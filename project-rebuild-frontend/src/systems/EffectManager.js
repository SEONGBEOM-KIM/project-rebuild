export default class EffectManager {
  static flash(scene, target, color = 0xffffff) {
    scene.tweens.add({
      targets: target,
      alpha: { from: 0.35, to: 1 },
      duration: 180,
      yoyo: true,
      repeat: 1,
      tint: color,
    });
  }
}
