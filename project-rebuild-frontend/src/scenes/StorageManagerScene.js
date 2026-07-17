import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import SaveManager from '../systems/SaveManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import StorageSummaryManager from '../systems/StorageSummaryManager.js';
import StorageManagerViewManager from '../systems/StorageManagerViewManager.js';
import StorageManagerRenderer from '../systems/StorageManagerRenderer.js';
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
    const controls = StorageManagerRenderer.renderControls(this, layout, StorageSummaryManager.formatStatusText());
    this.statusText = controls.statusText;

    controls.clearSaveButton.on('pointerdown', () => {
      SaveManager.clear();
      this.scene.restart();
    });

    controls.clearLogButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    controls.clearAllButton.on('pointerdown', () => {
      SaveManager.clear();
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    controls.titleButton.on('pointerdown', () => this.scene.start(layout.title.targetScene));
    controls.savedDataButton.on('pointerdown', () => this.scene.start(layout.savedData.targetScene));
  }

}
