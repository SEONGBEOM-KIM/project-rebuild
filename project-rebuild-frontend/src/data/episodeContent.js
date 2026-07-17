import { DEFAULT_PLACEMENT_CONFIG_ID } from './episodePlacementConfigs.js';
export const EP1_DATA_CARDS = [
  {
    id: 'population_change',
    title: '푸른군 인구 변화',
    subtitle: '10년 전과 현재 비교',
    bars: [
      { label: '10년 전', value: 8000, max: 8000, color: 0x60a5fa },
      { label: '현재', value: 4200, max: 8000, color: 0xf87171 },
    ],
    takeaway: '지역 인구가 줄면 학교, 상점, 교통 같은 생활 기반도 약해질 수 있습니다.',
  },
  {
    id: 'regional_gap',
    title: '지역과 수도권의 차이',
    subtitle: '인구 이동 방향 이해하기',
    bars: [
      { label: '푸른군', value: 4200, max: 9000, color: 0xf87171 },
      { label: '수도권', value: 9000, max: 9000, color: 0x34d399 },
    ],
    takeaway: '한 지역의 감소만 보는 것이 아니라 지역 불균형도 함께 살펴봐야 합니다.',
  },
  {
    id: 'aging_ratio',
    title: '65세 이상 인구 비율',
    subtitle: '고령화가 생활 수요를 바꿈',
    bars: [
      { label: '10년 전', value: 18, max: 45, color: 0x93c5fd, suffix: '%' },
      { label: '현재', value: 39, max: 45, color: 0xfacc15, suffix: '%' },
    ],
    takeaway: '고령 주민이 늘면 의료, 교통, 복지 같은 시설의 중요성이 커집니다.',
  },
];

export const EP1_CORE_CONCEPT = '인구 감소는 단순히 사람 수가 줄어드는 문제가 아니라 교육, 경제, 교통, 복지 조건이 함께 흔들리는 지역 문제입니다.';

export const EP1_CAUSE_QUESTION = {
  id: 'ep1_q1_population_decline_reason',
  prompt: '푸른군의 인구가 줄어든 가장 큰 이유로 알맞은 것은?',
  choices: [
    {
      id: 'lack_jobs_services',
      text: '일자리와 생활 편의 시설이 부족하기 때문이다.',
      correct: true,
      feedback: '맞습니다. 일자리, 교통, 의료, 교육 같은 생활 조건이 약해지면 사람들이 다른 지역으로 이동할 가능성이 커집니다.',
    },
    {
      id: 'everyone_traveling',
      text: '사람들이 모두 긴 여행을 떠났기 때문이다.',
      correct: false,
      feedback: '여행은 일시적인 이동입니다. 푸른군의 문제는 오랜 기간 계속된 인구 유출과 생활 기반 약화입니다.',
    },
    {
      id: 'bad_weather',
      text: '지역의 날씨가 매일 나쁘기 때문이다.',
      correct: false,
      feedback: '날씨보다 일자리, 교통, 교육, 의료 같은 생활 조건이 인구 이동에 더 중요한 원인으로 제시되었습니다.',
    },
  ],
};

export const EP1_EXPLORATION_CLUES = [
  '• 학교: 학생 수 감소와 폐교 위기',
  '• 시장: 손님 감소와 빈 점포 증가',
  '• 교통: 버스 운행 감소와 이동 불편',
  '• 보건: 고령 주민 증가와 의료 수요',
  '• 주거: 빈집 증가와 인구 유출',
];


export const EP1_PROBLEM_ITEMS = [
  { id: 'population_decline', title: '인구 감소', detail: '젊은 세대가 줄고 지역에 머무는 사람이 감소합니다.', icon: '👥' },
  { id: 'aging', title: '고령화', detail: '의료·복지·교통 같은 생활 지원의 필요성이 커집니다.', icon: '👵' },
  { id: 'school_closure_risk', title: '학교 폐교 위기', detail: '학생 수 감소는 교육 시설 유지 문제로 이어집니다.', icon: '🏫' },
  { id: 'market_decline', title: '상권 침체', detail: '손님과 일자리가 줄어 지역 경제 활력이 약해집니다.', icon: '🏪' },
  { id: 'mobility_healthcare_gap', title: '교통·의료 불편', detail: '생활 기반 시설 이용이 어려워지면 정주 여건이 나빠집니다.', icon: '🚌' },
  { id: 'empty_houses', title: '빈집 증가', detail: '인구 유출은 주거 공백과 마을 관리 문제를 만듭니다.', icon: '🏚️' },
];

export const EP1_CORE_CAUSE_SUMMARY = '일자리와 생활 편의 시설 부족은 인구 유출과 지역 불균형으로 이어질 수 있습니다.';

export const EP1_NEXT_MISSION = [
  '이제 푸른군에 다시 사람들이 찾아오고, 주민이 계속 살고 싶어지는 조건을 고민합니다.',
  '',
  '다음 화면에서 회복 방향을 선택하고 시설 배치로 상태 변화를 확인합니다.',
];


export const EP1_NEXT_DEVELOPMENT_GOALS = [
  'EP1 지역 위기 탐색',
  '',
  '• 학교·시장·버스정류장 등 장소 클릭',
  '• 인구 감소 자료 카드 확인',
  '• 원인 파악 선택형 질문',
  '• 문제 정리 후 EP2 연결',
  '',
  '아직 실제 퀴즈·완성 콘텐츠는 다음 단계에서 확정합니다.',
];



export const EP2_MISSION_BRIEFING = {
  title: '인구 유입 전략',
  intro: [
    'EP1에서 푸른군의 인구 감소, 고령화, 상권 침체를 확인했습니다.',
    'EP2에서는 사람들이 다시 찾아오고 머물 수 있는 조건을 비교합니다.',
    '정책 선택과 시설 배치가 인구, 경제, 만족도, 예산에 어떤 영향을 주는지 살펴봅니다.',
  ],
  strategies: [
    {
      id: 'jobs_services',
      policyId: 'youth_living_support',
      placementConfigId: DEFAULT_PLACEMENT_CONFIG_ID,
      title: '일자리와 생활 기반',
      icon: '🏢',
      description: '청년센터, 상권 지원, 생활 편의 시설로 머물 이유를 만듭니다.',
      stateFocus: '인구↑ 경제↑ 예산↓',
      checkQuestion: '효과가 크지만 예산을 많이 쓰는 선택을 언제 우선할까요?',
      placementGoal: '청년센터와 상권 시설을 조합해 인구와 경제가 함께 오르는지 확인합니다.',
      placementGoalShort: '인구·경제 동시 개선',
      observationPoint: '예산 감소 폭이 커질 때 만족도와 경제 효과가 충분히 보상하는지 비교합니다.',
      observationPointShort: '예산 대비 효과',
      color: 0x38bdf8,
    },
    {
      id: 'housing_mobility',
      policyId: 'mobility_access',
      placementConfigId: DEFAULT_PLACEMENT_CONFIG_ID,
      title: '주거와 교통 접근성',
      icon: '🚌',
      description: '빈집 활용, 버스 연결, 이동 편의 개선으로 정주 조건을 높입니다.',
      stateFocus: '만족도↑ 교통 부담↓ 예산↓',
      checkQuestion: '이동이 편해지면 학교·시장·병원 이용은 어떻게 달라질까요?',
      placementGoal: '버스정류장과 생활 시설을 연결해 만족도와 교통 부담 변화를 확인합니다.',
      placementGoalShort: '이동·만족도 개선',
      observationPoint: '이동 편의가 높아질수록 의료·교육·시장 접근성이 어떻게 좋아지는지 살펴봅니다.',
      observationPointShort: '교통 부담 변화',
      color: 0xfacc15,
    },
    {
      id: 'balanced_growth',
      policyId: 'green_recovery',
      placementConfigId: DEFAULT_PLACEMENT_CONFIG_ID,
      title: '균형 성장',
      icon: '🌿',
      description: '개발 효과와 환경 부담을 함께 비교해 오래 지속되는 회복을 노립니다.',
      stateFocus: '환경 유지 만족도↑ 오염↓',
      checkQuestion: '인구와 경제만 높이면 어떤 부작용이 생길 수 있을까요?',
      placementGoal: '공원과 회복 시설을 섞어 환경 부담을 낮추면서 만족도를 유지합니다.',
      placementGoalShort: '환경·만족도 균형',
      observationPoint: '개발 효과가 커질 때 환경과 오염 지표가 함께 나빠지지 않는지 확인합니다.',
      observationPointShort: '오염 지표 변화',
      color: 0x4ade80,
    },
  ],
};

export const EP1_REFLECTION_CHOICES = [
  {
    id: 'population_economy',
    title: '인구·경제 보완',
    icon: '👥',
    description: '사람들이 돌아오고 일자리가 늘어나는 조건을 더 고민한다.',
    nextActionLabel: '일자리·생활 기반 비교',
    nextAction: '다음 개발에서는 일자리와 생활 기반 시설이 인구 회복에 함께 작동하는지 비교합니다.',
    color: 0x38bdf8,
  },
  {
    id: 'mobility_welfare',
    title: '교통·복지 보완',
    icon: '🚌',
    description: '주민이 학교, 시장, 병원에 쉽게 갈 수 있는 조건을 더 고민한다.',
    nextActionLabel: '이동·복지 접근성 확인',
    nextAction: '다음 개발에서는 이동 편의와 복지 접근성이 주민 만족도에 주는 영향을 확인합니다.',
    color: 0xfacc15,
  },
  {
    id: 'environment',
    title: '환경 보완',
    icon: '🌿',
    description: '개발 과정에서 환경과 오염 문제를 줄이는 방법을 더 고민한다.',
    nextActionLabel: '개발 효과와 환경 부담 비교',
    nextAction: '다음 개발에서는 개발 효과와 환경 부담을 동시에 낮추는 배치 조합을 찾습니다.',
    color: 0x4ade80,
  },
  {
    id: 'budget_balance',
    title: '예산 균형 보완',
    icon: '💰',
    description: '효과와 비용을 비교해 우선순위를 정하는 방법을 더 고민한다.',
    nextActionLabel: '예산 안의 우선순위 정하기',
    nextAction: '다음 개발에서는 예산 한도 안에서 효과가 큰 시설을 먼저 고르는 기준을 세웁니다.',
    color: 0xfb7185,
  },
];
