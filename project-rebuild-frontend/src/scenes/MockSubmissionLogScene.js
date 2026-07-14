import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import MockApiClient from '../systems/MockApiClient.js';
import MockSubmissionLogViewManager from '../systems/MockSubmissionLogViewManager.js';

export default class MockSubmissionLogScene extends Phaser.Scene {
  constructor() {
    super('MockSubmissionLogScene');
  }

  create() {
    const { width, height } = this.scale;
    this.submissions = MockApiClient.listSubmissions();
    this.submissionsJson = MockSubmissionLogViewManager.formatJson(this.submissions);

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 78, 'Mock 제출 로그', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, '실제 백엔드 연결 전, API 제출 시뮬레이션 기록을 확인합니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawSummaryPanel();
    this.drawLogPanel();
    this.drawControls();
  }

  drawSummaryPanel() {
    const layout = MockSubmissionLogViewManager.getSummaryPanelLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0xffffff, 0.96)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '제출 요약', {
      fontSize: '36px',
      color: '#172554',
      fontStyle: 'bold',
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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x111827, 0.98)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '최근 제출 JSON', {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
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
    this.statusText = this.add.text(layout.status.x, layout.status.y, MockSubmissionLogViewManager.formatStatusText(), {
      fontSize: '23px',
      color: '#bfdbfe',
      align: 'center',
    }).setOrigin(0.5);

    const copyButton = this.createButton(layout.copy.x, layout.copy.y, layout.copy.label, '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyLogs());

    const downloadButton = this.createButton(layout.download.x, layout.download.y, layout.download.label, '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadLogs());

    const clearButton = this.createButton(layout.clear.x, layout.clear.y, layout.clear.label, '#fecaca', '#7f1d1d');
    clearButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const apiButton = this.createButton(layout.api.x, layout.api.y, layout.api.label, '#bbf7d0', '#123524');
    apiButton.on('pointerdown', () => this.scene.start(layout.api.target));

    const endingButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, '#fde68a', '#0f172a');
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

  async copyLogs() {
    try {
      await navigator.clipboard.writeText(this.submissionsJson);
      this.statusText.setText(MockSubmissionLogViewManager.formatCopySuccess());
      this.statusText.setColor('#bbf7d0');
    } catch (_error) {
      this.statusText.setText(MockSubmissionLogViewManager.formatCopyFailure());
      this.statusText.setColor('#fecaca');
    }
  }

  downloadLogs() {
    const blob = new Blob([this.submissionsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = MockSubmissionLogViewManager.formatDownloadFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.statusText.setText(MockSubmissionLogViewManager.formatDownloadSuccess());
    this.statusText.setColor('#bbf7d0');
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '27px',
      color,
      backgroundColor,
      padding: { x: 22, y: 15 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
