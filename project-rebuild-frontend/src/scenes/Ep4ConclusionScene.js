import Phaser from 'phaser';
import { EPISODE_IDS } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import IndustrializationRiskManager from '../systems/IndustrializationRiskManager.js';
import Ep4ConclusionViewManager from '../systems/Ep4ConclusionViewManager.js';
import Ep4ConclusionRenderer from '../systems/Ep4ConclusionRenderer.js';

export default class Ep4ConclusionScene extends Phaser.Scene {
  constructor() {
    super('Ep4ConclusionScene');
  }

  create() {
    const { width } = this.scale;
    const risks = IndustrializationRiskManager.detect({
      gameState: this.registry.get(REGISTRY_KEYS.gameState),
      placedBuildings: this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [],
      placementEpisodeId: EPISODE_IDS.EconomyGrowth,
    });
    const layout = Ep4ConclusionViewManager.getScreenLayout(width);
    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    Ep4ConclusionRenderer.renderMainPanel(this, risks);
    Ep4ConclusionRenderer.renderNextPanel(this);
    const controls = Ep4ConclusionRenderer.renderControls(this, width / 2);
    controls.backButton.on('pointerdown', () => this.scene.start(controls.layout.back.target));
    controls.nextButton.on('pointerdown', () => this.scene.start(controls.layout.next.target, { episodeId: EPISODE_IDS.BalancedSolutions }));
  }
}
