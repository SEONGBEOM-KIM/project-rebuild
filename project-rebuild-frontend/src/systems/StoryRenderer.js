import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';
import SCENE_KEYS from '../data/sceneKeys.js';
import { UI_THEME } from '../ui/UiTheme.js';

export default class StoryRenderer {
  static renderDialogue(scene, dialogue, layout, { isFinal = false, onNext }) {
    const panel = createPanelBackground(scene, layout.panel, layout.panel);
    const speaker = createLayoutText(scene, layout.speaker, {
      text: dialogue.speaker,
      style: { fontSize: '38px', color: '#bbf7d0', fontStyle: 'bold' },
      origin: 0.5,
    });
    const text = createLayoutText(scene, layout.text, {
      text: `“${dialogue.text}”`,
      style: { fontSize: '34px', color: '#f8fafc', align: 'center', lineSpacing: 14 },
      origin: 0.5,
    });
    const progress = createLayoutText(scene, layout.progress, {
      text: layout.progress.text,
      style: { fontSize: '24px', color: '#94a3b8' },
      origin: 0.5,
    });
    const button = {
      ...layout.nextButton,
      label: isFinal ? layout.nextButton.finalLabel : layout.nextButton.nextLabel,
      targetScene: SCENE_KEYS.Exploration,
    };
    const controls = StoryRenderer.renderStartButton(scene, button, onNext);
    return { panel, speaker, text, progress, ...controls };
  }

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
    buttonBg.on('pointerover', () => {
      buttonBg.setScale(UI_THEME.button.hoverScale);
      buttonText.setScale(UI_THEME.button.hoverScale);
    });
    buttonBg.on('pointerout', () => {
      buttonBg.setScale(1);
      buttonText.setScale(1);
    });
    buttonBg.on('pointerdown', () => {
      buttonBg.setScale(UI_THEME.button.activeScale);
      buttonText.setScale(UI_THEME.button.activeScale);
      onStart();
    });
    buttonText.on('pointerover', () => {
      buttonBg.setScale(UI_THEME.button.hoverScale);
      buttonText.setScale(UI_THEME.button.hoverScale);
    });
    buttonText.on('pointerout', () => {
      buttonBg.setScale(1);
      buttonText.setScale(1);
    });
    buttonText.on('pointerdown', () => {
      buttonBg.setScale(UI_THEME.button.activeScale);
      buttonText.setScale(UI_THEME.button.activeScale);
      onStart();
    });

    return { buttonBg, buttonText };
  }
}
