import Phaser from 'phaser';
import { CURRENT_EPISODE } from '../data/episodes.js';

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x123524);
    this.add.text(width / 2, 150, CURRENT_EPISODE.title, {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 430, CURRENT_EPISODE.intro, {
      fontSize: '34px',
      color: '#dcfce7',
      align: 'center',
      lineSpacing: 18,
    }).setOrigin(0.5);

    this.createStartPlacementButton(width / 2, 830);
  }

  createStartPlacementButton(x, y) {
    const buttonBg = this.add.rectangle(x, y, 360, 86, 0xbbf7d0)
      .setStrokeStyle(4, 0x86efac)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(x, y, '지역 탐색 시작', {
      fontSize: '38px',
      color: '#123524',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const goToPlacement = () => {
      this.scene.start('ExplorationScene');
    };

    buttonBg.on('pointerover', () => buttonBg.setFillStyle(0x86efac));
    buttonBg.on('pointerout', () => buttonBg.setFillStyle(0xbbf7d0));
    buttonBg.on('pointerdown', goToPlacement);
    buttonText.on('pointerdown', goToPlacement);

    this.input.keyboard?.once('keydown-ENTER', goToPlacement);
  }
}
