import GlobalStateHudRenderer from './GlobalStateHudRenderer.js';
import { UI_THEME } from './UiTheme.js';

export function createScreenBackground(scene, color, options = {}) {
  const { width, height } = scene.scale;
  const background = scene.add.rectangle(width / 2, height / 2, width, height, color);
  const theme = { ...UI_THEME.screen, ...options };
  const topAccent = scene.add.rectangle(width / 2, theme.topAccentHeight / 2, width, theme.topAccentHeight, theme.topAccentColor, theme.topAccentAlpha);
  const bottomAccent = scene.add.rectangle(width / 2, height - theme.bottomAccentHeight / 2, width, theme.bottomAccentHeight, theme.bottomAccentColor, theme.bottomAccentAlpha);
  [background, topAccent, bottomAccent].forEach((object, index) => {
    object.setScrollFactor?.(0);
    object.setDepth?.(-20 + index);
  });
  GlobalStateHudRenderer.renderIfAvailable(scene);
  return { background, topAccent, bottomAccent };
}
