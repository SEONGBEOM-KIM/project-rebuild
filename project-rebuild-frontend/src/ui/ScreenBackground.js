import GlobalStateHudRenderer from './GlobalStateHudRenderer.js';

export function createScreenBackground(scene, color) {
  const { width, height } = scene.scale;
  const background = scene.add.rectangle(width / 2, height / 2, width, height, color);
  GlobalStateHudRenderer.renderIfAvailable(scene);
  return background;
}
