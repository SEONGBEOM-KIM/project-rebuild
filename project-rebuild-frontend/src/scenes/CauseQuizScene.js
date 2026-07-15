import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningProgress from '../systems/LearningProgress.js';
import CauseQuizManager from '../systems/CauseQuizManager.js';
import CauseQuizViewManager from '../systems/CauseQuizViewManager.js';

import { EP1_CAUSE_QUESTION, EP1_EXPLORATION_CLUES } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';

export default class CauseQuizScene extends Phaser.Scene {
  constructor() {
    super('CauseQuizScene');
  }

  create() {
    const { width, height } = this.scale;
    this.selectedChoice = null;
    this.choiceObjects = new Map();

    const layout = CauseQuizViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, layout.title).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, layout.subtitle).setOrigin(0.5);

    this.drawExplorationSummary();
    this.drawQuestionPanel();
    this.drawControls();
  }

  drawExplorationSummary() {
    const exploredCount = (this.registry.get('exploredPlaces') ?? []).length;
    const layout = CauseQuizViewManager.getExplorationSummaryLayout();
    const textStyles = CauseQuizViewManager.getTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, textStyles.summaryTitle).setOrigin(0.5);

    const rows = CauseQuizManager.formatExplorationSummaryRows(exploredCount, EP1_EXPLORATION_CLUES);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), {
      ...textStyles.summaryBody,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawQuestionPanel() {
    const layout = CauseQuizViewManager.getQuestionLayout();
    const textStyles = CauseQuizViewManager.getTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.prompt.x, layout.prompt.y, EP1_CAUSE_QUESTION.prompt, {
      ...textStyles.prompt,
      wordWrap: { width: layout.prompt.wordWrapWidth },
    }).setOrigin(0.5);

    EP1_CAUSE_QUESTION.choices.forEach((choice, index) => {
      this.createChoice(choice, index, index + 1);
    });

    this.feedbackText = this.add.text(layout.feedback.x, layout.feedback.y, layout.feedback.text, {
      ...textStyles.feedback,
      wordWrap: { width: layout.feedback.wordWrapWidth },
    });
  }

  createChoice(choice, index, number) {
    const layout = CauseQuizViewManager.getChoiceLayout(index);
    const textStyles = CauseQuizViewManager.getTextStyles();
    const background = this.add.rectangle(layout.background.x, layout.background.y, layout.background.width, layout.background.height, layout.background.fillColor, layout.background.fillAlpha)
      .setStrokeStyle(layout.background.strokeWidth, layout.background.strokeColor)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(layout.text.x, layout.text.y, `${number}. ${choice.text}`, {
      ...textStyles.choice,
      wordWrap: { width: layout.text.wordWrapWidth },
    }).setOrigin(0, 0.5);

    const select = () => this.selectChoice(choice);
    background.on('pointerdown', select);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    this.choiceObjects.set(choice.id, { background, text });
  }

  drawControls() {
    const layout = CauseQuizViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, CauseQuizViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    this.nextButton = createTextButton(this, layout.nextDisabled, CauseQuizViewManager.getButtonStyle());
    this.nextButton.on('pointerdown', () => {
      if (!this.selectedChoice) {
        this.feedbackText.setText(CauseQuizManager.formatMissingChoiceFeedback());
        this.feedbackText.setColor(CauseQuizManager.getMissingChoiceFeedbackColor());
        return;
      }
      this.scene.start(layout.nextEnabled.target);
    });
  }

  selectChoice(choice) {
    this.selectedChoice = choice;
    const quizResult = CauseQuizManager.buildQuizResult(EP1_CAUSE_QUESTION, choice);
    this.registry.set('quizResult', quizResult);
    LearningProgress.update(this.registry, { quizResult });

    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const style = CauseQuizViewManager.getChoiceVisualStyle(choiceId, choice, EP1_CAUSE_QUESTION);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
    }

    const layout = CauseQuizViewManager.getControlLayout();
    this.feedbackText.setText(CauseQuizManager.formatFeedback(choice));
    this.feedbackText.setColor(CauseQuizManager.getFeedbackColor(choice));
    this.nextButton.setText(layout.nextEnabled.label);
    this.nextButton.setStyle({ backgroundColor: layout.nextEnabled.backgroundColor });
  }

}
