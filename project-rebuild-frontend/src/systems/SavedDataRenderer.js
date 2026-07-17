import SavedDataViewManager from './SavedDataViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class SavedDataRenderer {
  static renderBodyPanel(scene, layout, saved) {
    createPanelBackground(scene, layout.bodyPanel, {
      fillColor: layout.bodyPanel.fillColor,
      fillAlpha: layout.bodyPanel.alpha,
      strokeWidth: layout.bodyPanel.strokeWidth,
      strokeColor: layout.bodyPanel.strokeColor,
    });

    return createLayoutText(scene, layout.bodyText, {
      text: SavedDataViewManager.formatBody(saved),
      style: SavedDataViewManager.getBodyTextStyle(),
    });
  }

  static renderStatusText(scene, layout) {
    return createLayoutText(scene, layout.status, {
      style: SavedDataViewManager.getStatusTextStyle(),
      origin: 0.5,
    });
  }
}
