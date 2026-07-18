export const API_CONTRACT = {
  method: 'POST',
  endpoint: '/api/learning-records/',
  contentType: 'application/json',
  schemaVersion: 1,
  requestExample: {
    schema_version: 1,
    episode_id: 1,
    episode_context: {
      current: {
        id: 1,
        code: 'ep1',
        title: '푸른군 지역 회복 프로젝트',
        short_title: 'EP1. 지역 위기 탐색',
        region_name: '푸른군',
        theme: '인구 감소와 생활 기반 약화',
      },
      placement: {
        id: 2,
        code: 'ep2',
        title: '푸른군 인구 유입 전략',
        short_title: 'EP2. 인구 유입 전략',
        region_name: '푸른군',
        theme: '인구 유입 조건과 지속 가능한 회복',
      },
    },
    completed: true,
    summary: {
      outcome_type: '환경 우선 회복안',
      outcome_message: '생활 환경 개선 효과가 뚜렷합니다.',
      priority_issue: null,
      selected_policy_name: '녹색 회복 계획',
      selected_strategy_title: '균형 성장',
      placement_count: 1,
      next_action: {
        id: 'environment',
        title: '환경 보완',
        label: '개발 효과와 환경 부담 비교',
      },
    },
    learning_steps: {
      explored_places: ['school', 'market', 'bus_stop'],
      data_viewed: true,
      quiz_result: {
        question_id: 'ep1_q1_population_decline_reason',
        selected: 'lack_jobs_services',
        correct: true,
      },
      problem_summary_completed: true,
      reflection_choice: {
        id: 'budget_balance',
        title: '예산 균형 보완',
      },
    },
    selected_policy: {
      id: 'green_recovery',
      name: '녹색 회복 계획',
    },
    selected_strategy: {
      id: 'balanced_growth',
      title: '균형 성장',
      state_focus: '환경 유지 만족도↑ 오염↓',
      policy_id: 'green_recovery',
      placement_config_id: 'ep2_population_recovery',
    },
    placement_config: {
      id: 'ep2_population_recovery',
      episode_id: 'ep2',
      title: '푸른군 인구 회복 배치 실험',
      required_placements: 3,
      state_keys: ['population', 'economy', 'environment', 'satisfaction', 'budget', 'traffic', 'pollution'],
      evaluation_profile_id: 'ep2_population_recovery_default',
    },
    evaluation_profile: {
      id: 'ep2_population_recovery_default',
    },
    placements: [
      {
        order: 1,
        building_id: 'small_park',
        building_name: '작은 공원',
        position: { x: 6, y: 1 },
        effect: { environment: 12 },
      },
    ],
    final_state: {
      population: 1000,
      economy: 50,
      environment: 92,
      satisfaction: 74,
      budget: 860,
      traffic: 10,
      pollution: 6,
    },
  },
  successResponseExample: {
    id: 123,
    student_id: 45,
    episode_id: 1,
    episode_context: {
      current: {
        id: 1,
        code: 'ep1',
        title: '푸른군 지역 회복 프로젝트',
        short_title: 'EP1. 지역 위기 탐색',
        region_name: '푸른군',
        theme: '인구 감소와 생활 기반 약화',
      },
      placement: {
        id: 2,
        code: 'ep2',
        title: '푸른군 인구 유입 전략',
        short_title: 'EP2. 인구 유입 전략',
        region_name: '푸른군',
        theme: '인구 유입 조건과 지속 가능한 회복',
      },
    },
    completed: true,
    created_at: '2026-07-12T10:00:00+09:00',
    updated_at: '2026-07-12T10:00:00+09:00',
  },
  errorResponseExample: {
    error: 'validation_error',
    fields: {
      episode_id: ['This field is required.'],
      placements: ['At least one placement is required.'],
    },
  },
};

export function formatContractRequest() {
  return `${API_CONTRACT.method} ${API_CONTRACT.endpoint}\nContent-Type: ${API_CONTRACT.contentType}\n\n${JSON.stringify(API_CONTRACT.requestExample, null, 2)}`;
}

export function formatContractResponse() {
  return `201 Created\n${JSON.stringify(API_CONTRACT.successResponseExample, null, 2)}\n\n400 Bad Request\n${JSON.stringify(API_CONTRACT.errorResponseExample, null, 2)}`;
}
