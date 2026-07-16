import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import LearningProgress from '../systems/LearningProgress.js';
import ProblemSummaryViewManager from '../systems/ProblemSummaryViewManager.js';

import { EP1_CORE_CAUSE_SUMMARY, EP1_NEXT_MISSION, EP1_PROBLEM_ITEMS } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

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
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawProblemGrid();
    this.drawLearningRecord(exploredPlaces, quizResult);
    this.drawNextMission();
    this.drawControls();
  }

  drawProblemGrid() {
    const layout = ProblemSummaryViewManager.getProblemGridLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, textStyles.gridTitle).setOrigin(0.5);

    EP1_PROBLEM_ITEMS.forEach((item, index) => {
      const { x, y } = ProblemSummaryViewManager.getProblemItemLayout(index);
      const card = ProblemSummaryViewManager.getProblemItemCardLayout(x, y);
      this.add.rectangle(card.background.x, card.background.y, card.background.width, card.background.height, card.background.fillColor, card.background.fillAlpha)
        .setStrokeStyle(card.background.strokeWidth, card.background.strokeColor);
      this.add.text(card.icon.x, card.icon.y, item.icon, textStyles.itemIcon).setOrigin(0.5);
      this.add.text(card.title.x, card.title.y, item.title, textStyles.itemTitle);
      createLayoutText(this, card.detail, {
        text: item.detail,
        style: textStyles.itemDetail,
      });
    });
  }

  drawLearningRecord(exploredPlaces, quizResult) {
    const layout = ProblemSummaryViewManager.getLearningRecordLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, textStyles.learningTitle).setOrigin(0.5);

    createLayoutText(this, layout.body, {
      text: ProblemSummaryViewManager.formatLearningRecordText(
        explorationPlaces,
        exploredPlaces,
        quizResult,
        EP1_CORE_CAUSE_SUMMARY,
      ),
      style: textStyles.learningBody,
    });
  }

  drawNextMission() {
    const layout = ProblemSummaryViewManager.getNextMissionLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, textStyles.nextTitle).setOrigin(0.5);
    createLayoutText(this, layout.body, {
      text: EP1_NEXT_MISSION.join('\n'),
      style: textStyles.nextBody,
    });
  }

  drawControls() {
    const layout = ProblemSummaryViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, ProblemSummaryViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, ProblemSummaryViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { problemSummaryCompleted: true });
      this.scene.start(layout.next.target);
    });
  }

}
