import Phaser from 'phaser';
import GameState from '../systems/GameState.js';
import LearningProgress from '../systems/LearningProgress.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.registry.set('gameState', GameState.createInitialState());
    this.registry.set('lastPlacementResult', null);
    this.registry.set('placedBuildings', []);
    this.registry.set('selectedPolicy', null);
    this.registry.set('exploredPlaces', []);
    this.registry.set('quizResult', null);
    this.registry.set('reflectionChoice', null);
    this.registry.set('learningProgress', LearningProgress.createInitialProgress());
    this.scene.start('TitleScene');
  }
}
