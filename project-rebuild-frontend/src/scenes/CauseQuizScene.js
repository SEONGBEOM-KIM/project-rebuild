import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import LearningProgress from '../systems/LearningProgress.js';
import CauseQuizManager from '../systems/CauseQuizManager.js';
import CauseQuizViewManager from '../systems/CauseQuizViewManager.js';

import { EP1_CAUSE_QUESTION, EP1_EXPLORATION_CLUES } from '../data/episodeContent.js';

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
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '58px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: '27px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawExplorationSummary();
    this.drawQuestionPanel();
    this.drawControls();
  }

  drawExplorationSummary() {
    const exploredCount = (this.registry.get('exploredPlaces') ?? []).length;
    const layout = CauseQuizViewManager.getExplorationSummaryLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = CauseQuizManager.formatExplorationSummaryRows(exploredCount, EP1_EXPLORATION_CLUES);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), {
      fontSize: '24px',
      color: '#dbeafe',
      lineSpacing: 11,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawQuestionPanel() {
    const layout = CauseQuizViewManager.getQuestionLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.prompt.x, layout.prompt.y, EP1_CAUSE_QUESTION.prompt, {
      fontSize: '36px',
      color: '#172554',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.prompt.wordWrapWidth },
    }).setOrigin(0.5);

    EP1_CAUSE_QUESTION.choices.forEach((choice, index) => {
      this.createChoice(choice, index, index + 1);
    });

    this.feedbackText = this.add.text(layout.feedback.x, layout.feedback.y, layout.feedback.text, {
      fontSize: '25px',
      color: '#334155',
      lineSpacing: 10,
      wordWrap: { width: layout.feedback.wordWrapWidth },
    });
  }

  createChoice(choice, index, number) {
    const layout = CauseQuizViewManager.getChoiceLayout(index);
    const background = this.add.rectangle(layout.background.x, layout.background.y, layout.background.width, layout.background.height, layout.background.fillColor, layout.background.fillAlpha)
      .setStrokeStyle(layout.background.strokeWidth, layout.background.strokeColor)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(layout.text.x, layout.text.y, `${number}. ${choice.text}`, {
      fontSize: '25px',
      color: '#0f172a',
      wordWrap: { width: layout.text.wordWrapWidth },
    }).setOrigin(0, 0.5);

    const select = () => this.selectChoice(choice);
    background.on('pointerdown', select);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    this.choiceObjects.set(choice.id, { background, text });
  }

  drawControls() {
    const layout = CauseQuizViewManager.getControlLayout();
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, layout.back.backgroundColor, layout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    this.nextButton = this.createButton(layout.nextDisabled.x, layout.nextDisabled.y, layout.nextDisabled.label, layout.nextDisabled.backgroundColor, layout.nextDisabled.textColor);
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

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '32px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
