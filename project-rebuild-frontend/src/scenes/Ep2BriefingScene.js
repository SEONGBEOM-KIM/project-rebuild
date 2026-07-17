import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP2_MISSION_BRIEFING } from '../data/episodeContent.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import Ep2BriefingRenderer from '../systems/Ep2BriefingRenderer.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class Ep2BriefingScene extends Phaser.Scene {
  constructor() {
    super('Ep2BriefingScene');
  }

  create() {
    const { width } = this.scale;
    const layout = Ep2BriefingViewManager.getScreenLayout(width);
    createScreenBackground(this, layout.backgroundColor);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    Ep2BriefingRenderer.renderIntroPanel(this, EP2_MISSION_BRIEFING);
    EP2_MISSION_BRIEFING.strategies.forEach((strategy, index) => {
      Ep2BriefingRenderer.renderStrategyCard(this, strategy, index);
    });

    const controls = Ep2BriefingRenderer.renderControls(this, width / 2);
    controls.endingButton.on('pointerdown', () => this.scene.start(controls.layout.ending.target));
    controls.startButton.on('pointerdown', () => this.scene.start(controls.layout.start.target));
  }
}
