import { EPISODE_IDS } from './episodes.js';
import SCENE_KEYS from './sceneKeys.js';

export const EPISODE_TRANSITIONS = Object.freeze({
  [EPISODE_IDS.PopulationRecovery]: Object.freeze({
    episodeId: EPISODE_IDS.PopulationRecovery,
    title: 'EP2. 인구 유입 전략',
    subtitle: '사람들이 다시 머물고 싶은 푸른군을 만들 시간입니다.',
    speaker: '시청 직원',
    dialogue: [
      '시장님! 큰일이에요. 푸른군의 인구가 계속 줄고 있어요.',
      '일자리와 생활 편의가 약해지면서 젊은 주민들이 떠나고 있습니다.',
      '이제 인구 유입 전략을 하나 정하고, 실제 시설 배치로 효과를 확인해야 합니다.',
    ],
    nextLabel: 'EP2 전략 살펴보기',
    nextScene: SCENE_KEYS.Ep2Briefing,
  }),
  [EPISODE_IDS.EconomyGrowth]: Object.freeze({
    episodeId: EPISODE_IDS.EconomyGrowth,
    title: 'EP3. 경제 성장',
    subtitle: '생활 기반 회복을 넘어, 지역에 지속적인 활력을 더합니다.',
    speaker: '시장',
    dialogue: [
      '주민이 머물 수 있는 기반을 마련했으니, 이제 푸른군에서 일할 기회도 늘려야 합니다.',
      '산업과 상권이 살아나면 경제는 성장하지만 새로운 부담도 함께 생길 수 있습니다.',
      '성장의 효과와 변화를 관찰하며 푸른군의 다음 선택을 준비합시다.',
    ],
    nextLabel: 'EP3 성장 미션 시작',
    nextScene: SCENE_KEYS.Ep3Preview,
  }),
  [EPISODE_IDS.SideEffects]: Object.freeze({
    episodeId: EPISODE_IDS.SideEffects,
    title: 'EP4. 성장의 부작용',
    subtitle: '성장 이후, 주민 생활에 나타난 변화를 확인합니다.',
    speaker: '주민 대표',
    dialogue: [
      '일자리와 방문객은 늘었지만 길이 막히고 공기가 답답하다는 목소리도 커지고 있어요.',
      '성장의 혜택이 모든 주민에게 고르게 닿고 있는지도 살펴봐야 합니다.',
      '교통, 환경, 소득 격차를 함께 확인하고 가장 두드러진 문제를 찾아봅시다.',
    ],
    nextLabel: 'EP4 변화 확인하기',
    nextScene: SCENE_KEYS.Ep4Briefing,
  }),
  [EPISODE_IDS.BalancedSolutions]: Object.freeze({
    episodeId: EPISODE_IDS.BalancedSolutions,
    title: 'EP5. 균형 해결',
    subtitle: '한 가지 문제를 줄이면서 푸른군 전체의 균형을 회복합니다.',
    speaker: '시장',
    dialogue: [
      '이제 한 문제만 고치는 것으로는 충분하지 않습니다.',
      '가장 큰 부담을 먼저 낮추되, 교통·환경·생활 격차가 함께 좋아지는 해결안을 만들어야 합니다.',
      '푸른군의 다음 장을 위한 균형 계획을 시작합시다.',
    ],
    nextLabel: 'EP5 해결안 준비',
    nextScene: SCENE_KEYS.Ep5Preview,
  }),
});

export function getEpisodeTransition(episodeId) {
  return EPISODE_TRANSITIONS[episodeId] ?? null;
}
