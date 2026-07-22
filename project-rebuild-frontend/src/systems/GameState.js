const INITIAL_STATE = Object.freeze({
  population: 1000,
  economy: 50,
  environment: 80,
  satisfaction: 60,
  budget: 1000,
  traffic: 10,
  pollution: 10,
  inequality: 30,
});

export default class GameState {
  static createInitialState() {
    return { ...INITIAL_STATE };
  }

  static applyEffect(state, effect) {
    const nextState = { ...state };
    for (const [key, value] of Object.entries(effect)) {
      nextState[key] = (nextState[key] ?? 0) + value;
    }
    return nextState;
  }
}
