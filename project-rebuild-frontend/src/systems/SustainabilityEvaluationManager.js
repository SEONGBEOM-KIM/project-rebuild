const DIMENSIONS = Object.freeze([
  {
    id: 'growth',
    icon: '📈',
    title: '지역 활력',
    description: '인구와 경제가 함께 회복되었는지 확인합니다.',
    passes: (state) => state.population >= 1050 && state.economy >= 70,
    value: (state) => `인구 ${state.population} / 경제 ${state.economy}`,
  },
  {
    id: 'environment',
    icon: '🌿',
    title: '환경 안전',
    description: '환경 상태와 오염 부담이 안전한 범위인지 확인합니다.',
    passes: (state) => state.environment >= 70 && state.pollution <= 18,
    value: (state) => `환경 ${state.environment} / 오염 ${state.pollution}`,
  },
  {
    id: 'living',
    icon: '😊',
    title: '생활 균형',
    description: '만족도와 교통·소득 격차 부담을 함께 확인합니다.',
    passes: (state) => state.satisfaction >= 65 && state.traffic <= 20 && state.inequality <= 40,
    value: (state) => `만족도 ${state.satisfaction} / 교통 ${state.traffic} / 격차 ${state.inequality}`,
  },
  {
    id: 'budget',
    icon: '💰',
    title: '재정 지속성',
    description: '다음 계획을 이어갈 수 있는 예산을 남겼는지 확인합니다.',
    passes: (state) => state.budget >= 500,
    value: (state) => `예산 ${state.budget}`,
  },
]);

const FINAL_OUTCOMES = Object.freeze({
  4: {
    title: '지속 가능한 푸른군',
    message: '성장, 환경, 주민 생활, 재정이 함께 안정되어 다음 발전을 이어갈 수 있습니다.',
  },
  3: {
    title: '균형 회복 중인 푸른군',
    message: '대부분의 조건은 좋아졌습니다. 남은 한 가지 부담을 다음 계획에서 보완해 보세요.',
  },
  2: {
    title: '회복 기반을 만든 푸른군',
    message: '긍정적 변화가 시작되었습니다. 여러 지표를 함께 관리하는 보완 계획이 필요합니다.',
  },
  0: {
    title: '다시 조정이 필요한 푸른군',
    message: '한 지표의 개선만으로는 충분하지 않습니다. 우선순위와 균형 기준을 다시 살펴보세요.',
  },
});

export default class SustainabilityEvaluationManager {
  static evaluate(gameState = {}) {
    const dimensions = DIMENSIONS.map((dimension) => ({
      ...dimension,
      passed: dimension.passes(gameState),
      valueText: dimension.value(gameState),
    }));
    const score = dimensions.filter((dimension) => dimension.passed).length;
    const outcome = FINAL_OUTCOMES[score] ?? FINAL_OUTCOMES[0];
    const remainingTitles = dimensions.filter((dimension) => !dimension.passed).map((dimension) => dimension.title);

    return {
      score,
      dimensions,
      outcome,
      remainingTitles,
    };
  }

  static formatFinalTakeaway(evaluation) {
    const remainingText = evaluation.remainingTitles.length
      ? `다음 보완: ${evaluation.remainingTitles.join(' · ')}`
      : '모든 균형 기준을 충족했습니다.';
    return `${evaluation.outcome.title} · ${evaluation.outcome.message}\n${remainingText}`;
  }

  static formatDimensionBody(dimension) {
    return [
      dimension.description,
      '',
      dimension.valueText,
      '',
      dimension.passed ? '✓ 지속 가능성 기준 충족' : '△ 다음 계획에서 보완 필요',
    ].join('\n');
  }
}
