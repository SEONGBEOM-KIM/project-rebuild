import SideEffectViewManager from './SideEffectViewManager.js';
import SideEffectIssueRenderer from './SideEffectIssueRenderer.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class SideEffectRenderer {
  static renderIssueArea(scene, issues) {
    const layout = SideEffectViewManager.getIssuePanelLayout();
    const panelStyle = SideEffectViewManager.getPanelStyle();
    const textStyles = SideEffectViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, {
      fillColor: panelStyle.issueFillColor,
      fillAlpha: panelStyle.issueFillAlpha,
      strokeWidth: panelStyle.issueStrokeWidth,
    });
    createPanelTitle(scene, layout.title, textStyles.issueTitle, { origin: 0.5 });

    createLayoutText(scene, layout.summary, {
      text: SideEffectViewManager.formatIssueSummary(issues),
      style: textStyles.issueSummary,
    });

    if (!issues.length) {
      return createLayoutText(scene, layout.emptyBody, {
        text: SideEffectViewManager.formatEmptyIssueMessage(),
        style: textStyles.emptyBody,
      });
    }

    return SideEffectViewManager.sortIssuesByPriority(issues).slice(0, 4).map((issue, index) => (
      SideEffectIssueRenderer.renderIssueCard(scene, issue, index)
    ));
  }

  static renderConceptPanel(scene, issues) {
    const layout = SideEffectViewManager.getHintPanelLayout();
    const panelStyle = SideEffectViewManager.getPanelStyle();
    const textStyles = SideEffectViewManager.getTextStyles();
    createPanelBackground(scene, layout.panel, {
      fillColor: panelStyle.hintFillColor,
      fillAlpha: panelStyle.hintFillAlpha,
      strokeWidth: panelStyle.hintStrokeWidth,
    });
    createPanelTitle(scene, layout.title, textStyles.hintTitle, { origin: 0.5 });

    return createLayoutText(scene, layout.body, {
      text: SideEffectViewManager.formatHintRows(issues).join('\n'),
      style: textStyles.hintBody,
    });
  }
}
