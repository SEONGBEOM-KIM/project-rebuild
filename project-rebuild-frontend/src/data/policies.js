import { buildings } from './buildings.js';

function getBuildingNames(buildingIds) {
  return buildingIds.map((buildingId) => buildings.find((building) => building.id === buildingId)?.name ?? buildingId);
}

const policyDefinitions = [
  {
    id: 'youth_living_support',
    name: '청년 생활 지원',
    tagline: '젊은 세대가 머물 이유 만들기',
    description: '청년센터와 생활 편의 지원을 묶어 젊은 세대가 돌아올 조건을 만드는 전략입니다.',
    focus: ['인구', '만족도'],
    recommendedBuildingIds: ['youth_center', 'bus_station'],
    note: 'EP2 전략: 일자리와 생활 기반을 먼저 보완해 인구 유입 가능성을 높입니다.',
    color: 0x38bdf8,
  },
  {
    id: 'mobility_access',
    name: '이동 편의 개선',
    tagline: '학교·시장·보건소까지 쉽게 이동하기',
    description: '버스 연결과 이동 편의를 높여 학교·시장·보건소 접근성을 개선하는 전략입니다.',
    focus: ['교통', '만족도'],
    recommendedBuildingIds: ['bus_station', 'small_park'],
    note: 'EP2 전략: 주거와 교통 접근성을 보완해 계속 살기 쉬운 조건을 만듭니다.',
    color: 0xfacc15,
  },
  {
    id: 'green_recovery',
    name: '녹색 회복 계획',
    tagline: '개발과 환경 보전의 균형 잡기',
    description: '개발 효과와 환경 부담을 함께 비교해 지속 가능한 회복을 노리는 전략입니다.',
    focus: ['환경', '오염', '만족도'],
    recommendedBuildingIds: ['small_park', 'youth_center'],
    note: 'EP2 전략: 성장 효과와 환경 보전을 함께 비교해 장기 균형을 지킵니다.',
    color: 0x4ade80,
  },
];

export const policies = policyDefinitions.map((policy) => ({
  ...policy,
  recommendedBuildings: getBuildingNames(policy.recommendedBuildingIds),
}));
