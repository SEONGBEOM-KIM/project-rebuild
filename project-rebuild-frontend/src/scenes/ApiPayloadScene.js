import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningDataManager from '../systems/LearningDataManager.js';
import LearningApiPayloadManager from '../systems/LearningApiPayloadManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import ApiPayloadViewManager from '../systems/ApiPayloadViewManager.js';

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
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(screenLayout.subtitle.x, screenLayout.subtitle.y, screenLayout.subtitle.text, {
      fontSize: '21px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawPayloadPanel();
    this.drawValidationPanel();
    this.drawSubmissionLog();
    this.drawControls();
  }

  drawPayloadPanel() {
    const layout = ApiPayloadViewManager.getPayloadPanelLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x0f172a, 0.98)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '31px',
      color: '#ffffff',
      fontStyle: 'bold',
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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0xffffff, 0.96).setStrokeStyle(5, summary.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.rows.x, layout.rows.y, ApiPayloadViewManager.formatValidationRows(summary.rows), {
      fontSize: '21px',
      color: '#1e293b',
      lineSpacing: 9,
      wordWrap: { width: layout.rows.wordWrapWidth },
    });

    this.statusText = this.add.text(layout.status.x, layout.status.y, summary.statusText, {
      fontSize: '21px',
      color: summary.statusColor,
      lineSpacing: 9,
      wordWrap: { width: layout.status.wordWrapWidth },
    });
  }

  drawSubmissionLog() {
    const submissions = MockApiClient.listSubmissions();
    const layout = ApiPayloadViewManager.getSubmissionLogLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x1e293b, 0.98).setStrokeStyle(3, layout.title.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.submissionLogText = this.add.text(layout.body.x, layout.body.y, ApiPayloadViewManager.formatSubmissionLog(submissions), {
      fontSize: '18px',
      color: '#dbeafe',
      lineSpacing: 6,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
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
      this.statusText.setColor('#991b1b');
      return;
    }

    const submissions = MockApiClient.listSubmissions();
    this.statusText.setText(ApiPayloadViewManager.formatSubmitSuccess(response));
    this.statusText.setColor('#166534');
    this.submissionLogText.setText(ApiPayloadViewManager.formatSubmissionLog(submissions));
    this.submissionLogText.setColor('#bbf7d0');
  }

  async copyPayload() {
    try {
      await navigator.clipboard.writeText(this.apiPayloadJson);
      this.statusText.setText(ApiPayloadViewManager.formatCopySuccess());
      this.statusText.setColor('#166534');
    } catch (_error) {
      this.statusText.setText(ApiPayloadViewManager.formatCopyFailure());
      this.statusText.setColor('#991b1b');
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
    this.statusText.setColor('#166534');
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '21px',
      color,
      backgroundColor,
      padding: { x: 14, y: 13 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
