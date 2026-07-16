import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import StorageSummaryManager from '../systems/StorageSummaryManager.js';
import StorageManagerViewManager from '../systems/StorageManagerViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class StorageManagerScene extends Phaser.Scene {
  constructor() {
    super('StorageManagerScene');
  }

  create() {
    const { width, height } = this.scale;
    this.saved = SaveManager.load();
    this.submissions = MockApiClient.listSubmissions();

    const layout = StorageManagerViewManager.getScreenLayout(width);
    this.add.rectangle(width / 2, height / 2, width, height, layout.backgroundColor);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawSavedDataPanel();
    this.drawSubmissionPanel();
    this.drawControls();
  }

  drawSavedDataPanel() {
    const layout = StorageManagerViewManager.getPanelLayout().saved;
    const panelStyle = StorageManagerViewManager.getPanelStyle();
    createPanelBackground(this, layout.panel, panelStyle);
    createPanelTitle(this, layout.title, panelStyle, { origin: 0.5 });

    const rows = StorageSummaryManager.formatSavedDataRows(this.saved);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), StorageManagerViewManager.getBodyTextStyle());
  }

  drawSubmissionPanel() {
    const layout = StorageManagerViewManager.getPanelLayout().submissions;
    const panelStyle = StorageManagerViewManager.getPanelStyle();
    createPanelBackground(this, layout.panel, panelStyle);
    createPanelTitle(this, layout.title, panelStyle, { origin: 0.5 });

    const rows = StorageSummaryManager.formatSubmissionRows(this.submissions);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), StorageManagerViewManager.getBodyTextStyle());
  }

  drawControls() {
    const layout = StorageManagerViewManager.getControlLayout();
    this.statusText = this.add.text(layout.status.x, layout.status.y, StorageSummaryManager.formatStatusText(), StorageManagerViewManager.getStatusTextStyle())
      .setOrigin(0.5);

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
