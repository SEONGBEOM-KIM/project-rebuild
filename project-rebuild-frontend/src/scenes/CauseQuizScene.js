import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningProgress from '../systems/LearningProgress.js';
import CauseQuizManager from '../systems/CauseQuizManager.js';

import { EP1_CAUSE_QUESTION, EP1_EXPLORATION_CLUES } from '../data/episodeContent.js';

export default class CauseQuizScene extends Phaser.Scene {
  constructor() {
    super('CauseQuizScene');
  }

  create() {
    const { width, height } = this.scale;
    this.selectedChoice = null;
    this.choiceObjects = new Map();

    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);
    ProgressStepper.render(this, 'quiz');
    this.add.text(width / 2, 72, 'EP1. 문제 원인 생각하기', {
      fontSize: '58px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 142, '탐색한 장소의 문제를 바탕으로 인구 감소의 원인을 골라보세요.', {
      fontSize: '27px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawExplorationSummary();
    this.drawQuestionPanel();
    this.drawControls();
  }

  drawExplorationSummary() {
    const exploredCount = (this.registry.get('exploredPlaces') ?? []).length;
    this.add.rectangle(420, 525, 560, 630, 0x1e293b, 0.98).setStrokeStyle(4, 0x60a5fa);
    this.add.text(420, 260, '탐색에서 확인한 단서', {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = [
      `확인한 장소: ${exploredCount}곳`,
      '',
      ...EP1_EXPLORATION_CLUES,
      '',
      '핵심:',
      '지역 문제는 하나의 원인만이 아니라 생활 조건의 약화가 서로 연결되어 나타납니다.',
    ];

    this.add.text(170, 320, rows.join('\n'), {
      fontSize: '24px',
      color: '#dbeafe',
      lineSpacing: 11,
      wordWrap: { width: 500 },
    });
  }

  drawQuestionPanel() {
    this.add.rectangle(1170, 525, 900, 630, 0xffffff, 0.97).setStrokeStyle(5, 0xfde68a);
    this.add.text(1170, 255, EP1_CAUSE_QUESTION.prompt, {
      fontSize: '36px',
      color: '#172554',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 780 },
    }).setOrigin(0.5);

    EP1_CAUSE_QUESTION.choices.forEach((choice, index) => {
      this.createChoice(choice, 1170, 390 + index * 115, index + 1);
    });

    this.feedbackText = this.add.text(760, 760, '답을 선택하면 피드백이 표시됩니다.', {
      fontSize: '25px',
      color: '#334155',
      lineSpacing: 10,
      wordWrap: { width: 820 },
    });
  }

  createChoice(choice, x, y, number) {
    const background = this.add.rectangle(x, y, 760, 82, 0xe0f2fe, 1)
      .setStrokeStyle(3, 0x93c5fd)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(x - 350, y, `${number}. ${choice.text}`, {
      fontSize: '25px',
      color: '#0f172a',
      wordWrap: { width: 700 },
    }).setOrigin(0, 0.5);

    const select = () => this.selectChoice(choice);
    background.on('pointerdown', select);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    this.choiceObjects.set(choice.id, { background, text });
  }

  drawControls() {
    const backButton = this.createButton(760, 955, '자료 다시 보기', '#93c5fd', '#0f172a');
    backButton.on('pointerdown', () => this.scene.start('DataBriefingScene'));

    this.nextButton = this.createButton(1160, 955, '답 선택 필요', '#94a3b8', '#0f172a');
    this.nextButton.on('pointerdown', () => {
      if (!this.selectedChoice) {
        this.feedbackText.setText('먼저 답을 하나 선택하세요.');
        this.feedbackText.setColor('#b91c1c');
        return;
      }
      this.scene.start('ProblemSummaryScene');
    });
  }

  selectChoice(choice) {
    this.selectedChoice = choice;
    const quizResult = CauseQuizManager.buildQuizResult(EP1_CAUSE_QUESTION, choice);
    this.registry.set('quizResult', quizResult);
    LearningProgress.update(this.registry, { quizResult });

    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const selected = choiceId === choice.id;
      const correctChoice = EP1_CAUSE_QUESTION.choices.find((item) => item.id === choiceId)?.correct;
      const strokeColor = selected ? CauseQuizManager.getSelectedStrokeColor(choice) : 0x93c5fd;
      objects.background.setFillStyle(selected ? 0xfef3c7 : 0xe0f2fe, 1);
      objects.background.setStrokeStyle(selected || correctChoice ? 5 : 3, correctChoice && selected ? 0x22c55e : strokeColor);
    }

    this.feedbackText.setText([
      choice.correct ? '정답입니다.' : '다시 생각해 볼 수 있습니다.',
      choice.feedback,
      '',
      '다음 단계에서는 확인한 문제를 정리합니다.',
    ].join('\n'));
    this.feedbackText.setColor(choice.correct ? '#166534' : '#991b1b');
    this.nextButton.setText('문제 정리');
    this.nextButton.setStyle({ backgroundColor: '#bbf7d0' });
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
