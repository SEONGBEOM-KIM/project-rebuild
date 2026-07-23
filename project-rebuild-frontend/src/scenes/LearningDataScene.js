import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import LearningDataManager from '../systems/LearningDataManager.js';
import SaveManager from '../systems/SaveManager.js';
import LearningDataViewManager from '../systems/LearningDataViewManager.js';
import LearningDataRenderer from '../systems/LearningDataRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class LearningDataScene extends Phaser.Scene {
  constructor() {
    super('LearningDataScene');
  }

  create() {
    const { width } = this.scale;
    const learningData = this.buildLearningData();

    const screenLayout = LearningDataViewManager.getScreenLayout(width);
    createScreenBackground(this, screenLayout.backgroundColor);

    createLayoutText(this, screenLayout.title, { origin: 0.5 });
    createLayoutText(this, screenLayout.subtitle, { origin: 0.5 });

    this.learningData = learningData;
    this.learningDataJson = LearningDataViewManager.formatJson(learningData);
    LearningDataRenderer.renderSummaryStrip(this, learningData, width / 2);
    LearningDataRenderer.renderDataPanel(this, this.learningDataJson);
    LearningDataRenderer.renderValidationPanel(this, learningData);
    this.saveStatusText = LearningDataRenderer.renderSavePanel(this, SaveManager.load());
    this.drawControls();
  }

  buildLearningData() {
    return LearningDataManager.build(this.registry);
  }


  drawControls() {
    const layout = LearningDataViewManager.getControlLayout();
    const apiButton = createTextButton(this, layout.api, LearningDataViewManager.getButtonStyle());
    apiButton.on('pointerdown', () => this.scene.start(layout.api.target));

    const saveButton = createTextButton(this, layout.save, LearningDataViewManager.getButtonStyle());
    saveButton.on('pointerdown', () => {
      const saved = SaveManager.save(this.learningData);
      this.saveStatusText.setText(LearningDataViewManager.formatSaveStatus(saved));
      this.saveStatusText.setColor(LearningDataViewManager.getFeedbackColor('success'));
    });

    const copyButton = createTextButton(this, layout.copy, LearningDataViewManager.getButtonStyle());
    copyButton.on('pointerdown', () => this.copyJsonToClipboard());

    const downloadButton = createTextButton(this, layout.download, LearningDataViewManager.getButtonStyle());
    downloadButton.on('pointerdown', () => this.downloadJson());

    const clearButton = createTextButton(this, layout.clear, LearningDataViewManager.getButtonStyle());
    clearButton.on('pointerdown', () => {
      SaveManager.clear();
      this.saveStatusText.setText(LearningDataViewManager.formatSaveCleared());
      this.saveStatusText.setColor(LearningDataViewManager.getFeedbackColor('error'));
    });

    const backButton = createTextButton(this, layout.ending, LearningDataViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

  async copyJsonToClipboard() {
    try {
      await copyTextToClipboard(this.learningDataJson);
      this.saveStatusText.setText(LearningDataViewManager.formatCopySuccess());
      this.saveStatusText.setColor(LearningDataViewManager.getFeedbackColor('success'));
    } catch (_error) {
      this.saveStatusText.setText(LearningDataViewManager.formatCopyFailure());
      this.saveStatusText.setColor(LearningDataViewManager.getFeedbackColor('error'));
    }
  }

  downloadJson() {
    const downloadConfig = LearningDataViewManager.getDownloadConfig();
    downloadTextFile({
      content: this.learningDataJson,
      fileName: LearningDataViewManager.formatDownloadFileName(this.learningData),
      mimeType: downloadConfig.mimeType,
    });
    this.saveStatusText.setText(LearningDataViewManager.formatDownloadSuccess());
    this.saveStatusText.setColor(LearningDataViewManager.getFeedbackColor('success'));
  }

}
