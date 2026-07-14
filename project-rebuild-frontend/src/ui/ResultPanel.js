export default class ResultPanel {
  constructor(scene) {
    this.scene = scene;
  }

  show(lines) {
    const { width, height } = this.scene.scale;
    this.scene.add.rectangle(width / 2, height / 2, 720, 480, 0xffffff, 0.95)
      .setStrokeStyle(4, 0x1d4ed8);
    return this.scene.add.text(width / 2, height / 2, lines, {
      fontSize: '30px',
      color: '#1e293b',
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);
  }
}
