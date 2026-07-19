import { economyBuildings } from './economyBuildings.js';

function getEconomyBuildingNames(buildingIds) {
  return buildingIds.map((buildingId) => economyBuildings.find((building) => building.id === buildingId)?.name ?? buildingId);
}

const economyPolicyDefinitions = [
  {
    id: 'local_industry_jobs',
    name: '지역 산업 일자리',
    tagline: '지역 자원으로 일자리 만들기',
    description: '식품 가공 공장과 물류 기반을 활용해 지역 안에서 일할 기회를 늘리는 전략입니다.',
    focus: ['경제', '인구', '일자리'],
    recommendedBuildingIds: ['food_factory', 'logistics_center'],
    note: 'EP3 전략: 경제 성장과 인구 유입 효과를 크게 만들되 교통 부담을 함께 관찰합니다.',
    color: 0xfb923c,
  },
  {
    id: 'visitor_economy',
    name: '방문 경제 활성화',
    tagline: '관광과 상권 회복 연결하기',
    description: '관광 단지와 지역 상권 효과를 연결해 방문객과 소비를 늘리는 전략입니다.',
    focus: ['경제', '만족도', '방문객'],
    recommendedBuildingIds: ['tour_complex', 'food_factory'],
    note: 'EP3 전략: 상권 활성화 효과와 자연 공간 이용 부담을 함께 비교합니다.',
    color: 0xa78bfa,
  },
  {
    id: 'distribution_growth',
    name: '유통 성장 거점',
    tagline: '교통망을 활용한 빠른 경제 회복',
    description: '물류 센터를 중심으로 기업 활동과 유통 효율을 높이는 성장 전략입니다.',
    focus: ['경제', '교통', '오염 신호'],
    recommendedBuildingIds: ['logistics_center', 'food_factory'],
    note: 'EP3 전략: 경제 효과는 빠르지만 교통·오염 신호가 EP4 문제로 이어질 수 있습니다.',
    color: 0x60a5fa,
  },
];

export const economyPolicies = economyPolicyDefinitions.map((policy) => ({
  ...policy,
  recommendedBuildings: getEconomyBuildingNames(policy.recommendedBuildingIds),
}));
