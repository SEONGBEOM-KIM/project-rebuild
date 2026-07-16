import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningDataManager from '../systems/LearningDataManager.js';
import LearningApiPayloadManager from '../systems/LearningApiPayloadManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import ApiPayloadViewManager from '../systems/ApiPayloadViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

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

    createLayoutText(this, screenLayout.title, { origin: 0.5 });
    createLayoutText(this, screenLayout.subtitle, { origin: 0.5 });

    this.drawPayloadPanel();
    this.drawValidationPanel();
    this.drawSubmissionLog();
    this.drawControls();
  }

  drawPayloadPanel() {
    const layout = ApiPayloadViewManager.getPayloadPanelLayout();
    const panelStyle = ApiPayloadViewManager.getDarkPanelStyle();
    createPanelBackground(this, layout.panel, panelStyle);
    createPanelTitle(this, layout.title, panelStyle);
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
    createPanelBackground(this, layout.panel, panelStyle, { strokeColor: summary.strokeColor });
    createPanelTitle(this, layout.title, panelStyle, { origin: 0.5 });

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
    createPanelBackground(this, layout.panel, logStyle, { strokeColor: layout.title.strokeColor });
    createPanelTitle(this, layout.title, logStyle);
    this.submissionLogText = this.add.text(
      layout.body.x,
      layout.body.y,
      ApiPayloadViewManager.formatSubmissionLog(submissions),
      ApiPayloadViewManager.getLogTextStyle(layout.body.wordWrapWidth),
    );
  }

  drawControls() {
    const layout = ApiPayloadViewManager.getControlLayout();
    const submitButton = createTextButton(this, layout.submit, ApiPayloadViewManager.getButtonStyle());
    submitButton.on('pointerdown', () => this.submitMockPayload());

    const copyButton = createTextButton(this, layout.copy, ApiPayloadViewManager.getButtonStyle());
    copyButton.on('pointerdown', () => this.copyPayload());

    const downloadButton = createTextButton(this, layout.download, ApiPayloadViewManager.getButtonStyle());
    downloadButton.on('pointerdown', () => this.downloadPayload());

    const contractButton = createTextButton(this, layout.contract, ApiPayloadViewManager.getButtonStyle());
    contractButton.on('pointerdown', () => this.scene.start(layout.contract.target));

    const logButton = createTextButton(this, layout.log, ApiPayloadViewManager.getButtonStyle());
    logButton.on('pointerdown', () => this.scene.start(layout.log.target));

    const dataButton = createTextButton(this, layout.data, ApiPayloadViewManager.getButtonStyle());
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));

    const endingButton = createTextButton(this, layout.ending, ApiPayloadViewManager.getButtonStyle());
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
      await copyTextToClipboard(this.apiPayloadJson);
      this.statusText.setText(ApiPayloadViewManager.formatCopySuccess());
      this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('success'));
    } catch (_error) {
      this.statusText.setText(ApiPayloadViewManager.formatCopyFailure());
      this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('error'));
    }
  }

  downloadPayload() {
    const downloadConfig = ApiPayloadViewManager.getDownloadConfig();
    downloadTextFile({
      content: this.apiPayloadJson,
      fileName: ApiPayloadViewManager.formatDownloadFileName(this.apiPayload),
      mimeType: downloadConfig.mimeType,
    });
    this.statusText.setText(ApiPayloadViewManager.formatDownloadSuccess());
    this.statusText.setColor(ApiPayloadViewManager.getFeedbackColor('success'));
  }

}
