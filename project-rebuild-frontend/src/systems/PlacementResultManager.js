import GameState from './GameState.js';
import LearningProgress from './LearningProgress.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class PlacementResultManager {
  static createPlacementResult({ building, tile, occupiedTiles, before }) {
    const after = GameState.applyEffect(before, building.effect);

    return {
      building,
      position: { x: tile.x, y: tile.y },
      occupiedTiles,
      before,
      after,
      delta: building.effect,
    };
  }

  static createPlacementRecord({ building, tile, occupiedTiles, placedCount, now = Date.now() }) {
    return {
      id: `${building.id}-${now}-${placedCount}`,
      building,
      position: { x: tile.x, y: tile.y },
      occupiedTiles,
      delta: building.effect,
    };
  }

  static commitPlacement({ registry, building, tile, occupiedTiles, placedBuildings, now = Date.now() }) {
    const before = registry.get(REGISTRY_KEYS.gameState);
    const result = PlacementResultManager.createPlacementResult({ building, tile, occupiedTiles, before });
    const record = PlacementResultManager.createPlacementRecord({
      building,
      tile,
      occupiedTiles,
      placedCount: placedBuildings.length,
      now,
    });
    const nextPlacedBuildings = [...placedBuildings, record];

    registry.set(REGISTRY_KEYS.gameState, result.after);
    registry.set(REGISTRY_KEYS.lastPlacementResult, result);
    registry.set(REGISTRY_KEYS.placedBuildings, nextPlacedBuildings);
    LearningProgress.addPlacedBuilding(registry, building.id);

    return {
      result,
      record,
      placedBuildings: nextPlacedBuildings,
    };
  }
}
