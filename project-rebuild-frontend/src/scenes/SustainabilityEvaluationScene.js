import Phaser from 'phaser';
import { EPISODE_IDS } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import WorldStateManager from '../systems/WorldStateManager.js';
import SustainabilityEvaluationManager from '../systems/SustainabilityEvaluationManager.js';
import SustainabilityEvaluationViewManager from '../systems/SustainabilityEvaluationViewManager.js';
import SustainabilityEvaluationRenderer from '../systems/SustainabilityEvaluationRenderer.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class SustainabilityEvaluationScene extends Phaser.Scene {
  constructor() {
    super('SustainabilityEvaluationScene');
  }

  create() {
    const { width } = this.scale;
    const layout = SustainabilityEvaluationViewManager.getScreenLayout(width);
    const gameState = this.registry.get(REGISTRY_KEYS.gameState);
    const evaluation = SustainabilityEvaluationManager.evaluate(gameState);
    const startedWorldState = WorldStateManager.startEpisode(WorldStateManager.get(this.registry), EPISODE_IDS.SustainabilityEvaluation);
    const evaluatedWorldState = WorldStateManager.setEpisodeRunMetadata(
      startedWorldState,
      EPISODE_IDS.SustainabilityEvaluation,
      { sustainabilityEvaluation: SustainabilityEvaluationManager.serialize(evaluation) },
    );
    WorldStateManager.set(this.registry, WorldStateManager.completeEpisode(evaluatedWorldState, EPISODE_IDS.SustainabilityEvaluation, { gameState }));

    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    SustainabilityEvaluationRenderer.renderTakeaway(this, width / 2, evaluation);
    evaluation.dimensions.forEach((dimension, index) => SustainabilityEvaluationRenderer.renderDimensionCard(this, dimension, index));
    const controls = SustainabilityEvaluationRenderer.renderControls(this, width / 2);
    Object.values(controls).forEach(({ control, button }) => button.on('pointerdown', () => this.scene.start(control.target)));
  }
}
