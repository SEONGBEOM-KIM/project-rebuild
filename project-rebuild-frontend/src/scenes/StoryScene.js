import Phaser from 'phaser';
import { CURRENT_EPISODE } from '../data/episodes.js';
import StoryViewManager from '../systems/StoryViewManager.js';

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = StoryViewManager.getLayout();
    this.add.rectangle(width / 2, height / 2, width, height, layout.backgroundColor);
    this.add.text(width / 2, layout.titleY, CURRENT_EPISODE.title, {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, layout.introY, CURRENT_EPISODE.intro, {
      fontSize: '34px',
      color: '#dcfce7',
      align: 'center',
      lineSpacing: 18,
    }).setOrigin(0.5);

    this.createStartPlacementButton(StoryViewManager.getStartButton(width));
  }

  createStartPlacementButton(button) {
    const buttonBg = this.add.rectangle(button.x, button.y, button.width, button.height, button.fillColor)
      .setStrokeStyle(4, button.strokeColor)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(button.x, button.y, button.label, {
      fontSize: '38px',
      color: '#123524',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

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
