export const EPISODE_STEPS = [
  { key: 'exploration', label: '탐색' },
  { key: 'data', label: '자료' },
  { key: 'quiz', label: '원인' },
  { key: 'summary', label: '정리' },
  { key: 'selection', label: '방향' },
  { key: 'placement', label: '배치' },
  { key: 'result', label: '결과' },
  { key: 'ending', label: '마무리' },
];

export const EPISODE_IDS = Object.freeze({
  Crisis: 'ep1',
  PopulationRecovery: 'ep2',
  EconomyGrowth: 'ep3',
  SideEffects: 'ep4',
  BalancedSolutions: 'ep5',
});

export const EPISODES = Object.freeze({
  [EPISODE_IDS.Crisis]: {
    id: 1,
    code: EPISODE_IDS.Crisis,
    title: '푸른군 지역 회복 프로젝트',
    shortTitle: 'EP1. 지역 위기 탐색',
    regionName: '푸른군',
    theme: '인구 감소와 생활 기반 약화',
    requiredExploredCount: 3,
    intro: [
      '푸른군은 인구가 줄고 상권의 활기가 사라지고 있습니다.',
      '여러분은 지역 회복 프로젝트 담당자가 되어',
      '사람들이 다시 머물고 싶은 지역을 만들 준비를 시작합니다.',
      '',
      '먼저 마을의 문제를 살펴본 뒤 회복 방향을 정하고 시설을 배치합니다.',
    ],
  },
  [EPISODE_IDS.PopulationRecovery]: {
    id: 2,
    code: EPISODE_IDS.PopulationRecovery,
    title: '푸른군 인구 유입 전략',
    shortTitle: 'EP2. 인구 유입 전략',
    regionName: '푸른군',
    theme: '인구 유입 조건과 지속 가능한 회복',
    requiredExploredCount: 0,
    intro: [
      'EP1에서 확인한 지역 위기를 바탕으로 회복 방향을 선택합니다.',
      '정책과 시설 배치를 통해 사람들이 다시 머물 조건을 실험합니다.',
    ],
  },
  [EPISODE_IDS.EconomyGrowth]: {
    id: 3,
    code: EPISODE_IDS.EconomyGrowth,
    title: '푸른군 경제 성장 전략',
    shortTitle: 'EP3. 경제 성장',
    regionName: '푸른군',
    theme: '산업과 일자리 중심의 지역 활성화',
    requiredExploredCount: 0,
    intro: [
      '생활 기반이 조금씩 회복된 뒤에는 일자리와 경제 활력이 필요합니다.',
      '산업 시설과 성장 전략이 인구, 경제, 교통에 어떤 변화를 만드는지 살펴봅니다.',
    ],
  },
  [EPISODE_IDS.SideEffects]: {
    id: 4,
    code: EPISODE_IDS.SideEffects,
    title: '푸른군 성장의 부작용',
    shortTitle: 'EP4. 부작용 발생',
    regionName: '푸른군',
    theme: '성장과 삶의 질 사이의 균형',
    requiredExploredCount: 0,
    intro: [
      '산업과 관광 개발로 푸른군은 활기를 되찾았습니다.',
      '하지만 성장의 효과와 함께 주민 생활에 새로운 부담도 나타나기 시작했습니다.',
    ],
  },
  [EPISODE_IDS.BalancedSolutions]: {
    id: 5,
    code: EPISODE_IDS.BalancedSolutions,
    title: '푸른군 균형 해결 프로젝트',
    shortTitle: 'EP5. 문제 해결',
    regionName: '푸른군',
    theme: '성장과 삶의 질을 함께 지키는 해결',
    requiredExploredCount: 0,
    intro: [
      '푸른군의 성장을 멈추는 대신, 성장의 혜택과 부담을 더 공정하고 안전하게 조정할 차례입니다.',
      '한 문제를 먼저 해결하되, 다른 문제를 키우지 않는 균형안을 설계합니다.',
    ],
  },
});

export const CURRENT_EPISODE = EPISODES[EPISODE_IDS.Crisis];
export const CURRENT_PLACEMENT_EPISODE = EPISODES[EPISODE_IDS.PopulationRecovery];

export function getEpisode(episodeCodeOrId = CURRENT_EPISODE.code) {
  if (typeof episodeCodeOrId === 'number') {
    return Object.values(EPISODES).find((episode) => episode.id === episodeCodeOrId) ?? CURRENT_EPISODE;
  }
  return EPISODES[episodeCodeOrId] ?? CURRENT_EPISODE;
}

export function getEpisodeStep(stepKey) {
  return EPISODE_STEPS.find((step) => step.key === stepKey) ?? null;
}
