import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningDataManager from '../systems/LearningDataManager.js';
import LearningApiPayloadManager from '../systems/LearningApiPayloadManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import ApiPayloadViewManager from '../systems/ApiPayloadViewManager.js';
import { createTextButton } from '../ui/TextButton.js';

export default class ApiPayloadScene extends Phaser.Scene {
  constructor() {
    super('ApiPayloadScene');
  }

  create() {
    const { width, height } = this.scale;
    this.learningData = LearningDataManager.build(this.registry);
    this.apiPayload = LearningApiPayloadManager.build(this.learningData);
    this.apiPayloadJson = ApiPayloadViewManager.formatJson(this.apiPayload);

    const screenLayout = ApiPayloadViewManager.getScreenLayout(width);
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

    this.drawPayloadPanel();
    this.drawValidationPanel();
    this.drawSubmissionLog();
    this.drawControls();
  }

  drawPayloadPanel() {
    const layout = ApiPayloadViewManager.getPayloadPanelLayout();
    const panelStyle = ApiPayloadViewManager.getDarkPanelStyle();
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
      this.apiPayloadJson,
      ApiPayloadViewManager.getPayloadTextStyle(layout.body.wordWrapWidth),
    );
  }

  drawValidationPanel() {
    const summary = ApiPayloadViewManager.getValidationSummary(this.apiPayload);

    const layout = ApiPayloadViewManager.getValidationPanelLayout();
    const panelStyle = ApiPayloadViewManager.getLightPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, summary.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    }).setOrigin(0.5);

    this.add.text(
      layout.rows.x,
      layout.rows.y,
      ApiPayloadViewManager.formatValidationRows(summary.rows),
      ApiPayloadViewManager.getValidationTextStyle(layout.rows.wordWrapWidth),
    );

    this.statusText = this.add.text(
      layout.status.x,
      layout.status.y,
      summary.statusText,
      ApiPayloadViewManager.getStatusTextStyle(layout.status.wordWrapWidth, summary.statusColor),
    );
  }

  drawSubmissionLog() {
    const submissions = MockApiClient.listSubmissions();
    const layout = ApiPayloadViewManager.getSubmissionLogLayout();
    const logStyle = ApiPayloadViewManager.getLogPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, logStyle.fillColor, logStyle.fillAlpha)
      .setStrokeStyle(logStyle.strokeWidth, layout.title.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: logStyle.titleFontSize,
      color: logStyle.titleColor,
      fontStyle: logStyle.titleFontStyle,
    });
    this.submissionLogText = this.add.text(
      layout.body.x,
      layout.body.y,
      ApiPayloadViewManager.formatSubmissionLog(submissions),
      ApiPayloadViewManager.getLogTextStyle(layout.body.wordWrapWidth),
    );
  }

  drawControls() {
    const layout = ApiPayloadViewManager.getControlLayout();
    const submitButton = this.createButton(layout.submit.x, layout.submit.y, layout.submit.label, layout.submit.backgroundColor, layout.submit.textColor);
    submitButton.on('pointerdown', () => this.submitMockPayload());

    const copyButton = this.createButton(layout.copy.x, layout.copy.y, layout.copy.label, layout.copy.backgroundColor, layout.copy.textColor);
    copyButton.on('pointerdown', () => this.copyPayload());

    const downloadButton = this.createButton(layout.download.x, layout.download.y, layout.download.label, layout.download.backgroundColor, layout.download.textColor);
    downloadButton.on('pointerdown', () => this.downloadPayload());

    const contractButton = this.createButton(layout.contract.x, layout.contract.y, layout.contract.label, layout.contract.backgroundColor, layout.contract.textColor);
    contractButton.on('pointerdown', () => this.scene.start(layout.contract.target));

    const logButton = this.createButton(layout.log.x, layout.log.y, layout.log.label, layout.log.backgroundColor, layout.log.textColor);
    logButton.on('pointerdown', () => this.scene.start(layout.log.target));

    const dataButton = this.createButton(layout.data.x, layout.data.y, layout.data.label, layout.data.backgroundColor, layout.data.textColor);
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));

    const endingButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, layout.ending.backgroundColor, layout.ending.textColor);
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

  submitMockPayload() {
    const response = MockApiClient.submitLearningRecord(this.apiPayload);
    if (!response.ok) {
      this.statusText.setText(ApiPayloadViewManager.formatSubmitFailure(response));
      this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('error'));
      return;
    }

    const submissions = MockApiClient.listSubmissions();
    this.statusText.setText(ApiPayloadViewManager.formatSubmitSuccess(response));
    this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('success'));
    this.submissionLogText.setText(ApiPayloadViewManager.formatSubmissionLog(submissions));
    this.submissionLogText.setColor(ApiPayloadViewManager.getFeedbackColor('logUpdated'));
  }

  async copyPayload() {
    try {
      await navigator.clipboard.writeText(this.apiPayloadJson);
      this.statusText.setText(ApiPayloadViewManager.formatCopySuccess());
      this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('success'));
    } catch (_error) {
      this.statusText.setText(ApiPayloadViewManager.formatCopyFailure());
      this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('error'));
    }
  }

  downloadPayload() {
    const downloadConfig = ApiPayloadViewManager.getDownloadConfig();
    const blob = new Blob([this.apiPayloadJson], { type: downloadConfig.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = ApiPayloadViewManager.formatDownloadFileName(this.apiPayload);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.statusText.setText(ApiPayloadViewManager.formatDownloadSuccess());
    this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('success'));
  }

  createButton(x, y, label, backgroundColor, color) {
    return createTextButton(this, {
      x,
      y,
      label,
      backgroundColor,
      textColor: color,
    }, ApiPayloadViewManager.getButtonStyle());
  }
}
