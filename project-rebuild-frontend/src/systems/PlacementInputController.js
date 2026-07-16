import PlacementViewManager from './PlacementViewManager.js';

export default class PlacementInputController {
  constructor({ scene, pointerToTile, clearPreview, updatePreview, tryPlace, isPointerOnUi = PlacementViewManager.isPointerOnUi }) {
    this.scene = scene;
    this.pointerToTile = pointerToTile;
    this.clearPreview = clearPreview;
    this.updatePreview = updatePreview;
    this.tryPlace = tryPlace;
    this.isPointerOnUi = isPointerOnUi;
    this.pendingPlacementPointer = null;
  }

  enable() {
    this.scene.input.on('pointermove', (pointer) => this.handlePointerMove(pointer));
    this.scene.input.on('pointerdown', (pointer, gameObjects) => this.handlePointerDown(pointer, gameObjects));
    this.scene.input.on('pointerup', (pointer, gameObjects) => this.handlePointerUp(pointer, gameObjects));
    return this;
  }

  handlePointerMove(pointer) {
    if (this.isPointerOnUi(pointer)) {
      this.clearPreview();
      return;
    }

    this.updatePreview(pointer);
  }

  handlePointerDown(pointer, gameObjects = []) {
    if (PlacementInputController.shouldIgnorePointer(pointer, gameObjects, this.isPointerOnUi)) {
      this.pendingPlacementPointer = null;
      return;
    }

    this.pendingPlacementPointer = PlacementInputController.createPendingPointer(pointer, this.pointerToTile(pointer));
  }

  handlePointerUp(pointer, gameObjects = []) {
    if (!this.pendingPlacementPointer || PlacementInputController.shouldIgnorePointer(pointer, gameObjects, this.isPointerOnUi)) {
      this.pendingPlacementPointer = null;
      return;
    }

    const decision = PlacementInputController.getReleaseDecision(
      this.pendingPlacementPointer,
      pointer,
      this.pointerToTile(pointer),
    );
    this.pendingPlacementPointer = null;

    if (!decision.shouldPlace) {
      return;
    }

    this.tryPlace(pointer);
  }

  static shouldIgnorePointer(pointer, gameObjects = [], isPointerOnUi = PlacementViewManager.isPointerOnUi) {
    return gameObjects.length > 0 || isPointerOnUi(pointer);
  }

  static createPendingPointer(pointer, tile) {
    return {
      x: pointer.x,
      y: pointer.y,
      tile,
    };
  }

  static getReleaseDecision(pendingPointer, pointer, releaseTile) {
    const dragDistance = Math.hypot(pointer.x - pendingPointer.x, pointer.y - pendingPointer.y);
    const sameTile = releaseTile
      && pendingPointer.tile
      && releaseTile.x === pendingPointer.tile.x
      && releaseTile.y === pendingPointer.tile.y;

    return {
      dragDistance,
      sameTile: Boolean(sameTile),
      shouldPlace: PlacementViewManager.isDragPlacementCandidate(dragDistance, sameTile),
    };
  }
}
