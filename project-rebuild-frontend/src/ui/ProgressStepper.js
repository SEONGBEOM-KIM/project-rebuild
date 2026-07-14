import { EPISODE_STEPS } from '../data/episodes.js';

export default class ProgressStepper {
  static render(scene, activeKey, options = {}) {
    const activeIndex = EPISODE_STEPS.findIndex((step) => step.key === activeKey);
    const x = options.x ?? scene.scale.width / 2;
    const y = options.y ?? 28;
    const spacing = options.spacing ?? 176;
    const container = scene.add.container(x, y).setDepth(options.depth ?? 220).setScrollFactor(0);
    const startX = -((EPISODE_STEPS.length - 1) * spacing) / 2;

    EPISODE_STEPS.forEach((step, index) => {
      const stepX = startX + index * spacing;
      const completed = activeIndex >= 0 && index < activeIndex;
      const active = index === activeIndex;
      const circleColor = active ? 0xfde68a : completed ? 0xbbf7d0 : 0x475569;
      const textColor = active ? '#fde68a' : completed ? '#bbf7d0' : '#cbd5e1';

      if (index > 0) {
        const lineColor = index <= activeIndex ? 0xbbf7d0 : 0x475569;
        container.add(scene.add.rectangle(stepX - spacing / 2, 0, spacing - 46, 4, lineColor, 0.95));
      }

      container.add(scene.add.circle(stepX, 0, active ? 18 : 14, circleColor, 1).setStrokeStyle(3, 0xffffff, active ? 1 : 0.65));
      container.add(scene.add.text(stepX, 31, step.label, {
        fontSize: active ? '20px' : '18px',
        color: textColor,
        fontStyle: active ? 'bold' : 'normal',
      }).setOrigin(0.5));
    });

    return container;
  }
}
