export default class LearningApiPayloadManager {
  static build(learningData) {
    return {
      schema_version: 1,
      episode_id: learningData.episode,
      completed: Boolean(learningData.completed),
      summary: learningData.summary ? {
        outcome_type: learningData.summary.outcomeType,
        outcome_message: learningData.summary.outcomeMessage,
        priority_issue: learningData.summary.priorityIssue,
        selected_policy_name: learningData.summary.selectedPolicyName,
        selected_strategy_title: learningData.summary.selectedStrategyTitle,
        placement_count: learningData.summary.placementCount,
        next_action: learningData.summary.nextAction,
      } : null,
      learning_steps: {
        explored_places: learningData.exploredPlaces ?? [],
        data_viewed: Boolean(learningData.dataViewed),
        quiz_result: learningData.quizResult ? {
          question_id: learningData.quizResult.questionId,
          selected: learningData.quizResult.selected,
          correct: Boolean(learningData.quizResult.correct),
        } : null,
        problem_summary_completed: Boolean(learningData.problemSummaryCompleted),
        reflection_choice: learningData.reflectionChoice ? {
          id: learningData.reflectionChoice.id,
          title: learningData.reflectionChoice.title,
        } : null,
      },
      selected_policy: learningData.selectedPolicy ? {
        id: learningData.selectedPolicy.id,
        name: learningData.selectedPolicy.name,
      } : null,
      selected_strategy: learningData.selectedStrategy ? {
        id: learningData.selectedStrategy.id,
        title: learningData.selectedStrategy.title,
        state_focus: learningData.selectedStrategy.stateFocus,
        policy_id: learningData.selectedStrategy.policyId,
      } : null,
      placements: (learningData.placements ?? []).map((placement, index) => ({
        order: index + 1,
        building_id: placement.buildingId,
        building_name: placement.buildingName,
        position: placement.position,
        effect: placement.effect,
      })),
      final_state: learningData.gameState ?? null,
    };
  }

  static validate(payload) {
    return [
      {
        ok: payload.schema_version === 1,
        label: 'schema_version 확인',
        message: 'schema_version이 1이 아닙니다.',
      },
      {
        ok: Number.isFinite(payload.episode_id),
        label: 'episode_id 확인',
        message: 'episode_id가 숫자가 아닙니다.',
      },
      {
        ok: payload.summary == null || Boolean(payload.summary?.outcome_type),
        label: '요약 구조 확인',
        message: 'summary.outcome_type 값이 없습니다.',
      },
      {
        ok: Array.isArray(payload.learning_steps?.explored_places),
        label: '탐색 장소 배열 확인',
        message: 'explored_places 배열이 없습니다.',
      },
      {
        ok: payload.learning_steps?.quiz_result === null || Boolean(payload.learning_steps?.quiz_result?.selected),
        label: '퀴즈 결과 구조 확인',
        message: 'quiz_result.selected 값이 없습니다.',
      },
      {
        ok: payload.selected_policy === null || Boolean(payload.selected_policy.id),
        label: '정책 선택 구조 확인',
        message: 'selected_policy.id 값이 없습니다.',
      },
      {
        ok: payload.selected_strategy == null || Boolean(payload.selected_strategy.id),
        label: 'EP2 전략 구조 확인',
        message: 'selected_strategy.id 값이 없습니다.',
      },
      {
        ok: Array.isArray(payload.placements),
        label: '배치 기록 배열 확인',
        message: 'placements 배열이 없습니다.',
      },
      {
        ok: Array.isArray(payload.placements) && payload.placements.every((placement) => Number.isFinite(placement.order) && placement.building_id && placement.position),
        label: '배치 항목 구조 확인',
        message: '일부 배치 항목에 order/building_id/position이 없습니다.',
      },
      {
        ok: payload.final_state !== null && typeof payload.final_state === 'object',
        label: '최종 상태 구조 확인',
        message: 'final_state 객체가 없습니다.',
      },
    ];
  }
}
