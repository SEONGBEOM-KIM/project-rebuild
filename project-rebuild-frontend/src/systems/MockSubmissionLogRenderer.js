import MockSubmissionLogViewManager from './MockSubmissionLogViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class MockSubmissionLogRenderer {
  static renderSummaryPanel(scene, submissions) {
    const layout = MockSubmissionLogViewManager.getSummaryPanelLayout();
    const panelStyle = MockSubmissionLogViewManager.getSummaryPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle, { origin: 0.5 });

    return createLayoutText(scene, layout.body, {
      text: MockSubmissionLogViewManager.formatSummaryRows(submissions).join('\n'),
      style: MockSubmissionLogViewManager.getSummaryTextStyle(layout.body.wordWrapWidth),
    });
  }

  static renderLogPanel(scene, submissions) {
    const layout = MockSubmissionLogViewManager.getLogPanelLayout();
    const panelStyle = MockSubmissionLogViewManager.getLogPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle);

    return createLayoutText(scene, layout.body, {
      text: MockSubmissionLogViewManager.formatLogBody(submissions),
      style: MockSubmissionLogViewManager.getLogTextStyle(layout.body.wordWrapWidth),
    });
  }

  static renderStatus(scene, layout) {
    return createLayoutText(scene, layout.status, {
      text: MockSubmissionLogViewManager.formatStatusText(),
      style: MockSubmissionLogViewManager.getStatusTextStyle(),
      origin: 0.5,
    });
  }
}
