export function createScreenBackground(scene, color) {
  const { width, height } = scene.scale;
  return scene.add.rectangle(width / 2, height / 2, width, height, color);
}
