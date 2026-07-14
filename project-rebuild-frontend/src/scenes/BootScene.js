import Phaser from 'phaser';
import BootFlowManager from '../systems/BootFlowManager.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    for (const [key, value] of BootFlowManager.createInitialRegistryEntries()) {
      this.registry.set(key, value);
    }
    this.scene.start(BootFlowManager.getTargetScene());
  }
}
