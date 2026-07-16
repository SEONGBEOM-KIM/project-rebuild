import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import AuthViewManager from '../systems/AuthViewManager.js';

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super('AuthScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = AuthViewManager.getLayout();
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { x: width / 2, origin: 0.5 });
    createLayoutText(this, layout.subtitle, { x: width / 2, origin: 0.5 });

    AuthViewManager.getPanelPositions(width, height).forEach((panel) => {
      this.createPanel(panel.x, panel.y, panel.title);
    });

    const proceedButton = AuthViewManager.getProceedButton(width);
    const proceed = createTextButton(this, {
      ...proceedButton,
      label: proceedButton.text,
    }, {
      fontSize: proceedButton.fontSize,
      padding: proceedButton.padding,
    });

    proceed.on('pointerdown', () => this.scene.start(proceedButton.targetScene));
  }

  createPanel(x, y, title) {
    const panel = AuthViewManager.getLayout().panel;
    createPanelBackground(this, { x, y, width: panel.width, height: panel.height }, {
      fillColor: panel.fillColor,
      strokeWidth: panel.strokeWidth,
      strokeColor: panel.strokeColor,
    });
    createLayoutText(this, { x, y: y + panel.titleOffsetY, text: title }, {
      style: { fontSize: panel.titleFontSize, color: panel.titleColor },
      origin: 0.5,
    });
    panel.fields.forEach((field) => {
      createPanelBackground(this, {
        x,
        y: y + field.offsetY,
        width: panel.fieldWidth,
        height: panel.fieldHeight,
      }, { fillColor: panel.fieldColor });
      createLayoutText(this, { x: x + panel.fieldOffsetX, y: y + field.offsetY, text: field.label }, {
        style: { fontSize: panel.fieldLabelFontSize, color: panel.fieldLabelColor },
        origin: [0, 0.5],
      });
    });
    createPanelBackground(this, {
      x,
      y: y + panel.sampleButton.offsetY,
      width: panel.sampleButton.width,
      height: panel.sampleButton.height,
    }, { fillColor: panel.sampleButton.color });
    createLayoutText(this, { x, y: y + panel.sampleButton.offsetY, text: panel.sampleButton.label }, {
      style: { fontSize: panel.sampleButton.fontSize, color: panel.sampleButton.textColor },
      origin: 0.5,
    });
  }
}
