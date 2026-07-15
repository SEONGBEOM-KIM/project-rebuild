import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import MockApiClient from '../systems/MockApiClient.js';
import StorageSummaryManager from '../systems/StorageSummaryManager.js';
import StorageManagerViewManager from '../systems/StorageManagerViewManager.js';

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

    const clearSaveButton = this.createButton(layout.clearSave.x, layout.clearSave.y, layout.clearSave.label, layout.clearSave.backgroundColor, layout.clearSave.textColor);
    clearSaveButton.on('pointerdown', () => {
      SaveManager.clear();
      this.scene.restart();
    });

    const clearLogButton = this.createButton(layout.clearLog.x, layout.clearLog.y, layout.clearLog.label, layout.clearLog.backgroundColor, layout.clearLog.textColor);
    clearLogButton.on('pointerdown', () => {
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const clearAllButton = this.createButton(layout.clearAll.x, layout.clearAll.y, layout.clearAll.label, layout.clearAll.backgroundColor, layout.clearAll.textColor);
    clearAllButton.on('pointerdown', () => {
      SaveManager.clear();
      MockApiClient.clearSubmissions();
      this.scene.restart();
    });

    const titleButton = this.createButton(layout.title.x, layout.title.y, layout.title.label, layout.title.backgroundColor, layout.title.textColor);
    titleButton.on('pointerdown', () => this.scene.start(layout.title.targetScene));

    const dataButton = this.createButton(layout.savedData.x, layout.savedData.y, layout.savedData.label, layout.savedData.backgroundColor, layout.savedData.textColor);
    dataButton.on('pointerdown', () => this.scene.start(layout.savedData.targetScene));
  }

  createButton(x, y, label, backgroundColor, color) {
    const buttonStyle = StorageManagerViewManager.getButtonStyle();
    return this.add.text(x, y, label, {
      fontSize: buttonStyle.fontSize,
      color,
      backgroundColor,
      padding: buttonStyle.padding,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
