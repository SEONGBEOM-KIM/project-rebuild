import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';
import { policies } from '../data/policies.js';
import { buildings } from '../data/buildings.js';
import { EP2_MISSION_BRIEFING } from '../data/episodeContent.js';
import Ep2BriefingViewManager from './Ep2BriefingViewManager.js';

export default class LearningDataRestoreManager {
  static restore(registry, data) {
    const selectedPolicy = policies.find((policy) => policy.id === data.selectedPolicy?.id) ?? null;
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(EP2_MISSION_BRIEFING, data.selectedStrategy?.id, selectedPolicy?.id);
    const restoredPlacements = LearningDataRestoreManager.restorePlacements(data.placements ?? []);
    const progress = LearningDataRestoreManager.buildProgress(data, selectedPolicy, selectedStrategy, restoredPlacements);

    registry.set('gameState', LearningDataRestoreManager.restoreGameState(data.gameState, restoredPlacements));
    registry.set('lastPlacementResult', null);
    registry.set('placedBuildings', restoredPlacements);
    registry.set('selectedPolicy', selectedPolicy);
    registry.set('ep2StrategyId', selectedStrategy?.id ?? null);
    registry.set('exploredPlaces', progress.exploredPlaces);
    registry.set('quizResult', progress.quizResult);
    registry.set('reflectionChoice', progress.reflectionChoice);
    registry.set('learningProgress', progress);

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

  static restorePlacements(placements) {
    return placements
      .map((placement, index) => {
        const building = buildings.find((candidate) => candidate.id === placement.buildingId);
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

  static buildProgress(data, selectedPolicy, selectedStrategy, restoredPlacements) {
    return {
      ...LearningProgress.createInitialProgress(),
      episode: data.episode ?? 1,
      exploredPlaces: data.exploredPlaces ?? [],
      dataViewed: Boolean(data.dataViewed),
      quizResult: data.quizResult ?? null,
      problemSummaryCompleted: Boolean(data.problemSummaryCompleted),
      selectedPolicyId: selectedPolicy?.id ?? null,
      selectedStrategyId: selectedStrategy?.id ?? null,
      placedBuildingIds: restoredPlacements.map((record) => record.building.id),
      reflectionChoice: data.reflectionChoice ?? null,
      completed: Boolean(data.completed),
    };
  }
}
