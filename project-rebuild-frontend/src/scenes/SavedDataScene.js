import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import SaveManager from '../systems/SaveManager.js';
import LearningDataRestoreManager from '../systems/LearningDataRestoreManager.js';
import SavedDataViewManager from '../systems/SavedDataViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class SavedDataScene extends Phaser.Scene {
  constructor() {
    super('SavedDataScene');
  }

  create() {
    const { width, height } = this.scale;
    const saved = SaveManager.load();

    const layout = SavedDataViewManager.getLayout(width);
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    createPanelBackground(this, layout.bodyPanel, {
      fillColor: layout.bodyPanel.fillColor,
      fillAlpha: layout.bodyPanel.alpha,
      strokeWidth: layout.bodyPanel.strokeWidth,
      strokeColor: layout.bodyPanel.strokeColor,
    });

    const body = SavedDataViewManager.formatBody(saved);

    createLayoutText(this, layout.bodyText, {
      text: body,
      style: SavedDataViewManager.getBodyTextStyle(),
    });

    this.importStatusText = createLayoutText(this, layout.status, {
      style: SavedDataViewManager.getStatusTextStyle(),
      origin: 0.5,
    });

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
