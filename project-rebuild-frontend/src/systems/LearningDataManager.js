import { explorationPlaces } from '../data/explorationPlaces.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import IndustrializationRiskManager from './IndustrializationRiskManager.js';
import LearningProgress from './LearningProgress.js';
import EndingSummaryManager from './EndingSummaryManager.js';
import EpisodeFlowManager from './EpisodeFlowManager.js';
import PlacementContextManager from './PlacementContextManager.js';
import WorldStateManager from './WorldStateManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class LearningDataManager {
  static build(registry) {
    const progress = LearningProgress.get(registry);
    const quizResult = registry.get(REGISTRY_KEYS.quizResult);
    const selectedPolicy = registry.get(REGISTRY_KEYS.selectedPolicy);
    const selectedStrategy = EpisodeFlowManager.resolveSelectedStrategy({ registry, learningProgress: progress, selectedPolicy });
    const { placementConfig, evaluationProfile } = PlacementContextManager.resolve({
      registry,
      progress,
      selectedStrategy,
    });
    const placementEpisode = EpisodeFlowManager.resolveActivePlacementEpisode({
      registry,
      learningProgress: progress,
      placementConfig,
    });
    const placedBuildings = registry.get(REGISTRY_KEYS.placedBuildings) ?? [];
    const placements = placedBuildings.map((record) => ({
      buildingId: record.building.id,
      buildingName: record.building.name,
      episodeId: record.episodeId ?? placementConfig.episodeId,
      position: record.position,
      effect: record.delta,
    }));
    const gameState = registry.get(REGISTRY_KEYS.gameState);
    const reflectionChoice = registry.get(REGISTRY_KEYS.reflectionChoice);
    const issues = IndustrializationRiskManager.detect({
      gameState,
      placedBuildings,
      placementEpisodeId: placementEpisode.code,
      evaluationProfile,
    });
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings, evaluationProfile);
    const exploredPlaceNames = explorationPlaces
      .filter((place) => progress.exploredPlaces.includes(place.id))
      .map((place) => place.name);

    return {
      episode: progress.episode,
      episodeContext: {
        current: LearningDataManager.serializeEpisode(CURRENT_EPISODE),
        placement: LearningDataManager.serializeEpisode(placementEpisode),
      },
      summary: LearningDataManager.buildSummary({
        ending,
        issues,
        selectedPolicy,
        selectedStrategy,
        placementCount: placements.length,
        placementBreakdown: WorldStateManager.getPlacementBreakdown(placements, placementConfig.episodeId),
        reflectionChoice,
        placementConfig,
        evaluationProfile,
      }),
      exploredPlaces: progress.exploredPlaces,
      exploredPlaceNames,
      dataViewed: progress.dataViewed,
      quizResult: quizResult ?? progress.quizResult,
      problemSummaryCompleted: progress.problemSummaryCompleted,
      selectedPolicy: selectedPolicy ? {
        id: selectedPolicy.id,
        name: selectedPolicy.name,
      } : null,
      selectedStrategy: selectedStrategy ? {
        id: selectedStrategy.id,
        title: selectedStrategy.title,
        stateFocus: selectedStrategy.stateFocus,
        policyId: selectedStrategy.policyId,
        placementConfigId: placementConfig.id,
      } : null,
      placementConfig: {
        id: placementConfig.id,
        episodeId: placementConfig.episodeId,
        title: placementConfig.title,
        requiredPlacements: placementConfig.requiredPlacements,
        stateKeys: placementConfig.stateKeys,
        evaluationProfileId: placementConfig.evaluationProfileId,
      },
      evaluationProfile: {
        id: evaluationProfile.id,
      },
      placements,
      gameState,
      // The learning-record API intentionally stays focused on the current episode.
      // Local saves also carry this optional snapshot so later episodes can resume
      // the shared Blue County state after a refresh or import.
      worldState: WorldStateManager.get(registry),
      reflectionChoice,
      completed: progress.completed,
    };
  }

  static serializeEpisode(episode) {
    return {
      id: episode.id,
      code: episode.code,
      title: episode.title,
      shortTitle: episode.shortTitle,
      regionName: episode.regionName,
      theme: episode.theme,
    };
  }

  static buildPlacementContextSummary(placementConfig, evaluationProfile) {
    return {
      placementConfigId: placementConfig?.id ?? null,
      placementConfigTitle: placementConfig?.title ?? null,
      requiredPlacements: placementConfig?.requiredPlacements ?? null,
      evaluationProfileId: evaluationProfile?.id ?? null,
    };
  }

  static buildSummary({ ending, issues, selectedPolicy, selectedStrategy, placementCount, placementBreakdown, reflectionChoice, placementConfig = null, evaluationProfile = null }) {
    const priorityIssue = issues.find((issue) => issue.primary) ?? issues[0] ?? null;
    return {
      outcomeType: ending.title,
      outcomeMessage: ending.message,
      priorityIssue: priorityIssue ? {
        id: priorityIssue.id,
        title: priorityIssue.title,
      } : null,
      sideEffectRisks: IndustrializationRiskManager.summarize(issues),
      selectedPolicyName: selectedPolicy?.name ?? null,
      selectedStrategyTitle: selectedStrategy?.title ?? null,
      placementContext: LearningDataManager.buildPlacementContextSummary(placementConfig, evaluationProfile),
      placementCount,
      placementBreakdown,
      nextAction: reflectionChoice ? {
        id: reflectionChoice.id,
        title: reflectionChoice.title,
        label: reflectionChoice.nextActionLabel ?? reflectionChoice.title,
      } : null,
    };
  }

  static hasSelectedStrategy(data) {
    return Boolean(data.selectedStrategy?.id)
      || Boolean(EpisodeFlowManager.resolveSelectedStrategyFromLearningData(data, data.selectedPolicy));
  }

  static getRequiredPlacements(data) {
    return data?.summary?.placementContext?.requiredPlacements
      ?? data?.placementConfig?.requiredPlacements
      ?? 3;
  }

  static validate(data) {
    const requiredPlacements = LearningDataManager.getRequiredPlacements(data);
    const expectedPlacementEpisode = EpisodeFlowManager.resolveActivePlacementEpisode({
      placementConfig: data.placementConfig,
    });
    return [
      {
        ok: data.episode === 1,
        label: 'episode 값 확인',
        message: 'episode 값이 EP1로 저장되지 않았습니다.',
      },
      {
        ok: data.episodeContext == null || data.episodeContext.current?.code === CURRENT_EPISODE.code,
        label: '현재 에피소드 메타 확인',
        message: 'episodeContext.current 값이 현재 에피소드와 다릅니다.',
      },
      {
        ok: data.episodeContext == null || data.episodeContext.placement?.code === expectedPlacementEpisode.code,
        label: '배치 에피소드 메타 확인',
        message: 'episodeContext.placement 값이 배치 설정의 에피소드와 다릅니다.',
      },
      {
        ok: Boolean(data.summary?.outcomeType),
        label: '학습 결론 요약',
        message: 'summary.outcomeType 결론 요약이 없습니다.',
      },
      {
        ok: data.summary?.placementContext == null || Boolean(data.summary.placementContext.placementConfigId),
        label: '요약 배치 설정 확인',
        message: 'summary.placementContext.placementConfigId 값이 없습니다.',
      },
      {
        ok: data.summary?.placementContext == null || Boolean(data.summary.placementContext.evaluationProfileId),
        label: '요약 평가 기준 확인',
        message: 'summary.placementContext.evaluationProfileId 값이 없습니다.',
      },
      {
        ok: data.summary?.placementContext?.placementConfigId == null
          || data.placementConfig?.id == null
          || data.summary.placementContext.placementConfigId === data.placementConfig.id,
        label: '요약-배치 설정 연결 확인',
        message: 'summary.placementContext.placementConfigId와 placementConfig.id가 다릅니다.',
      },
      {
        ok: data.summary?.placementContext?.evaluationProfileId == null
          || data.evaluationProfile?.id == null
          || data.summary.placementContext.evaluationProfileId === data.evaluationProfile.id,
        label: '요약-평가 프로필 연결 확인',
        message: 'summary.placementContext.evaluationProfileId와 evaluationProfile.id가 다릅니다.',
      },
      {
        ok: Array.isArray(data.exploredPlaces) && data.exploredPlaces.length >= 3,
        label: '탐색 장소 3곳 이상',
        message: '탐색 장소 기록이 3곳 미만입니다.',
      },
      {
        ok: data.dataViewed === true,
        label: '자료 확인 완료',
        message: '자료 확인 완료 기록이 없습니다.',
      },
      {
        ok: Boolean(data.quizResult?.selected),
        label: '원인 질문 응답 기록',
        message: '퀴즈 선택 기록이 없습니다.',
      },
      {
        ok: data.problemSummaryCompleted === true,
        label: '문제 정리 완료',
        message: '문제 정리 완료 기록이 없습니다.',
      },
      {
        ok: Boolean(data.selectedPolicy?.id),
        label: '회복 방향 선택',
        message: '선택한 회복 방향이 없습니다.',
      },
      {
        ok: LearningDataManager.hasSelectedStrategy(data),
        label: '배치 전략 선택',
        message: '선택한 배치 전략이 없습니다.',
      },
      {
        ok: data.selectedStrategy?.placementConfigId == null
          || data.placementConfig?.id == null
          || data.selectedStrategy.placementConfigId === data.placementConfig.id,
        label: '전략-배치 설정 연결 확인',
        message: 'selectedStrategy.placementConfigId와 placementConfig.id가 다릅니다.',
      },
      {
        ok: data.placementConfig?.evaluationProfileId == null
          || data.evaluationProfile?.id == null
          || data.placementConfig.evaluationProfileId === data.evaluationProfile.id,
        label: '배치 설정-평가 프로필 연결 확인',
        message: 'placementConfig.evaluationProfileId와 evaluationProfile.id가 다릅니다.',
      },
      {
        ok: Array.isArray(data.placements) && data.placements.length >= requiredPlacements,
        label: `시설 배치 ${requiredPlacements}개 이상`,
        message: `배치 기록이 ${requiredPlacements}개 미만입니다.`,
      },
      {
        ok: Boolean(data.reflectionChoice?.id),
        label: '생각 정리 선택',
        message: '생각 정리 선택 기록이 없습니다.',
      },
      {
        ok: data.completed === true,
        label: 'EP1 완료 여부',
        message: 'EP1 완료 플래그가 true가 아닙니다.',
      },
    ];
  }

  static isReadyToSave(data) {
    return LearningDataManager.validate(data).every((row) => row.ok);
  }
}
