import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import LearningProgress from '../systems/LearningProgress.js';
import ProblemSummaryViewManager from '../systems/ProblemSummaryViewManager.js';

import { EP1_CORE_CAUSE_SUMMARY, EP1_NEXT_MISSION, EP1_PROBLEM_ITEMS } from '../data/episodeContent.js';

export default class ProblemSummaryScene extends Phaser.Scene {
  constructor() {
    super('ProblemSummaryScene');
  }

  create() {
    const { width, height } = this.scale;
    const exploredPlaces = this.registry.get('exploredPlaces') ?? [];
    const quizResult = this.registry.get('quizResult');

    this.add.rectangle(width / 2, height / 2, width, height, 0x10253f);
    ProgressStepper.render(this, 'summary');
    this.add.text(width / 2, 72, 'EP1. 문제 정리', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 140, '탐색과 질문을 통해 확인한 푸른군의 핵심 문제를 정리합니다.', {
      fontSize: '27px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawProblemGrid();
    this.drawLearningRecord(exploredPlaces, quizResult);
    this.drawNextMission();
    this.drawControls();
  }

  drawProblemGrid() {
    this.add.rectangle(645, 540, 1050, 680, 0xffffff, 0.96).setStrokeStyle(5, 0x93c5fd);
    this.add.text(645, 240, '확인한 지역 문제', {
      fontSize: '38px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    EP1_PROBLEM_ITEMS.forEach((item, index) => {
      const { x, y } = ProblemSummaryViewManager.getProblemItemLayout(index);
      this.add.rectangle(x + 230, y + 55, 470, 126, 0xe0f2fe, 1).setStrokeStyle(3, 0x60a5fa);
      this.add.text(x + 28, y + 32, item.icon, { fontSize: '40px' }).setOrigin(0.5);
      this.add.text(x + 62, y + 16, item.title, {
        fontSize: '27px',
        color: '#0f172a',
        fontStyle: 'bold',
      });
      this.add.text(x + 62, y + 56, item.detail, {
        fontSize: '20px',
        color: '#334155',
        lineSpacing: 5,
        wordWrap: { width: 365 },
      });
    });
  }

  drawLearningRecord(exploredPlaces, quizResult) {
    this.add.rectangle(1470, 390, 560, 380, 0x1e293b, 0.98).setStrokeStyle(4, 0xfde68a);
    this.add.text(1470, 245, '학습 기록', {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(1215, 305, ProblemSummaryViewManager.formatLearningRecordText(
      explorationPlaces,
      exploredPlaces,
      quizResult,
      EP1_CORE_CAUSE_SUMMARY,
    ), {
      fontSize: '23px',
      color: '#dbeafe',
      lineSpacing: 10,
      wordWrap: { width: 510 },
    });
  }

  drawNextMission() {
    this.add.rectangle(1470, 735, 560, 260, 0xffffff, 0.96).setStrokeStyle(4, 0xbbf7d0);
    this.add.text(1470, 650, '다음 미션', {
      fontSize: '34px',
      color: '#14532d',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(1215, 700, EP1_NEXT_MISSION.join('\n'), {
      fontSize: '24px',
      color: '#1e293b',
      lineSpacing: 11,
      wordWrap: { width: 510 },
    });
  }

  drawControls() {
    const backButton = this.createButton(750, 955, '원인 질문 다시 보기', '#93c5fd', '#0f172a');
    backButton.on('pointerdown', () => this.scene.start('CauseQuizScene'));

    const nextButton = this.createButton(1180, 955, '회복 방향 선택', '#bbf7d0', '#123524');
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { problemSummaryCompleted: true });
      this.scene.start('SelectionScene');
    });
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '32px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
