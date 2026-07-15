import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';

import { formatContractRequest, formatContractResponse } from '../data/apiContract.js';
import ApiContractViewManager from '../systems/ApiContractViewManager.js';
import { createTextButton } from '../ui/TextButton.js';

export default class ApiContractScene extends Phaser.Scene {
  constructor() {
    super('ApiContractScene');
  }

  create() {
    const { width, height } = this.scale;
    const screenLayout = ApiContractViewManager.getScreenLayout(width);
    this.add.rectangle(width / 2, height / 2, width, height, screenLayout.backgroundColor);
    ProgressStepper.render(this, screenLayout.progressStep);

    this.add.text(screenLayout.title.x, screenLayout.title.y, screenLayout.title.text, {
      fontSize: screenLayout.title.fontSize,
      color: screenLayout.title.color,
      fontStyle: screenLayout.title.fontStyle,
    }).setOrigin(0.5);

    this.add.text(screenLayout.subtitle.x, screenLayout.subtitle.y, screenLayout.subtitle.text, {
      fontSize: screenLayout.subtitle.fontSize,
      color: screenLayout.subtitle.color,
    }).setOrigin(0.5);

    const panels = ApiContractViewManager.getPanelLayout();
    this.drawPanel(panels.request, formatContractRequest());
    this.drawPanel(panels.response, formatContractResponse());
    this.drawNotes();
    this.drawControls();
  }

  drawPanel(panel, body) {
    const panelStyle = ApiContractViewManager.getPanelStyle();
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, panelStyle.strokeColor);
    const titlePosition = ApiContractViewManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: panelStyle.titleFontSize,
      color: panelStyle.titleColor,
      fontStyle: panelStyle.titleFontStyle,
    });
    const bodyPosition = ApiContractViewManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, ApiContractViewManager.getPanelBodyStyle(panel));
  }

  drawNotes() {
    const layout = ApiContractViewManager.getNotesLayout();
    const noteStyle = ApiContractViewManager.getNoteStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, noteStyle.fillColor, noteStyle.fillAlpha)
      .setStrokeStyle(noteStyle.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: noteStyle.titleFontSize,
      color: noteStyle.titleColor,
      fontStyle: noteStyle.titleFontStyle,
    });
    this.add.text(layout.body.x, layout.body.y, ApiContractViewManager.formatBackendNote(), {
      fontSize: noteStyle.bodyFontSize,
      color: noteStyle.bodyColor,
      wordWrap: { width: layout.body.width },
    });
  }

  drawControls() {
    const layout = ApiContractViewManager.getControlLayout();
    const payloadButton = createTextButton(this, layout.payload, ApiContractViewManager.getButtonStyle());
    payloadButton.on('pointerdown', () => this.scene.start(layout.payload.target));

    const dataButton = createTextButton(this, layout.data, ApiContractViewManager.getButtonStyle());
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));

    const endingButton = createTextButton(this, layout.ending, ApiContractViewManager.getButtonStyle());
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

}
