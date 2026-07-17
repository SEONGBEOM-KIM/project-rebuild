import { getEvaluationProfile } from '../data/evaluationRules.js';
import { getPlacementConfig, getPlacementConfigIdForStrategy } from '../data/episodePlacementConfigs.js';
import LearningProgress from './LearningProgress.js';

export default class PlacementContextManager {
  static resolvePlacementConfigId({ registry, progress = null, selectedStrategy = null } = {}) {
    return registry?.get('placementConfigId')
      ?? progress?.placementConfigId
      ?? getPlacementConfigIdForStrategy(selectedStrategy);
  }

  static resolve({ registry, progress = null, selectedStrategy = null } = {}) {
    const resolvedProgress = progress ?? (registry ? LearningProgress.get(registry) : null);
    const placementConfig = getPlacementConfig(PlacementContextManager.resolvePlacementConfigId({
      registry,
      progress: resolvedProgress,
      selectedStrategy,
    }));
    const evaluationProfile = getEvaluationProfile(placementConfig.evaluationProfileId);

    return {
      placementConfig,
      evaluationProfile,
    };
  }
}
