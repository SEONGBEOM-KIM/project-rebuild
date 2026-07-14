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
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 78, 'API 계약 보기', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, 'Django REST Framework 연동 시 사용할 저장 endpoint와 요청/응답 구조 초안입니다.', {
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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x1e293b, 0.98).setStrokeStyle(3, 0xfde68a);
    this.add.text(layout.title.x, layout.title.y, '백엔드 구현 메모', {
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
    const payloadButton = this.createButton(layout.payload.x, layout.payload.y, layout.payload.label, '#bbf7d0', '#123524');
    payloadButton.on('pointerdown', () => this.scene.start(layout.payload.target));

    const dataButton = this.createButton(layout.data.x, layout.data.y, layout.data.label, '#c4b5fd', '#1e1b4b');
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));

    const endingButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, '#fde68a', '#0f172a');
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
