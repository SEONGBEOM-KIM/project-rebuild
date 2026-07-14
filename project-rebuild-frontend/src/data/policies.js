import { buildings } from './buildings.js';

function getBuildingNames(buildingIds) {
  return buildingIds.map((buildingId) => buildings.find((building) => building.id === buildingId)?.name ?? buildingId);
}

const policyDefinitions = [
  {
    id: 'youth_living_support',
    name: '청년 생활 지원',
    tagline: '젊은 세대가 머물 이유 만들기',
    description: '주거·일자리 상담과 생활 지원을 묶어 청년 유입 가능성을 높이는 방향입니다.',
    focus: ['인구', '만족도'],
    recommendedBuildingIds: ['youth_center', 'bus_station'],
    note: '이번 UI 검증에서는 정책 선택이 상태값을 직접 바꾸지는 않습니다.',
    color: 0x38bdf8,
  },
  {
    id: 'mobility_access',
    name: '이동 편의 개선',
    tagline: '학교·시장·보건소까지 쉽게 이동하기',
    description: '교통 접근성을 높여 고령 주민과 학생이 생활 시설을 이용하기 쉽게 만드는 방향입니다.',
    focus: ['교통', '만족도'],
    recommendedBuildingIds: ['bus_station', 'small_park'],
    note: '도로 인접 조건을 확인하며 배치하는 연습에 적합합니다.',
    color: 0xfacc15,
  },
  {
    id: 'green_recovery',
    name: '녹색 회복 계획',
    tagline: '개발과 환경 보전의 균형 잡기',
    description: '생활 환경을 회복하고 주민 만족을 높이는 시설을 우선 검토하는 방향입니다.',
    focus: ['환경', '오염', '만족도'],
    recommendedBuildingIds: ['small_park', 'youth_center'],
    note: '숲·강 인접 조건을 확인하며 배치하는 연습에 적합합니다.',
    color: 0x4ade80,
  },
];

export const policies = policyDefinitions.map((policy) => ({
  ...policy,
  recommendedBuildings: getBuildingNames(policy.recommendedBuildingIds),
}));
