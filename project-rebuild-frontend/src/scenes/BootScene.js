import Phaser from 'phaser';
import BootFlowManager from '../systems/BootFlowManager.js';
import { EP1_VISUAL_ASSETS, TITLE_VISUAL_ASSETS } from '../data/visualAssets.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image(TITLE_VISUAL_ASSETS.background.textureKey, TITLE_VISUAL_ASSETS.background.source);
    Object.values(EP1_VISUAL_ASSETS.buildings).forEach((asset) => {
      this.load.image(asset.textureKey, asset.source);
    });
    Object.values(EP1_VISUAL_ASSETS.exploration).forEach((asset) => {
      this.load.image(asset.textureKey, asset.source);
    });
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
