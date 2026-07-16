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
import PlacementWorldRenderer from '../systems/PlacementWorldRenderer.js';
import PlacementUiUpdater from '../systems/PlacementUiUpdater.js';

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
    this.worldRenderer = new PlacementWorldRenderer({
      scene: this,
      geometry: this.mapGeometry,
      mapRenderer: this.mapRenderer,
      objectRegistry: this.objectRegistry,
      placementSystem: this.placementSystem,
      mapLabels: this.mapLabels,
    });

    this.drawMap();
    this.worldRenderer.restorePlacedBuildings(this.placedBuildings);
    this.createUi();
    this.uiUpdater = new PlacementUiUpdater({
      missionText: this.missionText,
      statusText: this.statusText,
      cursorInfoText: this.cursorInfoText,
      messageText: this.messageText,
      lastChangeText: this.lastChangeText,
      placementHistoryText: this.placementHistoryText,
      continueButton: this.continueButton,
      continueButtonBg: this.continueButtonBg,
    });
    this.setupCamera();
    this.registerPlacementInput();
    this.uiUpdater.updateStatusBar(this.registry.get('gameState'));
    this.uiUpdater.updateLastChangePanel(this.registry.get('lastPlacementResult'));
    this.uiUpdater.updatePlacementHistoryPanel(this.placedBuildings);
    this.updateSelectedBuildingUi();
    this.uiUpdater.updateContinueButton(this.placedBuildings.length, this.selectedPolicy);
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
        this.uiUpdater.showMessage(PlacementUiStateManager.formatNeedMoreMessage(this.placedBuildings.length), '#fecaca');
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
      this.uiUpdater.showMessage(PlacementUiStateManager.formatBuildingSelectedMessage(building.name), '#bbf7d0');
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
      this.uiUpdater.updateCursorInfo(null);
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    const previewStyle = PlacementViewManager.getPreviewStyle(validation);

    this.mapRenderer.drawTiles(this.previewGraphics, validation.footprintTiles, previewStyle);

    this.uiUpdater.updateCursorInfo(tile, this.placementSystem.getTile(tile.x, tile.y), validation);
  }

  tryPlace(pointer) {
    const tile = this.pointerToTile(pointer);
    if (!tile) {
      this.uiUpdater.showMessage(PlacementUiStateManager.formatMapSelectMessage(), '#fecaca');
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    if (!validation.valid) {
      this.uiUpdater.showMessage(PlacementUiStateManager.formatInvalidPlacementMessage(validation.reason), '#fecaca');
      this.uiUpdater.updateCursorInfo(tile, this.placementSystem.getTile(tile.x, tile.y), validation);
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

    this.worldRenderer.drawPlacedBuilding(this.selectedBuilding, tile.x, tile.y);
    this.worldRenderer.drawImpactMarkers(this.selectedBuilding, tile.x, tile.y);
    this.uiUpdater.updateStatusBar(this.registry.get('gameState'));
    this.uiUpdater.updateLastChangePanel(this.registry.get('lastPlacementResult'));
    this.uiUpdater.updatePlacementHistoryPanel(this.placedBuildings);
    this.uiUpdater.updateContinueButton(this.placedBuildings.length, this.selectedPolicy);
    this.uiUpdater.showMessage(PlacementUiStateManager.formatPlacementSuccessMessage(this.selectedBuilding.name, this.placedBuildings.length), '#bbf7d0');
    this.updatePreview(pointer);
  }

  pointerToTile(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    return this.mapGeometry.worldToTile(worldPoint.x, worldPoint.y);
  }



}
