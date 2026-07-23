export default class LearningApiPayloadManager {
  static formatEpisodeContext(episode) {
    if (!episode) {
      return null;
    }
    return {
      id: episode.id,
      code: episode.code,
      title: episode.title,
      short_title: episode.shortTitle,
      region_name: episode.regionName,
      theme: episode.theme,
    };
  }

  static buildSummaryPlacementContext(learningData) {
    const context = learningData.summary?.placementContext;
    return {
      placement_config_id: context?.placementConfigId ?? learningData.placementConfig?.id ?? null,
      placement_config_title: context?.placementConfigTitle ?? learningData.placementConfig?.title ?? null,
      required_placements: context?.requiredPlacements ?? learningData.placementConfig?.requiredPlacements ?? null,
      evaluation_profile_id: context?.evaluationProfileId ?? learningData.evaluationProfile?.id ?? null,
    };
  }

  static build(learningData) {
    const summaryPlacementContext = LearningApiPayloadManager.buildSummaryPlacementContext(learningData);

    return {
      schema_version: 1,
      episode_id: learningData.episode,
      episode_context: learningData.episodeContext ? {
        current: LearningApiPayloadManager.formatEpisodeContext(learningData.episodeContext.current),
        placement: LearningApiPayloadManager.formatEpisodeContext(learningData.episodeContext.placement),
      } : null,
      time_state: learningData.timeState ? {
        current_year: learningData.timeState.currentYear,
        turn: learningData.timeState.turn,
        last_event: learningData.timeState.lastEvent ?? null,
      } : null,
      episode_journey: Array.isArray(learningData.episodeJourney) ? [...learningData.episodeJourney] : [],
      completed: Boolean(learningData.completed),
      summary: learningData.summary ? {
        outcome_type: learningData.summary.outcomeType,
        outcome_message: learningData.summary.outcomeMessage,
        priority_issue: learningData.summary.priorityIssue,
        selected_policy_name: learningData.summary.selectedPolicyName,
        selected_strategy_title: learningData.summary.selectedStrategyTitle,
        placement_context: summaryPlacementContext,
        placement_count: learningData.summary.placementCount,
        next_action: learningData.summary.nextAction,
        sustainability_evaluation: learningData.summary.sustainabilityEvaluation ?? null,
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
        placement_config_id: learningData.selectedStrategy.placementConfigId ?? learningData.placementConfig?.id ?? null,
      } : null,
      placement_config: learningData.placementConfig ? {
        id: learningData.placementConfig.id,
        episode_id: learningData.placementConfig.episodeId,
        title: learningData.placementConfig.title,
        required_placements: learningData.placementConfig.requiredPlacements,
        state_keys: learningData.placementConfig.stateKeys,
        evaluation_profile_id: learningData.placementConfig.evaluationProfileId,
      } : null,
      evaluation_profile: learningData.evaluationProfile ? {
        id: learningData.evaluationProfile.id,
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
        ok: payload.episode_context == null || Boolean(payload.episode_context?.current?.code),
        label: '현재 에피소드 메타 확인',
        message: 'episode_context.current.code 값이 없습니다.',
      },
      {
        ok: payload.episode_context == null || Boolean(payload.episode_context?.placement?.code),
        label: '배치 에피소드 메타 확인',
        message: 'episode_context.placement.code 값이 없습니다.',
      },
      {
        ok: payload.time_state == null
          || (Number.isFinite(payload.time_state.current_year)
            && Number.isFinite(payload.time_state.turn)
            && (payload.time_state.last_event == null || typeof payload.time_state.last_event === 'object')),
        label: '시간 상태 구조 확인',
        message: 'time_state.current_year/turn 또는 last_event 구조가 올바르지 않습니다.',
      },
      {
        ok: payload.episode_journey == null
          || (Array.isArray(payload.episode_journey) && payload.episode_journey.every((entry) => typeof entry === 'string')),
        label: '에피소드 여정 배열 확인',
        message: 'episode_journey는 문자열 배열이어야 합니다.',
      },
      {
        ok: payload.summary == null || Boolean(payload.summary?.outcome_type),
        label: '요약 구조 확인',
        message: 'summary.outcome_type 값이 없습니다.',
      },
      {
        ok: payload.summary?.sustainability_evaluation == null
          || (Number.isFinite(payload.summary.sustainability_evaluation.score)
            && Boolean(payload.summary.sustainability_evaluation.outcome?.title)
            && Array.isArray(payload.summary.sustainability_evaluation.dimensions)),
        label: '지속 가능성 평가 구조 확인',
        message: 'summary.sustainability_evaluation 구조가 올바르지 않습니다.',
      },
      {
        ok: payload.summary?.placement_context == null || Boolean(payload.summary.placement_context.placement_config_id),
        label: '요약 배치 설정 확인',
        message: 'summary.placement_context.placement_config_id 값이 없습니다.',
      },
      {
        ok: payload.summary?.placement_context == null || Boolean(payload.summary.placement_context.evaluation_profile_id),
        label: '요약 평가 기준 확인',
        message: 'summary.placement_context.evaluation_profile_id 값이 없습니다.',
      },
      {
        ok: payload.summary?.placement_context?.placement_config_id == null
          || payload.placement_config?.id == null
          || payload.summary.placement_context.placement_config_id === payload.placement_config.id,
        label: '요약-배치 설정 연결 확인',
        message: 'summary.placement_context.placement_config_id와 placement_config.id가 다릅니다.',
      },
      {
        ok: payload.summary?.placement_context?.evaluation_profile_id == null
          || payload.evaluation_profile?.id == null
          || payload.summary.placement_context.evaluation_profile_id === payload.evaluation_profile.id,
        label: '요약-평가 프로필 연결 확인',
        message: 'summary.placement_context.evaluation_profile_id와 evaluation_profile.id가 다릅니다.',
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
        ok: payload.selected_policy == null || Boolean(payload.selected_policy?.id),
        label: '정책 선택 구조 확인',
        message: 'selected_policy.id 값이 없습니다.',
      },
      {
        ok: payload.selected_strategy == null || Boolean(payload.selected_strategy?.id),
        label: '배치 전략 구조 확인',
        message: 'selected_strategy.id 값이 없습니다.',
      },
      {
        ok: payload.placement_config == null || Boolean(payload.placement_config?.id),
        label: '배치 설정 ID 확인',
        message: 'placement_config.id 값이 없습니다.',
      },
      {
        ok: payload.placement_config == null || Number.isFinite(payload.placement_config?.required_placements),
        label: '배치 설정 요구 수 확인',
        message: 'placement_config.required_placements 값이 숫자가 아닙니다.',
      },
      {
        ok: payload.placement_config == null || Array.isArray(payload.placement_config?.state_keys),
        label: '배치 설정 상태 키 확인',
        message: 'placement_config.state_keys 배열이 없습니다.',
      },
      {
        ok: payload.evaluation_profile == null || Boolean(payload.evaluation_profile?.id),
        label: '평가 프로필 ID 확인',
        message: 'evaluation_profile.id 값이 없습니다.',
      },
      {
        ok: payload.selected_strategy?.placement_config_id == null
          || payload.placement_config?.id == null
          || payload.selected_strategy.placement_config_id === payload.placement_config.id,
        label: '전략-배치 설정 연결 확인',
        message: 'selected_strategy.placement_config_id와 placement_config.id가 다릅니다.',
      },
      {
        ok: payload.placement_config?.evaluation_profile_id == null
          || payload.evaluation_profile?.id == null
          || payload.placement_config.evaluation_profile_id === payload.evaluation_profile.id,
        label: '배치 설정-평가 프로필 연결 확인',
        message: 'placement_config.evaluation_profile_id와 evaluation_profile.id가 다릅니다.',
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
