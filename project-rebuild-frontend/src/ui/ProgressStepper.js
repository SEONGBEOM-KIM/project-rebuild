import { EPISODE_STEPS } from '../data/episodes.js';

export const PROGRESS_STEPPER_STYLE = {
  position: { y: 28 },
  spacing: 176,
  depth: 220,
  line: {
    widthOffset: 46,
    height: 4,
    alpha: 0.95,
  },
  circle: {
    activeRadius: 18,
    inactiveRadius: 14,
    strokeWidth: 3,
    strokeColor: 0xffffff,
    activeStrokeAlpha: 1,
    inactiveStrokeAlpha: 0.65,
  },
  label: {
    y: 31,
    activeFontSize: '20px',
    inactiveFontSize: '18px',
    activeFontStyle: 'bold',
    inactiveFontStyle: 'normal',
  },
  colors: {
    active: 0xfde68a,
    completed: 0xbbf7d0,
    pending: 0x475569,
    pendingText: '#cbd5e1',
  },
};

export default class ProgressStepper {
  static getStyle() {
    return {
      position: { ...PROGRESS_STEPPER_STYLE.position },
      spacing: PROGRESS_STEPPER_STYLE.spacing,
      depth: PROGRESS_STEPPER_STYLE.depth,
      line: { ...PROGRESS_STEPPER_STYLE.line },
      circle: { ...PROGRESS_STEPPER_STYLE.circle },
      label: { ...PROGRESS_STEPPER_STYLE.label },
      colors: { ...PROGRESS_STEPPER_STYLE.colors },
    };
  }

  static getStepVisualState(index, activeIndex) {
    const completed = activeIndex >= 0 && index < activeIndex;
    const active = index === activeIndex;
    const { colors, circle, label } = PROGRESS_STEPPER_STYLE;

    return {
      completed,
      active,
      circleColor: active ? colors.active : completed ? colors.completed : colors.pending,
      lineColor: index <= activeIndex ? colors.completed : colors.pending,
      textColor: active ? '#fde68a' : completed ? '#bbf7d0' : colors.pendingText,
      radius: active ? circle.activeRadius : circle.inactiveRadius,
      strokeAlpha: active ? circle.activeStrokeAlpha : circle.inactiveStrokeAlpha,
      fontSize: active ? label.activeFontSize : label.inactiveFontSize,
      fontStyle: active ? label.activeFontStyle : label.inactiveFontStyle,
    };
  }

  static render(scene, activeKey, options = {}) {
    const style = ProgressStepper.getStyle();
    const activeIndex = EPISODE_STEPS.findIndex((step) => step.key === activeKey);
    const x = options.x ?? scene.scale.width / 2;
    const y = options.y ?? style.position.y;
    const spacing = options.spacing ?? style.spacing;
    const container = scene.add.container(x, y).setDepth(options.depth ?? style.depth).setScrollFactor(0);
    const startX = -((EPISODE_STEPS.length - 1) * spacing) / 2;

    EPISODE_STEPS.forEach((step, index) => {
      const stepX = startX + index * spacing;
      const visualState = ProgressStepper.getStepVisualState(index, activeIndex);

      if (index > 0) {
        container.add(scene.add.rectangle(
          stepX - spacing / 2,
          0,
          spacing - style.line.widthOffset,
          style.line.height,
          visualState.lineColor,
          style.line.alpha,
        ));
      }

      container.add(scene.add.circle(stepX, 0, visualState.radius, visualState.circleColor, 1)
        .setStrokeStyle(style.circle.strokeWidth, style.circle.strokeColor, visualState.strokeAlpha));
      container.add(scene.add.text(stepX, style.label.y, step.label, {
        fontSize: visualState.fontSize,
        color: visualState.textColor,
        fontStyle: visualState.fontStyle,
      }).setOrigin(0.5));
    });

    return container;
  }
}
