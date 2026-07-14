import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import StorageSummaryManager from '../systems/StorageSummaryManager.js';

export default class StorageManagerScene extends Phaser.Scene {
  constructor() {
    super('StorageManagerScene');
  }

  create() {
    const { width, height } = this.scale;
    this.saved = SaveManager.load();
    this.submissions = MockApiClient.listSubmissions();

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    this.add.text(width / 2, 90, '브라우저 저장 관리', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 155, 'localStorage에 남아 있는 학습 저장 데이터와 Mock 제출 로그를 관리합니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawSavedDataPanel();
    this.drawSubmissionPanel();
    this.drawControls();
  }

  drawSavedDataPanel() {
    const layout = StorageSummaryManager.getPanelLayout().saved;
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0xffffff, 0.96)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '학습 저장 데이터', {
      fontSize: '36px',
      color: layout.title.color,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = StorageSummaryManager.formatSavedDataRows(this.saved);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), StorageSummaryManager.getBodyTextStyle());
  }

  drawSubmissionPanel() {
    const layout = StorageSummaryManager.getPanelLayout().submissions;
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0xffffff, 0.96)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, 'Mock 제출 로그', {
      fontSize: '36px',
      color: layout.title.color,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = StorageSummaryManager.formatSubmissionRows(this.submissions);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), StorageSummaryManager.getBodyTextStyle());
  }

  drawControls() {
    const layout = StorageSummaryManager.getControlLayout();
    this.statusText = this.add.text(layout.status.x, layout.status.y, StorageSummaryManager.formatStatusText(), {
      fontSize: '24px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    const clearSaveButton = this.createButton(layout.clearSave.x, layout.clearSave.y, '학습 저장 삭제', '#fecaca', '#7f1d1d');
    clearSaveButton.on('pointerdown', () => {
      SaveManager.clear();
      this.scene.restart();
    });

    const clearLogButton = this.createButton(layout.clearLog.x, layout.clearLog.y, '제출 로그 삭제', '#fed7aa', '#7c2d12');
    clearLogButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const clearAllButton = this.createButton(layout.clearAll.x, layout.clearAll.y, '전체 초기화', '#fca5a5', '#7f1d1d');
    clearAllButton.on('pointerdown', () => {
      SaveManager.clear();
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const titleButton = this.createButton(layout.title.x, layout.title.y, '제목으로', '#c4b5fd', '#1e1b4b');
    titleButton.on('pointerdown', () => this.scene.start('TitleScene'));

    const dataButton = this.createButton(layout.savedData.x, layout.savedData.y, '저장 확인', '#bbf7d0', '#123524');
    dataButton.on('pointerdown', () => this.scene.start('SavedDataScene'));
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '28px',
      color,
      backgroundColor,
      padding: { x: 24, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
