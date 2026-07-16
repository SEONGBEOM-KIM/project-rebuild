import { createLayoutText } from './LayoutText.js';

export function createPanelBackground(scene, layout, style, options = {}) {
  const background = scene.add.rectangle(
    layout.x,
    layout.y,
    layout.width,
    layout.height,
    style.fillColor,
    style.fillAlpha,
  );

  const strokeWidth = options.strokeWidth ?? style.strokeWidth;
  const strokeColor = options.strokeColor ?? layout.strokeColor ?? style.strokeColor;
  if (strokeWidth !== undefined && strokeColor !== undefined) {
    background.setStrokeStyle(strokeWidth, strokeColor);
  }

  return background;
}

export function getPanelTitleStyle(style, extraStyle = {}) {
  const titleStyle = {};
  if (style.titleFontSize !== undefined) titleStyle.fontSize = style.titleFontSize;
  if (style.titleColor !== undefined) titleStyle.color = style.titleColor;
  if (style.titleFontStyle !== undefined) titleStyle.fontStyle = style.titleFontStyle;
  return {
    ...titleStyle,
    ...extraStyle,
  };
}

export function createPanelTitle(scene, layout, style, options = {}) {
  return createLayoutText(scene, layout, {
    origin: options.origin,
    text: options.text,
    style: getPanelTitleStyle(style, options.style),
  });
}
