import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import StoryViewManager from '../systems/StoryViewManager.js';

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const { width, height } = this.scale;
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

    this.createStartPlacementButton(StoryViewManager.getStartButton(width));
  }

  createStartPlacementButton(button) {
    const buttonBg = createPanelBackground(this, button, {
      fillColor: button.fillColor,
      strokeWidth: button.strokeWidth,
      strokeColor: button.strokeColor,
    }).setInteractive({ useHandCursor: true });
    const buttonText = createLayoutText(this, { x: button.x, y: button.y, text: button.label }, {
      style: {
        fontSize: button.fontSize,
        color: button.textColor,
        fontStyle: button.fontStyle,
      },
      origin: 0.5,
    }).setInteractive({ useHandCursor: true });

    const goToPlacement = () => {
      this.scene.start(button.targetScene);
    };

    buttonBg.on('pointerover', () => buttonBg.setFillStyle(button.hoverFillColor));
    buttonBg.on('pointerout', () => buttonBg.setFillStyle(button.fillColor));
    buttonBg.on('pointerdown', goToPlacement);
    buttonText.on('pointerdown', goToPlacement);

    this.input.keyboard?.once('keydown-ENTER', goToPlacement);
  }
}
