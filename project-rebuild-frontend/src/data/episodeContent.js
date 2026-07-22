import { DEFAULT_PLACEMENT_CONFIG_ID, ENVIRONMENT_PLACEMENT_CONFIG_ID, EP3_ECONOMY_PLACEMENT_CONFIG_ID } from './episodePlacementConfigs.js';
import { CURRENT_EPISODE, CURRENT_PLACEMENT_EPISODE, EPISODE_IDS } from './episodes.js';
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
  '다음은 인구 유입 전략을 비교합니다.',
];

export const EP2_NEXT_DEVELOPMENT_GOALS = [
  'EP3 경제 성장 예고',
  '',
  '• 지역 경제 상황 확인',
  '• 산업·일자리 정책 카드 비교',
  '• 산업 시설 배치 규칙 준비',
  '• 경제 성장 효과와 작은 불편 신호 확인',
  '',
  '다음 개발은 생활 기반 회복 이후 일자리와 산업 성장으로 확장합니다.',
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
      successChecks: [
        { key: 'population', label: '인구 1100 이상', min: 1100 },
        { key: 'economy', label: '경제 60 이상', min: 60 },
        { key: 'budget', label: '예산 500 이상 유지', min: 500 },
      ],
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
      successChecks: [
        { key: 'satisfaction', label: '만족도 75 이상', min: 75 },
        { key: 'traffic', label: '교통 부담 7 이하', max: 7 },
        { key: 'budget', label: '예산 500 이상 유지', min: 500 },
      ],
      color: 0xfacc15,
    },
    {
      id: 'balanced_growth',
      policyId: 'green_recovery',
      placementConfigId: ENVIRONMENT_PLACEMENT_CONFIG_ID,
      title: '균형 성장',
      icon: '🌿',
      description: '개발 효과와 환경 부담을 함께 비교해 오래 지속되는 회복을 노립니다.',
      stateFocus: '환경 유지 만족도↑ 오염↓',
      checkQuestion: '인구와 경제만 높이면 어떤 부작용이 생길 수 있을까요?',
      placementGoal: '공원과 회복 시설을 섞어 환경 부담을 낮추면서 만족도를 유지합니다.',
      placementGoalShort: '환경·만족도 균형',
      observationPoint: '개발 효과가 커질 때 환경과 오염 지표가 함께 나빠지지 않는지 확인합니다.',
      observationPointShort: '오염 지표 변화',
      successChecks: [
        { key: 'environment', label: '환경 85 이상', min: 85 },
        { key: 'pollution', label: '오염 10 이하', max: 10 },
        { key: 'budget', label: '예산 650 이상 유지', min: 650 },
      ],
      color: 0x4ade80,
    },
  ],
};


export const EP3_MISSION_PREVIEW = {
  title: '경제 성장 전략',
  placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
  intro: [
    'EP2에서 생활 기반과 정주 조건을 비교했습니다.',
    'EP3에서는 사람들이 오래 머물 수 있도록 일자리와 산업 성장을 실험합니다.',
    '경제 효과가 커질수록 교통, 소음, 환경 같은 작은 불편 신호도 함께 확인합니다.',
  ],
  focusAreas: [
    { id: 'jobs', title: '일자리 증가', icon: '🏭', stateFocus: '경제↑ 인구↑', note: '산업 시설이 지역에 새 일자리를 만드는지 확인합니다.' },
    { id: 'commerce', title: '상권 활성화', icon: '🏪', stateFocus: '경제↑ 만족도↑', note: '방문객과 소비 증가가 시장 활기로 이어지는지 확인합니다.' },
    { id: 'traffic_signal', title: '작은 불편 신호', icon: '🚚', stateFocus: '교통 부담↑ 오염 신호↑', note: '성장 과정에서 생기는 교통·소음 문제를 EP4 복선으로 기록합니다.' },
  ],
};

export const EP3_MISSION_BRIEFING = {
  title: '경제 성장 전략',
  placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
  intro: EP3_MISSION_PREVIEW.intro,
  strategies: [
    {
      id: 'industry_jobs_growth',
      policyId: 'local_industry_jobs',
      placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
      title: '지역 산업 일자리',
      icon: '🏭',
      description: '지역 자원과 가공 산업을 연결해 푸른군 안에서 일할 기회를 늘립니다.',
      stateFocus: '경제↑ 인구↑ 교통 부담↑',
      checkQuestion: '새 일자리가 늘어날 때 교통과 오염 신호는 어느 정도까지 감당할 수 있을까요?',
      placementGoal: '식품 가공 공장과 물류 시설을 조합해 경제 성장과 인구 유입 효과를 확인합니다.',
      placementGoalShort: '일자리 기반 성장',
      observationPoint: '경제 효과가 커지는 만큼 교통 부담과 오염 신호가 함께 증가하는지 비교합니다.',
      observationPointShort: '성장 대비 부담',
      successChecks: [
        { key: 'economy', label: '경제 90 이상', min: 90 },
        { key: 'population', label: '인구 1200 이상', min: 1200 },
        { key: 'budget', label: '예산 300 이상 유지', min: 300 },
      ],
      color: 0xfb923c,
    },
    {
      id: 'visitor_commerce_growth',
      policyId: 'visitor_economy',
      placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
      title: '방문 경제 활성화',
      icon: '🏪',
      description: '관광과 상권을 연결해 방문객 소비가 지역 경제와 만족도로 이어지게 합니다.',
      stateFocus: '경제↑ 만족도↑ 환경 부담↑',
      checkQuestion: '방문객이 늘어날 때 자연 공간과 주민 생활은 어떻게 보호해야 할까요?',
      placementGoal: '관광 단지와 산업 시설을 비교해 상권 활기와 환경 부담을 함께 관찰합니다.',
      placementGoalShort: '상권·방문객 성장',
      observationPoint: '만족도와 경제 효과가 오르는 동안 자연 공간 이용 부담이 커지는지 확인합니다.',
      observationPointShort: '상권 효과와 자연 부담',
      successChecks: [
        { key: 'economy', label: '경제 85 이상', min: 85 },
        { key: 'satisfaction', label: '만족도 75 이상', min: 75 },
        { key: 'pollution', label: '오염 16 이하', max: 16 },
      ],
      color: 0xa78bfa,
    },
    {
      id: 'logistics_growth_hub',
      policyId: 'distribution_growth',
      placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
      title: '유통 성장 거점',
      icon: '🚚',
      description: '도로망을 활용해 기업 활동과 유통 효율을 높이는 빠른 성장 경로입니다.',
      stateFocus: '경제↑ 교통 부담↑ 오염 신호↑',
      checkQuestion: '빠른 성장을 선택하면 도로 혼잡과 생활 불편을 어떻게 줄일 수 있을까요?',
      placementGoal: '물류 센터 중심 배치가 경제 효과를 빠르게 만들지만 어떤 부작용을 남기는지 확인합니다.',
      placementGoalShort: '물류 중심 성장',
      observationPoint: '경제 상승 폭과 함께 교통·오염 신호가 EP4 문제로 이어지는지 기록합니다.',
      observationPointShort: '빠른 성장의 부작용',
      successChecks: [
        { key: 'economy', label: '경제 95 이상', min: 95 },
        { key: 'traffic', label: '교통 부담 20 이하', max: 20 },
        { key: 'budget', label: '예산 300 이상 유지', min: 300 },
      ],
      color: 0x60a5fa,
    },
  ],
};

export const EP3_REFLECTION_CHOICES = [
  {
    id: 'jobs_quality',
    title: '일자리 질 보완',
    icon: '🏭',
    description: '경제 성장이 실제 주민 일자리와 정주 조건으로 이어지는지 더 확인한다.',
    nextActionLabel: '일자리 지속성 점검',
    nextAction: '다음 개발에서는 일자리 수뿐 아니라 이동 거리, 임금, 지역 상권 연결까지 함께 비교합니다.',
    color: 0x38bdf8,
  },
  {
    id: 'traffic_management',
    title: '교통 부담 보완',
    icon: '🚚',
    description: '물류와 방문객 증가가 도로 혼잡이나 생활 불편으로 이어지지 않게 조정한다.',
    nextActionLabel: '교통 완충 계획',
    nextAction: '다음 개발에서는 산업 시설 주변 도로, 대중교통, 주거지 거리 조건을 함께 점검합니다.',
    color: 0xfacc15,
  },
  {
    id: 'environment_guard',
    title: '환경 안전 보완',
    icon: '🌿',
    description: '산업 성장 과정에서 오염과 자연 훼손 신호가 커지지 않도록 관리한다.',
    nextActionLabel: '환경 영향 관리',
    nextAction: '다음 개발에서는 성장 시설과 녹지·하천 보호 조건을 함께 배치하는 기준을 세웁니다.',
    color: 0x4ade80,
  },
  {
    id: 'budget_return',
    title: '투자 효과 보완',
    icon: '💰',
    description: '큰 예산을 쓴 시설이 경제 효과와 주민 만족으로 충분히 돌아오는지 따져본다.',
    nextActionLabel: '예산 대비 성장 비교',
    nextAction: '다음 개발에서는 시설 비용, 경제 증가, 주민 만족 변화를 함께 비교하는 평가 기준을 만듭니다.',
    color: 0xfb7185,
  },
];

export const EP3_NEXT_DEVELOPMENT_GOALS = [
  'EP3 경제 성장 확장 목표',
  '',
  '• 산업 시설 효과와 부작용 비교',
  '• 일자리·상권·교통 부담의 연결 확인',
  '• 성장 이후 환경·예산 관리 기준 준비',
  '• 다음 에피소드에서 생활 불편과 지속 가능성 검토',
  '',
  '다음 개발은 성장 효과가 만든 새 문제를 균형 있게 조정하는 방향으로 확장합니다.',
];

export const EP4_MISSION_BRIEFING = {
  title: '부작용 발생',
  intro: [
    '경제 성장으로 일자리와 방문객은 늘었지만, 모든 변화가 긍정적인 것은 아닙니다.',
    '교통 혼잡, 환경 오염, 소득 격차는 함께 나타날 수 있으며 이전 선택에 따라 한 문제가 더 크게 드러납니다.',
    '이제 푸른군의 주민 생활에서 어떤 부담이 커졌는지 확인하고, 다음 해결 미션의 우선순위를 정합니다.',
  ],
  learningGoal: '성장의 긍정적 효과와 부작용이 함께 생길 수 있음을 이해하고, 균형 있는 해결이 필요한 이유를 설명합니다.',
  activitySteps: [
    '성장 이후 달라진 푸른군의 상태를 확인합니다.',
    '교통·환경·격차 문제를 비교하고 가장 두드러진 위험을 찾습니다.',
    '주민 생활과 지역 경제를 함께 지키기 위한 다음 해결 방향을 준비합니다.',
  ],
  nextEpisodeTitle: 'EP5. 문제 해결',
};

export const EP4_NEXT_DEVELOPMENT_GOALS = [
  'EP5 문제 해결 예고',
  '',
  '• 교통 혼잡 완화',
  '• 환경 오염 저감',
  '• 성장 혜택의 지역 공유',
  '',
  '다음 단계에서는 한 가지 문제만 줄이는 것이 아니라 푸른군 전체의 균형을 회복합니다.',
];

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


export const EPISODE_CONTENT = Object.freeze({
  [EPISODE_IDS.Crisis]: Object.freeze({
    dataCards: EP1_DATA_CARDS,
    coreConcept: EP1_CORE_CONCEPT,
    causeQuestion: EP1_CAUSE_QUESTION,
    explorationClues: EP1_EXPLORATION_CLUES,
    problemItems: EP1_PROBLEM_ITEMS,
    coreCauseSummary: EP1_CORE_CAUSE_SUMMARY,
    nextMission: EP1_NEXT_MISSION,
    nextDevelopmentGoals: EP1_NEXT_DEVELOPMENT_GOALS,
    reflectionChoices: EP1_REFLECTION_CHOICES,
  }),
  [EPISODE_IDS.PopulationRecovery]: Object.freeze({
    missionBriefing: EP2_MISSION_BRIEFING,
    nextDevelopmentGoals: EP2_NEXT_DEVELOPMENT_GOALS,
    nextEpisodeId: EPISODE_IDS.EconomyGrowth,
  }),
  [EPISODE_IDS.EconomyGrowth]: Object.freeze({
    missionPreview: EP3_MISSION_PREVIEW,
    missionBriefing: EP3_MISSION_BRIEFING,
    reflectionChoices: EP3_REFLECTION_CHOICES,
    nextDevelopmentGoals: EP3_NEXT_DEVELOPMENT_GOALS,
    nextEpisodeId: EPISODE_IDS.SideEffects,
  }),
  [EPISODE_IDS.SideEffects]: Object.freeze({
    missionBriefing: EP4_MISSION_BRIEFING,
    nextDevelopmentGoals: EP4_NEXT_DEVELOPMENT_GOALS,
  }),
});

export function getEpisodeContent(episodeCode = CURRENT_EPISODE.code) {
  return EPISODE_CONTENT[episodeCode] ?? EPISODE_CONTENT[CURRENT_EPISODE.code];
}

export function getReflectionChoices(episodeCode = CURRENT_EPISODE.code) {
  return getEpisodeContent(episodeCode).reflectionChoices ?? getCurrentEpisodeContent().reflectionChoices ?? [];
}

export function getNextDevelopmentGoals(episodeCode = CURRENT_PLACEMENT_EPISODE.code) {
  return getEpisodeContent(episodeCode).nextDevelopmentGoals ?? getCurrentEpisodeContent().nextDevelopmentGoals ?? [];
}

export function getCurrentEpisodeContent() {
  return getEpisodeContent(CURRENT_EPISODE.code);
}

export function getCurrentPlacementEpisodeContent() {
  return getEpisodeContent(CURRENT_PLACEMENT_EPISODE.code);
}

export function getCurrentPlacementMissionBriefing() {
  return getCurrentPlacementEpisodeContent().missionBriefing;
}

export function getCurrentPlacementNextDevelopmentGoals() {
  return getCurrentPlacementEpisodeContent().nextDevelopmentGoals ?? getCurrentEpisodeContent().nextDevelopmentGoals ?? [];
}

export function getNextEpisodeContent(episodeCode = CURRENT_PLACEMENT_EPISODE.code) {
  const nextEpisodeId = getEpisodeContent(episodeCode).nextEpisodeId;
  return nextEpisodeId ? getEpisodeContent(nextEpisodeId) : null;
}
