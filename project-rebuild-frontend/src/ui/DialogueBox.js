export default class DialogueBox {
  constructor(scene) {
    this.scene = scene;
  }

  show(text) {
    const { width, height } = this.scene.scale;
    this.scene.add.rectangle(width / 2, height - 150, width - 220, 180, 0x0f172a, 0.92)
      .setStrokeStyle(3, 0x93c5fd);
    return this.scene.add.text(160, height - 210, text, {
      fontSize: '30px',
      color: '#ffffff',
      wordWrap: { width: width - 320 },
    });
  }
}
