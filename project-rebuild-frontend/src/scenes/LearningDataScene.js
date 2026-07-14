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

  drawDataPanel(learningData) {
    this.add.rectangle(760, 560, 1120, 720, 0x111827, 0.98).setStrokeStyle(5, 0x60a5fa);
    this.add.text(240, 235, '저장 후보 데이터', {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    this.add.text(245, 290, this.learningDataJson, {
      fontSize: '20px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: 1030 },
    });
  }

  drawValidationPanel(learningData) {
    this.add.rectangle(1550, 560, 500, 720, 0xffffff, 0.96).setStrokeStyle(5, 0xfde68a);
    this.add.text(1550, 235, '데이터 검증', {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const summary = LearningDataViewManager.getValidationSummary(learningData);
    this.add.text(1325, 290, LearningDataViewManager.formatValidationRows(summary.rows), {
      fontSize: '21px',
      color: '#1e293b',
      lineSpacing: 9,
      wordWrap: { width: 440 },
    });

    this.add.rectangle(1550, 620, 430, 190, summary.backgroundColor, 1)
      .setStrokeStyle(3, summary.strokeColor);
    this.add.text(1355, 545, summary.title, {
      fontSize: '24px',
      color: summary.titleColor,
      fontStyle: 'bold',
    });
    this.add.text(1355, 585, summary.body, {
      fontSize: '20px',
      color: summary.bodyColor,
      lineSpacing: 8,
      wordWrap: { width: 390 },
    });
  }

  drawSavePanel() {
    const saved = SaveManager.load();
    this.add.rectangle(1550, 815, 500, 150, 0x1e293b, 0.98).setStrokeStyle(4, 0xbbf7d0);
    this.add.text(1325, 760, '임시 저장 상태', {
      fontSize: '25px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.saveStatusText = this.add.text(1325, 800, LearningDataViewManager.formatSaveStatus(saved), {
      fontSize: '20px',
      color: '#dbeafe',
      lineSpacing: 8,
      wordWrap: { width: 440 },
    });
  }

  drawControls() {
    const apiButton = this.createButton(260, 960, 'API 미리보기', '#fde68a', '#0f172a');
    apiButton.on('pointerdown', () => this.scene.start('ApiPayloadScene'));

    const saveButton = this.createButton(520, 960, '임시 저장', '#bbf7d0', '#123524');
    saveButton.on('pointerdown', () => {
      const saved = SaveManager.save(this.learningData);
      this.saveStatusText.setText(LearningDataViewManager.formatSaveStatus(saved));
      this.saveStatusText.setColor('#bbf7d0');
    });

    const copyButton = this.createButton(760, 960, 'JSON 복사', '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyJsonToClipboard());

    const downloadButton = this.createButton(1015, 960, 'JSON 다운로드', '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadJson());

    const clearButton = this.createButton(1275, 960, '저장 삭제', '#fecaca', '#7f1d1d');
    clearButton.on('pointerdown', () => {
      SaveManager.clear();
      this.saveStatusText.setText('저장된 학습 데이터를 삭제했습니다.');
      this.saveStatusText.setColor('#fecaca');
    });

    const backButton = this.createButton(1545, 960, '마무리로', '#c4b5fd', '#1e1b4b');
    backButton.on('pointerdown', () => this.scene.start('EndingScene'));
  }

  async copyJsonToClipboard() {
    try {
      await navigator.clipboard.writeText(this.learningDataJson);
      this.saveStatusText.setText('JSON을 클립보드에 복사했습니다.');
      this.saveStatusText.setColor('#bbf7d0');
    } catch (_error) {
      this.saveStatusText.setText('클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.');
      this.saveStatusText.setColor('#fecaca');
    }
  }

  downloadJson() {
    const blob = new Blob([this.learningDataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-rebuild-ep${this.learningData.episode}-learning-data.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.saveStatusText.setText('JSON 다운로드를 시작했습니다.');
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
