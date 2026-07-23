import { UI_THEME } from './UiTheme.js';

const toTextColor = (color) => {
  if (typeof color === 'number') {
    return `#${color.toString(16).padStart(6, '0')}`;
  }
  return color;
};

export function createTextButton(scene, config, style) {
  const button = scene.add.text(config.x, config.y, config.label, {
    ...style,
    color: toTextColor(config.textColor),
    backgroundColor: toTextColor(config.backgroundColor),
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  button.on('pointerover', () => button.setScale(UI_THEME.button.hoverScale));
  button.on('pointerout', () => button.setScale(1));
  button.on('pointerdown', () => button.setScale(UI_THEME.button.activeScale));
  button.on('pointerup', () => button.setScale(UI_THEME.button.hoverScale));
  return button;
}

export function getTextButtonColor(color) {
  return toTextColor(color);
}
