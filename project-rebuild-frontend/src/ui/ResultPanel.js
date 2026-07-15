export const RESULT_PANEL_STYLE = {
  panel: {
    width: 720,
    height: 480,
    fillColor: 0xffffff,
    fillAlpha: 0.95,
    strokeWidth: 4,
    strokeColor: 0x1d4ed8,
  },
  text: {
    fontSize: '30px',
    color: '#1e293b',
    align: 'center',
    lineSpacing: 12,
  },
};

export default class ResultPanel {
  constructor(scene) {
    this.scene = scene;
  }

  static getStyle() {
    return {
      panel: { ...RESULT_PANEL_STYLE.panel },
      text: { ...RESULT_PANEL_STYLE.text },
    };
  }

  show(lines) {
    const { width, height } = this.scene.scale;
    const style = ResultPanel.getStyle();
    this.scene.add.rectangle(
      width / 2,
      height / 2,
      style.panel.width,
      style.panel.height,
      style.panel.fillColor,
      style.panel.fillAlpha,
    ).setStrokeStyle(style.panel.strokeWidth, style.panel.strokeColor);
    return this.scene.add.text(width / 2, height / 2, lines, style.text).setOrigin(0.5);
  }
}
