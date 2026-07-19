import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { getNextEpisodeContent } from '../data/episodeContent.js';
import { EP3_ECONOMY_PLACEMENT_CONFIG_ID } from '../data/episodePlacementConfigs.js';
import { economyBuildings } from '../data/economyBuildings.js';
import { economyPolicies } from '../data/economyPolicies.js';
import Ep3PreviewViewManager from '../systems/Ep3PreviewViewManager.js';
import Ep3PreviewRenderer from '../systems/Ep3PreviewRenderer.js';
import GameState from '../systems/GameState.js';
import LearningProgress from '../systems/LearningProgress.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class Ep3PreviewScene extends Phaser.Scene {
  constructor() {
    super('Ep3PreviewScene');
  }

  create() {
    const { width } = this.scale;
    const preview = getNextEpisodeContent()?.missionPreview;
    const layout = Ep3PreviewViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.backgroundColor);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    Ep3PreviewRenderer.renderIntroPanel(this, preview);
    preview.focusAreas.forEach((focusArea, index) => {
      Ep3PreviewRenderer.renderFocusCard(this, focusArea, index);
    });
    Ep3PreviewRenderer.renderTransitionNote(this, preview, economyPolicies, economyBuildings);

    const controls = Ep3PreviewRenderer.renderControls(this, width / 2);
    controls.endingButton.on('pointerdown', () => this.scene.start(controls.layout.ending.target));
    controls.startButton.on('pointerdown', () => {
      this.prepareEp3Placement();
      this.scene.start(controls.layout.start.target);
    });
    controls.restartButton.on('pointerdown', () => this.scene.start(controls.layout.restart.target));
  }

  prepareEp3Placement() {
    this.registry.set(REGISTRY_KEYS.placementConfigId, EP3_ECONOMY_PLACEMENT_CONFIG_ID);
    this.registry.set(REGISTRY_KEYS.selectedPolicy, economyPolicies[0]);
    this.registry.set(REGISTRY_KEYS.selectedPlacementStrategy, null);
    this.registry.set(REGISTRY_KEYS.placedBuildings, []);
    this.registry.set(REGISTRY_KEYS.lastPlacementResult, null);
    this.registry.set(REGISTRY_KEYS.gameState, GameState.createInitialState());
    LearningProgress.update(this.registry, {
      selectedPolicyId: economyPolicies[0].id,
      selectedStrategyId: null,
      placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
      placedBuildingIds: [],
    });
  }
}
