import { explorationPlaces } from '../data/explorationPlaces.js';
import { CURRENT_EPISODE, CURRENT_PLACEMENT_EPISODE } from '../data/episodes.js';
import { getCurrentPlacementMissionBriefing } from '../data/episodeContent.js';
import IssueDetector from './IssueDetector.js';
import LearningProgress from './LearningProgress.js';
import EndingSummaryManager from './EndingSummaryManager.js';
import Ep2BriefingViewManager from './Ep2BriefingViewManager.js';
import PlacementContextManager from './PlacementContextManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class LearningDataManager {
  static build(registry) {
    const progress = LearningProgress.get(registry);
    const quizResult = registry.get(REGISTRY_KEYS.quizResult);
    const selectedPolicy = registry.get(REGISTRY_KEYS.selectedPolicy);
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(getCurrentPlacementMissionBriefing(), registry.get(REGISTRY_KEYS.selectedPlacementStrategy) ?? progress.selectedStrategyId, selectedPolicy?.id);
    const { placementConfig, evaluationProfile } = PlacementContextManager.resolve({
      registry,
      progress,
      selectedStrategy,
    });
    const placedBuildings = registry.get(REGISTRY_KEYS.placedBuildings) ?? [];
    const gameState = registry.get(REGISTRY_KEYS.gameState);
    const reflectionChoice = registry.get(REGISTRY_KEYS.reflectionChoice);
    const issues = IssueDetector.detect(gameState, evaluationProfile);
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings, evaluationProfile);
    const exploredPlaceNames = explorationPlaces
      .filter((place) => progress.exploredPlaces.includes(place.id))
      .map((place) => place.name);

    return {
      episode: progress.episode,
      episodeContext: {
        current: LearningDataManager.serializeEpisode(CURRENT_EPISODE),
        placement: LearningDataManager.serializeEpisode(CURRENT_PLACEMENT_EPISODE),
      },
      summary: LearningDataManager.buildSummary({
        ending,
        issues,
        selectedPolicy,
        selectedStrategy,
        placedBuildings,
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
      placements: placedBuildings.map((record) => ({
        buildingId: record.building.id,
        buildingName: record.building.name,
        position: record.position,
        effect: record.delta,
      })),
      gameState,
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

  static buildSummary({ ending, issues, selectedPolicy, selectedStrategy, placedBuildings, reflectionChoice, placementConfig = null, evaluationProfile = null }) {
    const priorityIssue = issues[0] ?? null;
    return {
      outcomeType: ending.title,
      outcomeMessage: ending.message,
      priorityIssue: priorityIssue ? {
        id: priorityIssue.id,
        title: priorityIssue.title,
      } : null,
      selectedPolicyName: selectedPolicy?.name ?? null,
      selectedStrategyTitle: selectedStrategy?.title ?? null,
      placementContext: LearningDataManager.buildPlacementContextSummary(placementConfig, evaluationProfile),
      placementCount: placedBuildings.length,
      nextAction: reflectionChoice ? {
        id: reflectionChoice.id,
        title: reflectionChoice.title,
        label: reflectionChoice.nextActionLabel ?? reflectionChoice.title,
      } : null,
    };
  }

  static hasSelectedStrategy(data) {
    return Boolean(data.selectedStrategy?.id)
      || Boolean(Ep2BriefingViewManager.findStrategyByPolicyId(getCurrentPlacementMissionBriefing(), data.selectedPolicy?.id));
  }

  static validate(data) {
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
        ok: data.episodeContext == null || data.episodeContext.placement?.code === CURRENT_PLACEMENT_EPISODE.code,
        label: '배치 에피소드 메타 확인',
        message: 'episodeContext.placement 값이 현재 배치 에피소드와 다릅니다.',
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
        label: 'EP2 전략 선택',
        message: '선택한 EP2 전략이 없습니다.',
      },
      {
        ok: Array.isArray(data.placements) && data.placements.length >= 3,
        label: '시설 배치 3개 이상',
        message: '배치 기록이 3개 미만입니다.',
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
