import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import LearningProgress from '../systems/LearningProgress.js';
import CauseQuizManager from '../systems/CauseQuizManager.js';
import CauseQuizViewManager from '../systems/CauseQuizViewManager.js';
import CauseQuizPanelRenderer from '../systems/CauseQuizPanelRenderer.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

import { getCurrentEpisodeContent } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class CauseQuizScene extends Phaser.Scene {
  constructor() {
    super('CauseQuizScene');
  }

  create() {
    const { width } = this.scale;
    const episodeContent = getCurrentEpisodeContent();
    this.questions = episodeContent.causeQuestions ?? [episodeContent.causeQuestion];
    this.questionIndex = 0;
    this.quizResults = this.registry.get(REGISTRY_KEYS.quizResults) ?? [];
    this.selectedChoice = null;
    this.choiceObjects = new Map();

    const layout = CauseQuizViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawExplorationSummary();
    this.drawQuestionPanel();
    this.drawControls();
  }

  drawExplorationSummary() {
    const exploredCount = (this.registry.get(REGISTRY_KEYS.exploredPlaces) ?? []).length;
    const episodeContent = getCurrentEpisodeContent();
    const rows = CauseQuizManager.formatExplorationSummaryRows(exploredCount, episodeContent.explorationClues);
    CauseQuizPanelRenderer.renderExplorationSummary(this, rows);
  }

  drawQuestionPanel() {
    this.clearQuestionPanel();
    const question = this.questions[this.questionIndex];
    const renderedPanel = CauseQuizPanelRenderer.renderQuestionPanel(
      this,
      question,
      (choice) => this.selectChoice(choice),
      `문제 ${this.questionIndex + 1}/${this.questions.length}`,
    );
    this.questionPanelObjects = renderedPanel;
    this.choiceObjects = renderedPanel.choiceObjects;
    this.feedbackText = renderedPanel.feedbackText;
  }

  clearQuestionPanel() {
    if (!this.questionPanelObjects) {
      return;
    }
    const { panel, progress, prompt, feedbackText, choiceObjects } = this.questionPanelObjects;
    [panel, progress, prompt, feedbackText, ...Array.from(choiceObjects.values()).flatMap(({ background, text }) => [background, text])]
      .filter(Boolean)
      .forEach((object) => object.destroy());
    this.questionPanelObjects = null;
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
      if (this.questionIndex < this.questions.length - 1) {
        this.questionIndex += 1;
        this.selectedChoice = null;
        this.drawQuestionPanel();
        this.nextButton.setText(layout.nextDisabled.label);
        this.nextButton.setStyle({ backgroundColor: layout.nextDisabled.backgroundColor });
        return;
      }
      this.scene.start(layout.nextEnabled.target);
    });
  }

  selectChoice(choice) {
    this.selectedChoice = choice;
    const question = this.questions[this.questionIndex];
    const quizResult = CauseQuizManager.buildQuizResult(question, choice);
    this.quizResults = [
      ...this.quizResults.filter((result) => result.questionId !== quizResult.questionId),
      quizResult,
    ];
    this.registry.set(REGISTRY_KEYS.quizResult, quizResult);
    this.registry.set(REGISTRY_KEYS.quizResults, this.quizResults);
    LearningProgress.update(this.registry, { quizResult, quizResults: this.quizResults });

    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const style = CauseQuizViewManager.getChoiceVisualStyle(choiceId, choice, question);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
    }

    const layout = CauseQuizViewManager.getControlLayout();
    this.feedbackText.setText(CauseQuizManager.formatFeedback(choice));
    this.feedbackText.setColor(CauseQuizManager.getFeedbackColor(choice));
    const isLastQuestion = this.questionIndex === this.questions.length - 1;
    this.nextButton.setText(isLastQuestion ? layout.nextEnabled.label : layout.nextQuestion.label);
    this.nextButton.setStyle({ backgroundColor: isLastQuestion ? layout.nextEnabled.backgroundColor : layout.nextQuestion.backgroundColor });
  }

}
