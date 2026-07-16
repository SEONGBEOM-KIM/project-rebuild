import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import SaveManager from '../systems/SaveManager.js';
import TitleViewManager from '../systems/TitleViewManager.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;
    const screenText = TitleViewManager.getScreenText();
    createScreenBackground(this, screenText.backgroundColor);
    this.add.text(width / 2, screenText.title.y, screenText.title.text, screenText.title).setOrigin(0.5);
    this.add.text(width / 2, screenText.subtitle.y, screenText.subtitle.text, screenText.subtitle).setOrigin(0.5);

    const hasSave = SaveManager.hasSave();
    const layout = TitleViewManager.getLayout(hasSave);
    const startButtonConfig = TitleViewManager.getStartButton();
    const importButtonConfig = TitleViewManager.getImportButton();
    const storageButtonConfig = TitleViewManager.getStorageButton();
    const loadButtonConfig = TitleViewManager.getLoadButton();

    const startButton = this.add.text(width / 2, layout.startButtonY, startButtonConfig.label, TitleViewManager.getPrimaryButtonStyle())
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => this.scene.start(startButtonConfig.targetScene));

    const importButton = this.add.text(width / 2, layout.importButtonY, importButtonConfig.label, TitleViewManager.getSecondaryButtonStyle())
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    importButton.on('pointerdown', () => this.openImportPicker());

    this.importStatusText = this.add.text(width / 2, layout.importStatusY, '', TitleViewManager.getImportStatusStyle()).setOrigin(0.5);

    const storageButton = this.add.text(width / 2, layout.storageButtonY, storageButtonConfig.label, TitleViewManager.getStorageButtonStyle())
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    storageButton.on('pointerdown', () => this.scene.start(storageButtonConfig.targetScene));


    if (hasSave) {
      const loadButton = this.add.text(width / 2, layout.loadButtonY, loadButtonConfig.label, TitleViewManager.getLoadButtonStyle())
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      loadButton.on('pointerdown', () => this.scene.start(loadButtonConfig.targetScene));
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
