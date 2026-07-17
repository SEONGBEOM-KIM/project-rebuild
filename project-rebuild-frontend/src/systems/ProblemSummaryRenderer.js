import ProblemSummaryViewManager from './ProblemSummaryViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ProblemSummaryRenderer {
  static renderProblemGrid(scene, items) {
    const layout = ProblemSummaryViewManager.getProblemGridLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, layout.panel);
    createPanelTitle(scene, layout.title, textStyles.gridTitle, { origin: 0.5 });

    items.forEach((item, index) => {
      ProblemSummaryRenderer.renderProblemItem(scene, item, index, textStyles);
    });
  }

  static renderProblemItem(scene, item, index, textStyles = ProblemSummaryViewManager.getTextStyles()) {
    const { x, y } = ProblemSummaryViewManager.getProblemItemLayout(index);
    const card = ProblemSummaryViewManager.getProblemItemCardLayout(x, y);
    createPanelBackground(scene, card.background, card.background);
    createLayoutText(scene, card.icon, {
      text: item.icon,
      style: textStyles.itemIcon,
      origin: 0.5,
    });
    createLayoutText(scene, card.title, {
      text: item.title,
      style: textStyles.itemTitle,
    });
    createLayoutText(scene, card.detail, {
      text: item.detail,
      style: textStyles.itemDetail,
    });
  }

  static renderLearningRecord(scene, bodyText) {
    const layout = ProblemSummaryViewManager.getLearningRecordLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, layout.panel);
    createPanelTitle(scene, layout.title, textStyles.learningTitle, { origin: 0.5 });

    return createLayoutText(scene, layout.body, {
      text: bodyText,
      style: textStyles.learningBody,
    });
  }

  static renderNextMission(scene, missionRows) {
    const layout = ProblemSummaryViewManager.getNextMissionLayout();
    const textStyles = ProblemSummaryViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, layout.panel);
    createPanelTitle(scene, layout.title, textStyles.nextTitle, { origin: 0.5 });

    return createLayoutText(scene, layout.body, {
      text: missionRows.join('\n'),
      style: textStyles.nextBody,
    });
  }
}
