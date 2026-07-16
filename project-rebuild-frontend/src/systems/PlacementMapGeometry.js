export default class PlacementMapGeometry {
  constructor({ origin, tileWidth, tileHeight, mapWidth, mapHeight }) {
    this.origin = { ...origin };
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.halfTileWidth = tileWidth / 2;
    this.halfTileHeight = tileHeight / 2;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
  }

  tileToWorld(tileX, tileY) {
    return {
      x: this.origin.x + (tileX - tileY) * this.halfTileWidth,
      y: this.origin.y + (tileX + tileY) * this.halfTileHeight,
    };
  }

  worldToTile(worldX, worldY) {
    const localX = worldX - this.origin.x;
    const localY = worldY - this.origin.y;
    const approximateX = (localX / this.halfTileWidth + localY / this.halfTileHeight) / 2;
    const approximateY = (localY / this.halfTileHeight - localX / this.halfTileWidth) / 2;
    const tileX = Math.floor(approximateX + 0.5);
    const tileY = Math.floor(approximateY + 0.5);

    if (!this.containsTile(tileX, tileY)) {
      return null;
    }

    return { x: tileX, y: tileY };
  }

  containsTile(tileX, tileY) {
    return tileX >= 0 && tileY >= 0 && tileX < this.mapWidth && tileY < this.mapHeight;
  }

  getDiamondPoints(tileX, tileY) {
    const center = this.tileToWorld(tileX, tileY);
    return [
      { x: center.x, y: center.y - this.halfTileHeight },
      { x: center.x + this.halfTileWidth, y: center.y },
      { x: center.x, y: center.y + this.halfTileHeight },
      { x: center.x - this.halfTileWidth, y: center.y },
    ];
  }

  getFootprintCenter(tileX, tileY, footprint) {
    const start = this.tileToWorld(tileX, tileY);
    const end = this.tileToWorld(tileX + footprint.width - 1, tileY + footprint.height - 1);
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }
}
