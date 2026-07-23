import Phaser from 'phaser';
import BootFlowManager from '../systems/BootFlowManager.js';
import { EP1_VISUAL_ASSETS } from '../data/visualAssets.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.atlas(
      EP1_VISUAL_ASSETS.atlas.key,
      EP1_VISUAL_ASSETS.atlas.image,
      EP1_VISUAL_ASSETS.atlas.data,
    );
  }

  create() {
    BootFlowManager.resetRegistry(this.registry);
    this.scene.start(BootFlowManager.getTargetScene());
  }
}
