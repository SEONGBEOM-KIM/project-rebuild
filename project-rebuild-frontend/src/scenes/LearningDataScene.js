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

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 78, '학습 데이터 확인', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, '현재는 서버 저장 없이 registry에 쌓인 학습 기록을 화면에서 확인하는 UI 단계입니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x111827, 0.98)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '저장 후보 데이터', {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0xffffff, 0.96)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '데이터 검증', {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const summary = LearningDataViewManager.getValidationSummary(learningData);
    this.add.text(layout.rows.x, layout.rows.y, LearningDataViewManager.formatValidationRows(summary.rows), {
      fontSize: '21px',
      color: '#1e293b',
      lineSpacing: 9,
      wordWrap: { width: layout.rows.wordWrapWidth },
    });

    this.add.rectangle(layout.summaryBox.x, layout.summaryBox.y, layout.summaryBox.width, layout.summaryBox.height, summary.backgroundColor, 1)
      .setStrokeStyle(3, summary.strokeColor);
    this.add.text(layout.summaryTitle.x, layout.summaryTitle.y, summary.title, {
      fontSize: '24px',
      color: summary.titleColor,
      fontStyle: 'bold',
    });
    this.add.text(layout.summaryBody.x, layout.summaryBody.y, summary.body, {
      fontSize: '20px',
      color: summary.bodyColor,
      lineSpacing: 8,
      wordWrap: { width: layout.summaryBody.wordWrapWidth },
    });
  }

  drawSavePanel() {
    const saved = SaveManager.load();
    const layout = LearningDataViewManager.getSavePanelLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x1e293b, 0.98)
      .setStrokeStyle(4, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '임시 저장 상태', {
      fontSize: '25px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.saveStatusText = this.add.text(layout.body.x, layout.body.y, LearningDataViewManager.formatSaveStatus(saved), {
      fontSize: '20px',
      color: '#dbeafe',
      lineSpacing: 8,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawControls() {
    const layout = LearningDataViewManager.getControlLayout();
    const apiButton = this.createButton(layout.api.x, layout.api.y, layout.api.label, '#fde68a', '#0f172a');
    apiButton.on('pointerdown', () => this.scene.start(layout.api.target));

    const saveButton = this.createButton(layout.save.x, layout.save.y, layout.save.label, '#bbf7d0', '#123524');
    saveButton.on('pointerdown', () => {
      const saved = SaveManager.save(this.learningData);
      this.saveStatusText.setText(LearningDataViewManager.formatSaveStatus(saved));
      this.saveStatusText.setColor('#bbf7d0');
    });

    const copyButton = this.createButton(layout.copy.x, layout.copy.y, layout.copy.label, '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyJsonToClipboard());

    const downloadButton = this.createButton(layout.download.x, layout.download.y, layout.download.label, '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadJson());

    const clearButton = this.createButton(layout.clear.x, layout.clear.y, layout.clear.label, '#fecaca', '#7f1d1d');
    clearButton.on('pointerdown', () => {
      SaveManager.clear();
      this.saveStatusText.setText(LearningDataViewManager.formatSaveCleared());
      this.saveStatusText.setColor('#fecaca');
    });

    const backButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, '#c4b5fd', '#1e1b4b');
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
    const blob = new Blob([this.learningDataJson], { type: 'application/json' });
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
    return this.add.text(x, y, label, {
      fontSize: '25px',
      color,
      backgroundColor,
      padding: { x: 22, y: 15 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
