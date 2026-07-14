import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';
import { policies } from '../data/policies.js';
import { buildings } from '../data/buildings.js';

export default class LearningDataRestoreManager {
  static restore(registry, data) {
    const selectedPolicy = policies.find((policy) => policy.id === data.selectedPolicy?.id) ?? null;
    const restoredPlacements = LearningDataRestoreManager.restorePlacements(data.placements ?? []);
    const progress = LearningDataRestoreManager.buildProgress(data, selectedPolicy, restoredPlacements);

    registry.set('gameState', data.gameState ?? GameState.createInitialState());
    registry.set('lastPlacementResult', null);
    registry.set('placedBuildings', restoredPlacements);
    registry.set('selectedPolicy', selectedPolicy);
    registry.set('exploredPlaces', progress.exploredPlaces);
    registry.set('quizResult', progress.quizResult);
    registry.set('reflectionChoice', progress.reflectionChoice);
    registry.set('learningProgress', progress);

    return {
      selectedPolicy,
      placedBuildings: restoredPlacements,
      learningProgress: progress,
    };
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

  static buildProgress(data, selectedPolicy, restoredPlacements) {
    return {
      ...LearningProgress.createInitialProgress(),
      episode: data.episode ?? 1,
      exploredPlaces: data.exploredPlaces ?? [],
      dataViewed: Boolean(data.dataViewed),
      quizResult: data.quizResult ?? null,
      problemSummaryCompleted: Boolean(data.problemSummaryCompleted),
      selectedPolicyId: selectedPolicy?.id ?? null,
      placedBuildingIds: restoredPlacements.map((record) => record.building.id),
      reflectionChoice: data.reflectionChoice ?? null,
      completed: Boolean(data.completed),
    };
  }
}
