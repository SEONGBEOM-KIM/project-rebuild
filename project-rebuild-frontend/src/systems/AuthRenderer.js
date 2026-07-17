import AuthViewManager from './AuthViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class AuthRenderer {
  static renderAuthPanel(scene, x, y, title) {
    const panel = AuthViewManager.getLayout().panel;
    createPanelBackground(scene, { x, y, width: panel.width, height: panel.height }, {
      fillColor: panel.fillColor,
      strokeWidth: panel.strokeWidth,
      strokeColor: panel.strokeColor,
    });
    createLayoutText(scene, { x, y: y + panel.titleOffsetY, text: title }, {
      style: { fontSize: panel.titleFontSize, color: panel.titleColor },
      origin: 0.5,
    });

    panel.fields.forEach((field) => {
      AuthRenderer.renderField(scene, panel, x, y, field);
    });

    AuthRenderer.renderSampleButton(scene, panel, x, y);
  }

  static renderField(scene, panel, x, y, field) {
    createPanelBackground(scene, {
      x,
      y: y + field.offsetY,
      width: panel.fieldWidth,
      height: panel.fieldHeight,
    }, { fillColor: panel.fieldColor });
    createLayoutText(scene, { x: x + panel.fieldOffsetX, y: y + field.offsetY, text: field.label }, {
      style: { fontSize: panel.fieldLabelFontSize, color: panel.fieldLabelColor },
      origin: [0, 0.5],
    });
  }

  static renderSampleButton(scene, panel, x, y) {
    createPanelBackground(scene, {
      x,
      y: y + panel.sampleButton.offsetY,
      width: panel.sampleButton.width,
      height: panel.sampleButton.height,
    }, { fillColor: panel.sampleButton.color });
    createLayoutText(scene, { x, y: y + panel.sampleButton.offsetY, text: panel.sampleButton.label }, {
      style: { fontSize: panel.sampleButton.fontSize, color: panel.sampleButton.textColor },
      origin: 0.5,
    });
  }
}
