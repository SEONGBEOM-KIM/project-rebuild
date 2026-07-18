import { DEFAULT_STATE_KEYS, STATE_ICONS, STATE_LABELS, formatSignedValue } from '../data/stateLabels.js';
import GameState from './GameState.js';

export default class StateHudManager {
  static buildItems(state = {}, { previousState = null, stateKeys = DEFAULT_STATE_KEYS } = {}) {
    const baseline = previousState ?? GameState.createInitialState();
    return stateKeys.map((key) => {
      const value = state[key] ?? 0;
      const previousValue = baseline[key] ?? value;
      const delta = value - previousValue;
      return {
        key,
        label: STATE_LABELS[key] ?? key,
        icon: STATE_ICONS[key] ?? '•',
        value,
        previousValue,
        delta,
        deltaText: delta === 0 ? '0' : formatSignedValue(delta),
        trend: StateHudManager.getTrend(delta),
        tone: StateHudManager.getTone(key, delta),
      };
    });
  }

  static getTrend(delta) {
    if (delta > 0) {
      return 'up';
    }
    if (delta < 0) {
      return 'down';
    }
    return 'flat';
  }

  static getTone(key, delta) {
    if (delta === 0) {
      return 'neutral';
    }

    const lowerIsBetter = key === 'pollution' || key === 'traffic';
    const higherIsCost = key === 'budget' ? false : lowerIsBetter;
    if (higherIsCost) {
      return delta < 0 ? 'positive' : 'negative';
    }
    return delta > 0 ? 'positive' : 'negative';
  }

  static formatCompactText(state = {}, options = {}) {
    return StateHudManager.buildItems(state, options)
      .map((item) => `${item.icon} ${item.label} ${item.value}`)
      .join('  ');
  }

  static formatStackedText(state = {}, options = {}) {
    return [
      '현재 상태',
      ...StateHudManager.buildItems(state, options).map((item) => `${item.icon} ${item.label}: ${item.value}`),
    ].join('\n');
  }
}
