import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';
import { policies } from '../data/policies.js';
import { economyPolicies } from '../data/economyPolicies.js';
import EpisodeFlowManager from './EpisodeFlowManager.js';
import PlacementContextManager from './PlacementContextManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class LearningDataRestoreManager {
  static findPolicyById(policyId) {
    return [...policies, ...economyPolicies].find((policy) => policy.id === policyId) ?? null;
  }

  static restore(registry, data) {
    const selectedPolicy = LearningDataRestoreManager.findPolicyById(data.selectedPolicy?.id);
    const selectedStrategy = EpisodeFlowManager.resolveSelectedStrategyFromLearningData(data, selectedPolicy);
    const placementContext = PlacementContextManager.resolveFromLearningData(data, selectedStrategy);
    const restoredPlacements = LearningDataRestoreManager.restorePlacements(
      data.placements ?? [],
      placementContext.placementConfig.buildings,
    );
    const progress = LearningDataRestoreManager.buildProgress(data, selectedPolicy, selectedStrategy, restoredPlacements, placementContext);

    registry.set(REGISTRY_KEYS.gameState, LearningDataRestoreManager.restoreGameState(data.gameState, restoredPlacements));
    registry.set(REGISTRY_KEYS.lastPlacementResult, null);
    registry.set(REGISTRY_KEYS.placedBuildings, restoredPlacements);
    registry.set(REGISTRY_KEYS.selectedPolicy, selectedPolicy);
    registry.set(REGISTRY_KEYS.selectedPlacementStrategy, selectedStrategy?.id ?? null);
    registry.set(REGISTRY_KEYS.placementConfigId, progress.placementConfigId);
    registry.set(REGISTRY_KEYS.exploredPlaces, progress.exploredPlaces);
    registry.set(REGISTRY_KEYS.quizResult, progress.quizResult);
    registry.set(REGISTRY_KEYS.reflectionChoice, progress.reflectionChoice);
    registry.set(REGISTRY_KEYS.learningProgress, progress);

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

  static restorePlacements(placements, availableBuildings) {
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
        };
      })
      .filter(Boolean);
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
