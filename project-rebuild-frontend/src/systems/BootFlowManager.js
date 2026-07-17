import SCENE_KEYS from '../data/sceneKeys.js';
import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';

export const BOOT_TARGET_SCENE = SCENE_KEYS.Title;

export default class BootFlowManager {
  static getTargetScene() {
    return BOOT_TARGET_SCENE;
  }

  static createInitialRegistryEntries() {
    return [
      ['gameState', GameState.createInitialState()],
      ['lastPlacementResult', null],
      ['placedBuildings', []],
      ['selectedPolicy', null],
      ['ep2StrategyId', null],
      ['exploredPlaces', []],
      ['quizResult', null],
      ['reflectionChoice', null],
      ['learningProgress', LearningProgress.createInitialProgress()],
    ];
  }
}
