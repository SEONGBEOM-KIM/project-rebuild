import PlacementResultManager from './PlacementResultManager.js';

export const PLACEMENT_ACTION_STATUS = {
  MISSING_TILE: 'missing_tile',
  INVALID: 'invalid',
  PLACED: 'placed',
};

export default class PlacementActionManager {
  static previewPlacement({ tile, placementSystem, building }) {
    if (!tile) {
      return {
        status: PLACEMENT_ACTION_STATUS.MISSING_TILE,
        tile: null,
        mapTile: null,
        validation: null,
      };
    }

    const validation = placementSystem.validatePlacement(tile.x, tile.y, building);
    return {
      status: validation.valid ? PLACEMENT_ACTION_STATUS.PLACED : PLACEMENT_ACTION_STATUS.INVALID,
      tile,
      mapTile: placementSystem.getTile(tile.x, tile.y),
      validation,
    };
  }

  static place({ registry, tile, placementSystem, building, placedBuildings }) {
    const preview = PlacementActionManager.previewPlacement({ tile, placementSystem, building });

    if (preview.status === PLACEMENT_ACTION_STATUS.MISSING_TILE || preview.status === PLACEMENT_ACTION_STATUS.INVALID) {
      return preview;
    }

    const occupiedTiles = placementSystem.place(tile.x, tile.y, building);
    const placementCommit = PlacementResultManager.commitPlacement({
      registry,
      building,
      tile,
      occupiedTiles,
      placedBuildings,
    });

    return {
      ...preview,
      occupiedTiles,
      placementCommit,
      placedBuildings: placementCommit.placedBuildings,
    };
  }
}
