import { getEvaluationProfile } from '../data/evaluationRules.js';

export default class IssueDetector {
  static detect(gameState, evaluationProfile = getEvaluationProfile()) {
    const issues = [];
    const issueThresholds = evaluationProfile.issueThresholds;

    if (gameState.environment < issueThresholds.environmentMin || gameState.pollution >= issueThresholds.pollutionMax) {
      issues.push({
        id: 'environment',
        title: '환경 주의',
        shortMessage: '환경 보전 대책 필요',
        message: '개발 효과와 함께 환경 보전 대책을 검토해야 합니다.',
        cause: '환경 수치가 낮거나 오염 수치가 높아지면 주민 삶의 질이 떨어질 수 있습니다.',
        nextAction: '공원, 녹지, 오염 완화 정책처럼 환경을 회복하는 선택을 검토합니다.',
        color: 0x22c55e,
      });
    }

    if (gameState.traffic >= issueThresholds.trafficMax) {
      issues.push({
        id: 'traffic',
        title: '교통 불편',
        shortMessage: '이동 편의 개선 필요',
        message: '인구 유입 전에 이동 편의 시설이 더 필요할 수 있습니다.',
        cause: '사람이 늘거나 시설이 생겨도 이동이 어려우면 생활 만족도가 낮아질 수 있습니다.',
        nextAction: '버스정류장, 도로 연결, 대중교통 개선처럼 이동 편의를 높이는 선택을 검토합니다.',
        color: 0xfacc15,
      });
    }

    if (gameState.inequality >= issueThresholds.inequalityMax) {
      issues.push({
        id: 'inequality',
        title: '소득 격차 주의',
        shortMessage: '성장 혜택의 지역 공유 필요',
        message: '성장 효과가 주민 생활에 고르게 이어지도록 보완해야 합니다.',
        cause: '일자리·상권·서비스 혜택이 일부 지역에 집중되면 생활 격차가 커질 수 있습니다.',
        nextAction: '지역 일자리, 생활 서비스, 이동 접근성을 함께 높이는 선택을 검토합니다.',
        color: 0xa78bfa,
      });
    }

    if (gameState.budget < issueThresholds.budgetMin) {
      issues.push({
        id: 'budget',
        title: '예산 부족',
        shortMessage: '비용 균형 검토 필요',
        message: '좋은 시설도 비용이 크면 다음 선택의 폭이 줄어듭니다.',
        cause: '예산이 부족하면 추가 정책이나 시설을 선택하기 어려워질 수 있습니다.',
        nextAction: '효과가 큰 시설과 비용이 낮은 시설을 비교하며 우선순위를 정합니다.',
        color: 0xfb7185,
      });
    }

    if (gameState.satisfaction < issueThresholds.satisfactionMin) {
      issues.push({
        id: 'satisfaction',
        title: '만족도 보완',
        shortMessage: '생활 편의 개선 필요',
        message: '주민이 체감할 생활 편의 개선을 더 고민해야 합니다.',
        cause: '시설이 늘어도 주민이 실제로 편리함을 느끼지 못하면 정착 효과가 약해질 수 있습니다.',
        nextAction: '교통, 휴식 공간, 복지 시설처럼 주민 체감도가 높은 선택을 검토합니다.',
        color: 0xa78bfa,
      });
    }

    return issues;
  }

  static formatRows(gameState, emptyMessage = '큰 부작용 신호 없음', evaluationProfile = getEvaluationProfile()) {
    const issues = IssueDetector.detect(gameState, evaluationProfile);
    return issues.length
      ? issues.map((issue) => `• ${issue.title}: ${issue.shortMessage}`)
      : [`• ${emptyMessage}`];
  }
}
