import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningDataManager from '../systems/LearningDataManager.js';
import SaveManager from '../systems/SaveManager.js';
import LearningDataViewManager from '../systems/LearningDataViewManager.js';

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

    this.add.text(screenLayout.title.x, screenLayout.title.y, screenLayout.title.text, {
      fontSize: screenLayout.title.fontSize,
      color: screenLayout.title.color,
      fontStyle: screenLayout.title.fontStyle,
    }).setOrigin(0.5);

    this.add.text(screenLayout.subtitle.x, screenLayout.subtitle.y, screenLayout.subtitle.text, {
      fontSize: screenLayout.subtitle.fontSize,
      color: screenLayout.subtitle.color,
    }).setOrigin(0.5);

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
    this.saveStatusText = this.add.text(layout.body.x, layout.body.y, LearningDataViewManager.formatSaveStatus(saved), {
      fontSize: panelStyle.bodyFontSize,
      color: panelStyle.bodyColor,
      lineSpacing: panelStyle.bodyLineSpacing,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawControls() {
    const layout = LearningDataViewManager.getControlLayout();
    const apiButton = this.createButton(layout.api.x, layout.api.y, layout.api.label, layout.api.backgroundColor, layout.api.textColor);
    apiButton.on('pointerdown', () => this.scene.start(layout.api.target));

    const saveButton = this.createButton(layout.save.x, layout.save.y, layout.save.label, layout.save.backgroundColor, layout.save.textColor);
    saveButton.on('pointerdown', () => {
      const saved = SaveManager.save(this.learningData);
      this.saveStatusText.setText(LearningDataViewManager.formatSaveStatus(saved));
      this.saveStatusText.setColor('#bbf7d0');
    });

    const copyButton = this.createButton(layout.copy.x, layout.copy.y, layout.copy.label, layout.copy.backgroundColor, layout.copy.textColor);
    copyButton.on('pointerdown', () => this.copyJsonToClipboard());

    const downloadButton = this.createButton(layout.download.x, layout.download.y, layout.download.label, layout.download.backgroundColor, layout.download.textColor);
    downloadButton.on('pointerdown', () => this.downloadJson());

    const clearButton = this.createButton(layout.clear.x, layout.clear.y, layout.clear.label, layout.clear.backgroundColor, layout.clear.textColor);
    clearButton.on('pointerdown', () => {
      SaveManager.clear();
      this.saveStatusText.setText(LearningDataViewManager.formatSaveCleared());
      this.saveStatusText.setColor('#fecaca');
    });

    const backButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, layout.ending.backgroundColor, layout.ending.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

  async copyJsonToClipboard() {
    try {
      await navigator.clipboard.writeText(this.learningDataJson);
      this.saveStatusText.setText(LearningDataViewManager.formatCopySuccess());
      this.saveStatusText.setColor('#bbf7d0');
    } catch (_error) {
      this.saveStatusText.setText(LearningDataViewManager.formatCopyFailure());
      this.saveStatusText.setColor('#fecaca');
    }
  }

  downloadJson() {
    const downloadConfig = LearningDataViewManager.getDownloadConfig();
    const blob = new Blob([this.learningDataJson], { type: downloadConfig.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = LearningDataViewManager.formatDownloadFileName(this.learningData);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.saveStatusText.setText(LearningDataViewManager.formatDownloadSuccess());
    this.saveStatusText.setColor('#bbf7d0');
  }

  createButton(x, y, label, backgroundColor, color) {
    const buttonStyle = LearningDataViewManager.getButtonStyle();
    return this.add.text(x, y, label, {
      fontSize: buttonStyle.fontSize,
      color,
      backgroundColor,
      padding: buttonStyle.padding,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
