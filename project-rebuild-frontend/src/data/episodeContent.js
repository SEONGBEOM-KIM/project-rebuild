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


export const EP1_REFLECTION_CHOICES = [
  {
    id: 'population_economy',
    title: '인구·경제 보완',
    icon: '👥',
    description: '사람들이 돌아오고 일자리가 늘어나는 조건을 더 고민한다.',
    color: 0x38bdf8,
  },
  {
    id: 'mobility_welfare',
    title: '교통·복지 보완',
    icon: '🚌',
    description: '주민이 학교, 시장, 병원에 쉽게 갈 수 있는 조건을 더 고민한다.',
    color: 0xfacc15,
  },
  {
    id: 'environment',
    title: '환경 보완',
    icon: '🌿',
    description: '개발 과정에서 환경과 오염 문제를 줄이는 방법을 더 고민한다.',
    color: 0x4ade80,
  },
  {
    id: 'budget_balance',
    title: '예산 균형 보완',
    icon: '💰',
    description: '효과와 비용을 비교해 우선순위를 정하는 방법을 더 고민한다.',
    color: 0xfb7185,
  },
];
