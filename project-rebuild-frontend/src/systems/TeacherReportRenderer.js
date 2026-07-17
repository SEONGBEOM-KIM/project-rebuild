import TeacherReportViewManager from './TeacherReportViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class TeacherReportRenderer {
  static renderSummaryStrip(scene, centerX, body) {
    const layout = TeacherReportViewManager.getSummaryLayout(centerX);
    const summaryStyle = TeacherReportViewManager.getSummaryStyle();
    const textStyles = TeacherReportViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, summaryStyle);
    createPanelTitle(scene, layout.title, textStyles.summaryTitle);
    return createLayoutText(scene, layout.body, {
      text: body,
      style: textStyles.summaryBody,
    });
  }

  static renderPanel(scene, panel, body) {
    const panelStyle = TeacherReportViewManager.getPanelStyle();
    const textStyles = TeacherReportViewManager.getTextStyles();
    createPanelBackground(scene, panel, panelStyle);
    const titlePosition = TeacherReportViewManager.getPanelTitlePosition(panel);
    createPanelTitle(scene, titlePosition, textStyles.panelTitle, { text: panel.title, origin: 0.5 });
    const bodyPosition = TeacherReportViewManager.getPanelBodyPosition(panel);
    return createLayoutText(scene, bodyPosition, {
      text: body,
      style: TeacherReportViewManager.getPanelBodyStyle(panel),
    });
  }
}
