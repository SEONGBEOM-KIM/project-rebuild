import { EPISODE_IDS } from './episodes.js';

export const EPISODE_ACTIVITY_FLOWS = Object.freeze({
  [EPISODE_IDS.Crisis]: Object.freeze({
    episodeId: EPISODE_IDS.Crisis,
    learningGoal: '인구 감소가 일자리·생활 기반·지역 불균형과 연결된 지역 문제임을 설명합니다.',
    activitySteps: Object.freeze([
      { id: 'explore', label: '지역 탐색', description: '학교·시장·교통 등 변화한 장소를 살펴봅니다.' },
      { id: 'evidence', label: '자료 확인', description: '인구 변화와 고령화 자료를 비교합니다.' },
      { id: 'cause', label: '원인 정리', description: '인구 유출의 원인을 생활 조건과 연결합니다.' },
    ]),
    completionFocus: '문제를 발견하고 다음 회복 미션에 필요한 질문을 만들었습니다.',
    nextEpisodeId: EPISODE_IDS.PopulationRecovery,
  }),
  [EPISODE_IDS.PopulationRecovery]: Object.freeze({
    episodeId: EPISODE_IDS.PopulationRecovery,
    learningGoal: '인구 유입을 위한 전략을 비교하고 시설 배치가 지역 상태를 어떻게 바꾸는지 해석합니다.',
    activitySteps: Object.freeze([
      { id: 'strategy', label: '전략 선택', description: '일자리·교통·환경 중 우선 회복 방향을 정합니다.' },
      { id: 'placement', label: '시설 배치', description: '선택한 전략에 맞는 시설 조합을 실험합니다.' },
      { id: 'compare', label: '결과 비교', description: '내 전략의 영향과 다른 전략의 차이를 확인합니다.' },
    ]),
    completionFocus: '생활 기반 회복이 인구 유입 조건에 주는 영향을 확인했습니다.',
    nextEpisodeId: EPISODE_IDS.EconomyGrowth,
  }),
  [EPISODE_IDS.EconomyGrowth]: Object.freeze({
    episodeId: EPISODE_IDS.EconomyGrowth,
    learningGoal: '산업과 일자리 성장이 경제 효과와 생활 부담을 함께 만들 수 있음을 이해합니다.',
    activitySteps: Object.freeze([
      { id: 'growth-plan', label: '성장 방향', description: '일자리·관광·유통 중심 성장 방향을 비교합니다.' },
      { id: 'industry-placement', label: '산업 배치', description: '산업 시설의 경제 효과와 비용을 실험합니다.' },
      { id: 'risk-record', label: '변화 기록', description: '교통·환경·소득 격차 신호를 함께 확인합니다.' },
    ]),
    completionFocus: '성장 효과와 부작용은 동시에 나타날 수 있음을 확인했습니다.',
    nextEpisodeId: EPISODE_IDS.SideEffects,
  }),
  [EPISODE_IDS.SideEffects]: Object.freeze({
    episodeId: EPISODE_IDS.SideEffects,
    learningGoal: '성장 이후의 교통·환경·소득 격차 문제를 비교하고 균형 해결이 필요한 이유를 설명합니다.',
    activitySteps: Object.freeze([
      { id: 'risk-check', label: '위험 확인', description: '성장 이후 달라진 지역 상태를 확인합니다.' },
      { id: 'risk-compare', label: '문제 비교', description: '세 가지 부작용이 서로 어떻게 연결되는지 살펴봅니다.' },
      { id: 'solution-prepare', label: '해결 준비', description: '가장 큰 문제를 우선 보완할 균형 기준을 정리합니다.' },
    ]),
    completionFocus: '한 문제만 줄이는 방식보다 여러 지표를 함께 관리하는 해결이 필요합니다.',
    nextEpisodeId: EPISODE_IDS.BalancedSolutions,
  }),
  [EPISODE_IDS.BalancedSolutions]: Object.freeze({
    episodeId: EPISODE_IDS.BalancedSolutions,
    learningGoal: '가장 두드러진 문제를 우선 해결하면서 지역 전체의 균형을 회복하는 계획을 만듭니다.',
    activitySteps: Object.freeze([
      { id: 'solution-plan', label: '해결안 선택', description: '우선 보완할 문제와 함께 관리할 지표를 정합니다.' },
      { id: 'balanced-placement', label: '균형 배치', description: '교통·환경·생활 격차를 함께 고려해 시설을 배치합니다.' },
      { id: 'final-evaluation', label: '최종 평가', description: '성장과 삶의 질이 함께 좋아졌는지 확인합니다.' },
    ]),
    completionFocus: '푸른군의 성장을 지속할 수 있는 균형 해결안을 완성했습니다.',
    nextEpisodeId: null,
  }),
});

export function getEpisodeActivityFlow(episodeId) {
  return EPISODE_ACTIVITY_FLOWS[episodeId] ?? null;
}
