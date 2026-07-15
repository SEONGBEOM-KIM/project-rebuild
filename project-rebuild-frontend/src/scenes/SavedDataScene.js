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

    const backButton = this.createButton(buttonLayout.back.x, buttonLayout.back.y, buttonLayout.back.label, buttonLayout.back.backgroundColor, buttonLayout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(buttonLayout.back.targetScene));

    const importButton = this.createButton(buttonLayout.import.x, buttonLayout.import.y, buttonLayout.import.label, buttonLayout.import.backgroundColor, buttonLayout.import.textColor);
    importButton.on('pointerdown', () => this.openImportPicker());

    const continueButton = this.createButton(buttonLayout.continue.x, buttonLayout.continue.y, buttonLayout.continue.label, continueButtonState.backgroundColor, continueButtonState.textColor);
    continueButton.on('pointerdown', () => {
      if (!continueButtonState.canContinue) {
        return;
      }
      this.restoreSavedData(saved.data);
      this.scene.start(buttonLayout.continue.targetScene);
    });

    const clearButton = this.createButton(buttonLayout.clear.x, buttonLayout.clear.y, buttonLayout.clear.label, buttonLayout.clear.backgroundColor, buttonLayout.clear.textColor);
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

  createButton(x, y, label, backgroundColor, color) {
    return createTextButton(this, {
      x,
      y,
      label,
      backgroundColor,
      textColor: color,
    }, SavedDataViewManager.getButtonStyle());
  }
}
