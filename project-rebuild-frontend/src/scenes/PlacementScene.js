import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { buildings } from '../data/buildings.js';
import { mapData } from '../data/mapData.js';
import PlacementSystem from '../systems/PlacementSystem.js';
import CameraController from '../systems/CameraController.js';
import PlacementViewManager from '../systems/PlacementViewManager.js';
import PlacementMapGeometry from '../systems/PlacementMapGeometry.js';
import PlacementMapRenderer from '../systems/PlacementMapRenderer.js';
import PlacementResultManager from '../systems/PlacementResultManager.js';
import PlacementUiStateManager from '../systems/PlacementUiStateManager.js';
import PlacementSceneObjectRegistry from '../systems/PlacementSceneObjectRegistry.js';
import PlacementInputController from '../systems/PlacementInputController.js';

export default class PlacementScene extends Phaser.Scene {
  constructor() {
    super('PlacementScene');
  }

  create() {
    this.selectedBuilding = buildings[0];
    this.selectedPolicy = this.registry.get('selectedPolicy');
    this.placementSystem = new PlacementSystem(this.cloneMapData(mapData));
    this.placedBuildings = [...(this.registry.get('placedBuildings') ?? [])];
    this.mapGeometry = new PlacementMapGeometry({
      origin: PlacementViewManager.getScreenLayout().mapOrigin,
      tileWidth: mapData.tileWidth,
      tileHeight: mapData.tileHeight,
      mapWidth: mapData.width,
      mapHeight: mapData.height,
    });
    this.mapRenderer = new PlacementMapRenderer({ geometry: this.mapGeometry });
    this.objectRegistry = new PlacementSceneObjectRegistry(this, {
      fixedRectangleStrokeWidth: PlacementViewManager.getFixedUiStyle().rectangleStrokeWidth,
    });

    this.drawBackground();
    this.mapGraphics = this.objectRegistry.registerWorldObject(this.add.graphics().setDepth(1));
    this.buildingGraphics = this.objectRegistry.registerWorldObject(this.add.graphics().setDepth(4));
    this.previewGraphics = this.objectRegistry.registerWorldObject(this.add.graphics().setDepth(6));
    this.mapLabels = this.objectRegistry.registerWorldObject(this.add.container(0, 0).setDepth(8));

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
    this.objectRegistry.registerWorldObject(this.add.rectangle(width / 2, height / 2, width, height, layout.background.color).setScrollFactor(0).setDepth(-10));
    this.objectRegistry.registerUiObject(ProgressStepper.render(this, layout.progressStep));
    this.objectRegistry.registerUiObject(this.add.text(layout.topHint.x, layout.topHint.y, layout.topHint.text, layout.topHint).setScrollFactor(0).setDepth(100));
  }

  setupCamera() {
    const cameraConfig = PlacementViewManager.getCameraConfig();

    new CameraController(this, {
      ...cameraConfig,
      ignoreDrag: (pointer) => PlacementViewManager.isPointerOnUi(pointer),
    }).enable();

    this.objectRegistry.ignoreUiObjectsOnMainCamera();
    this.uiCamera = this.objectRegistry.createUiCamera('PlacementUiCamera');
  }

  createUi() {
    this.cardObjects = new Map();
    const layout = PlacementViewManager.getUiLayout();
    const textStyles = PlacementViewManager.getTextStyles();

    this.objectRegistry.createFixedRectangleFromLayout(layout.leftPanel);
    this.objectRegistry.createFixedTextFromLayout(layout.title, textStyles.title);
    this.objectRegistry.createFixedTextFromLayout(layout.subtitle, textStyles.subtitle);

    this.missionText = this.objectRegistry.createFixedTextFromLayout(layout.mission, textStyles.mission);

    buildings.forEach((building, index) => {
      this.createBuildingCard(building, layout.buildingList.x, layout.buildingList.startY + index * layout.buildingList.gapY);
    });

    this.statusText = this.objectRegistry.createFixedTextFromLayout(layout.status, textStyles.status);

    this.cursorInfoText = this.objectRegistry.createFixedLayoutText(layout.cursorInfo, {
      style: textStyles.cursorInfo,
    });

    this.messageText = this.objectRegistry.createFixedLayoutText(layout.message, {
      style: textStyles.message,
    });

    this.continueButtonBg = this.objectRegistry.createFixedRectangleFromLayout(layout.continueButton, {
      fillColor: layout.continueButton.backgroundColor,
    }).setInteractive({ useHandCursor: true });
    this.continueButton = this.objectRegistry.createFixedTextFromLayout(layout.continueButton, textStyles.continueButton)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const handleContinue = () => {
      if (!PlacementUiStateManager.canContinue(this.placedBuildings.length)) {
        this.showMessage(PlacementUiStateManager.formatNeedMoreMessage(this.placedBuildings.length), '#fecaca');
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

    this.objectRegistry.createFixedRectangleFromLayout(layout.legendPanel);
    this.objectRegistry.createFixedTextFromLayout(layout.legendTitle, textStyles.panelTitle);

    legendItems.forEach((item, index) => {
      const itemLayout = PlacementViewManager.getLegendItemLayout(index, item);
      this.objectRegistry.createFixedRectangleFromLayout(itemLayout.swatch);
      this.objectRegistry.createFixedTextFromLayout(itemLayout.text, {
        ...textStyles.legendText,
        color: PlacementViewManager.getLegendTextColor(item),
      });
    });
  }

  createLastChangePanel() {
    const layout = PlacementViewManager.getUiLayout();
    const emptyState = PlacementUiStateManager.getEmptyLastChangeState();
    const textStyles = PlacementViewManager.getTextStyles();

    this.objectRegistry.createFixedRectangleFromLayout(layout.lastChangePanel);
    this.objectRegistry.createFixedTextFromLayout(layout.lastChangeTitle, textStyles.panelTitle);
    this.lastChangeText = this.objectRegistry.createFixedLayoutText(layout.lastChangeBody, {
      text: emptyState.text,
      style: {
        ...textStyles.panelBody,
        color: emptyState.color,
      },
    });
  }

  createPlacementHistoryPanel() {
    const layout = PlacementViewManager.getUiLayout();
    const emptyState = PlacementUiStateManager.getEmptyPlacementHistoryState();
    const textStyles = PlacementViewManager.getTextStyles();

    this.objectRegistry.createFixedRectangleFromLayout(layout.historyPanel);
    this.objectRegistry.createFixedTextFromLayout(layout.historyTitle, textStyles.panelTitle);
    this.placementHistoryText = this.objectRegistry.createFixedLayoutText(layout.historyBody, {
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
    const card = this.objectRegistry.createFixedRectangleFromLayout(layout.card, visual.card)
      .setInteractive({ useHandCursor: true });
    const swatch = this.objectRegistry.createFixedRectangleFromLayout(layout.swatch, visual.swatch);
    const title = this.objectRegistry.createFixedTextFromLayout(layout.title, textStyles.cardTitle, { text: content.title });
    const recommendationBadge = this.createRecommendationBadge(building, layout.recommendationBadge.x, layout.recommendationBadge.y);
    const detail = this.objectRegistry.createFixedTextFromLayout(layout.detail, textStyles.cardDetail, { text: content.detail });
    const description = this.objectRegistry.createFixedLayoutText(layout.description, {
      text: content.description,
      style: textStyles.cardDescription,
    });
    const placementHint = this.objectRegistry.createFixedLayoutText(layout.placementHint, {
      text: content.placementHint,
      style: textStyles.cardPlacementHint,
    });
    const effect = this.objectRegistry.createFixedLayoutText(layout.effect, {
      text: content.effect,
      style: textStyles.cardEffect,
    });

    const selectBuilding = () => {
      this.selectedBuilding = building;
      this.updateSelectedBuildingUi();
      this.showMessage(PlacementUiStateManager.formatBuildingSelectedMessage(building.name), '#bbf7d0');
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
    const badgeBg = this.objectRegistry.createFixedRectangleFromLayout(layout.background);
    const badgeText = this.objectRegistry.createFixedTextFromLayout(layout.text, PlacementViewManager.getTextStyles().recommendationBadge).setOrigin(0.5);
    return { badgeBg, badgeText };
  }

  updateSelectedBuildingUi() {
    for (const objects of this.cardObjects.values()) {
      const style = PlacementViewManager.getBuildingCardStyle(objects.building, this.selectedBuilding, this.selectedPolicy);
      objects.card.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.card.setFillStyle(style.fillColor, style.fillAlpha);
    }
  }

  drawMap() {
    this.mapRenderer.drawMap(this.mapGraphics, this.placementSystem.mapData);
  }


  registerPlacementInput() {
    this.placementInputController = new PlacementInputController({
      scene: this,
      pointerToTile: (pointer) => this.pointerToTile(pointer),
      clearPreview: () => this.previewGraphics.clear(),
      updatePreview: (pointer) => this.updatePreview(pointer),
      tryPlace: (pointer) => this.tryPlace(pointer),
    }).enable();
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

    this.mapRenderer.drawTiles(this.previewGraphics, validation.footprintTiles, previewStyle);

    this.updateCursorInfo(tile, validation);
  }

  tryPlace(pointer) {
    const tile = this.pointerToTile(pointer);
    if (!tile) {
      this.showMessage(PlacementUiStateManager.formatMapSelectMessage(), '#fecaca');
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    if (!validation.valid) {
      this.showMessage(PlacementUiStateManager.formatInvalidPlacementMessage(validation.reason), '#fecaca');
      this.updateCursorInfo(tile, validation);
      return;
    }

    const occupiedTiles = this.placementSystem.place(tile.x, tile.y, this.selectedBuilding);
    const placementCommit = PlacementResultManager.commitPlacement({
      registry: this.registry,
      building: this.selectedBuilding,
      tile,
      occupiedTiles,
      placedBuildings: this.placedBuildings,
    });
    this.placedBuildings = placementCommit.placedBuildings;

    this.drawPlacedBuilding(this.selectedBuilding, tile.x, tile.y);
    this.drawImpactMarkers(this.selectedBuilding, tile.x, tile.y);
    this.updateStatusBar();
    this.updateLastChangePanel(this.registry.get('lastPlacementResult'));
    this.updatePlacementHistoryPanel();
    this.updateContinueButton();
    this.showMessage(PlacementUiStateManager.formatPlacementSuccessMessage(this.selectedBuilding.name, this.placedBuildings.length), '#bbf7d0');
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
    const center = this.mapGeometry.getFootprintCenter(tileX, tileY, building.footprint);
    const markerData = PlacementViewManager.getImpactMarkerData(building);
    const markerLayout = PlacementViewManager.getImpactMarkerLayout(center, tileX, tileY);
    const markerContainer = this.objectRegistry.registerWorldObject(this.add.container(markerLayout.container.x, markerLayout.container.y)
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
    const graphics = this.objectRegistry.registerWorldObject(this.add.graphics().setDepth(buildingVisual.depth));
    this.mapRenderer.drawTiles(
      graphics,
      this.placementSystem.getFootprintTiles(tileX, tileY, building.footprint),
      buildingVisual,
    );

    const labelPosition = this.mapGeometry.getFootprintCenter(tileX, tileY, building.footprint);
    const labelLayout = PlacementViewManager.getBuildingLabelLayout(labelPosition, tileX, tileY);
    graphics.fillStyle(labelLayout.background.fillColor, labelLayout.background.fillAlpha);
    graphics.fillRoundedRect(
      labelLayout.background.x,
      labelLayout.background.y,
      labelLayout.background.width,
      labelLayout.background.height,
      labelLayout.background.radius,
    );
    const label = this.objectRegistry.registerWorldObject(this.add.text(
      labelLayout.text.x,
      labelLayout.text.y,
      building.name,
      PlacementViewManager.getTextStyles().buildingLabel,
    ).setOrigin(0.5).setDepth(labelLayout.text.depth));

    this.mapLabels.add(label);
  }

  pointerToTile(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    return this.mapGeometry.worldToTile(worldPoint.x, worldPoint.y);
  }

  updateCursorInfo(tile, validation = null) {
    if (!this.cursorInfoText) {
      return;
    }

    if (!tile) {
      const cursorState = PlacementUiStateManager.formatCursorInfo(null);
      this.cursorInfoText.setText(cursorState.text);
      this.cursorInfoText.setColor(cursorState.color);
      return;
    }

    const mapTile = this.placementSystem.getTile(tile.x, tile.y);
    const status = validation ?? this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    const cursorState = PlacementUiStateManager.formatCursorInfo(tile, mapTile, status);
    this.cursorInfoText.setText(cursorState.text);
    this.cursorInfoText.setColor(cursorState.color);

  }

  updateStatusBar() {
    if (!this.statusText) {
      return;
    }
    const state = this.registry.get('gameState');
    this.statusText.setText(PlacementUiStateManager.formatStatusText(state));

  }

  updateLastChangePanel(lastPlacementResult = this.registry.get('lastPlacementResult')) {
    if (!this.lastChangeText) {
      return;
    }

    const lastChangeState = PlacementUiStateManager.formatLastChangeState(lastPlacementResult);
    this.lastChangeText.setText(lastChangeState.text);
    this.lastChangeText.setColor(lastChangeState.color);
  }

  updatePlacementHistoryPanel() {
    if (!this.placementHistoryText) {
      return;
    }

    const historyState = PlacementUiStateManager.formatPlacementHistoryState(this.placedBuildings);
    this.placementHistoryText.setText(historyState.text);
    this.placementHistoryText.setColor(historyState.color);
  }

  updateContinueButton() {
    const continueState = PlacementUiStateManager.getContinueState(this.placedBuildings.length, this.selectedPolicy);

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
