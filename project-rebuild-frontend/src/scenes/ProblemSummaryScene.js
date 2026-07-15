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

    const layout = ProblemSummaryViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: '27px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawProblemGrid();
    this.drawLearningRecord(exploredPlaces, quizResult);
    this.drawNextMission();
    this.drawControls();
  }

  drawProblemGrid() {
    const layout = ProblemSummaryViewManager.getProblemGridLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '38px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    EP1_PROBLEM_ITEMS.forEach((item, index) => {
      const { x, y } = ProblemSummaryViewManager.getProblemItemLayout(index);
      const card = ProblemSummaryViewManager.getProblemItemCardLayout(x, y);
      this.add.rectangle(card.background.x, card.background.y, card.background.width, card.background.height, card.background.fillColor, card.background.fillAlpha)
        .setStrokeStyle(card.background.strokeWidth, card.background.strokeColor);
      this.add.text(card.icon.x, card.icon.y, item.icon, { fontSize: '40px' }).setOrigin(0.5);
      this.add.text(card.title.x, card.title.y, item.title, {
        fontSize: '27px',
        color: '#0f172a',
        fontStyle: 'bold',
      });
      this.add.text(card.detail.x, card.detail.y, item.detail, {
        fontSize: '20px',
        color: '#334155',
        lineSpacing: 5,
        wordWrap: { width: card.detail.wordWrapWidth },
      });
    });
  }

  drawLearningRecord(exploredPlaces, quizResult) {
    const layout = ProblemSummaryViewManager.getLearningRecordLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.body.x, layout.body.y, ProblemSummaryViewManager.formatLearningRecordText(
      explorationPlaces,
      exploredPlaces,
      quizResult,
      EP1_CORE_CAUSE_SUMMARY,
    ), {
      fontSize: '23px',
      color: '#dbeafe',
      lineSpacing: 10,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawNextMission() {
    const layout = ProblemSummaryViewManager.getNextMissionLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '34px',
      color: '#14532d',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(layout.body.x, layout.body.y, EP1_NEXT_MISSION.join('\n'), {
      fontSize: '24px',
      color: '#1e293b',
      lineSpacing: 11,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawControls() {
    const layout = ProblemSummaryViewManager.getControlLayout();
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, layout.back.backgroundColor, layout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = this.createButton(layout.next.x, layout.next.y, layout.next.label, layout.next.backgroundColor, layout.next.textColor);
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { problemSummaryCompleted: true });
      this.scene.start(layout.next.target);
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
