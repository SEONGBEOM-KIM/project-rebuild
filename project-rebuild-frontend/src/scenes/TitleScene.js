import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
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
    createLayoutText(this, screenText.title, { x: width / 2, origin: 0.5 });
    createLayoutText(this, screenText.subtitle, { x: width / 2, origin: 0.5 });

    const hasSave = SaveManager.hasSave();
    const layout = TitleViewManager.getLayout(hasSave);
    const startButtonConfig = TitleViewManager.getStartButton();
    const importButtonConfig = TitleViewManager.getImportButton();
    const storageButtonConfig = TitleViewManager.getStorageButton();
    const loadButtonConfig = TitleViewManager.getLoadButton();

    this.createTitleButton(width / 2, layout.startButtonY, startButtonConfig, TitleViewManager.getPrimaryButtonStyle())
      .on('pointerdown', () => this.scene.start(startButtonConfig.targetScene));

    this.createTitleButton(width / 2, layout.importButtonY, importButtonConfig, TitleViewManager.getSecondaryButtonStyle())
      .on('pointerdown', () => this.openImportPicker());

    this.importStatusText = createLayoutText(this, { x: width / 2, y: layout.importStatusY }, {
      style: TitleViewManager.getImportStatusStyle(),
      origin: 0.5,
    });

    this.createTitleButton(width / 2, layout.storageButtonY, storageButtonConfig, TitleViewManager.getStorageButtonStyle())
      .on('pointerdown', () => this.scene.start(storageButtonConfig.targetScene));

    if (hasSave) {
      this.createTitleButton(width / 2, layout.loadButtonY, loadButtonConfig, TitleViewManager.getLoadButtonStyle())
        .on('pointerdown', () => this.scene.start(loadButtonConfig.targetScene));
    }
  }

  createTitleButton(x, y, config, style) {
    return createTextButton(this, {
      x,
      y,
      label: config.label,
      backgroundColor: style.backgroundColor,
      textColor: style.color,
    }, style);
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
