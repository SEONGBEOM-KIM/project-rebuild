import CauseQuizViewManager from './CauseQuizViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class CauseQuizPanelRenderer {
  static renderExplorationSummary(scene, rows) {
    const layout = CauseQuizViewManager.getExplorationSummaryLayout();
    const textStyles = CauseQuizViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, layout.panel);
    createPanelTitle(scene, layout.title, textStyles.summaryTitle, { origin: 0.5 });

    return createLayoutText(scene, layout.body, {
      text: rows.join('\n'),
      style: textStyles.summaryBody,
    });
  }

  static renderQuestionPanel(scene, question, onChoiceSelect, progressText = null) {
    const layout = CauseQuizViewManager.getQuestionLayout();
    const textStyles = CauseQuizViewManager.getTextStyles();
    const panel = createPanelBackground(scene, layout.panel, layout.panel);
    const progress = progressText
      ? createLayoutText(scene, layout.progress, { text: progressText, style: textStyles.progress, origin: 0.5 })
      : null;
    const prompt = createLayoutText(scene, layout.prompt, {
      text: question.prompt,
      style: textStyles.prompt,
      origin: 0.5,
    });

    const choiceObjects = new Map();
    question.choices.forEach((choice, index) => {
      choiceObjects.set(choice.id, CauseQuizPanelRenderer.renderChoice(scene, choice, index, index + 1, onChoiceSelect));
    });

    const feedbackText = createLayoutText(scene, layout.feedback, {
      style: textStyles.feedback,
    });

    return { panel, progress, prompt, choiceObjects, feedbackText };
  }

  static renderChoice(scene, choice, index, number, onChoiceSelect) {
    const layout = CauseQuizViewManager.getChoiceLayout(index);
    const textStyles = CauseQuizViewManager.getTextStyles();
    const background = createPanelBackground(scene, layout.background, layout.background)
      .setInteractive({ useHandCursor: true });
    const text = createLayoutText(scene, layout.text, {
      text: `${number}. ${choice.text}`,
      style: textStyles.choice,
      origin: [0, 0.5],
    });

    const select = () => onChoiceSelect(choice);
    background.on('pointerdown', select);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    return { background, text };
  }
}
