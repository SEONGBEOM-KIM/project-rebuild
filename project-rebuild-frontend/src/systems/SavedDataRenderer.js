import SavedDataViewManager from './SavedDataViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
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

  static renderControls(scene, buttonLayout, saved) {
    const continueButtonState = SavedDataViewManager.getContinueButtonState(saved);
    return {
      backButton: createTextButton(scene, buttonLayout.back, SavedDataViewManager.getButtonStyle()),
      importButton: createTextButton(scene, buttonLayout.import, SavedDataViewManager.getButtonStyle()),
      continueButton: createTextButton(scene, {
        ...buttonLayout.continue,
        backgroundColor: continueButtonState.backgroundColor,
        textColor: continueButtonState.textColor,
      }, SavedDataViewManager.getButtonStyle()),
      clearButton: createTextButton(scene, buttonLayout.clear, SavedDataViewManager.getButtonStyle()),
      continueButtonState,
    };
  }
}
