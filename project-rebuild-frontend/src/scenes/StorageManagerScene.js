import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import StorageSummaryManager from '../systems/StorageSummaryManager.js';
import StorageManagerViewManager from '../systems/StorageManagerViewManager.js';
import { createTextButton } from '../ui/TextButton.js';

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
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: layout.title.fontSize,
      color: layout.title.color,
      fontStyle: layout.title.fontStyle,
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: layout.subtitle.fontSize,
      color: layout.subtitle.color,
    }).setOrigin(0.5);

    this.drawSavedDataPanel();
    this.drawSubmissionPanel();
    this.drawControls();
  }

  drawSavedDataPanel() {
    const layout = StorageManagerViewManager.getPanelLayout().saved;
    const panelStyle = StorageManagerViewManager.getPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: layout.title.color,
      fontStyle: panelStyle.titleFontStyle,
    }).setOrigin(0.5);

    const rows = StorageSummaryManager.formatSavedDataRows(this.saved);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), StorageManagerViewManager.getBodyTextStyle());
  }

  drawSubmissionPanel() {
    const layout = StorageManagerViewManager.getPanelLayout().submissions;
    const panelStyle = StorageManagerViewManager.getPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: panelStyle.titleFontSize,
      color: layout.title.color,
      fontStyle: panelStyle.titleFontStyle,
    }).setOrigin(0.5);

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
