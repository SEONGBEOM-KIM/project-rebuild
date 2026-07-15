import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import LearningDataRestoreManager from '../systems/LearningDataRestoreManager.js';
import SavedDataViewManager from '../systems/SavedDataViewManager.js';
import { createTextButton } from '../ui/TextButton.js';

export default class SavedDataScene extends Phaser.Scene {
  constructor() {
    super('SavedDataScene');
  }

  create() {
    const { width, height } = this.scale;
    const saved = SaveManager.load();

    const layout = SavedDataViewManager.getLayout(width);
    this.add.rectangle(width / 2, height / 2, width, height, layout.backgroundColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: layout.title.fontSize,
      color: layout.title.color,
      fontStyle: layout.title.fontStyle,
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: layout.subtitle.fontSize,
      color: layout.subtitle.color,
    }).setOrigin(0.5);

    this.add.rectangle(
      layout.bodyPanel.x,
      layout.bodyPanel.y,
      layout.bodyPanel.width,
      layout.bodyPanel.height,
      layout.bodyPanel.fillColor,
      layout.bodyPanel.alpha,
    ).setStrokeStyle(layout.bodyPanel.strokeWidth, layout.bodyPanel.strokeColor);

    const body = SavedDataViewManager.formatBody(saved);

    this.add.text(layout.bodyText.x, layout.bodyText.y, body, SavedDataViewManager.getBodyTextStyle());

    this.importStatusText = this.add.text(layout.status.x, layout.status.y, '', SavedDataViewManager.getStatusTextStyle()).setOrigin(0.5);

    const buttonLayout = SavedDataViewManager.getButtonLayout(width);
    const continueButtonState = SavedDataViewManager.getContinueButtonState(saved);

    const backButton = createTextButton(this, buttonLayout.back, SavedDataViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(buttonLayout.back.targetScene));

    const importButton = createTextButton(this, buttonLayout.import, SavedDataViewManager.getButtonStyle());
    importButton.on('pointerdown', () => this.openImportPicker());

    const continueButton = createTextButton(this, {
      ...buttonLayout.continue,
      backgroundColor: continueButtonState.backgroundColor,
      textColor: continueButtonState.textColor,
    }, SavedDataViewManager.getButtonStyle());
    continueButton.on('pointerdown', () => {
      if (!continueButtonState.canContinue) {
        return;
      }
      this.restoreSavedData(saved.data);
      this.scene.start(buttonLayout.continue.targetScene);
    });

    const clearButton = createTextButton(this, buttonLayout.clear, SavedDataViewManager.getButtonStyle());
    clearButton.on('pointerdown', () => {
      SaveManager.clear();
      this.scene.restart();
    });
  }

  openImportPicker() {
    const inputConfig = SavedDataViewManager.getLayout(this.scale.width).importFile;
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
        this.scene.restart();
      } catch (error) {
        this.importStatusText.setText(SavedDataViewManager.getImportErrorMessage(error));
      }
    };
    input.click();
  }

  restoreSavedData(data) {
    LearningDataRestoreManager.restore(this.registry, data);
  }

}
