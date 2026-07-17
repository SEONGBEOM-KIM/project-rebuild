import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class StoryRenderer {
  static renderStartButton(scene, button, onStart) {
    const buttonBg = createPanelBackground(scene, button, {
      fillColor: button.fillColor,
      strokeWidth: button.strokeWidth,
      strokeColor: button.strokeColor,
    }).setInteractive({ useHandCursor: true });
    const buttonText = createLayoutText(scene, { x: button.x, y: button.y, text: button.label }, {
      style: {
        fontSize: button.fontSize,
        color: button.textColor,
        fontStyle: button.fontStyle,
      },
      origin: 0.5,
    }).setInteractive({ useHandCursor: true });

    buttonBg.on('pointerover', () => buttonBg.setFillStyle(button.hoverFillColor));
    buttonBg.on('pointerout', () => buttonBg.setFillStyle(button.fillColor));
    buttonBg.on('pointerdown', onStart);
    buttonText.on('pointerdown', onStart);

    return { buttonBg, buttonText };
  }
}
