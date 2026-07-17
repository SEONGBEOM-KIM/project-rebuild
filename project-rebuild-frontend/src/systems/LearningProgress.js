const INITIAL_PROGRESS = Object.freeze({
  episode: 1,
  exploredPlaces: [],
  dataViewed: false,
  quizResult: null,
  problemSummaryCompleted: false,
  selectedPolicyId: null,
  selectedStrategyId: null,
  placementConfigId: null,
  placedBuildingIds: [],
  reflectionChoice: null,
  completed: false,
});

export default class LearningProgress {
  static createInitialProgress() {
    return {
      ...INITIAL_PROGRESS,
      exploredPlaces: [],
      placedBuildingIds: [],
    };
  }

  static get(registry) {
    return registry.get('learningProgress') ?? LearningProgress.createInitialProgress();
  }

  static update(registry, patch) {
    const nextProgress = {
      ...LearningProgress.get(registry),
      ...patch,
    };
    registry.set('learningProgress', nextProgress);
    return nextProgress;
  }

  static addExploredPlace(registry, placeId) {
    const progress = LearningProgress.get(registry);
    const exploredPlaces = Array.from(new Set([...progress.exploredPlaces, placeId]));
    return LearningProgress.update(registry, { exploredPlaces });
  }

  static addPlacedBuilding(registry, buildingId) {
    const progress = LearningProgress.get(registry);
    return LearningProgress.update(registry, {
      placedBuildingIds: [...progress.placedBuildingIds, buildingId],
    });
  }
}
