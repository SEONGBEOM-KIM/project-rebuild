export const POLICY_CARD_STYLE = {
  background: {
    x: 0,
    y: 0,
    width: 240,
    height: 110,
    fillColor: 0xe0f2fe,
    strokeWidth: 2,
    strokeColor: 0x0284c7,
  },
  label: {
    x: 0,
    y: 0,
    fontSize: '24px',
    color: '#0f172a',
  },
};

export default class PolicyCard {
  constructor(scene, x, y, label) {
    const style = PolicyCard.getStyle();
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.add(scene.add.rectangle(
      style.background.x,
      style.background.y,
      style.background.width,
      style.background.height,
      style.background.fillColor,
    ).setStrokeStyle(style.background.strokeWidth, style.background.strokeColor));
    this.container.add(scene.add.text(style.label.x, style.label.y, label, {
      fontSize: style.label.fontSize,
      color: style.label.color,
    }).setOrigin(0.5));
  }

  static getStyle() {
    return {
      background: { ...POLICY_CARD_STYLE.background },
      label: { ...POLICY_CARD_STYLE.label },
    };
  }
}
