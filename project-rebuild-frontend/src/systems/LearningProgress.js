import { CURRENT_EPISODE } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

const INITIAL_PROGRESS = Object.freeze({
  episode: CURRENT_EPISODE.id,
  exploredPlaces: [],
  dataViewed: false,
  quizResult: null,
  problemSummaryCompleted: false,
  selectedPolicyId: null,
  selectedStrategyId: null,
  placementConfigId: null,
  placedBuildingIds: [],
  reviewedRiskIds: [],
  ep4InvestigationCompleted: false,
  selectedSolutionPlanId: null,
  reflectionChoice: null,
  completed: false,
});

export default class LearningProgress {
  static createInitialProgress() {
    return {
      ...INITIAL_PROGRESS,
      exploredPlaces: [],
      placedBuildingIds: [],
      reviewedRiskIds: [],
    };
  }

  static get(registry) {
    return registry.get(REGISTRY_KEYS.learningProgress) ?? LearningProgress.createInitialProgress();
  }

  static update(registry, patch) {
    const nextProgress = {
      ...LearningProgress.get(registry),
      ...patch,
    };
    registry.set(REGISTRY_KEYS.learningProgress, nextProgress);
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

  static addReviewedRisk(registry, riskId) {
    const progress = LearningProgress.get(registry);
    const reviewedRiskIds = Array.from(new Set([...(progress.reviewedRiskIds ?? []), riskId]));
    return LearningProgress.update(registry, { reviewedRiskIds });
  }
}
