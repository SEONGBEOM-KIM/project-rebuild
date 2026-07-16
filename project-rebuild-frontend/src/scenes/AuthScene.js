import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import AuthViewManager from '../systems/AuthViewManager.js';

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super('AuthScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = AuthViewManager.getLayout();
    createScreenBackground(this, layout.backgroundColor);
    this.add.text(width / 2, layout.title.y, layout.title.text, {
      fontSize: layout.title.fontSize,
      color: layout.title.color,
      fontStyle: layout.title.fontStyle,
    }).setOrigin(0.5);

    this.add.text(width / 2, layout.subtitle.y, layout.subtitle.text, {
      fontSize: layout.subtitle.fontSize,
      color: layout.subtitle.color,
    }).setOrigin(0.5);

    AuthViewManager.getPanelPositions(width, height).forEach((panel) => {
      this.createPanel(panel.x, panel.y, panel.title);
    });

    const proceedButton = AuthViewManager.getProceedButton(width);
    const proceed = this.add.text(proceedButton.x, proceedButton.y, proceedButton.text, {
      fontSize: proceedButton.fontSize,
      color: proceedButton.textColor,
      backgroundColor: proceedButton.backgroundColor,
      padding: proceedButton.padding,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    proceed.on('pointerdown', () => this.scene.start(proceedButton.targetScene));
  }

  createPanel(x, y, title) {
    const panel = AuthViewManager.getLayout().panel;
    this.add.rectangle(x, y, panel.width, panel.height, panel.fillColor).setStrokeStyle(panel.strokeWidth, panel.strokeColor);
    this.add.text(x, y + panel.titleOffsetY, title, { fontSize: panel.titleFontSize, color: panel.titleColor }).setOrigin(0.5);
    panel.fields.forEach((field) => {
      this.add.rectangle(x, y + field.offsetY, panel.fieldWidth, panel.fieldHeight, panel.fieldColor);
      this.add.text(x + panel.fieldOffsetX, y + field.offsetY, field.label, { fontSize: panel.fieldLabelFontSize, color: panel.fieldLabelColor }).setOrigin(0, 0.5);
    });
    this.add.rectangle(x, y + panel.sampleButton.offsetY, panel.sampleButton.width, panel.sampleButton.height, panel.sampleButton.color);
    this.add.text(x, y + panel.sampleButton.offsetY, panel.sampleButton.label, { fontSize: panel.sampleButton.fontSize, color: panel.sampleButton.textColor }).setOrigin(0.5);
  }
}
