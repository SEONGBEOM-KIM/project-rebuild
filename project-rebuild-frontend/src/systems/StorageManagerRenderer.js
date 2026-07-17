import StorageManagerViewManager from './StorageManagerViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
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

  static renderControls(scene, layout, statusText) {
    return {
      statusText: StorageManagerRenderer.renderStatus(scene, layout, statusText),
      clearSaveButton: createTextButton(scene, layout.clearSave, StorageManagerViewManager.getButtonStyle()),
      clearLogButton: createTextButton(scene, layout.clearLog, StorageManagerViewManager.getButtonStyle()),
      clearAllButton: createTextButton(scene, layout.clearAll, StorageManagerViewManager.getButtonStyle()),
      titleButton: createTextButton(scene, layout.title, StorageManagerViewManager.getButtonStyle()),
      savedDataButton: createTextButton(scene, layout.savedData, StorageManagerViewManager.getButtonStyle()),
    };
  }
}
