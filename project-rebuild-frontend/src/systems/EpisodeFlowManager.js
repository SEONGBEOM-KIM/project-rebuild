import { CURRENT_PLACEMENT_EPISODE } from '../data/episodes.js';
import { getEpisodeContent, getNextDevelopmentGoals, getReflectionChoices } from '../data/episodeContent.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import LearningProgress from './LearningProgress.js';
import PlacementContextManager from './PlacementContextManager.js';

export default class EpisodeFlowManager {
  static resolveActivePlacementEpisodeId({ registry = null, learningProgress = null, placementConfig = null } = {}) {
    const progress = learningProgress ?? (registry ? LearningProgress.get(registry) : null);
    const resolvedPlacementConfig = placementConfig
      ?? (registry || progress ? PlacementContextManager.resolve({ registry, progress }).placementConfig : null);
    return resolvedPlacementConfig?.episodeId ?? CURRENT_PLACEMENT_EPISODE.code;
  }


  static getMissionBriefing(context = {}) {
    return getEpisodeContent(EpisodeFlowManager.resolveActivePlacementEpisodeId(context)).missionBriefing ?? null;
  }

  static findStrategyById(briefing, strategyId) {
    return briefing?.strategies?.find((strategy) => strategy.id === strategyId) ?? null;
  }

  static findStrategyByPolicyId(briefing, policyId) {
    return briefing?.strategies?.find((strategy) => strategy.policyId === policyId) ?? null;
  }

  static resolveSelectedStrategy({ registry = null, learningProgress = null, placementConfig = null, selectedPolicy = null } = {}) {
    const progress = learningProgress ?? (registry ? LearningProgress.get(registry) : null);
    const briefing = EpisodeFlowManager.getMissionBriefing({ registry, learningProgress: progress, placementConfig });
    const strategyId = registry?.get(REGISTRY_KEYS.selectedPlacementStrategy) ?? progress?.selectedStrategyId;
    return EpisodeFlowManager.findStrategyById(briefing, strategyId)
      ?? EpisodeFlowManager.findStrategyByPolicyId(briefing, selectedPolicy?.id);
  }

  static getReflectionChoices(context = {}) {
    return getReflectionChoices(EpisodeFlowManager.resolveActivePlacementEpisodeId(context));
  }

  static getNextDevelopmentGoals(context = {}) {
    return getNextDevelopmentGoals(EpisodeFlowManager.resolveActivePlacementEpisodeId(context));
  }
}
