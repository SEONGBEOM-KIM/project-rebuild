import Phaser from 'phaser';
import BootFlowManager from '../systems/BootFlowManager.js';
import TitleRenderer from '../systems/TitleRenderer.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width } = this.scale;
    const controls = TitleRenderer.renderScreen(this, width);

    controls.startSurface.on('pointerdown', () => {
      BootFlowManager.resetRegistry(this.registry);
      this.scene.start(controls.startTargetScene);
    });
  }
}
