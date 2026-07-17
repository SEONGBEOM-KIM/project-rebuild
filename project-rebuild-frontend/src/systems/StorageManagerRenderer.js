import StorageManagerViewManager from './StorageManagerViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class StorageManagerRenderer {
  static renderPanel(scene, layout, rows) {
    const panelStyle = StorageManagerViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, panelStyle);
    createPanelTitle(scene, layout.title, panelStyle, { origin: 0.5 });

    return createLayoutText(scene, layout.body, {
      text: rows.join('\n'),
      style: StorageManagerViewManager.getBodyTextStyle(),
    });
  }

  static renderStatus(scene, layout, text) {
    return createLayoutText(scene, layout.status, {
      text,
      style: StorageManagerViewManager.getStatusTextStyle(),
      origin: 0.5,
    });
  }
}
