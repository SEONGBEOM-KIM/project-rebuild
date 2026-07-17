import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import TitleViewManager from '../systems/TitleViewManager.js';
import TitleRenderer from '../systems/TitleRenderer.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width } = this.scale;
    const controls = TitleRenderer.renderScreen(this, width, SaveManager.hasSave());
    this.importStatusText = controls.importStatusText;

    controls.startButton.on('pointerdown', () => this.scene.start(controls.startButtonConfig.targetScene));
    controls.importButton.on('pointerdown', () => this.openImportPicker());
    controls.storageButton.on('pointerdown', () => this.scene.start(controls.storageButtonConfig.targetScene));

    if (controls.loadButton) {
      controls.loadButton.on('pointerdown', () => this.scene.start(controls.loadButtonConfig.targetScene));
    }
  }

  openImportPicker() {
    const inputConfig = TitleViewManager.getImportFileConfig();
    const input = document.createElement('input');
    input.type = inputConfig.type;
    input.accept = inputConfig.accept;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      try {
        const text = await file.text();
        SaveManager.importJsonText(text);
        this.scene.start(inputConfig.successTargetScene);
      } catch (error) {
        this.importStatusText.setText(TitleViewManager.formatImportError(error));
      }
    };
    input.click();
  }
}
