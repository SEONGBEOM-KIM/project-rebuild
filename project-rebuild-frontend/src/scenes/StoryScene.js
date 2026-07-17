import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import StoryViewManager from '../systems/StoryViewManager.js';
import StoryRenderer from '../systems/StoryRenderer.js';

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const { width } = this.scale;
    const layout = StoryViewManager.getLayout();
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, {
      x: width / 2,
      text: CURRENT_EPISODE.title,
      origin: 0.5,
    });

    createLayoutText(this, layout.intro, {
      x: width / 2,
      text: CURRENT_EPISODE.intro,
      origin: 0.5,
    });

    const button = StoryViewManager.getStartButton(width);
    const goToPlacement = () => {
      this.scene.start(button.targetScene);
    };
    StoryRenderer.renderStartButton(this, button, goToPlacement);
    this.input.keyboard?.once('keydown-ENTER', goToPlacement);
  }
}
