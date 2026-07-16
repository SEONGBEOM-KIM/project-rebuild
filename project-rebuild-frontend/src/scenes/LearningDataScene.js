import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningDataManager from '../systems/LearningDataManager.js';
import SaveManager from '../systems/SaveManager.js';
import LearningDataViewManager from '../systems/LearningDataViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class LearningDataScene extends Phaser.Scene {
  constructor() {
    super('LearningDataScene');
  }

  create() {
    const { width, height } = this.scale;
    const learningData = this.buildLearningData();

    const screenLayout = LearningDataViewManager.getScreenLayout(width);
    this.add.rectangle(width / 2, height / 2, width, height, screenLayout.backgroundColor);
    ProgressStepper.render(this, screenLayout.progressStep);

    createLayoutText(this, screenLayout.title, { origin: 0.5 });
    createLayoutText(this, screenLayout.subtitle, { origin: 0.5 });

    this.learningData = learningData;
    this.learningDataJson = LearningDataViewManager.formatJson(learningData);
    this.drawDataPanel(learningData);
    this.drawValidationPanel(learningData);
    this.drawSavePanel();
    this.drawControls();
  }

  buildLearningData() {
    return LearningDataManager.build(this.registry);
  }

  drawDataPanel(_learningData) {
    const layout = LearningDataViewManager.getDataPanelLayout();
    const panelStyle = LearningDataViewManager.getDarkPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    });

    this.add.text(
      layout.body.x,
      layout.body.y,
      this.learningDataJson,
      LearningDataViewManager.getJsonTextStyle(layout.body.wordWrapWidth),
    );
  }

  drawValidationPanel(learningData) {
    const layout = LearningDataViewManager.getValidationPanelLayout();
    const panelStyle = LearningDataViewManager.getLightPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    }).setOrigin(0.5);

    const summary = LearningDataViewManager.getValidationSummary(learningData);
    this.add.text(
      layout.rows.x,
      layout.rows.y,
      LearningDataViewManager.formatValidationRows(summary.rows),
      LearningDataViewManager.getValidationTextStyle(layout.rows.wordWrapWidth),
    );

    const summaryStyle = LearningDataViewManager.getSummaryBoxStyle(layout.summaryBody.wordWrapWidth);
    this.add.rectangle(layout.summaryBox.x, layout.summaryBox.y, layout.summaryBox.width, layout.summaryBox.height, summary.backgroundColor, summaryStyle.fillAlpha)
      .setStrokeStyle(summaryStyle.strokeWidth, summary.strokeColor);
    this.add.text(layout.summaryTitle.x, layout.summaryTitle.y, summary.title, {
      fontSize: summaryStyle.titleFontSize,
      color: summary.titleColor,
      fontStyle: summaryStyle.titleFontStyle,
    });
    this.add.text(layout.summaryBody.x, layout.summaryBody.y, summary.body, {
      fontSize: summaryStyle.bodyFontSize,
      color: summary.bodyColor,
      lineSpacing: summaryStyle.lineSpacing,
      wordWrap: summaryStyle.wordWrap,
    });
  }

  drawSavePanel() {
    const saved = SaveManager.load();
    const layout = LearningDataViewManager.getSavePanelLayout();
    const panelStyle = LearningDataViewManager.getSavePanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    });
    this.saveStatusText = createLayoutText(this, layout.body, {
      text: LearningDataViewManager.formatSaveStatus(saved),
      style: {
        fontSize: panelStyle.bodyFontSize,
        color: panelStyle.bodyColor,
        lineSpacing: panelStyle.bodyLineSpacing,
      },
    });
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
