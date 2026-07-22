import { EPISODE_IDS } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { getPlacementConfigIdForStrategy, EP3_ECONOMY_PLACEMENT_CONFIG_ID, EP5_BALANCED_SOLUTIONS_CONFIG_ID } from '../data/episodePlacementConfigs.js';
import { economyPolicies } from '../data/economyPolicies.js';
import { getEp5Policy } from '../data/ep5Policies.js';
import { getEpisodeContent } from '../data/episodeContent.js';
import LearningProgress from './LearningProgress.js';
import WorldStateManager from './WorldStateManager.js';

export default class EpisodePlacementLaunchManager {
  static buildEp3EconomyLaunchContext({ worldState = null, cumulative = true, selectedStrategy = null } = {}) {
    const missionBriefing = getEpisodeContent(EPISODE_IDS.EconomyGrowth).missionBriefing;
    const resolvedStrategy = selectedStrategy ?? missionBriefing.strategies[0] ?? null;
    const selectedPolicy = economyPolicies.find((policy) => policy.id === resolvedStrategy?.policyId) ?? economyPolicies[0];
    const placementConfigId = getPlacementConfigIdForStrategy(resolvedStrategy) ?? EP3_ECONOMY_PLACEMENT_CONFIG_ID;
    const startedWorldState = WorldStateManager.startEpisode(
      worldState ?? WorldStateManager.createInitialWorldState(),
      EPISODE_IDS.EconomyGrowth,
    );
    const baseWorldState = WorldStateManager.setEpisodeRunMetadata(startedWorldState, EPISODE_IDS.EconomyGrowth, {
      selectedStrategyId: resolvedStrategy?.id ?? null,
      selectedPolicyId: selectedPolicy.id,
      placementConfigId,
    });
    const placementSeed = WorldStateManager.buildPlacementSeed(baseWorldState, { cumulative });

    return {
      episodeId: EPISODE_IDS.EconomyGrowth,
      placementConfigId,
      selectedPolicy,
      selectedStrategy: resolvedStrategy?.id ?? null,
      gameState: placementSeed.gameState,
      placedBuildings: placementSeed.placedBuildings,
      lastPlacementResult: null,
      worldState: baseWorldState,
      progressPatch: {
        episode: 3,
        selectedPolicyId: selectedPolicy.id,
        selectedStrategyId: resolvedStrategy?.id ?? null,
        placementConfigId,
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
      cumulative: options.cumulative ?? true,
      selectedStrategy: options.selectedStrategy ?? null,
    });
    return EpisodePlacementLaunchManager.applyLaunchContext(registry, context);
  }

  static prepareEp5BalancedPlacement(registry, selectedSolutionPlan) {
    const selectedPolicy = getEp5Policy(selectedSolutionPlan?.id) ?? getEp5Policy('mobility_green_network');
    const startedWorldState = WorldStateManager.startEpisode(WorldStateManager.get(registry), EPISODE_IDS.BalancedSolutions);
    const baseWorldState = WorldStateManager.setEpisodeRunMetadata(startedWorldState, EPISODE_IDS.BalancedSolutions, {
      selectedSolutionPlanId: selectedSolutionPlan?.id ?? selectedPolicy.id,
      targetPrimaryRiskId: selectedSolutionPlan?.primaryRiskId ?? null,
      selectedPolicyId: selectedPolicy.id,
      placementConfigId: EP5_BALANCED_SOLUTIONS_CONFIG_ID,
    });
    const placementSeed = WorldStateManager.buildPlacementSeed(baseWorldState, { cumulative: true });
    return EpisodePlacementLaunchManager.applyLaunchContext(registry, {
      episodeId: EPISODE_IDS.BalancedSolutions,
      placementConfigId: EP5_BALANCED_SOLUTIONS_CONFIG_ID,
      selectedPolicy,
      selectedStrategy: null,
      gameState: placementSeed.gameState,
      placedBuildings: placementSeed.placedBuildings,
      lastPlacementResult: null,
      worldState: baseWorldState,
      progressPatch: {
        episode: 5,
        selectedPolicyId: selectedPolicy.id,
        selectedStrategyId: null,
        placementConfigId: EP5_BALANCED_SOLUTIONS_CONFIG_ID,
        selectedSolutionPlanId: selectedSolutionPlan?.id ?? selectedPolicy.id,
        placedBuildingIds: placementSeed.placedBuildings.map((record) => record.buildingId ?? record.building?.id).filter(Boolean),
      },
    });
  }
}
