import Phaser from 'phaser';
import BootFlowManager from '../systems/BootFlowManager.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    BootFlowManager.resetRegistry(this.registry);
    this.scene.start(BootFlowManager.getTargetScene());
  }
}
