export default class StatusBar {
  constructor(scene) {
    this.scene = scene;
  }

  render(state) {
    const text = Object.entries(state).map(([key, value]) => `${key}: ${value}`).join('  |  ');
    return this.scene.add.text(24, 24, text, {
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#0f172a',
      padding: { x: 14, y: 10 },
    }).setScrollFactor(0);
  }
}
