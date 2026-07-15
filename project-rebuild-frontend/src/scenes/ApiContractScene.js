import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';

import { formatContractRequest, formatContractResponse } from '../data/apiContract.js';
import ApiContractViewManager from '../systems/ApiContractViewManager.js';

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
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(screenLayout.subtitle.x, screenLayout.subtitle.y, screenLayout.subtitle.text, {
      fontSize: '25px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    const panels = ApiContractViewManager.getPanelLayout();
    this.drawPanel(panels.request, formatContractRequest());
    this.drawPanel(panels.response, formatContractResponse());
    this.drawNotes();
    this.drawControls();
  }

  drawPanel(panel, body) {
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, 0x111827, 0.98).setStrokeStyle(5, 0x60a5fa);
    const titlePosition = ApiContractViewManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '30px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    const bodyPosition = ApiContractViewManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, ApiContractViewManager.getPanelBodyStyle(panel));
  }

  drawNotes() {
    const layout = ApiContractViewManager.getNotesLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x1e293b, 0.98).setStrokeStyle(3, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '23px',
      color: '#fde68a',
      fontStyle: 'bold',
    });
    this.add.text(layout.body.x, layout.body.y, ApiContractViewManager.formatBackendNote(), {
      fontSize: '22px',
      color: '#ffffff',
      wordWrap: { width: layout.body.width },
    });
  }

  drawControls() {
    const layout = ApiContractViewManager.getControlLayout();
    const payloadButton = this.createButton(layout.payload.x, layout.payload.y, layout.payload.label, layout.payload.backgroundColor, layout.payload.textColor);
    payloadButton.on('pointerdown', () => this.scene.start(layout.payload.target));

    const dataButton = this.createButton(layout.data.x, layout.data.y, layout.data.label, layout.data.backgroundColor, layout.data.textColor);
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));

    const endingButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, layout.ending.backgroundColor, layout.ending.textColor);
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '29px',
      color,
      backgroundColor,
      padding: { x: 28, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
