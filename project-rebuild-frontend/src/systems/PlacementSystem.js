export default class PlacementSystem {
  constructor(mapData) {
    this.mapData = mapData;
    this.occupied = new Set();
  }

  canPlace(tileX, tileY, building) {
    return this.validatePlacement(tileX, tileY, building).valid;
  }

  validatePlacement(tileX, tileY, building) {
    const footprintTiles = this.getFootprintTiles(tileX, tileY, building.footprint);

    for (const tile of footprintTiles) {
      const tileValidation = this.validateTile(tile.x, tile.y, building);
      if (!tileValidation.valid) {
        return {
          valid: false,
          reason: tileValidation.reason,
          problemTile: tile,
          footprintTiles,
        };
      }
    }

    const ruleValidation = this.validatePlacementRules(footprintTiles, building);
    if (!ruleValidation.valid) {
      return {
        valid: false,
        reason: ruleValidation.reason,
        problemTile: null,
        footprintTiles,
      };
    }

    return {
      valid: true,
      reason: '배치 가능',
      problemTile: null,
      footprintTiles,
    };
  }

  validateTile(tileX, tileY, building = null) {
    if (tileX < 0 || tileY < 0 || tileX >= this.mapData.width || tileY >= this.mapData.height) {
      return { valid: false, reason: '지도 범위를 벗어납니다.' };
    }

    if (this.occupied.has(this.getKey(tileX, tileY))) {
      return { valid: false, reason: '이미 다른 시설이 배치된 타일입니다.' };
    }

    const tile = this.mapData.tiles[tileY]?.[tileX];
    if (!tile) {
      return { valid: false, reason: '타일 정보를 찾을 수 없습니다.' };
    }

    if (!tile.buildable) {
      return { valid: false, reason: `${this.getTileLabel(tile.type)}에는 시설을 지을 수 없습니다.` };
    }

    if (building?.allowedZones?.length && !building.allowedZones.includes(tile.zone)) {
      return { valid: false, reason: `${building.name}은(는) ${this.getZoneLabel(tile.zone)} 구역에 배치할 수 없습니다.` };
    }

    return { valid: true, reason: '배치 가능' };
  }

  validatePlacementRules(footprintTiles, building) {
    if (building.requiresAdjacentType && !this.hasAdjacentType(footprintTiles, building.requiresAdjacentType)) {
      return {
        valid: false,
        reason: `${building.name}은(는) ${this.getTileLabel(building.requiresAdjacentType)}와 인접해야 합니다.`,
      };
    }

    if (building.requiresAdjacentAnyType?.length && !building.requiresAdjacentAnyType.some((type) => this.hasAdjacentType(footprintTiles, type))) {
      const labels = building.requiresAdjacentAnyType.map((type) => this.getTileLabel(type)).join(' 또는 ');
      return {
        valid: false,
        reason: `${building.name}은(는) ${labels}과(와) 인접해야 합니다.`,
      };
    }

    return { valid: true, reason: '배치 가능' };
  }

  hasAdjacentType(footprintTiles, targetType) {
    const footprintKeys = new Set(footprintTiles.map((tile) => this.getKey(tile.x, tile.y)));
    for (const tile of footprintTiles) {
      for (const neighbor of this.getNeighborTiles(tile.x, tile.y)) {
        if (footprintKeys.has(this.getKey(neighbor.x, neighbor.y))) {
          continue;
        }
        const mapTile = this.getTile(neighbor.x, neighbor.y);
        if (mapTile?.type === targetType) {
          return true;
        }
      }
    }
    return false;
  }

  getNeighborTiles(tileX, tileY) {
    return [
      { x: tileX + 1, y: tileY },
      { x: tileX - 1, y: tileY },
      { x: tileX, y: tileY + 1 },
      { x: tileX, y: tileY - 1 },
    ].filter((tile) => tile.x >= 0 && tile.y >= 0 && tile.x < this.mapData.width && tile.y < this.mapData.height);
  }

  place(tileX, tileY, building) {
    const occupiedTiles = this.getFootprintTiles(tileX, tileY, building.footprint);
    for (const tile of occupiedTiles) {
      this.occupied.add(this.getKey(tile.x, tile.y));
      const mapTile = this.mapData.tiles[tile.y]?.[tile.x];
      if (mapTile) {
        mapTile.occupied = true;
      }
    }
    return occupiedTiles;
  }

  getTile(tileX, tileY) {
    return this.mapData.tiles[tileY]?.[tileX] ?? null;
  }

  getFootprintTiles(tileX, tileY, footprint) {
    const tiles = [];
    for (let y = 0; y < footprint.height; y += 1) {
      for (let x = 0; x < footprint.width; x += 1) {
        tiles.push({ x: tileX + x, y: tileY + y });
      }
    }
    return tiles;
  }

  getTileLabel(type) {
    const labels = {
      empty: '빈 땅',
      forest: '숲',
      road: '도로',
      river: '강',
    };
    return labels[type] ?? type;
  }

  getZoneLabel(zone) {
    const labels = {
      center: '중심지',
      outskirts: '외곽',
      nature: '자연',
      traffic: '교통',
    };
    return labels[zone] ?? zone;
  }

  getKey(tileX, tileY) {
    return `${tileX},${tileY}`;
  }
}
