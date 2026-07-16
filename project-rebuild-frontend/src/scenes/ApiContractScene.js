import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';

import { formatContractRequest, formatContractResponse } from '../data/apiContract.js';
import ApiContractViewManager from '../systems/ApiContractViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ApiContractScene extends Phaser.Scene {
  constructor() {
    super('ApiContractScene');
  }

  create() {
    const { width, height } = this.scale;
    const screenLayout = ApiContractViewManager.getScreenLayout(width);
    this.add.rectangle(width / 2, height / 2, width, height, screenLayout.backgroundColor);
    ProgressStepper.render(this, screenLayout.progressStep);

    createLayoutText(this, screenLayout.title, { origin: 0.5 });
    createLayoutText(this, screenLayout.subtitle, { origin: 0.5 });

    const panels = ApiContractViewManager.getPanelLayout();
    this.drawPanel(panels.request, formatContractRequest());
    this.drawPanel(panels.response, formatContractResponse());
    this.drawNotes();
    this.drawControls();
  }

  drawPanel(panel, body) {
    const panelStyle = ApiContractViewManager.getPanelStyle();
    createPanelBackground(this, panel, panelStyle);
    const titlePosition = ApiContractViewManager.getPanelTitlePosition(panel);
    createPanelTitle(this, titlePosition, panelStyle, { text: panel.title });
    const bodyPosition = ApiContractViewManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, ApiContractViewManager.getPanelBodyStyle(panel));
  }

  drawNotes() {
    const layout = ApiContractViewManager.getNotesLayout();
    const noteStyle = ApiContractViewManager.getNoteStyle();
    createPanelBackground(this, layout.panel, noteStyle);
    createPanelTitle(this, layout.title, noteStyle);
    createLayoutText(this, {
      x: layout.body.x,
      y: layout.body.y,
      wordWrapWidth: layout.body.width,
    }, {
      text: ApiContractViewManager.formatBackendNote(),
      style: {
        fontSize: noteStyle.bodyFontSize,
        color: noteStyle.bodyColor,
      },
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
