import { getEvaluationProfile } from '../data/evaluationRules.js';
import { getPlacementConfig, getPlacementConfigIdForStrategy } from '../data/episodePlacementConfigs.js';
import LearningProgress from './LearningProgress.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class PlacementContextManager {
  static resolvePlacementConfigId({ registry, progress = null, selectedStrategy = null } = {}) {
    return registry?.get(REGISTRY_KEYS.placementConfigId)
      ?? progress?.placementConfigId
      ?? getPlacementConfigIdForStrategy(selectedStrategy);
  }

  static resolvePlacementConfigIdFromLearningData(data, selectedStrategy = null) {
    return data?.placementConfig?.id
      ?? data?.summary?.placementContext?.placementConfigId
      ?? data?.selectedStrategy?.placementConfigId
      ?? getPlacementConfigIdForStrategy(selectedStrategy);
  }

  static buildContext(placementConfigId) {
    const placementConfig = getPlacementConfig(placementConfigId);
    const evaluationProfile = getEvaluationProfile(placementConfig.evaluationProfileId);

    return {
      placementConfig,
      evaluationProfile,
    };
  }

  static resolve({ registry, progress = null, selectedStrategy = null } = {}) {
    const resolvedProgress = progress ?? (registry ? LearningProgress.get(registry) : null);
    return PlacementContextManager.buildContext(PlacementContextManager.resolvePlacementConfigId({
      registry,
      progress: resolvedProgress,
      selectedStrategy,
    }));
  }

  static resolveFromLearningData(data, selectedStrategy = null) {
    return PlacementContextManager.buildContext(
      PlacementContextManager.resolvePlacementConfigIdFromLearningData(data, selectedStrategy),
    );
  }
}
