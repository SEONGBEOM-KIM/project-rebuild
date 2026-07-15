import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import MockApiClient from '../systems/MockApiClient.js';
import MockSubmissionLogViewManager from '../systems/MockSubmissionLogViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';

export default class MockSubmissionLogScene extends Phaser.Scene {
  constructor() {
    super('MockSubmissionLogScene');
  }

  create() {
    const { width, height } = this.scale;
    this.submissions = MockApiClient.listSubmissions();
    this.submissionsJson = MockSubmissionLogViewManager.formatJson(this.submissions);

    const layout = MockSubmissionLogViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: layout.title.fontSize,
      color: layout.title.color,
      fontStyle: layout.title.fontStyle,
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: layout.subtitle.fontSize,
      color: layout.subtitle.color,
    }).setOrigin(0.5);

    this.drawSummaryPanel();
    this.drawLogPanel();
    this.drawControls();
  }

  drawSummaryPanel() {
    const layout = MockSubmissionLogViewManager.getSummaryPanelLayout();
    const panelStyle = MockSubmissionLogViewManager.getSummaryPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    }).setOrigin(0.5);

    const rows = MockSubmissionLogViewManager.formatSummaryRows(this.submissions);

    this.add.text(
      layout.body.x,
      layout.body.y,
      rows.join('\n'),
      MockSubmissionLogViewManager.getSummaryTextStyle(layout.body.wordWrapWidth),
    );
  }

  drawLogPanel() {
    const layout = MockSubmissionLogViewManager.getLogPanelLayout();
    const panelStyle = MockSubmissionLogViewManager.getLogPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    });

    const body = MockSubmissionLogViewManager.formatLogBody(this.submissions);
    this.add.text(
      layout.body.x,
      layout.body.y,
      body,
      MockSubmissionLogViewManager.getLogTextStyle(layout.body.wordWrapWidth),
    );
  }

  drawControls() {
    const layout = MockSubmissionLogViewManager.getControlLayout();
    this.statusText = this.add.text(layout.status.x, layout.status.y, MockSubmissionLogViewManager.formatStatusText(), MockSubmissionLogViewManager.getStatusTextStyle())
      .setOrigin(0.5);

    const copyButton = createTextButton(this, layout.copy, MockSubmissionLogViewManager.getButtonStyle());
    copyButton.on('pointerdown', () => this.copyLogs());

    const downloadButton = createTextButton(this, layout.download, MockSubmissionLogViewManager.getButtonStyle());
    downloadButton.on('pointerdown', () => this.downloadLogs());

    const clearButton = createTextButton(this, layout.clear, MockSubmissionLogViewManager.getButtonStyle());
    clearButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const apiButton = createTextButton(this, layout.api, MockSubmissionLogViewManager.getButtonStyle());
    apiButton.on('pointerdown', () => this.scene.start(layout.api.target));

    const endingButton = createTextButton(this, layout.ending, MockSubmissionLogViewManager.getButtonStyle());
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

  async copyLogs() {
    try {
      await copyTextToClipboard(this.submissionsJson);
      this.statusText.setText(MockSubmissionLogViewManager.formatCopySuccess());
      this.statusText.setColor(MockSubmissionLogViewManager.getFeedbackColor('success'));
    } catch (_error) {
      this.statusText.setText(MockSubmissionLogViewManager.formatCopyFailure());
      this.statusText.setColor(MockSubmissionLogViewManager.getFeedbackColor('error'));
    }
  }

  downloadLogs() {
    const downloadConfig = MockSubmissionLogViewManager.getDownloadConfig();
    downloadTextFile({
      content: this.submissionsJson,
      fileName: MockSubmissionLogViewManager.formatDownloadFileName(),
      mimeType: downloadConfig.mimeType,
    });
    this.statusText.setText(MockSubmissionLogViewManager.formatDownloadSuccess());
    this.statusText.setColor(MockSubmissionLogViewManager.getFeedbackColor('success'));
  }

}
