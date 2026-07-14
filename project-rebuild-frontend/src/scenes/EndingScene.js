import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_NEXT_DEVELOPMENT_GOALS } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';
import EndingSummaryManager from '../systems/EndingSummaryManager.js';

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    const { width, height } = this.scale;
    const gameState = this.registry.get('gameState');
    const placedBuildings = this.registry.get('placedBuildings') ?? [];
    const selectedPolicy = this.registry.get('selectedPolicy');
    const exploredPlaces = this.registry.get('exploredPlaces') ?? [];
    const quizResult = this.registry.get('quizResult');
    const reflectionChoice = this.registry.get('reflectionChoice');
    const learningProgress = LearningProgress.update(this.registry, { completed: true });
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings);

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    ProgressStepper.render(this, 'ending');
    this.add.text(width / 2, 78, '학습 마무리', {
      fontSize: '62px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, 'EP1 탐색부터 시설 배치까지의 학습 기록을 요약합니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawPanel(430, 430, 600, 560, '오늘의 선택 요약', EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings));
    this.drawPanel(1110, 430, 600, 560, '지역 상태 요약', EndingSummaryManager.formatStateSummary(gameState, ending));
    this.drawNextMissionPanel(1585, 430, 360, 560);
    this.drawLearningRecordStrip(width / 2, 785, learningProgress, exploredPlaces, quizResult, reflectionChoice);

    const retry = this.createButton(width / 2 - 520, 955, '배치 다시 조정', '#c4b5fd');
    retry.on('pointerdown', () => this.scene.start('PlacementScene'));

    const reportButton = this.createButton(width / 2 - 175, 955, '교사용 요약', '#93c5fd');
    reportButton.on('pointerdown', () => this.scene.start('TeacherReportScene'));

    const dataButton = this.createButton(width / 2 + 175, 955, '학습 데이터 보기', '#bbf7d0');
    dataButton.on('pointerdown', () => this.scene.start('LearningDataScene'));

    const restart = this.createButton(width / 2 + 520, 955, '처음부터 다시', '#fde68a');
    restart.on('pointerdown', () => this.scene.start('BootScene'));
  }

  drawPanel(x, y, width, height, title, body) {
    this.add.rectangle(x, y, width, height, 0xffffff, 0.96).setStrokeStyle(4, 0x60a5fa);
    this.add.text(x, y - height / 2 + 45, title, {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(x - width / 2 + 45, y - height / 2 + 105, body, {
      fontSize: '23px',
      color: '#1e293b',
      lineSpacing: 9,
      wordWrap: { width: width - 90 },
    });
  }

  drawLearningRecordStrip(x, y, learningProgress, exploredPlaces, quizResult, reflectionChoice) {
    this.add.rectangle(x, y, 1660, 140, 0x1e293b, 0.96).setStrokeStyle(4, 0xfde68a);
    this.add.text(x - 790, y - 48, '학습 기록', {
      fontSize: '28px',
      color: '#fde68a',
      fontStyle: 'bold',
    });

    const rows = EndingSummaryManager.formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice);

    this.add.text(x - 620, y - 50, rows.join('\n'), {
      fontSize: '22px',
      color: '#ffffff',
      lineSpacing: 9,
      wordWrap: { width: 1410 },
    });
  }

  drawNextMissionPanel(x, y, width, height) {
    this.add.rectangle(x, y, width, height, 0x1e293b, 0.98).setStrokeStyle(4, 0xbbf7d0);
    this.add.text(x, y - height / 2 + 45, '다음 개발 목표', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(x - width / 2 + 32, y - height / 2 + 108, EP1_NEXT_DEVELOPMENT_GOALS.join('\n'), {
      fontSize: '22px',
      color: '#dbeafe',
      lineSpacing: 11,
      wordWrap: { width: width - 64 },
    });
  }

  createButton(x, y, label, backgroundColor) {
    return this.add.text(x, y, label, {
      fontSize: '29px',
      color: '#0f172a',
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }

}
