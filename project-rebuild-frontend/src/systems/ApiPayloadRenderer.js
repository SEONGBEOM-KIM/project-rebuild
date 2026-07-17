import ApiPayloadViewManager from './ApiPayloadViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ApiPayloadRenderer {
  static renderPayloadPanel(scene, payloadJson) {
    const layout = ApiPayloadViewManager.getPayloadPanelLayout();
    const panelStyle = ApiPayloadViewManager.getDarkPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle);
    return createLayoutText(scene, layout.body, {
      text: payloadJson,
      style: ApiPayloadViewManager.getPayloadTextStyle(layout.body.wordWrapWidth),
    });
  }

  static renderValidationPanel(scene, apiPayload) {
    const summary = ApiPayloadViewManager.getValidationSummary(apiPayload);
    const layout = ApiPayloadViewManager.getValidationPanelLayout();
    const panelStyle = ApiPayloadViewManager.getLightPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle, { strokeColor: summary.strokeColor });
    createPanelTitle(scene, layout.title, panelStyle, { origin: 0.5 });

    createLayoutText(scene, layout.rows, {
      text: ApiPayloadViewManager.formatValidationRows(summary.rows),
      style: ApiPayloadViewManager.getValidationTextStyle(layout.rows.wordWrapWidth),
    });

    return createLayoutText(scene, layout.status, {
      text: summary.statusText,
      style: ApiPayloadViewManager.getStatusTextStyle(layout.status.wordWrapWidth, summary.statusColor),
    });
  }

  static renderSubmissionLog(scene, submissions) {
    const layout = ApiPayloadViewManager.getSubmissionLogLayout();
    const logStyle = ApiPayloadViewManager.getLogPanelStyle();
    createPanelBackground(scene, layout.panel, logStyle, { strokeColor: layout.title.strokeColor });
    createPanelTitle(scene, layout.title, logStyle);
    return createLayoutText(scene, layout.body, {
      text: ApiPayloadViewManager.formatSubmissionLog(submissions),
      style: ApiPayloadViewManager.getLogTextStyle(layout.body.wordWrapWidth),
    });
  }
}
