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
    const renderedPanel = CauseQuizPanelRenderer.renderQuestionPanel(
      this,
      getCurrentEpisodeContent().causeQuestion,
      (choice) => this.selectChoice(choice),
    );
    this.choiceObjects = renderedPanel.choiceObjects;
    this.feedbackText = renderedPanel.feedbackText;
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
    const quizResult = CauseQuizManager.buildQuizResult(getCurrentEpisodeContent().causeQuestion, choice);
    this.registry.set(REGISTRY_KEYS.quizResult, quizResult);
    LearningProgress.update(this.registry, { quizResult });

    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const style = CauseQuizViewManager.getChoiceVisualStyle(choiceId, choice, getCurrentEpisodeContent().causeQuestion);
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
