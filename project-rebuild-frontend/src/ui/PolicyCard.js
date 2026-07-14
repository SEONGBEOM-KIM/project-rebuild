export default class PolicyCard {
  constructor(scene, x, y, label) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.add(scene.add.rectangle(0, 0, 240, 110, 0xe0f2fe).setStrokeStyle(2, 0x0284c7));
    this.container.add(scene.add.text(0, 0, label, { fontSize: '24px', color: '#0f172a' }).setOrigin(0.5));
  }
}
