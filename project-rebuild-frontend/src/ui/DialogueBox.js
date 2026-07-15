export const DIALOGUE_BOX_STYLE = {
  box: {
    bottomOffset: 150,
    horizontalMargin: 220,
    height: 180,
    fillColor: 0x0f172a,
    fillAlpha: 0.92,
    strokeWidth: 3,
    strokeColor: 0x93c5fd,
  },
  text: {
    x: 160,
    bottomOffset: 210,
    horizontalMargin: 320,
    fontSize: '30px',
    color: '#ffffff',
  },
};

export default class DialogueBox {
  constructor(scene) {
    this.scene = scene;
  }

  static getStyle() {
    return {
      box: { ...DIALOGUE_BOX_STYLE.box },
      text: { ...DIALOGUE_BOX_STYLE.text },
    };
  }

  show(text) {
    const { width, height } = this.scene.scale;
    const style = DialogueBox.getStyle();
    this.scene.add.rectangle(
      width / 2,
      height - style.box.bottomOffset,
      width - style.box.horizontalMargin,
      style.box.height,
      style.box.fillColor,
      style.box.fillAlpha,
    ).setStrokeStyle(style.box.strokeWidth, style.box.strokeColor);
    return this.scene.add.text(style.text.x, height - style.text.bottomOffset, text, {
      fontSize: style.text.fontSize,
      color: style.text.color,
      wordWrap: { width: width - style.text.horizontalMargin },
    });
  }
}
