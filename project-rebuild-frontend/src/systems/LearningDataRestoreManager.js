import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';
import { policies } from '../data/policies.js';
import { economyPolicies } from '../data/economyPolicies.js';
import EpisodeFlowManager from './EpisodeFlowManager.js';
import PlacementContextManager from './PlacementContextManager.js';
import WorldStateManager from './WorldStateManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class LearningDataRestoreManager {
  static findPolicyById(policyId) {
    return [...policies, ...economyPolicies].find((policy) => policy.id === policyId) ?? null;
  }

  static restore(registry, data) {
    const selectedPolicy = LearningDataRestoreManager.findPolicyById(data.selectedPolicy?.id);
    const selectedStrategy = EpisodeFlowManager.resolveSelectedStrategyFromLearningData(data, selectedPolicy);
    const placementContext = PlacementContextManager.resolveFromLearningData(data, selectedStrategy);
    const placementEpisodeId = placementContext.placementConfig.episodeId;
    const restoredPlacements = LearningDataRestoreManager.restorePlacements(
      data.placements ?? [],
      placementContext.placementConfig.buildings,
      placementEpisodeId,
    );
    const progress = LearningDataRestoreManager.buildProgress(data, selectedPolicy, selectedStrategy, restoredPlacements, placementContext);
    const restoredGameState = LearningDataRestoreManager.restoreGameState(data.gameState, restoredPlacements);
    const worldState = LearningDataRestoreManager.restoreWorldState({
      data,
      placementEpisodeId,
      restoredPlacements,
      restoredGameState,
    });

    registry.set(REGISTRY_KEYS.gameState, restoredGameState);
    registry.set(REGISTRY_KEYS.lastPlacementResult, null);
    registry.set(REGISTRY_KEYS.placedBuildings, restoredPlacements);
    registry.set(REGISTRY_KEYS.selectedPolicy, selectedPolicy);
    registry.set(REGISTRY_KEYS.selectedPlacementStrategy, selectedStrategy?.id ?? null);
    registry.set(REGISTRY_KEYS.placementConfigId, progress.placementConfigId);
    registry.set(REGISTRY_KEYS.exploredPlaces, progress.exploredPlaces);
    registry.set(REGISTRY_KEYS.quizResult, progress.quizResult);
    registry.set(REGISTRY_KEYS.reflectionChoice, progress.reflectionChoice);
    registry.set(REGISTRY_KEYS.learningProgress, progress);
    WorldStateManager.set(registry, worldState);

    return {
      selectedPolicy,
      selectedStrategy,
      placedBuildings: restoredPlacements,
      learningProgress: progress,
    };
  }

  static restoreGameState(gameState, restoredPlacements) {
    if (gameState) {
      return gameState;
    }

    return restoredPlacements.reduce(
      (state, record) => GameState.applyEffect(state, record.delta ?? record.building.effect),
      GameState.createInitialState(),
    );
  }

  static restorePlacements(placements, availableBuildings, episodeId = null) {
    return placements
      .map((placement, index) => {
        const building = availableBuildings.find((candidate) => candidate.id === placement.buildingId);
        if (!building) {
          return null;
        }
        return {
          id: `${building.id}-restored-${index}`,
          building,
          position: placement.position,
          occupiedTiles: [],
          delta: placement.effect ?? building.effect,
          episodeId: placement.episodeId ?? episodeId,
        };
      })
      .filter(Boolean);
  }

  static restoreWorldState({ data, placementEpisodeId, restoredPlacements, restoredGameState }) {
    if (data.worldState) {
      return WorldStateManager.createInitialWorldState(data.worldState);
    }

    const startedWorld = WorldStateManager.startEpisode(
      WorldStateManager.createInitialWorldState(),
      placementEpisodeId,
    );

    if (data.completed) {
      return WorldStateManager.completeEpisode(startedWorld, placementEpisodeId, {
        gameState: restoredGameState,
        placements: restoredPlacements,
      });
    }

    const withPlacements = WorldStateManager.appendPlacements(
      startedWorld,
      restoredPlacements,
      placementEpisodeId,
    );
    return WorldStateManager.createInitialWorldState({
      ...withPlacements,
      gameState: restoredGameState,
    });
  }

  static buildProgress(data, selectedPolicy, selectedStrategy, restoredPlacements, placementContext = null) {
    return {
      ...LearningProgress.createInitialProgress(),
      episode: data.episode ?? 1,
      exploredPlaces: data.exploredPlaces ?? [],
      dataViewed: Boolean(data.dataViewed),
      quizResult: data.quizResult ?? null,
      problemSummaryCompleted: Boolean(data.problemSummaryCompleted),
      selectedPolicyId: selectedPolicy?.id ?? null,
      selectedStrategyId: selectedStrategy?.id ?? null,
      placementConfigId: placementContext?.placementConfig.id ?? PlacementContextManager.resolvePlacementConfigIdFromLearningData(data, selectedStrategy),
      placedBuildingIds: restoredPlacements.map((record) => record.building.id),
      reflectionChoice: data.reflectionChoice ?? null,
      completed: Boolean(data.completed),
    };
  }
}
