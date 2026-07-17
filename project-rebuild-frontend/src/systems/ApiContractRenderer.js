import ApiContractViewManager from './ApiContractViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ApiContractRenderer {
  static renderPanel(scene, panel, body) {
    const panelStyle = ApiContractViewManager.getPanelStyle();
    createPanelBackground(scene, panel, panelStyle);
    const titlePosition = ApiContractViewManager.getPanelTitlePosition(panel);
    createPanelTitle(scene, titlePosition, panelStyle, { text: panel.title });
    const bodyPosition = ApiContractViewManager.getPanelBodyPosition(panel);
    return createLayoutText(scene, bodyPosition, {
      text: body,
      style: ApiContractViewManager.getPanelBodyStyle(panel),
    });
  }

  static renderNotes(scene) {
    const layout = ApiContractViewManager.getNotesLayout();
    const noteStyle = ApiContractViewManager.getNoteStyle();
    createPanelBackground(scene, layout.panel, noteStyle);
    createPanelTitle(scene, layout.title, noteStyle);
    return createLayoutText(scene, {
      x: layout.body.x,
      y: layout.body.y,
      wordWrapWidth: layout.body.width,
    }, {
      text: ApiContractViewManager.formatBackendNote(),
      style: {
        fontSize: noteStyle.bodyFontSize,
        color: noteStyle.bodyColor,
      },
    });
  }
}
