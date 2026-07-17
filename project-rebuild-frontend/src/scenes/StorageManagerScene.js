import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import SaveManager from '../systems/SaveManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import StorageSummaryManager from '../systems/StorageSummaryManager.js';
import StorageManagerViewManager from '../systems/StorageManagerViewManager.js';
import StorageManagerRenderer from '../systems/StorageManagerRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class StorageManagerScene extends Phaser.Scene {
  constructor() {
    super('StorageManagerScene');
  }

  create() {
    const { width } = this.scale;
    this.saved = SaveManager.load();
    this.submissions = MockApiClient.listSubmissions();

    const layout = StorageManagerViewManager.getScreenLayout(width);
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawSavedDataPanel();
    this.drawSubmissionPanel();
    this.drawControls();
  }

  drawSavedDataPanel() {
    StorageManagerRenderer.renderPanel(
      this,
      StorageManagerViewManager.getPanelLayout().saved,
      StorageSummaryManager.formatSavedDataRows(this.saved),
    );
  }

  drawSubmissionPanel() {
    StorageManagerRenderer.renderPanel(
      this,
      StorageManagerViewManager.getPanelLayout().submissions,
      StorageSummaryManager.formatSubmissionRows(this.submissions),
    );
  }

  drawControls() {
    const layout = StorageManagerViewManager.getControlLayout();
    this.statusText = StorageManagerRenderer.renderStatus(this, layout, StorageSummaryManager.formatStatusText());

    const clearSaveButton = createTextButton(this, layout.clearSave, StorageManagerViewManager.getButtonStyle());
    clearSaveButton.on('pointerdown', () => {
      SaveManager.clear();
      this.scene.restart();
    });

    const clearLogButton = createTextButton(this, layout.clearLog, StorageManagerViewManager.getButtonStyle());
    clearLogButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const clearAllButton = createTextButton(this, layout.clearAll, StorageManagerViewManager.getButtonStyle());
    clearAllButton.on('pointerdown', () => {
      SaveManager.clear();
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const titleButton = createTextButton(this, layout.title, StorageManagerViewManager.getButtonStyle());
    titleButton.on('pointerdown', () => this.scene.start(layout.title.targetScene));

    const dataButton = createTextButton(this, layout.savedData, StorageManagerViewManager.getButtonStyle());
    dataButton.on('pointerdown', () => this.scene.start(layout.savedData.targetScene));
  }

}
