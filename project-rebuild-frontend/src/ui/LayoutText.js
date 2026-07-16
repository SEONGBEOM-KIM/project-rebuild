export function getLayoutTextStyle(layout, extraStyle = {}) {
  const { x, y, text, origin, wordWrapWidth, ...style } = layout;
  return {
    ...style,
    ...(wordWrapWidth ? { wordWrap: { width: wordWrapWidth } } : {}),
    ...extraStyle,
  };
}

export function createLayoutText(scene, layout, options = {}) {
  const textObject = scene.add.text(
    options.x ?? layout.x,
    options.y ?? layout.y,
    options.text ?? layout.text ?? '',
    getLayoutTextStyle(layout, options.style),
  );

  const origin = options.origin ?? layout.origin;
  if (origin !== undefined) {
    if (Array.isArray(origin)) {
      textObject.setOrigin(...origin);
    } else {
      textObject.setOrigin(origin);
    }
  }

  return textObject;
}
