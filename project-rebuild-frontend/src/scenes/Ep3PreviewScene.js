import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { getEpisodeContent } from '../data/episodeContent.js';
import { economyBuildings } from '../data/economyBuildings.js';
import { economyPolicies } from '../data/economyPolicies.js';
import { EPISODE_IDS } from '../data/episodes.js';
import Ep3PreviewViewManager from '../systems/Ep3PreviewViewManager.js';
import Ep3PreviewRenderer from '../systems/Ep3PreviewRenderer.js';
import EpisodePlacementLaunchManager from '../systems/EpisodePlacementLaunchManager.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class Ep3PreviewScene extends Phaser.Scene {
  constructor() {
    super('Ep3PreviewScene');
  }

  create() {
    const { width } = this.scale;
    const briefing = getEpisodeContent(EPISODE_IDS.EconomyGrowth).missionBriefing;
    const layout = Ep3PreviewViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.backgroundColor);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    Ep3PreviewRenderer.renderIntroPanel(this, briefing);
    briefing.strategies.forEach((strategy, index) => {
      Ep3PreviewRenderer.renderFocusCard(this, strategy, index);
    });
    Ep3PreviewRenderer.renderTransitionNote(this, briefing, economyPolicies, economyBuildings);

    const controls = Ep3PreviewRenderer.renderControls(this, width / 2);
    controls.endingButton.on('pointerdown', () => this.scene.start(controls.layout.ending.target));
    controls.startButton.on('pointerdown', () => {
      this.prepareEp3Placement();
      this.scene.start(controls.layout.start.target);
    });
    controls.restartButton.on('pointerdown', () => this.scene.start(controls.layout.restart.target));
  }

  prepareEp3Placement() {
    EpisodePlacementLaunchManager.prepareEp3EconomyPlacement(this.registry);
  }
}
