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

export const DEFAULT_EVALUATION_PROFILE_ID = 'ep2_population_recovery_default';
export const ENVIRONMENT_EVALUATION_PROFILE_ID = 'ep2_environment_focus';

export const evaluationProfiles = Object.freeze({
  [DEFAULT_EVALUATION_PROFILE_ID]: Object.freeze({
    id: DEFAULT_EVALUATION_PROFILE_ID,
    issueThresholds: ISSUE_THRESHOLDS,
    resultThresholds: RESULT_THRESHOLDS,
    scoreRules: SCORE_RULES,
    reactionThresholds: REACTION_THRESHOLDS,
  }),
  [ENVIRONMENT_EVALUATION_PROFILE_ID]: Object.freeze({
    id: ENVIRONMENT_EVALUATION_PROFILE_ID,
    issueThresholds: Object.freeze({
      ...ISSUE_THRESHOLDS,
      environmentMin: 75,
      pollutionMax: 10,
      budgetMin: 650,
    }),
    resultThresholds: Object.freeze({
      ...RESULT_THRESHOLDS,
      environmentGood: 85,
      satisfactionBalanced: 75,
      budgetSafe: 650,
    }),
    scoreRules: Object.freeze({
      ...SCORE_RULES,
      environmentBase: 70,
      satisfactionBase: 65,
    }),
    reactionThresholds: Object.freeze({
      ...REACTION_THRESHOLDS,
      satisfactionHigh: 90,
      satisfactionModerate: 75,
    }),
  }),
});

export function getEvaluationProfile(profileId = DEFAULT_EVALUATION_PROFILE_ID) {
  return evaluationProfiles[profileId] ?? evaluationProfiles[DEFAULT_EVALUATION_PROFILE_ID];
}
