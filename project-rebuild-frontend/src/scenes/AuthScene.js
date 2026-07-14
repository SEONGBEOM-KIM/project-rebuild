import Phaser from 'phaser';
import AuthViewManager from '../systems/AuthViewManager.js';

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super('AuthScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = AuthViewManager.getLayout();
    this.add.rectangle(width / 2, height / 2, width, height, layout.backgroundColor);
    this.add.text(width / 2, layout.title.y, layout.title.text, {
      fontSize: '68px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, layout.subtitle.y, layout.subtitle.text, {
      fontSize: '28px',
      color: '#93c5fd',
    }).setOrigin(0.5);

    AuthViewManager.getPanelPositions(width, height).forEach((panel) => {
      this.createPanel(panel.x, panel.y, panel.title);
    });

    const proceedButton = AuthViewManager.getProceedButton(width);
    const proceed = this.add.text(proceedButton.x, proceedButton.y, proceedButton.text, {
      fontSize: '36px',
      color: '#10253f',
      backgroundColor: '#fde68a',
      padding: { x: 36, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    proceed.on('pointerdown', () => this.scene.start(proceedButton.targetScene));
  }

  createPanel(x, y, title) {
    const panel = AuthViewManager.getLayout().panel;
    this.add.rectangle(x, y, panel.width, panel.height, panel.fillColor).setStrokeStyle(4, panel.strokeColor);
    this.add.text(x, y + panel.titleOffsetY, title, { fontSize: '38px', color: '#ffffff' }).setOrigin(0.5);
    panel.fields.forEach((field) => {
      this.add.rectangle(x, y + field.offsetY, panel.fieldWidth, panel.fieldHeight, panel.fieldColor);
      this.add.text(x + panel.fieldOffsetX, y + field.offsetY, field.label, { fontSize: '24px', color: '#64748b' }).setOrigin(0, 0.5);
    });
    this.add.rectangle(x, y + panel.sampleButton.offsetY, panel.sampleButton.width, panel.sampleButton.height, panel.sampleButton.color);
    this.add.text(x, y + panel.sampleButton.offsetY, panel.sampleButton.label, { fontSize: '26px', color: '#0f172a' }).setOrigin(0.5);
  }
}
