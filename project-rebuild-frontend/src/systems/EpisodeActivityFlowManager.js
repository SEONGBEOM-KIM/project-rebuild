import { getEpisodeActivityFlow } from '../data/episodeActivityFlows.js';
import { EPISODE_IDS } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import LearningProgress from './LearningProgress.js';
import StateHudManager from './StateHudManager.js';
import WorldStateManager from './WorldStateManager.js';

export default class EpisodeActivityFlowManager {
  static get(episodeId) {
    return getEpisodeActivityFlow(episodeId);
  }

  static getNextEpisodeId(episodeId) {
    return EpisodeActivityFlowManager.get(episodeId)?.nextEpisodeId ?? null;
  }

  static getProgress(episodeId, registry = null) {
    const flow = EpisodeActivityFlowManager.get(episodeId);
    if (!flow) {
      return { steps: [], completedCount: 0, activeIndex: -1 };
    }

    const progress = registry ? LearningProgress.get(registry) : {};
    const worldState = registry ? WorldStateManager.get(registry) : {};
    const completedEpisodeIds = new Set(worldState.completedEpisodeIds ?? []);
    const episodePlacements = (worldState.placements ?? []).filter((record) => record.episodeId === episodeId);
    const reviewedRiskIds = progress.reviewedRiskIds ?? [];
    const stepCompletion = {
      [EPISODE_IDS.Crisis]: {
        explore: (progress.exploredPlaces ?? []).length >= 3,
        evidence: Boolean(progress.dataViewed),
        cause: Boolean(progress.quizResult),
      },
      [EPISODE_IDS.PopulationRecovery]: {
        strategy: Boolean(progress.selectedStrategyId),
        placement: episodePlacements.length > 0,
        compare: completedEpisodeIds.has(EPISODE_IDS.PopulationRecovery),
      },
      [EPISODE_IDS.EconomyGrowth]: {
        'growth-plan': Boolean(progress.selectedStrategyId),
        'industry-placement': episodePlacements.length > 0,
        'risk-record': completedEpisodeIds.has(EPISODE_IDS.EconomyGrowth),
      },
      [EPISODE_IDS.SideEffects]: {
        'risk-check': reviewedRiskIds.length > 0,
        'risk-compare': reviewedRiskIds.length >= 3,
        'solution-prepare': Boolean(progress.ep4InvestigationCompleted),
      },
      [EPISODE_IDS.BalancedSolutions]: {
        'solution-plan': Boolean(progress.selectedSolutionPlanId),
        'balanced-placement': episodePlacements.length > 0,
        'final-evaluation': completedEpisodeIds.has(EPISODE_IDS.BalancedSolutions),
      },
      [EPISODE_IDS.SustainabilityEvaluation]: {
        review: [EPISODE_IDS.PopulationRecovery, EPISODE_IDS.EconomyGrowth, EPISODE_IDS.SideEffects, EPISODE_IDS.BalancedSolutions]
          .every((id) => completedEpisodeIds.has(id)),
        evaluate: Boolean(worldState.episodeRuns?.[EPISODE_IDS.SustainabilityEvaluation]?.metadata?.sustainabilityEvaluation),
        conclude: completedEpisodeIds.has(EPISODE_IDS.SustainabilityEvaluation),
      },
    }[episodeId] ?? {};
    const steps = flow.activitySteps.map((step) => ({
      ...step,
      completed: Boolean(stepCompletion[step.id]),
    }));
    const activeIndex = steps.findIndex((step) => !step.completed);
    return {
      steps,
      completedCount: steps.filter((step) => step.completed).length,
      activeIndex: activeIndex === -1 ? steps.length - 1 : activeIndex,
    };
  }

  static formatActivityRows(episodeId, { registry = null, showStatus = false } = {}) {
    const progress = EpisodeActivityFlowManager.getProgress(episodeId, registry);
    return progress.steps.map((step, index) => {
      if (!showStatus) {
        return `${index + 1}. ${step.label} — ${step.description}`;
      }
      const status = step.completed ? '완료' : index === progress.activeIndex ? '진행' : '예정';
      return `${status} ${index + 1}. ${step.label} — ${step.description}`;
    });
  }

  static formatCarryoverSummary(worldState = {}) {
    const completedEpisodeIds = worldState.completedEpisodeIds ?? [];
    const placements = worldState.placements ?? [];
    if (!completedEpisodeIds.length) {
      return null;
    }

    const facilityNames = [...new Set(
      placements.map((record) => record.building?.name ?? record.buildingName ?? record.buildingId).filter(Boolean),
    )];
    const facilityText = facilityNames.length
      ? `이전 시설 ${placements.length}개: ${facilityNames.slice(0, 3).join(' · ')}`
      : '이전 시설 기록 없음';
    const stateText = worldState.gameState
      ? StateHudManager.formatCompactText(worldState.gameState, {
        stateKeys: ['population', 'economy', 'environment', 'satisfaction'],
      })
      : '지역 상태 기록 없음';

    return `이전 선택 이어받기 · ${facilityText}  |  ${stateText}`;
  }
}
