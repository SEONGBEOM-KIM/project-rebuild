import EndingSummaryViewManager from './EndingSummaryViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class EndingSummaryRenderer {
  static renderTakeawayStrip(scene, centerX, body) {
    const layout = EndingSummaryViewManager.getTakeawayLayout(centerX);
    const takeawayStyle = EndingSummaryViewManager.getTakeawayStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, takeawayStyle);
    createPanelTitle(scene, layout.title, textStyles.takeawayTitle);
    return createLayoutText(scene, layout.body, {
      text: body,
      style: textStyles.takeawayBody,
    });
  }

  static renderPanel(scene, panel, body) {
    const panelStyle = EndingSummaryViewManager.getPanelStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(scene, panel, panelStyle);
    const titlePosition = EndingSummaryViewManager.getPanelTitlePosition(panel);
    createPanelTitle(scene, titlePosition, textStyles.panelTitle, { text: panel.title, origin: 0.5 });
    const bodyPosition = EndingSummaryViewManager.getPanelBodyPosition(panel);
    return createLayoutText(scene, bodyPosition, {
      text: body,
      style: EndingSummaryViewManager.getPanelBodyStyle(panel),
    });
  }

  static renderLearningRecordStrip(scene, centerX, rows) {
    const layout = EndingSummaryViewManager.getLearningRecordLayout(centerX);
    const recordStyle = EndingSummaryViewManager.getLearningRecordStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, recordStyle);
    createPanelTitle(scene, layout.title, textStyles.learningRecordTitle);
    return createLayoutText(scene, layout.body, {
      text: rows.join('\n'),
      style: textStyles.learningRecordBody,
    });
  }

  static renderNextMissionPanel(scene, panel, missionRows) {
    const panelStyle = EndingSummaryViewManager.getNextMissionStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(scene, panel, panelStyle);
    const titlePosition = EndingSummaryViewManager.getPanelTitlePosition(panel);
    createPanelTitle(scene, titlePosition, textStyles.nextMissionTitle, { text: panel.title, origin: 0.5 });

    const bodyPosition = EndingSummaryViewManager.getPanelBodyPosition(panel, 32, 108);
    return createLayoutText(scene, bodyPosition, {
      text: missionRows.join('\n'),
      style: EndingSummaryViewManager.getNextMissionBodyStyle(panel),
    });
  }
}
