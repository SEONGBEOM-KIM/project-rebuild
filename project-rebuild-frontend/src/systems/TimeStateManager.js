import { REGISTRY_KEYS } from '../data/registryKeys.js';

const INITIAL_TIME_STATE = Object.freeze({
  currentYear: 2035,
  turn: 1,
  lastEvent: null,
});

function normalizeTimeState(timeState = {}) {
  return {
    ...INITIAL_TIME_STATE,
    ...timeState,
    currentYear: Number.isFinite(timeState.currentYear) ? timeState.currentYear : INITIAL_TIME_STATE.currentYear,
    turn: Number.isFinite(timeState.turn) ? timeState.turn : INITIAL_TIME_STATE.turn,
    lastEvent: timeState.lastEvent ? { ...timeState.lastEvent } : null,
  };
}

export default class TimeStateManager {
  static createInitialTimeState(overrides = {}) {
    return normalizeTimeState(overrides);
  }

  static get(registry) {
    return normalizeTimeState(registry.get(REGISTRY_KEYS.timeState));
  }

  static set(registry, timeState) {
    const normalized = normalizeTimeState(timeState);
    registry.set(REGISTRY_KEYS.timeState, normalized);
    return normalized;
  }

  static advance(registry, { years = 1, turns = 1, episodeId = null, reason = null } = {}) {
    const current = TimeStateManager.get(registry);
    const nextYear = current.currentYear + years;
    const nextTurn = current.turn + turns;
    return TimeStateManager.set(registry, {
      ...current,
      currentYear: nextYear,
      turn: nextTurn,
      lastEvent: { episodeId, reason, year: nextYear, turn: nextTurn },
    });
  }

  static advanceForEpisode(registry, { episodeId = null, reason = null, years = 1, turns = 1 } = {}) {
    const current = TimeStateManager.get(registry);
    if (episodeId && current.lastEvent?.episodeId === episodeId) {
      return current;
    }

    return TimeStateManager.advance(registry, { episodeId, reason, years, turns });
  }

  static formatCompact(timeState = {}) {
    const normalized = normalizeTimeState(timeState);
    return `${normalized.currentYear}년 · ${normalized.turn}턴`;
  }
}
