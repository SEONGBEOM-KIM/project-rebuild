export const ISSUE_THRESHOLDS = Object.freeze({
  environmentMin: 60,
  pollutionMax: 15,
  trafficMax: 12,
  budgetMin: 500,
  satisfactionMin: 70,
});

export const RESULT_THRESHOLDS = Object.freeze({
  populationImproved: 1100,
  economyImproved: 60,
  environmentGood: 70,
  satisfactionBalanced: 70,
  satisfactionHigh: 75,
  budgetSafe: 500,
  balancedScore: 75,
  recoveryScore: 60,
  balancedMinimumBuildingTypes: 2,
});

export const SCORE_RULES = Object.freeze({
  populationBase: 1000,
  populationDivisor: 10,
  economyBase: 50,
  economyMultiplier: 2,
  environmentBase: 60,
  satisfactionBase: 60,
  budgetDivisor: 25,
  maxPartScore: 20,
});


export const REACTION_THRESHOLDS = Object.freeze({
  satisfactionHigh: 85,
  satisfactionModerate: 70,
  trafficComfortable: 7,
});
