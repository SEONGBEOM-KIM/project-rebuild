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

    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 78, 'API 저장 페이로드 미리보기', {
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, 'Django API 연동 전, 프론트엔드 학습 데이터를 서버 저장용 구조로 변환해 확인합니다.', {
      fontSize: '21px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawPayloadPanel();
    this.drawValidationPanel();
    this.drawSubmissionLog();
    this.drawControls();
  }

  drawPayloadPanel() {
    this.add.rectangle(760, 555, 1120, 710, 0x0f172a, 0.98).setStrokeStyle(5, 0x60a5fa);
    this.add.text(240, 230, 'POST /api/learning-records/ 후보 body', {
      fontSize: '31px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.add.text(245, 285, this.apiPayloadJson, {
      fontSize: '20px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: 1030 },
    });
  }

  drawValidationPanel() {
    const summary = ApiPayloadViewManager.getValidationSummary(this.apiPayload);

    this.add.rectangle(1550, 555, 500, 710, 0xffffff, 0.96).setStrokeStyle(5, summary.strokeColor);
    this.add.text(1550, 230, 'API 구조 검증', {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(1325, 290, ApiPayloadViewManager.formatValidationRows(summary.rows), {
      fontSize: '21px',
      color: '#1e293b',
      lineSpacing: 9,
      wordWrap: { width: 440 },
    });

    this.statusText = this.add.text(1325, 770, summary.statusText, {
      fontSize: '21px',
      color: summary.statusColor,
      lineSpacing: 9,
      wordWrap: { width: 440 },
    });
  }

  drawSubmissionLog() {
    const submissions = MockApiClient.listSubmissions();
    this.add.rectangle(1550, 850, 500, 105, 0x1e293b, 0.98).setStrokeStyle(3, 0x93c5fd);
    this.add.text(1325, 815, 'Mock 제출 로그', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.submissionLogText = this.add.text(1325, 848, ApiPayloadViewManager.formatSubmissionLog(submissions), {
      fontSize: '18px',
      color: '#dbeafe',
      lineSpacing: 6,
      wordWrap: { width: 440 },
    });
  }

  drawControls() {
    const submitButton = this.createButton(350, 960, 'Mock 제출', '#bbf7d0', '#123524');
    submitButton.on('pointerdown', () => this.submitMockPayload());

    const copyButton = this.createButton(610, 960, 'Payload 복사', '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyPayload());

    const downloadButton = this.createButton(910, 960, 'Payload 다운로드', '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadPayload());

    const contractButton = this.createButton(1130, 960, 'API 계약', '#fde68a', '#0f172a');
    contractButton.on('pointerdown', () => this.scene.start('ApiContractScene'));

    const logButton = this.createButton(1335, 960, '제출 로그', '#bfdbfe', '#0f172a');
    logButton.on('pointerdown', () => this.scene.start('MockSubmissionLogScene'));

    const dataButton = this.createButton(1545, 960, '학습 데이터', '#c4b5fd', '#1e1b4b');
    dataButton.on('pointerdown', () => this.scene.start('LearningDataScene'));

    const endingButton = this.createButton(1745, 960, '마무리', '#fde68a', '#0f172a');
    endingButton.on('pointerdown', () => this.scene.start('EndingScene'));
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
      this.statusText.setText('API payload를 클립보드에 복사했습니다.');
      this.statusText.setColor('#166534');
    } catch (_error) {
      this.statusText.setText('클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.');
      this.statusText.setColor('#991b1b');
    }
  }

  downloadPayload() {
    const blob = new Blob([this.apiPayloadJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-rebuild-ep${this.apiPayload.episode_id}-api-payload.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.statusText.setText('API payload 다운로드를 시작했습니다.');
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
