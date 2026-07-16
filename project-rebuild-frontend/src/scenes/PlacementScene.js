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
import PlacementUiRenderer from '../systems/PlacementUiRenderer.js';

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
    this.uiRenderer = new PlacementUiRenderer({
      objectRegistry: this.objectRegistry,
      buildings,
      selectedPolicy: this.selectedPolicy,
      getPlacedCount: () => this.placedBuildings.length,
      onSelectBuilding: (building) => this.selectBuilding(building),
      onContinue: (target) => this.scene.start(target),
      onContinueBlocked: (placedCount) => {
        this.uiUpdater.showMessage(PlacementUiStateManager.formatNeedMoreMessage(placedCount), '#fecaca');
      },
    });

    const uiObjects = this.uiRenderer.create();
    Object.assign(this, uiObjects);
  }

  selectBuilding(building) {
    this.selectedBuilding = building;
    this.updateSelectedBuildingUi();
    this.uiUpdater.showMessage(PlacementUiStateManager.formatBuildingSelectedMessage(building.name), '#bbf7d0');
  }

  updateSelectedBuildingUi() {
    this.uiRenderer.updateSelectedBuildingCards(this.cardObjects, this.selectedBuilding);
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
