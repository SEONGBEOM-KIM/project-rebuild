import ResultViewManager from './ResultViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ResultRenderer {
  static renderResidentReactionStrip(scene, centerX, rows) {
    const layout = ResultViewManager.getResidentReactionLayout(centerX);
    const reactionStyle = ResultViewManager.getResidentReactionStyle();
    const textStyles = ResultViewManager.getResidentReactionTextStyles();
    createPanelBackground(scene, layout.panel, reactionStyle);
    createPanelTitle(scene, layout.title, textStyles.title);
    return createLayoutText(scene, layout.body, {
      text: rows,
      style: textStyles.body,
    });
  }

  static renderStatePanel(scene, panel, rows) {
    const panelStyle = ResultViewManager.getPanelStyle();
    createPanelBackground(scene, { ...panel, y: panel.y + panelStyle.yOffset }, panelStyle);
    const titlePosition = ResultViewManager.getPanelTitlePosition(panel);
    createPanelTitle(scene, titlePosition, ResultViewManager.getPanelTitleTextStyle(), { text: panel.title, origin: 0.5 });
    const bodyPosition = ResultViewManager.getPanelBodyPosition(panel);
    return createLayoutText(scene, bodyPosition, {
      text: rows,
      style: ResultViewManager.getPanelBodyStyle(panel),
      origin: [0.5, 0],
    });
  }
}
