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
    this.add.rectangle(420, 535, 520, 640, 0xffffff, 0.96).setStrokeStyle(5, 0x93c5fd);
    this.add.text(420, 260, '제출 요약', {
      fontSize: '36px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = MockSubmissionLogViewManager.formatSummaryRows(this.submissions);

    this.add.text(195, 325, rows.join('\n'), {
      fontSize: '24px',
      color: '#1e293b',
      lineSpacing: 11,
      wordWrap: { width: 450 },
    });
  }

  drawLogPanel() {
    this.add.rectangle(1185, 535, 920, 640, 0x111827, 0.98).setStrokeStyle(5, 0x60a5fa);
    this.add.text(760, 260, '최근 제출 JSON', {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    const body = MockSubmissionLogViewManager.formatLogBody(this.submissions);
    this.add.text(760, 315, body, {
      fontSize: '19px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: 840 },
    });
  }

  drawControls() {
    this.statusText = this.add.text(960, 855, 'Mock 제출 로그는 브라우저 localStorage에 임시 저장됩니다.', {
      fontSize: '23px',
      color: '#bfdbfe',
      align: 'center',
    }).setOrigin(0.5);

    const copyButton = this.createButton(420, 940, '로그 복사', '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyLogs());

    const downloadButton = this.createButton(700, 940, '로그 다운로드', '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadLogs());

    const clearButton = this.createButton(1010, 940, '로그 삭제', '#fecaca', '#7f1d1d');
    clearButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const apiButton = this.createButton(1300, 940, 'API 미리보기', '#bbf7d0', '#123524');
    apiButton.on('pointerdown', () => this.scene.start('ApiPayloadScene'));

    const endingButton = this.createButton(1580, 940, '마무리로', '#fde68a', '#0f172a');
    endingButton.on('pointerdown', () => this.scene.start('EndingScene'));
  }

  async copyLogs() {
    try {
      await navigator.clipboard.writeText(this.submissionsJson);
      this.statusText.setText('Mock 제출 로그를 클립보드에 복사했습니다.');
      this.statusText.setColor('#bbf7d0');
    } catch (_error) {
      this.statusText.setText('클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.');
      this.statusText.setColor('#fecaca');
    }
  }

  downloadLogs() {
    const blob = new Blob([this.submissionsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-rebuild-mock-submission-log.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.statusText.setText('Mock 제출 로그 다운로드를 시작했습니다.');
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
