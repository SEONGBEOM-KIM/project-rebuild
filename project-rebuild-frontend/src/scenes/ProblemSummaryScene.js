import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import LearningProgress from '../systems/LearningProgress.js';
import ProblemSummaryViewManager from '../systems/ProblemSummaryViewManager.js';

import { EP1_CORE_CAUSE_SUMMARY, EP1_NEXT_MISSION, EP1_PROBLEM_ITEMS } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ProblemSummaryScene extends Phaser.Scene {
  constructor() {
    super('ProblemSummaryScene');
  }

  create() {
    const { width, height } = this.scale;
    const exploredPlaces = this.registry.get('exploredPlaces') ?? [];
    const quizResult = this.registry.get('quizResult');

    const layout = ProblemSummaryViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
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
    createPanelBackground(this, layout.panel, layout.panel);
    createPanelTitle(this, layout.title, textStyles.gridTitle, { origin: 0.5 });

    EP1_PROBLEM_ITEMS.forEach((item, index) => {
      const { x, y } = ProblemSummaryViewManager.getProblemItemLayout(index);
      const card = ProblemSummaryViewManager.getProblemItemCardLayout(x, y);
      createPanelBackground(this, card.background, card.background);
      createLayoutText(this, card.icon, {
        text: item.icon,
        style: textStyles.itemIcon,
        origin: 0.5,
      });
      createLayoutText(this, card.title, {
        text: item.title,
        style: textStyles.itemTitle,
      });
      createLayoutText(this, card.detail, {
        text: item.detail,
        style: textStyles.itemDetail,
      });
    });
  }

  drawLearningRecord(exploredPlaces, quizResult) {
    const layout = ProblemSummaryViewManager.getLearningRecordLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    createPanelBackground(this, layout.panel, layout.panel);
    createPanelTitle(this, layout.title, textStyles.learningTitle, { origin: 0.5 });

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
    createPanelBackground(this, layout.panel, layout.panel);
    createPanelTitle(this, layout.title, textStyles.nextTitle, { origin: 0.5 });
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
