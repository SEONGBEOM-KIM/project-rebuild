import Phaser from 'phaser';
import { EPISODE_IDS } from '../data/episodes.js';
import { getEpisodeContent } from '../data/episodeContent.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import IndustrializationRiskManager from '../systems/IndustrializationRiskManager.js';
import Ep4BriefingViewManager from '../systems/Ep4BriefingViewManager.js';
import Ep4BriefingRenderer from '../systems/Ep4BriefingRenderer.js';

export default class Ep4BriefingScene extends Phaser.Scene {
  constructor() {
    super('Ep4BriefingScene');
  }

  create() {
    const { width } = this.scale;
    const briefing = getEpisodeContent(EPISODE_IDS.SideEffects).missionBriefing;
    const risks = IndustrializationRiskManager.detect({
      gameState: this.registry.get(REGISTRY_KEYS.gameState),
      placedBuildings: this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [],
      placementEpisodeId: EPISODE_IDS.EconomyGrowth,
    });
    const layout = Ep4BriefingViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    Ep4BriefingRenderer.renderIntroPanel(this, briefing);
    Ep4BriefingViewManager.sortRisks(risks).forEach((risk, index) => Ep4BriefingRenderer.renderRiskCard(this, risk, index));
    Ep4BriefingRenderer.renderLearningPanel(this, briefing);

    const controls = Ep4BriefingRenderer.renderControls(this, width / 2);
    controls.backButton.on('pointerdown', () => this.scene.start(controls.layout.back.target));
    controls.nextButton.on('pointerdown', () => this.scene.start(controls.layout.next.target));
  }
}
