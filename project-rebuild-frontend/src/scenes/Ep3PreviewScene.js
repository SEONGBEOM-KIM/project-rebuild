import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { getNextEpisodeContent } from '../data/episodeContent.js';
import Ep3PreviewViewManager from '../systems/Ep3PreviewViewManager.js';
import Ep3PreviewRenderer from '../systems/Ep3PreviewRenderer.js';
import { createLayoutText } from '../ui/LayoutText.js';

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
    Ep3PreviewRenderer.renderTransitionNote(this, preview);

    const controls = Ep3PreviewRenderer.renderControls(this, width / 2);
    controls.endingButton.on('pointerdown', () => this.scene.start(controls.layout.ending.target));
    controls.restartButton.on('pointerdown', () => this.scene.start(controls.layout.restart.target));
  }
}
