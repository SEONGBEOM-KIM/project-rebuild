import { EPISODE_IDS } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { EP3_ECONOMY_PLACEMENT_CONFIG_ID } from '../data/episodePlacementConfigs.js';
import { economyPolicies } from '../data/economyPolicies.js';
import LearningProgress from './LearningProgress.js';
import WorldStateManager from './WorldStateManager.js';

export default class EpisodePlacementLaunchManager {
  static buildEp3EconomyLaunchContext({ worldState = null, cumulative = false } = {}) {
    const baseWorldState = WorldStateManager.startEpisode(
      worldState ?? WorldStateManager.createInitialWorldState(),
      EPISODE_IDS.EconomyGrowth,
    );
    const placementSeed = WorldStateManager.buildPlacementSeed(baseWorldState, { cumulative });
    const selectedPolicy = economyPolicies[0];

    return {
      episodeId: EPISODE_IDS.EconomyGrowth,
      placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
      selectedPolicy,
      selectedStrategy: null,
      gameState: placementSeed.gameState,
      placedBuildings: placementSeed.placedBuildings,
      lastPlacementResult: null,
      worldState: baseWorldState,
      progressPatch: {
        episode: 3,
        selectedPolicyId: selectedPolicy.id,
        selectedStrategyId: null,
        placementConfigId: EP3_ECONOMY_PLACEMENT_CONFIG_ID,
        placedBuildingIds: placementSeed.placedBuildings.map((record) => record.buildingId ?? record.building?.id).filter(Boolean),
      },
    };
  }

  static applyLaunchContext(registry, context) {
    registry.set(REGISTRY_KEYS.placementConfigId, context.placementConfigId);
    registry.set(REGISTRY_KEYS.selectedPolicy, context.selectedPolicy);
    registry.set(REGISTRY_KEYS.selectedPlacementStrategy, context.selectedStrategy);
    registry.set(REGISTRY_KEYS.placedBuildings, context.placedBuildings);
    registry.set(REGISTRY_KEYS.lastPlacementResult, context.lastPlacementResult);
    registry.set(REGISTRY_KEYS.gameState, context.gameState);
    registry.set(REGISTRY_KEYS.worldState, context.worldState);
    LearningProgress.update(registry, context.progressPatch);
    return context;
  }

  static prepareEp3EconomyPlacement(registry, options = {}) {
    const context = EpisodePlacementLaunchManager.buildEp3EconomyLaunchContext({
      worldState: options.worldState ?? registry.get(REGISTRY_KEYS.worldState),
      cumulative: options.cumulative ?? false,
    });
    return EpisodePlacementLaunchManager.applyLaunchContext(registry, context);
  }
}
