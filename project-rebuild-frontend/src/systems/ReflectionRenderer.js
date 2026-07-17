import ReflectionViewManager from './ReflectionViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ReflectionRenderer {
  static renderRunSummary(scene, summaryData, layout) {
    const panelStyle = ReflectionViewManager.getSummaryPanelStyle();
    const textStyles = ReflectionViewManager.getSummaryTextStyles();
    createPanelBackground(scene, layout.summaryPanel, panelStyle);
    createPanelTitle(scene, layout.summaryTitle, textStyles.title);
    return createLayoutText(scene, layout.summaryBody, {
      text: ReflectionViewManager.formatRunSummary(summaryData),
      style: textStyles.body,
    });
  }

  static renderChoiceCard(scene, choice, selectedChoice, x, y, onSelect) {
    const layout = ReflectionViewManager.getChoiceCardLayout(x, y);
    const initialStyle = ReflectionViewManager.getChoiceCardStyle(choice.id, selectedChoice);
    const textStyles = ReflectionViewManager.getChoiceTextStyles();
    const background = createPanelBackground(scene, layout.background, initialStyle)
      .setInteractive({ useHandCursor: true });
    const icon = createLayoutText(scene, layout.icon, {
      text: choice.icon,
      style: textStyles.icon,
      origin: 0.5,
    });
    const title = createPanelTitle(scene, layout.title, textStyles.title, { text: choice.title });
    const description = createLayoutText(scene, layout.description, {
      text: choice.description,
      style: textStyles.description,
    });

    const select = () => onSelect(choice);
    background.on('pointerdown', select);
    icon.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    title.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    description.setInteractive({ useHandCursor: true }).on('pointerdown', select);

    return { background, choice, icon, title, description };
  }

  static renderFeedback(scene, layout) {
    return createLayoutText(scene, layout.feedback, {
      text: ReflectionViewManager.formatInitialFeedback(),
      style: ReflectionViewManager.getFeedbackTextStyle('initial', layout.feedback.wordWrapWidth),
      origin: 0.5,
    });
  }
}
