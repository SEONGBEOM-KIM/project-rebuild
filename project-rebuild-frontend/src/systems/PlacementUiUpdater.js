import PlacementUiStateManager from './PlacementUiStateManager.js';
import PlacementViewManager from './PlacementViewManager.js';

export default class PlacementUiUpdater {
  constructor({
    missionText,
    statusText,
    cursorInfoText,
    messageText,
    lastChangeText,
    placementHistoryText,
    continueButton,
    continueButtonBg,
    uiStateManager = PlacementUiStateManager,
    viewManager = PlacementViewManager,
  }) {
    this.missionText = missionText;
    this.statusText = statusText;
    this.cursorInfoText = cursorInfoText;
    this.messageText = messageText;
    this.lastChangeText = lastChangeText;
    this.placementHistoryText = placementHistoryText;
    this.continueButton = continueButton;
    this.continueButtonBg = continueButtonBg;
    this.uiStateManager = uiStateManager;
    this.viewManager = viewManager;
  }

  updateCursorInfo(tile, mapTile = null, validation = null) {
    if (!this.cursorInfoText) {
      return;
    }

    const cursorState = this.uiStateManager.formatCursorInfo(tile, mapTile, validation);
    this.cursorInfoText.setText(cursorState.text);
    this.cursorInfoText.setColor(cursorState.color);
  }

  updateStatusBar(state, stateKeys = undefined) {
    if (!this.statusText) {
      return;
    }

    this.statusText.setText(this.uiStateManager.formatStatusText(state, stateKeys));
  }

  updateLastChangePanel(lastPlacementResult, stateKeys = null) {
    if (!this.lastChangeText) {
      return;
    }

    const lastChangeState = this.uiStateManager.formatLastChangeState(lastPlacementResult, stateKeys);
    this.lastChangeText.setText(lastChangeState.text);
    this.lastChangeText.setColor(lastChangeState.color);
  }

  updatePlacementHistoryPanel(placedBuildings, stateKeys = null) {
    if (!this.placementHistoryText) {
      return;
    }

    const historyState = this.uiStateManager.formatPlacementHistoryState(placedBuildings, stateKeys);
    this.placementHistoryText.setText(historyState.text);
    this.placementHistoryText.setColor(historyState.color);
  }

  updateContinueButton(placedCount, selectedPolicy, selectedStrategy = null, requiredPlacements = undefined) {
    const continueState = this.uiStateManager.getContinueState(placedCount, selectedPolicy, selectedStrategy, requiredPlacements);

    if (this.missionText) {
      this.missionText.setText(continueState.missionText);
    }

    if (this.continueButton) {
      this.continueButton.setText(continueState.buttonText);
      this.continueButton.setAlpha(continueState.buttonAlpha);
    }

    if (this.continueButtonBg) {
      this.continueButtonBg.setFillStyle(continueState.backgroundFillColor, continueState.backgroundAlpha);
      this.continueButtonBg.setStrokeStyle(this.viewManager.getFixedUiStyle().rectangleStrokeWidth, continueState.strokeColor);
    }
  }

  showMessage(message, color = '#fde68a') {
    if (!this.messageText) {
      return;
    }

    this.messageText.setText(message);
    this.messageText.setColor(color);
  }
}
