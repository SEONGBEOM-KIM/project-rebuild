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

  static renderSelectedInsight(scene, insight, layout) {
    const style = ReflectionViewManager.getSelectedInsightStyle();
    createPanelBackground(scene, layout.selectedInsight, style);
    createLayoutText(scene, { x: layout.selectedInsight.x - 700, y: layout.selectedInsight.y - 58, text: insight.icon }, {
      style: { fontSize: '48px' },
      origin: 0.5,
    });
    createPanelTitle(scene, { x: layout.selectedInsight.x - 635, y: layout.selectedInsight.y - 67, text: insight.title }, {
      fontSize: '32px', color: '#fde68a', fontStyle: 'bold',
    });
    return createLayoutText(scene, { x: layout.selectedInsight.x - 700, y: layout.selectedInsight.y - 12, text: insight.body, wordWrapWidth: 1360 }, {
      style: { fontSize: '23px', color: '#e0f2fe', lineSpacing: 7 },
    });
  }

  static renderAlternativeInsight(scene, insight, index) {
    const layout = ReflectionViewManager.getAlternativeCardLayout(index);
    createPanelBackground(scene, layout.background, { fillColor: 0x0f172a, fillAlpha: 0.96, strokeWidth: 3, strokeColor: 0x64748b });
    createLayoutText(scene, layout.icon, { text: insight.icon, style: { fontSize: '38px' }, origin: 0.5 });
    createPanelTitle(scene, layout.title, { fontSize: '25px', color: '#ffffff', fontStyle: 'bold' }, { text: insight.title });
    return createLayoutText(scene, layout.body, { text: insight.body, style: { fontSize: '20px', color: '#cbd5e1', lineSpacing: 6 } });
  }
}
