import { EPISODE_IDS } from '../data/episodes.js';
import IssueDetector from './IssueDetector.js';

const INDUSTRIAL_BUILDING_IDS = new Set(['food_factory', 'logistics_center', 'tour_complex']);

const RISK_LEVELS = Object.freeze({
  low: { rank: 1, label: '관찰 필요' },
  medium: { rank: 2, label: '주의' },
  high: { rank: 3, label: '집중 대응' },
});

export default class IndustrializationRiskManager {
  static detect({ gameState, placedBuildings = [], placementEpisodeId = null, evaluationProfile = null } = {}) {
    if (placementEpisodeId !== EPISODE_IDS.EconomyGrowth) {
      return IssueDetector.detect(gameState, evaluationProfile ?? undefined);
    }

    const industrialCount = placedBuildings.filter((record) => INDUSTRIAL_BUILDING_IDS.has(record.building?.id)).length;
    const risks = [
      IndustrializationRiskManager.createTrafficRisk(gameState),
      IndustrializationRiskManager.createEnvironmentRisk(gameState),
      IndustrializationRiskManager.createInequalityRisk(gameState, industrialCount),
    ];
    const primaryRiskId = IndustrializationRiskManager.getPrimaryRisk(risks).id;
    return risks.map((risk) => ({ ...risk, primary: risk.id === primaryRiskId }));
  }

  static getLevel(key) {
    return RISK_LEVELS[key];
  }

  static getPrimaryRisk(risks) {
    return [...risks].sort((a, b) => b.impact - a.impact || b.severity.rank - a.severity.rank)[0];
  }

  static summarize(risks = []) {
    const primaryRisk = risks.find((risk) => risk.primary) ?? risks[0] ?? null;
    const serializeRisk = (risk) => ({
      id: risk.id,
      title: risk.title,
      shortMessage: risk.shortMessage,
      primary: Boolean(risk.primary),
      impact: risk.impact ?? 0,
      severity: risk.severity ? { ...risk.severity } : null,
    });

    return {
      primaryRisk: primaryRisk ? serializeRisk(primaryRisk) : null,
      risks: risks.map(serializeRisk),
    };
  }

  static createTrafficRisk(gameState) {
    const level = gameState.traffic >= 20 ? 'high' : gameState.traffic >= 15 ? 'medium' : 'low';
    return IndustrializationRiskManager.createRisk({
      id: 'traffic', level, color: 0xfacc15, impact: Math.max(0, gameState.traffic - 10),
      title: '교통 혼잡',
      shortMessage: '산업 시설과 이동량 증가를 함께 점검',
      message: level === 'high' ? '산업 시설 선택으로 차량과 물류 이동이 크게 늘어 교통 혼잡이 가장 두드러집니다.' : '산업화가 진행되면 통근과 물류 이동이 늘어 교통 부담이 생길 수 있습니다.',
      cause: '시설의 위치와 물류량이 늘면 지역 도로와 대중교통의 부담이 커집니다.',
      nextAction: '대중교통, 보행 연결, 물류 동선 분산을 함께 검토합니다.',
    });
  }

  static createEnvironmentRisk(gameState) {
    const level = gameState.pollution >= 20 || gameState.environment < 60 ? 'high' : gameState.pollution >= 15 || gameState.environment < 70 ? 'medium' : 'low';
    return IndustrializationRiskManager.createRisk({
      id: 'environment', level, color: 0x22c55e, impact: Math.max(0, gameState.pollution - 10, 80 - gameState.environment),
      title: '환경 오염',
      shortMessage: '개발 효과와 환경 부담을 함께 점검',
      message: level === 'high' ? '산업 시설과 개발 밀도가 높아져 오염과 환경 부담이 가장 크게 나타납니다.' : '산업화는 경제 효과와 함께 오염·자연 공간 부담을 만들 수 있습니다.',
      cause: '생산·물류·방문객 활동이 늘면 오염 관리와 자연 공간 보호가 필요해집니다.',
      nextAction: '녹지, 오염 저감 시설, 환경 기준을 함께 검토합니다.',
    });
  }

  static createInequalityRisk(gameState, industrialCount) {
    const economyGain = gameState.economy - 50;
    const satisfactionGain = gameState.satisfaction - 60;
    const inequality = gameState.inequality ?? 30;
    const level = inequality >= 50 || (industrialCount >= 2 && economyGain >= 50 && satisfactionGain <= 5)
      ? 'high'
      : inequality >= 40 || (industrialCount >= 1 && economyGain >= 25)
        ? 'medium'
        : 'low';
    return IndustrializationRiskManager.createRisk({
      id: 'inequality', level, color: 0xa78bfa, impact: Math.max(0, economyGain - Math.max(0, satisfactionGain)) + industrialCount * 2 + Math.max(0, inequality - 25) * 2,
      title: '소득 격차',
      shortMessage: '성장 혜택이 주민에게 고르게 닿는지 점검',
      message: level === 'high' ? '경제 수치는 크게 올랐지만 생활 만족도 개선이 따라가지 못해 성장 혜택의 격차가 가장 두드러집니다.' : '산업화의 경제 효과가 모든 주민의 생활 개선으로 이어지는지 확인해야 합니다.',
      cause: '새 일자리와 상권 효과가 특정 지역·계층에만 집중되면 생활 격차가 커질 수 있습니다.',
      nextAction: '생활 기반, 접근성, 지역 일자리 연결 정책을 함께 검토합니다.',
    });
  }

  static createRisk({ id, level, color, impact = 0, title, shortMessage, message, cause, nextAction }) {
    return { id, title, shortMessage, message, cause, nextAction, color, impact, severity: IndustrializationRiskManager.getLevel(level) };
  }
}
