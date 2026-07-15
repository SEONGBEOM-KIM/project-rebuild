const toTextColor = (color) => {
  if (typeof color === 'number') {
    return `#${color.toString(16).padStart(6, '0')}`;
  }
  return color;
};

export function createTextButton(scene, config, style) {
  return scene.add.text(config.x, config.y, config.label, {
    ...style,
    color: toTextColor(config.textColor),
    backgroundColor: toTextColor(config.backgroundColor),
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
}

export function getTextButtonColor(color) {
  return toTextColor(color);
}
