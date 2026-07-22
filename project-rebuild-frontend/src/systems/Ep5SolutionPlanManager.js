export default class Ep5SolutionPlanManager {
  static getPrimaryRisk(risks = []) {
    return risks.find((risk) => risk.primary) ?? risks[0] ?? null;
  }

  static getRecommendedPlanId(risks = []) {
    return Ep5SolutionPlanManager.getPrimaryRisk(risks)?.id ?? null;
  }

  static isRecommended(plan, risks = []) {
    return plan.primaryRiskId === Ep5SolutionPlanManager.getRecommendedPlanId(risks);
  }

  static formatIntroText(preview, primaryRisk = null) {
    const recommendation = primaryRisk
      ? `이번 푸른군에서는 ${primaryRisk.title}이 가장 두드러졌습니다. 이를 우선 보완하되 세 문제를 함께 관리할 계획을 고르세요.`
      : '가장 필요한 해결 방향을 고르되 세 문제를 함께 관리할 계획을 세우세요.';
    return [...preview.intro, '', recommendation].join('\n');
  }

  static formatPlanBody(plan) {
    return [plan.description, '', '함께 관리할 기준', ...plan.balanceChecks.map((check) => `• ${check}`), '', `균형 장치: ${plan.safeguards}`].join('\n');
  }

  static formatSelectionStatus(plan, selectedPlanId, risks) {
    if (plan.id === selectedPlanId) return '선택한 해결안';
    if (Ep5SolutionPlanManager.isRecommended(plan, risks)) return '현재 결과에 추천';
    return '클릭해서 비교';
  }
}
