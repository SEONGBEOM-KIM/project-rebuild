import Phaser from 'phaser';
import { getPlacementConfig } from '../data/episodePlacementConfigs.js';
import { getCurrentPlacementMissionBriefing } from '../data/episodeContent.js';
import PlacementViewManager from '../systems/PlacementViewManager.js';
import CameraController from '../systems/CameraController.js';
import PlacementUiStateManager from '../systems/PlacementUiStateManager.js';
import PlacementInputController from '../systems/PlacementInputController.js';
import PlacementUiUpdater from '../systems/PlacementUiUpdater.js';
import PlacementUiRenderer from '../systems/PlacementUiRenderer.js';
import PlacementSceneBootstrap from '../systems/PlacementSceneBootstrap.js';
import PlacementActionManager from '../systems/PlacementActionManager.js';
import LearningProgress from '../systems/LearningProgress.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import { PLACEMENT_ACTION_STATUS } from '../systems/PlacementActionManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class PlacementScene extends Phaser.Scene {
  constructor() {
    super('PlacementScene');
  }

  create() {
    this.placementConfig = getPlacementConfig(this.registry.get(REGISTRY_KEYS.placementConfigId));
    this.availableBuildings = this.placementConfig.buildings;
    this.selectedBuilding = this.availableBuildings[0];
    this.selectedPolicy = this.registry.get(REGISTRY_KEYS.selectedPolicy);
    const learningProgress = LearningProgress.get(this.registry);
    this.selectedStrategy = Ep2BriefingViewManager.resolveStrategy(getCurrentPlacementMissionBriefing(), this.registry.get(REGISTRY_KEYS.selectedPlacementStrategy) ?? learningProgress.selectedStrategyId, this.selectedPolicy?.id);
    this.placedBuildings = [...(this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [])];
    this.bootstrap = new PlacementSceneBootstrap({
      scene: this,
      sourceMapData: this.placementConfig.map,
      cameraControllerClass: CameraController,
    });

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
      stateHud: this.stateHud,
      cursorInfoText: this.cursorInfoText,
      messageText: this.messageText,
      lastChangeText: this.lastChangeText,
      placementHistoryText: this.placementHistoryText,
      continueButton: this.continueButton,
      continueButtonBg: this.continueButtonBg,
    });
    this.uiCamera = this.bootstrap.setupCamera(this.objectRegistry);
    this.registerPlacementInput();
    this.uiUpdater.updateStateHud(this.registry.get(REGISTRY_KEYS.gameState), this.placementConfig.stateKeys);
    this.uiUpdater.updateStatusBar(this.registry.get(REGISTRY_KEYS.gameState), this.placementConfig.stateKeys);
    this.uiUpdater.updateLastChangePanel(this.registry.get(REGISTRY_KEYS.lastPlacementResult), this.placementConfig.stateKeys);
    this.uiUpdater.updatePlacementHistoryPanel(this.placedBuildings, this.placementConfig.stateKeys);
    this.updateSelectedBuildingUi();
    this.uiUpdater.updateContinueButton(
      this.placedBuildings.length,
      this.selectedPolicy,
      this.selectedStrategy,
      this.placementConfig.requiredPlacements,
    );
  }

  createUi() {
    this.uiRenderer = new PlacementUiRenderer({
      objectRegistry: this.objectRegistry,
      buildings: this.availableBuildings,
      requiredPlacements: this.placementConfig.requiredPlacements,
      currentState: this.registry.get(REGISTRY_KEYS.gameState),
      stateKeys: this.placementConfig.stateKeys,
      selectedPolicy: this.selectedPolicy,
      getPlacedCount: () => this.placedBuildings.length,
      onSelectBuilding: (building) => this.selectBuilding(building),
      onContinue: (target) => this.scene.start(target),
      onContinueBlocked: (placedCount) => {
        this.uiUpdater.showMessage(
          PlacementUiStateManager.formatNeedMoreMessage(placedCount, this.placementConfig.requiredPlacements),
          '#fecaca',
        );
      },
    });

    const uiObjects = this.uiRenderer.create();
    Object.assign(this, uiObjects);
  }

  selectBuilding(building) {
    this.selectedBuilding = building;
    this.updateSelectedBuildingUi();
    this.uiUpdater.showMessage(PlacementUiStateManager.formatBuildingSelectedMessage(building), '#bbf7d0');
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
    const preview = PlacementActionManager.previewPlacement({
      tile: this.pointerToTile(pointer),
      placementSystem: this.placementSystem,
      building: this.selectedBuilding,
    });

    if (preview.status === PLACEMENT_ACTION_STATUS.MISSING_TILE) {
      this.uiUpdater.updateCursorInfo(null);
      return;
    }

    const previewStyle = PlacementViewManager.getPreviewStyle(preview.validation);
    this.mapRenderer.drawTiles(this.previewGraphics, preview.validation.footprintTiles, previewStyle);
    this.uiUpdater.updateCursorInfo(preview.tile, preview.mapTile, preview.validation);
  }

  tryPlace(pointer) {
    const action = PlacementActionManager.place({
      registry: this.registry,
      tile: this.pointerToTile(pointer),
      placementSystem: this.placementSystem,
      building: this.selectedBuilding,
      placedBuildings: this.placedBuildings,
    });

    if (action.status === PLACEMENT_ACTION_STATUS.MISSING_TILE) {
      this.uiUpdater.showMessage(PlacementUiStateManager.formatMapSelectMessage(), '#fecaca');
      return;
    }

    if (action.status === PLACEMENT_ACTION_STATUS.INVALID) {
      this.uiUpdater.showMessage(PlacementUiStateManager.formatInvalidPlacementMessage(action.validation.reason), '#fecaca');
      this.uiUpdater.updateCursorInfo(action.tile, action.mapTile, action.validation);
      return;
    }

    this.placedBuildings = action.placedBuildings;
    this.worldRenderer.drawPlacedBuilding(this.selectedBuilding, action.tile.x, action.tile.y);
    this.worldRenderer.drawImpactMarkers(this.selectedBuilding, action.tile.x, action.tile.y);
    this.uiUpdater.updateStateHud(this.registry.get(REGISTRY_KEYS.gameState), this.placementConfig.stateKeys);
    this.uiUpdater.updateStatusBar(this.registry.get(REGISTRY_KEYS.gameState), this.placementConfig.stateKeys);
    this.uiUpdater.updateLastChangePanel(this.registry.get(REGISTRY_KEYS.lastPlacementResult), this.placementConfig.stateKeys);
    this.uiUpdater.updatePlacementHistoryPanel(this.placedBuildings, this.placementConfig.stateKeys);
    this.uiUpdater.updateContinueButton(
      this.placedBuildings.length,
      this.selectedPolicy,
      this.selectedStrategy,
      this.placementConfig.requiredPlacements,
    );
    this.uiUpdater.showMessage(PlacementUiStateManager.formatPlacementSuccessMessage(
      this.selectedBuilding,
      this.placedBuildings.length,
      this.placementConfig.requiredPlacements,
    ), '#bbf7d0');
    this.updatePreview(pointer);
  }

  pointerToTile(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    return this.mapGeometry.worldToTile(worldPoint.x, worldPoint.y);
  }

}
