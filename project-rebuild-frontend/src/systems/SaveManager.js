export const LEARNING_SAVE_STORAGE_KEY = 'project-rebuild:learning-save:v1';

export default class SaveManager {
  static save(data) {
    const payload = {
      savedAt: new Date().toISOString(),
      version: 1,
      data,
    };
    window.localStorage.setItem(LEARNING_SAVE_STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  static load() {
    const raw = window.localStorage.getItem(LEARNING_SAVE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }


  static importJsonText(jsonText) {
    const parsed = JSON.parse(jsonText);
    const data = SaveManager.normalizeImportedData(parsed?.data ?? parsed);
    if (!SaveManager.isLearningDataShape(data)) {
      throw new Error('학습 데이터 JSON 형식이 아닙니다.');
    }
    return SaveManager.save(data);
  }

  static normalizeImportedData(data) {
    if (SaveManager.isLearningDataShape(data)) {
      return data;
    }
    if (SaveManager.isApiPayloadShape(data)) {
      return SaveManager.fromApiPayload(data);
    }
    return data;
  }

  static isLearningDataShape(data) {
    return Boolean(
      data
      && typeof data === 'object'
      && Number.isFinite(data.episode)
      && Array.isArray(data.exploredPlaces)
      && Array.isArray(data.placements)
    );
  }

  static isApiPayloadShape(data) {
    return Boolean(
      data
      && typeof data === 'object'
      && Number.isFinite(data.episode_id)
      && Array.isArray(data.learning_steps?.explored_places)
      && Array.isArray(data.placements)
    );
  }

  static fromApiPayload(payload) {
    return {
      episode: payload.episode_id,
      episodeContext: SaveManager.fromApiEpisodeContext(payload.episode_context),
      summary: SaveManager.fromApiSummary(payload.summary),
      exploredPlaces: payload.learning_steps.explored_places,
      dataViewed: Boolean(payload.learning_steps.data_viewed),
      quizResult: SaveManager.fromApiQuizResult(payload.learning_steps.quiz_result),
      problemSummaryCompleted: Boolean(payload.learning_steps.problem_summary_completed),
      selectedPolicy: SaveManager.fromApiPolicy(payload.selected_policy),
      selectedStrategy: SaveManager.fromApiStrategy(payload.selected_strategy),
      placementConfig: SaveManager.fromApiPlacementConfig(payload.placement_config),
      evaluationProfile: SaveManager.fromApiEvaluationProfile(payload.evaluation_profile),
      placements: payload.placements.map((placement) => ({
        buildingId: placement.building_id,
        buildingName: placement.building_name,
        position: placement.position,
        effect: placement.effect,
      })),
      gameState: payload.final_state ?? null,
      reflectionChoice: SaveManager.fromApiReflectionChoice(payload.learning_steps.reflection_choice),
      completed: Boolean(payload.completed),
    };
  }

  static fromApiEpisodeContext(episodeContext) {
    if (!episodeContext) {
      return null;
    }
    return {
      current: SaveManager.fromApiEpisodeMetadata(episodeContext.current),
      placement: SaveManager.fromApiEpisodeMetadata(episodeContext.placement),
    };
  }

  static fromApiEpisodeMetadata(episode) {
    if (!episode) {
      return null;
    }
    return {
      id: episode.id,
      code: episode.code,
      title: episode.title,
      shortTitle: episode.short_title,
      regionName: episode.region_name,
      theme: episode.theme,
    };
  }

  static fromApiSummary(summary) {
    if (!summary) {
      return null;
    }
    return {
      outcomeType: summary.outcome_type,
      outcomeMessage: summary.outcome_message,
      priorityIssue: summary.priority_issue,
      selectedPolicyName: summary.selected_policy_name,
      selectedStrategyTitle: summary.selected_strategy_title,
      placementCount: summary.placement_count,
      nextAction: summary.next_action,
    };
  }

  static fromApiQuizResult(quizResult) {
    if (!quizResult) {
      return null;
    }
    return {
      questionId: quizResult.question_id,
      selected: quizResult.selected,
      correct: Boolean(quizResult.correct),
    };
  }

  static fromApiPolicy(policy) {
    if (!policy) {
      return null;
    }
    return {
      id: policy.id,
      name: policy.name,
    };
  }

  static fromApiStrategy(strategy) {
    if (!strategy) {
      return null;
    }
    return {
      id: strategy.id,
      title: strategy.title,
      stateFocus: strategy.state_focus,
      policyId: strategy.policy_id,
      placementConfigId: strategy.placement_config_id ?? null,
    };
  }

  static fromApiPlacementConfig(placementConfig) {
    if (!placementConfig) {
      return null;
    }
    return {
      id: placementConfig.id,
      episodeId: placementConfig.episode_id,
      title: placementConfig.title,
      requiredPlacements: placementConfig.required_placements,
      stateKeys: placementConfig.state_keys,
      evaluationProfileId: placementConfig.evaluation_profile_id,
    };
  }

  static fromApiEvaluationProfile(evaluationProfile) {
    if (!evaluationProfile) {
      return null;
    }
    return {
      id: evaluationProfile.id,
    };
  }

  static fromApiReflectionChoice(reflectionChoice) {
    if (!reflectionChoice) {
      return null;
    }
    return {
      id: reflectionChoice.id,
      title: reflectionChoice.title,
    };
  }

  static clear() {
    window.localStorage.removeItem(LEARNING_SAVE_STORAGE_KEY);
  }

  static hasSave() {
    return Boolean(window.localStorage.getItem(LEARNING_SAVE_STORAGE_KEY));
  }
}
