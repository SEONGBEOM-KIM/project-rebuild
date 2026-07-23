import SCENE_KEYS from '../data/sceneKeys.js';
import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';
import WorldStateManager from './WorldStateManager.js';
import TimeStateManager from './TimeStateManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export const BOOT_TARGET_SCENE = SCENE_KEYS.Title;

export default class BootFlowManager {
  static getTargetScene() {
    return BOOT_TARGET_SCENE;
  }

  static createInitialRegistryEntries() {
    return [
      [REGISTRY_KEYS.gameState, GameState.createInitialState()],
      [REGISTRY_KEYS.lastPlacementResult, null],
      [REGISTRY_KEYS.placedBuildings, []],
      [REGISTRY_KEYS.selectedPolicy, null],
      [REGISTRY_KEYS.selectedPlacementStrategy, null],
      [REGISTRY_KEYS.exploredPlaces, []],
      [REGISTRY_KEYS.quizResult, null],
      [REGISTRY_KEYS.reflectionChoice, null],
      [REGISTRY_KEYS.selectedSolutionPlan, null],
      [REGISTRY_KEYS.learningProgress, LearningProgress.createInitialProgress()],
      [REGISTRY_KEYS.worldState, WorldStateManager.createInitialWorldState()],
      [REGISTRY_KEYS.timeState, TimeStateManager.createInitialTimeState()],
    ];
  }

  static resetRegistry(registry) {
    for (const [key, value] of BootFlowManager.createInitialRegistryEntries()) {
      registry.set(key, value);
    }
  }
}
