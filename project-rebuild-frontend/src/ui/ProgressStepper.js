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

  static render(_scene, _activeKey, _options = {}) {
    // Episode-specific step lists will replace this shared progress bar in a later UI pass.
    // Keep callers stable while intentionally hiding the provisional global sequence.
    return null;
  }
}
