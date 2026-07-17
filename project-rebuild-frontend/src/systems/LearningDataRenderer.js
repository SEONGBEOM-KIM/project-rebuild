import LearningDataViewManager from './LearningDataViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class LearningDataRenderer {
  static renderSummaryStrip(scene, learningData, centerX) {
    const layout = LearningDataViewManager.getSummaryLayout(centerX);
    const panelStyle = LearningDataViewManager.getSummaryStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle);
    return createLayoutText(scene, layout.body, {
      text: LearningDataViewManager.formatSummaryText(learningData),
      style: {
        fontSize: panelStyle.bodyFontSize,
        color: panelStyle.bodyColor,
        lineSpacing: panelStyle.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
  }

  static renderDataPanel(scene, learningDataJson) {
    const layout = LearningDataViewManager.getDataPanelLayout();
    const panelStyle = LearningDataViewManager.getDarkPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle);

    return createLayoutText(scene, layout.body, {
      text: learningDataJson,
      style: LearningDataViewManager.getJsonTextStyle(layout.body.wordWrapWidth),
    });
  }

  static renderValidationPanel(scene, learningData) {
    const layout = LearningDataViewManager.getValidationPanelLayout();
    const panelStyle = LearningDataViewManager.getLightPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle, { origin: 0.5 });

    const summary = LearningDataViewManager.getValidationSummary(learningData);
    const rowsText = createLayoutText(scene, layout.rows, {
      text: LearningDataViewManager.formatValidationRows(summary.rows),
      style: LearningDataViewManager.getValidationTextStyle(layout.rows.wordWrapWidth),
    });

    const summaryStyle = LearningDataViewManager.getSummaryBoxStyle(layout.summaryBody.wordWrapWidth);
    createPanelBackground(scene, layout.summaryBox, { ...summaryStyle, fillColor: summary.backgroundColor }, { strokeColor: summary.strokeColor });
    createPanelTitle(scene, layout.summaryTitle, summaryStyle, {
      text: summary.title,
      style: { color: summary.titleColor },
    });
    const summaryBody = createLayoutText(scene, layout.summaryBody, {
      text: summary.body,
      style: {
        fontSize: summaryStyle.bodyFontSize,
        color: summary.bodyColor,
        lineSpacing: summaryStyle.lineSpacing,
        wordWrap: summaryStyle.wordWrap,
      },
    });

    return { rowsText, summaryBody };
  }

  static renderSavePanel(scene, saved) {
    const layout = LearningDataViewManager.getSavePanelLayout();
    const panelStyle = LearningDataViewManager.getSavePanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle);
    return createLayoutText(scene, layout.body, {
      text: LearningDataViewManager.formatSaveStatus(saved),
      style: {
        fontSize: panelStyle.bodyFontSize,
        color: panelStyle.bodyColor,
        lineSpacing: panelStyle.bodyLineSpacing,
      },
    });
  }
}
