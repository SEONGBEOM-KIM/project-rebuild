import { CURRENT_PLACEMENT_EPISODE } from '../data/episodes.js';
import { getNextDevelopmentGoals, getReflectionChoices } from '../data/episodeContent.js';
import LearningProgress from './LearningProgress.js';
import PlacementContextManager from './PlacementContextManager.js';

export default class EpisodeFlowManager {
  static resolveActivePlacementEpisodeId({ registry = null, learningProgress = null, placementConfig = null } = {}) {
    const progress = learningProgress ?? (registry ? LearningProgress.get(registry) : null);
    const resolvedPlacementConfig = placementConfig
      ?? (registry || progress ? PlacementContextManager.resolve({ registry, progress }).placementConfig : null);
    return resolvedPlacementConfig?.episodeId ?? CURRENT_PLACEMENT_EPISODE.code;
  }

  static getReflectionChoices(context = {}) {
    return getReflectionChoices(EpisodeFlowManager.resolveActivePlacementEpisodeId(context));
  }

  static getNextDevelopmentGoals(context = {}) {
    return getNextDevelopmentGoals(EpisodeFlowManager.resolveActivePlacementEpisodeId(context));
  }
}
