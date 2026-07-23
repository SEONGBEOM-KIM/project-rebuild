import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import MockApiClient from '../systems/MockApiClient.js';
import MockSubmissionLogViewManager from '../systems/MockSubmissionLogViewManager.js';
import MockSubmissionLogRenderer from '../systems/MockSubmissionLogRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';

export default class MockSubmissionLogScene extends Phaser.Scene {
  constructor() {
    super('MockSubmissionLogScene');
  }

  create() {
    const { width } = this.scale;
    this.submissions = MockApiClient.listSubmissions();
    this.submissionsJson = MockSubmissionLogViewManager.formatJson(this.submissions);

    const layout = MockSubmissionLogViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);

    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawSummaryPanel();
    this.drawLogPanel();
    this.drawControls();
  }

  drawSummaryPanel() {
    MockSubmissionLogRenderer.renderSummaryPanel(this, this.submissions);
  }

  drawLogPanel() {
    MockSubmissionLogRenderer.renderLogPanel(this, this.submissions);
  }

  drawControls() {
    const layout = MockSubmissionLogViewManager.getControlLayout();
    this.statusText = MockSubmissionLogRenderer.renderStatus(this, layout);

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
