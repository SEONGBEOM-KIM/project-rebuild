import Phaser from 'phaser';
import { buildings } from '../data/buildings.js';
import PlacementViewManager from '../systems/PlacementViewManager.js';
import CameraController from '../systems/CameraController.js';
import PlacementResultManager from '../systems/PlacementResultManager.js';
import PlacementUiStateManager from '../systems/PlacementUiStateManager.js';
import PlacementInputController from '../systems/PlacementInputController.js';
import PlacementUiUpdater from '../systems/PlacementUiUpdater.js';
import PlacementUiRenderer from '../systems/PlacementUiRenderer.js';
import PlacementSceneBootstrap from '../systems/PlacementSceneBootstrap.js';

export default class PlacementScene extends Phaser.Scene {
  constructor() {
    super('PlacementScene');
  }

  create() {
    this.selectedBuilding = buildings[0];
    this.selectedPolicy = this.registry.get('selectedPolicy');
    this.placedBuildings = [...(this.registry.get('placedBuildings') ?? [])];
    this.bootstrap = new PlacementSceneBootstrap({ scene: this, cameraControllerClass: CameraController });

    Object.assign(this, this.bootstrap.createCoreSystems());
    this.bootstrap.drawBackground(this.objectRegistry);
    Object.assign(this, this.bootstrap.createWorldObjects({
      objectRegistry: this.objectRegistry,
      mapGeometry: this.mapGeometry,
      mapRenderer: this.mapRenderer,
      placementSystem: this.placementSystem,
    }));
    this.bootstrap.drawInitialWorld({
      mapRenderer: this.mapRenderer,
      mapGraphics: this.mapGraphics,
      placementSystem: this.placementSystem,
      worldRenderer: this.worldRenderer,
      placedBuildings: this.placedBuildings,
    });
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
    this.uiCamera = this.bootstrap.setupCamera(this.objectRegistry);
    this.registerPlacementInput();
    this.uiUpdater.updateStatusBar(this.registry.get('gameState'));
    this.uiUpdater.updateLastChangePanel(this.registry.get('lastPlacementResult'));
    this.uiUpdater.updatePlacementHistoryPanel(this.placedBuildings);
    this.updateSelectedBuildingUi();
    this.uiUpdater.updateContinueButton(this.placedBuildings.length, this.selectedPolicy);
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
