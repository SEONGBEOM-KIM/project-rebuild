import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { buildings } from '../data/buildings.js';
import { mapData } from '../data/mapData.js';
import GameState from '../systems/GameState.js';
import PlacementSystem from '../systems/PlacementSystem.js';
import CameraController from '../systems/CameraController.js';
import LearningProgress from '../systems/LearningProgress.js';
import PlacementViewManager from '../systems/PlacementViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class PlacementScene extends Phaser.Scene {
  constructor() {
    super('PlacementScene');
  }

  create() {
    this.selectedBuilding = buildings[0];
    this.selectedPolicy = this.registry.get('selectedPolicy');
    this.placementSystem = new PlacementSystem(this.cloneMapData(mapData));
    this.placedBuildings = [...(this.registry.get('placedBuildings') ?? [])];
    this.pendingPlacementPointer = null;
    this.mapOrigin = PlacementViewManager.getScreenLayout().mapOrigin;
    this.uiObjects = [];
    this.worldObjects = [];
    this.tileWidth = mapData.tileWidth;
    this.tileHeight = mapData.tileHeight;
    this.halfTileWidth = this.tileWidth / 2;
    this.halfTileHeight = this.tileHeight / 2;

    this.drawBackground();
    this.mapGraphics = this.registerWorldObject(this.add.graphics().setDepth(1));
    this.buildingGraphics = this.registerWorldObject(this.add.graphics().setDepth(4));
    this.previewGraphics = this.registerWorldObject(this.add.graphics().setDepth(6));
    this.mapLabels = this.registerWorldObject(this.add.container(0, 0).setDepth(8));

    this.drawMap();
    this.restorePlacedBuildings();
    this.createUi();
    this.setupCamera();
    this.registerPlacementInput();
    this.updateStatusBar();
    this.updateLastChangePanel();
    this.updatePlacementHistoryPanel();
    this.updateSelectedBuildingUi();
    this.updateContinueButton();
  }

  cloneMapData(source) {
    return {
      ...source,
      tiles: source.tiles.map((row) => row.map((tile) => ({ ...tile, occupied: false }))),
    };
  }

  drawBackground() {
    const { width, height } = this.scale;
    const layout = PlacementViewManager.getScreenLayout();
    this.registerWorldObject(this.add.rectangle(width / 2, height / 2, width, height, layout.background.color).setScrollFactor(0).setDepth(-10));
    this.registerUiObject(ProgressStepper.render(this, layout.progressStep));
    this.registerUiObject(this.add.text(layout.topHint.x, layout.topHint.y, layout.topHint.text, layout.topHint).setScrollFactor(0).setDepth(100));
  }

  setupCamera() {
    const cameraConfig = PlacementViewManager.getCameraConfig();

    new CameraController(this, {
      ...cameraConfig,
      ignoreDrag: (pointer) => PlacementViewManager.isPointerOnUi(pointer),
    }).enable();

    this.cameras.main.ignore(this.uiObjects);
    this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height, false, 'PlacementUiCamera');
    this.uiCamera.setScroll(0, 0);
    this.uiCamera.setZoom(1);
    this.uiCamera.ignore(this.worldObjects);
  }

  registerWorldObject(object) {
    this.worldObjects.push(object);

    if (this.uiCamera) {
      this.uiCamera.ignore(object);
    }

    return object;
  }

  registerUiObject(object) {
    this.uiObjects.push(object);

    if (this.cameras?.main) {
      this.cameras.main.ignore(object);
    }

    return object;
  }

  createUi() {
    this.cardObjects = new Map();
    const layout = PlacementViewManager.getUiLayout();
    const textStyles = PlacementViewManager.getTextStyles();

    this.createFixedRectangleFromLayout(layout.leftPanel);
    this.createFixedTextFromLayout(layout.title, textStyles.title);
    this.createFixedTextFromLayout(layout.subtitle, textStyles.subtitle);

    this.missionText = this.createFixedTextFromLayout(layout.mission, textStyles.mission);

    buildings.forEach((building, index) => {
      this.createBuildingCard(building, layout.buildingList.x, layout.buildingList.startY + index * layout.buildingList.gapY);
    });

    this.statusText = this.createFixedTextFromLayout(layout.status, textStyles.status);

    this.cursorInfoText = this.createFixedLayoutText(layout.cursorInfo, {
      style: textStyles.cursorInfo,
    });

    this.messageText = this.createFixedLayoutText(layout.message, {
      style: textStyles.message,
    });

    this.continueButtonBg = this.createFixedRectangleFromLayout(layout.continueButton, {
      fillColor: layout.continueButton.backgroundColor,
    }).setInteractive({ useHandCursor: true });
    this.continueButton = this.createFixedTextFromLayout(layout.continueButton, textStyles.continueButton)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const handleContinue = () => {
      if (!PlacementViewManager.canContinue(this.placedBuildings.length)) {
        this.showMessage(PlacementViewManager.formatNeedMoreMessage(this.placedBuildings.length), '#fecaca');
        return;
      }
      this.scene.start(layout.continueButton.target);
    };
    this.continueButtonBg.on('pointerdown', handleContinue);
    this.continueButton.on('pointerdown', handleContinue);
    this.createLegend();
    this.createLastChangePanel();
    this.createPlacementHistoryPanel();
  }

  createLegend() {
    const legendItems = PlacementViewManager.getLegendItems();
    const layout = PlacementViewManager.getUiLayout();
    const textStyles = PlacementViewManager.getTextStyles();

    this.createFixedRectangleFromLayout(layout.legendPanel);
    this.createFixedTextFromLayout(layout.legendTitle, textStyles.panelTitle);

    legendItems.forEach((item, index) => {
      const itemLayout = PlacementViewManager.getLegendItemLayout(index, item);
      this.createFixedRectangleFromLayout(itemLayout.swatch);
      this.createFixedTextFromLayout(itemLayout.text, {
        ...textStyles.legendText,
        color: PlacementViewManager.getLegendTextColor(item),
      });
    });
  }

  createLastChangePanel() {
    const layout = PlacementViewManager.getUiLayout();
    const emptyState = PlacementViewManager.getEmptyLastChangeState();
    const textStyles = PlacementViewManager.getTextStyles();

    this.createFixedRectangleFromLayout(layout.lastChangePanel);
    this.createFixedTextFromLayout(layout.lastChangeTitle, textStyles.panelTitle);
    this.lastChangeText = this.createFixedLayoutText(layout.lastChangeBody, {
      text: emptyState.text,
      style: {
        ...textStyles.panelBody,
        color: emptyState.color,
      },
    });
  }

  createPlacementHistoryPanel() {
    const layout = PlacementViewManager.getUiLayout();
    const emptyState = PlacementViewManager.getEmptyPlacementHistoryState();
    const textStyles = PlacementViewManager.getTextStyles();

    this.createFixedRectangleFromLayout(layout.historyPanel);
    this.createFixedTextFromLayout(layout.historyTitle, textStyles.panelTitle);
    this.placementHistoryText = this.createFixedLayoutText(layout.historyBody, {
      text: emptyState.text,
      style: {
        ...textStyles.panelBody,
        color: emptyState.color,
      },
    });
  }

  createBuildingCard(building, x, y) {
    const layout = PlacementViewManager.getBuildingCardLayout(x, y);
    const textStyles = PlacementViewManager.getTextStyles();
    const content = PlacementViewManager.getBuildingCardContent(building);
    const visual = PlacementViewManager.getBuildingCardVisual(building);
    const card = this.createFixedRectangleFromLayout(layout.card, visual.card)
      .setInteractive({ useHandCursor: true });
    const swatch = this.createFixedRectangleFromLayout(layout.swatch, visual.swatch);
    const title = this.createFixedTextFromLayout(layout.title, textStyles.cardTitle, { text: content.title });
    const recommendationBadge = this.createRecommendationBadge(building, layout.recommendationBadge.x, layout.recommendationBadge.y);
    const detail = this.createFixedTextFromLayout(layout.detail, textStyles.cardDetail, { text: content.detail });
    const description = this.createFixedLayoutText(layout.description, {
      text: content.description,
      style: textStyles.cardDescription,
    });
    const placementHint = this.createFixedLayoutText(layout.placementHint, {
      text: content.placementHint,
      style: textStyles.cardPlacementHint,
    });
    const effect = this.createFixedLayoutText(layout.effect, {
      text: content.effect,
      style: textStyles.cardEffect,
    });

    const selectBuilding = () => {
      this.selectedBuilding = building;
      this.updateSelectedBuildingUi();
      this.showMessage(PlacementViewManager.formatBuildingSelectedMessage(building.name), '#bbf7d0');
    };

    card.on('pointerdown', selectBuilding);
    title.setInteractive({ useHandCursor: true }).on('pointerdown', selectBuilding);

    this.cardObjects.set(building.id, { building, card, swatch, title, detail, description, placementHint, effect, recommendationBadge });
  }

  createRecommendationBadge(building, x, y) {
    if (!PlacementViewManager.isRecommendedBuilding(building, this.selectedPolicy)) {
      return null;
    }

    const layout = PlacementViewManager.getRecommendationBadgeLayout(x, y);
    const badgeBg = this.createFixedRectangleFromLayout(layout.background);
    const badgeText = this.createFixedTextFromLayout(layout.text, PlacementViewManager.getTextStyles().recommendationBadge).setOrigin(0.5);
    return { badgeBg, badgeText };
  }

  createFixedRectangleFromLayout(layout, options = {}) {
    return this.createFixedRectangle(
      options.x ?? layout.x,
      options.y ?? layout.y,
      options.width ?? layout.width,
      options.height ?? layout.height,
      options.fillColor ?? layout.fillColor,
      options.alpha ?? options.fillAlpha ?? layout.alpha ?? layout.fillAlpha ?? 1,
      options.strokeColor ?? layout.strokeColor ?? null,
    );
  }

  createFixedRectangle(x, y, width, height, color, alpha = 1, strokeColor = null) {
    const rectangle = this.add.rectangle(x, y, width, height, color, alpha).setScrollFactor(0).setDepth(100);
    if (strokeColor !== null) {
      rectangle.setStrokeStyle(PlacementViewManager.getFixedUiStyle().rectangleStrokeWidth, strokeColor);
    }
    return this.registerUiObject(rectangle);
  }

  createFixedTextFromLayout(layout, style, options = {}) {
    return this.createFixedText(
      options.x ?? layout.x,
      options.y ?? layout.y,
      options.text ?? layout.text ?? '',
      style,
    );
  }

  createFixedText(x, y, text, style) {
    const textObject = this.add.text(x, y, text, style).setScrollFactor(0).setDepth(101);
    return this.registerUiObject(textObject);
  }

  createFixedLayoutText(layout, options = {}) {
    const textObject = createLayoutText(this, layout, options).setScrollFactor(0).setDepth(101);
    return this.registerUiObject(textObject);
  }

  updateSelectedBuildingUi() {
    for (const objects of this.cardObjects.values()) {
      const style = PlacementViewManager.getBuildingCardStyle(objects.building, this.selectedBuilding, this.selectedPolicy);
      objects.card.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.card.setFillStyle(style.fillColor, style.fillAlpha);
    }
  }

  drawMap() {
    this.mapGraphics.clear();

    for (let y = 0; y < this.placementSystem.mapData.height; y += 1) {
      for (let x = 0; x < this.placementSystem.mapData.width; x += 1) {
        const tile = this.placementSystem.mapData.tiles[y][x];
        const tileStyle = PlacementViewManager.getMapTileVisual(tile);
        this.drawDiamond(this.mapGraphics, x, y, tileStyle.color, tileStyle.alpha, tileStyle.stroke, tileStyle.strokeWidth);
      }
    }
  }

  registerPlacementInput() {
    this.input.on('pointermove', (pointer) => {
      if (PlacementViewManager.isPointerOnUi(pointer)) {
        this.previewGraphics.clear();
        return;
      }
      this.updatePreview(pointer);
    });

    this.input.on('pointerdown', (pointer, gameObjects) => {
      if (gameObjects.length > 0 || PlacementViewManager.isPointerOnUi(pointer)) {
        this.pendingPlacementPointer = null;
        return;
      }

      this.pendingPlacementPointer = {
        x: pointer.x,
        y: pointer.y,
        tile: this.pointerToTile(pointer),
      };
    });

    this.input.on('pointerup', (pointer, gameObjects) => {
      if (!this.pendingPlacementPointer || gameObjects.length > 0 || PlacementViewManager.isPointerOnUi(pointer)) {
        this.pendingPlacementPointer = null;
        return;
      }

      const dragDistance = Phaser.Math.Distance.Between(
        this.pendingPlacementPointer.x,
        this.pendingPlacementPointer.y,
        pointer.x,
        pointer.y,
      );
      const releaseTile = this.pointerToTile(pointer);
      const sameTile = releaseTile
        && this.pendingPlacementPointer.tile
        && releaseTile.x === this.pendingPlacementPointer.tile.x
        && releaseTile.y === this.pendingPlacementPointer.tile.y;

      this.pendingPlacementPointer = null;

      if (!PlacementViewManager.isDragPlacementCandidate(dragDistance, sameTile)) {
        return;
      }

      this.tryPlace(pointer);
    });
  }

  updatePreview(pointer) {
    this.previewGraphics.clear();
    const tile = this.pointerToTile(pointer);
    if (!tile) {
      this.updateCursorInfo(null);
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    const previewStyle = PlacementViewManager.getPreviewStyle(validation);

    for (const footprintTile of validation.footprintTiles) {
      this.drawDiamond(
        this.previewGraphics,
        footprintTile.x,
        footprintTile.y,
        previewStyle.fillColor,
        previewStyle.fillAlpha,
        previewStyle.strokeColor,
        previewStyle.strokeWidth,
      );
    }

    this.updateCursorInfo(tile, validation);
  }

  tryPlace(pointer) {
    const tile = this.pointerToTile(pointer);
    if (!tile) {
      this.showMessage(PlacementViewManager.formatMapSelectMessage(), '#fecaca');
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    if (!validation.valid) {
      this.showMessage(PlacementViewManager.formatInvalidPlacementMessage(validation.reason), '#fecaca');
      this.updateCursorInfo(tile, validation);
      return;
    }

    const before = this.registry.get('gameState');
    const after = GameState.applyEffect(before, this.selectedBuilding.effect);
    const occupiedTiles = this.placementSystem.place(tile.x, tile.y, this.selectedBuilding);

    this.registry.set('gameState', after);
    this.registry.set('lastPlacementResult', {
      building: this.selectedBuilding,
      position: { x: tile.x, y: tile.y },
      occupiedTiles,
      before,
      after,
      delta: this.selectedBuilding.effect,
    });

    const placementRecord = {
      id: `${this.selectedBuilding.id}-${Date.now()}-${this.placedBuildings.length}`,
      building: this.selectedBuilding,
      position: { x: tile.x, y: tile.y },
      occupiedTiles,
      delta: this.selectedBuilding.effect,
    };
    this.placedBuildings = [...this.placedBuildings, placementRecord];
    this.registry.set('placedBuildings', this.placedBuildings);
    LearningProgress.addPlacedBuilding(this.registry, this.selectedBuilding.id);

    this.drawPlacedBuilding(this.selectedBuilding, tile.x, tile.y);
    this.drawImpactMarkers(this.selectedBuilding, tile.x, tile.y);
    this.updateStatusBar();
    this.updateLastChangePanel(this.registry.get('lastPlacementResult'));
    this.updatePlacementHistoryPanel();
    this.updateContinueButton();
    this.showMessage(PlacementViewManager.formatPlacementSuccessMessage(this.selectedBuilding.name, this.placedBuildings.length), '#bbf7d0');
    this.updatePreview(pointer);
  }

  restorePlacedBuildings() {
    for (const record of this.placedBuildings) {
      this.placementSystem.place(record.position.x, record.position.y, record.building);
      this.drawPlacedBuilding(record.building, record.position.x, record.position.y);
      this.drawImpactMarkers(record.building, record.position.x, record.position.y, false);
    }
  }


  drawImpactMarkers(building, tileX, tileY, animate = true) {
    const center = this.getFootprintCenter(tileX, tileY, building.footprint);
    const markerData = PlacementViewManager.getImpactMarkerData(building);
    const markerLayout = PlacementViewManager.getImpactMarkerLayout(center, tileX, tileY);
    const markerContainer = this.registerWorldObject(this.add.container(markerLayout.container.x, markerLayout.container.y)
      .setDepth(markerLayout.container.depth));

    const bubble = this.add.circle(0, 0, markerLayout.bubble.radius, markerData.color, markerLayout.bubble.alpha)
      .setStrokeStyle(markerLayout.bubble.strokeWidth, markerLayout.bubble.strokeColor, markerLayout.bubble.strokeAlpha);
    const textStyles = PlacementViewManager.getTextStyles();
    const icon = this.add.text(markerLayout.icon.x, markerLayout.icon.y, markerData.icon, textStyles.impactIcon).setOrigin(0.5);
    const labelBg = this.add.rectangle(
      markerLayout.labelBackground.x,
      markerLayout.labelBackground.y,
      markerLayout.labelBackground.width,
      markerLayout.labelBackground.height,
      markerLayout.labelBackground.fillColor,
      markerLayout.labelBackground.fillAlpha,
    ).setStrokeStyle(markerLayout.labelBackground.strokeWidth, markerData.color, markerLayout.labelBackground.strokeAlpha);
    const label = this.add.text(markerLayout.label.x, markerLayout.label.y, markerData.label, textStyles.impactLabel).setOrigin(0.5);

    markerContainer.add([bubble, icon, labelBg, label]);

    if (animate) {
      markerContainer.setScale(markerLayout.animation.initialScale);
      markerContainer.setAlpha(markerLayout.animation.initialAlpha);
      this.tweens.add({
        targets: markerContainer,
        scale: 1,
        alpha: 1,
        y: markerLayout.animation.targetY,
        duration: markerLayout.animation.duration,
        ease: markerLayout.animation.ease,
      });
    }
  }

  drawPlacedBuilding(building, tileX, tileY) {
    const buildingVisual = PlacementViewManager.getPlacedBuildingVisual(building, tileX, tileY);
    const graphics = this.registerWorldObject(this.add.graphics().setDepth(buildingVisual.depth));
    for (const tile of this.placementSystem.getFootprintTiles(tileX, tileY, building.footprint)) {
      this.drawDiamond(
        graphics,
        tile.x,
        tile.y,
        buildingVisual.fillColor,
        buildingVisual.alpha,
        buildingVisual.strokeColor,
        buildingVisual.strokeWidth,
      );
    }

    const labelPosition = this.getFootprintCenter(tileX, tileY, building.footprint);
    const labelLayout = PlacementViewManager.getBuildingLabelLayout(labelPosition, tileX, tileY);
    graphics.fillStyle(labelLayout.background.fillColor, labelLayout.background.fillAlpha);
    graphics.fillRoundedRect(
      labelLayout.background.x,
      labelLayout.background.y,
      labelLayout.background.width,
      labelLayout.background.height,
      labelLayout.background.radius,
    );
    const label = this.registerWorldObject(this.add.text(
      labelLayout.text.x,
      labelLayout.text.y,
      building.name,
      PlacementViewManager.getTextStyles().buildingLabel,
    ).setOrigin(0.5).setDepth(labelLayout.text.depth));

    this.mapLabels.add(label);
  }

  drawDiamond(graphics, tileX, tileY, fillColor, alpha, strokeColor, strokeWidth) {
    const center = this.tileToWorld(tileX, tileY);
    const points = [
      new Phaser.Geom.Point(center.x, center.y - this.halfTileHeight),
      new Phaser.Geom.Point(center.x + this.halfTileWidth, center.y),
      new Phaser.Geom.Point(center.x, center.y + this.halfTileHeight),
      new Phaser.Geom.Point(center.x - this.halfTileWidth, center.y),
    ];

    graphics.fillStyle(fillColor, alpha);
    graphics.fillPoints(points, true);
    graphics.lineStyle(strokeWidth, strokeColor, 0.9);
    graphics.strokePoints(points, true);
  }

  tileToWorld(tileX, tileY) {
    return {
      x: this.mapOrigin.x + (tileX - tileY) * this.halfTileWidth,
      y: this.mapOrigin.y + (tileX + tileY) * this.halfTileHeight,
    };
  }

  pointerToTile(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const localX = worldPoint.x - this.mapOrigin.x;
    const localY = worldPoint.y - this.mapOrigin.y;
    const approximateX = (localX / this.halfTileWidth + localY / this.halfTileHeight) / 2;
    const approximateY = (localY / this.halfTileHeight - localX / this.halfTileWidth) / 2;
    const tileX = Math.floor(approximateX + 0.5);
    const tileY = Math.floor(approximateY + 0.5);

    if (tileX < 0 || tileY < 0 || tileX >= this.placementSystem.mapData.width || tileY >= this.placementSystem.mapData.height) {
      return null;
    }

    return { x: tileX, y: tileY };
  }

  getFootprintCenter(tileX, tileY, footprint) {
    const start = this.tileToWorld(tileX, tileY);
    const end = this.tileToWorld(tileX + footprint.width - 1, tileY + footprint.height - 1);
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }

  updateCursorInfo(tile, validation = null) {
    if (!this.cursorInfoText) {
      return;
    }

    if (!tile) {
      const cursorState = PlacementViewManager.formatCursorInfo(null);
      this.cursorInfoText.setText(cursorState.text);
      this.cursorInfoText.setColor(cursorState.color);
      return;
    }

    const mapTile = this.placementSystem.getTile(tile.x, tile.y);
    const status = validation ?? this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    const cursorState = PlacementViewManager.formatCursorInfo(tile, mapTile, status);
    this.cursorInfoText.setText(cursorState.text);
    this.cursorInfoText.setColor(cursorState.color);

  }

  updateStatusBar() {
    if (!this.statusText) {
      return;
    }
    const state = this.registry.get('gameState');
    this.statusText.setText(PlacementViewManager.formatStatusText(state));

  }

  updateLastChangePanel(lastPlacementResult = this.registry.get('lastPlacementResult')) {
    if (!this.lastChangeText) {
      return;
    }

    const lastChangeState = PlacementViewManager.formatLastChangeState(lastPlacementResult);
    this.lastChangeText.setText(lastChangeState.text);
    this.lastChangeText.setColor(lastChangeState.color);
  }

  updatePlacementHistoryPanel() {
    if (!this.placementHistoryText) {
      return;
    }

    const historyState = PlacementViewManager.formatPlacementHistoryState(this.placedBuildings);
    this.placementHistoryText.setText(historyState.text);
    this.placementHistoryText.setColor(historyState.color);
  }

  updateContinueButton() {
    const continueState = PlacementViewManager.getContinueState(this.placedBuildings.length, this.selectedPolicy);

    if (this.missionText) {
      this.missionText.setText(continueState.missionText);
    }

    if (this.continueButton) {
      this.continueButton.setText(continueState.buttonText);
      this.continueButton.setAlpha(continueState.buttonAlpha);
    }

    if (this.continueButtonBg) {
      this.continueButtonBg.setFillStyle(continueState.backgroundFillColor, continueState.backgroundAlpha);
      this.continueButtonBg.setStrokeStyle(PlacementViewManager.getFixedUiStyle().rectangleStrokeWidth, continueState.strokeColor);
    }
  }

  showMessage(message, color = '#fde68a') {
    if (!this.messageText) {
      return;
    }
    this.messageText.setText(message);
    this.messageText.setColor(color);
  }

}
