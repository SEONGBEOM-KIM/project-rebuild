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

export const CURRENT_EPISODE = {
  id: 1,
  code: 'ep1',
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
};
