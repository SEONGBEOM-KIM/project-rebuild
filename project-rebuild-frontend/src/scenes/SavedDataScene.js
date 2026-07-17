import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import SaveManager from '../systems/SaveManager.js';
import LearningDataRestoreManager from '../systems/LearningDataRestoreManager.js';
import SavedDataViewManager from '../systems/SavedDataViewManager.js';
import SavedDataRenderer from '../systems/SavedDataRenderer.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class SavedDataScene extends Phaser.Scene {
  constructor() {
    super('SavedDataScene');
  }

  create() {
    const { width } = this.scale;
    const saved = SaveManager.load();

    const layout = SavedDataViewManager.getLayout(width);
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    SavedDataRenderer.renderBodyPanel(this, layout, saved);
    this.importStatusText = SavedDataRenderer.renderStatusText(this, layout);

    const buttonLayout = SavedDataViewManager.getButtonLayout(width);
    const controls = SavedDataRenderer.renderControls(this, buttonLayout, saved);

    controls.backButton.on('pointerdown', () => this.scene.start(buttonLayout.back.targetScene));
    controls.importButton.on('pointerdown', () => this.openImportPicker());

    controls.continueButton.on('pointerdown', () => {
      if (!controls.continueButtonState.canContinue) {
        return;
      }
      this.restoreSavedData(saved.data);
      this.scene.start(controls.continueButtonState.targetScene);
    });

    controls.clearButton.on('pointerdown', () => {
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
