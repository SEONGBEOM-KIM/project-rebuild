export const ep5SolutionPlans = [
  {
    id: 'mobility_green_network',
    title: '이동·녹지 연결 계획',
    icon: '🚌',
    primaryRiskId: 'traffic',
    description: '대중교통과 보행 연결을 먼저 보완하고, 녹지와 생활 접근성을 함께 높입니다.',
    balanceChecks: ['교통 혼잡 완화', '오염 저감 동선', '주거지 접근성'],
    safeguards: '도로만 넓히지 않고 대중교통·녹지·생활권 접근성을 함께 점검합니다.',
    color: 0xfacc15,
  },
  {
    id: 'clean_growth_guardrails',
    title: '친환경 성장 기준',
    icon: '🌿',
    primaryRiskId: 'environment',
    description: '오염 저감과 녹지 보호를 우선하고, 산업·물류의 이동 부담과 주민 혜택도 함께 관리합니다.',
    balanceChecks: ['환경 오염 저감', '물류·교통 부담 관리', '지역 일자리 연결'],
    safeguards: '개발을 멈추는 대신 환경 기준과 주민 생활 기준을 함께 세웁니다.',
    color: 0x4ade80,
  },
  {
    id: 'inclusive_local_benefits',
    title: '생활 혜택 공유 계획',
    icon: '🤝',
    primaryRiskId: 'inequality',
    description: '성장 혜택이 주민 생활과 지역 일자리로 이어지게 하고, 이동·환경 부담도 함께 줄입니다.',
    balanceChecks: ['생활 혜택의 지역 공유', '대중교통 접근성', '환경 안전 기준'],
    safeguards: '지원만 늘리지 않고 생활권, 이동, 환경 조건을 함께 비교합니다.',
    color: 0xa78bfa,
  },
];

export function getEp5SolutionPlan(planId) {
  return ep5SolutionPlans.find((plan) => plan.id === planId) ?? null;
}
