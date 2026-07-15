export const STATUS_BAR_STYLE = {
  position: { x: 24, y: 24 },
  text: {
    fontSize: '22px',
    color: '#ffffff',
    backgroundColor: '#0f172a',
    padding: { x: 14, y: 10 },
  },
};

export default class StatusBar {
  constructor(scene) {
    this.scene = scene;
  }

  static getStyle() {
    return {
      position: { ...STATUS_BAR_STYLE.position },
      text: {
        ...STATUS_BAR_STYLE.text,
        padding: { ...STATUS_BAR_STYLE.text.padding },
      },
    };
  }

  render(state) {
    const style = StatusBar.getStyle();
    const text = Object.entries(state).map(([key, value]) => `${key}: ${value}`).join('  |  ');
    return this.scene.add.text(style.position.x, style.position.y, text, style.text).setScrollFactor(0);
  }
}
