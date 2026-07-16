import PlacementViewManager from './PlacementViewManager.js';

export default class PlacementMapRenderer {
  constructor({ geometry, viewManager = PlacementViewManager }) {
    this.geometry = geometry;
    this.viewManager = viewManager;
  }

  drawMap(graphics, mapData) {
    graphics.clear();

    for (let y = 0; y < mapData.height; y += 1) {
      for (let x = 0; x < mapData.width; x += 1) {
        const tile = mapData.tiles[y][x];
        this.drawDiamond(graphics, x, y, this.viewManager.getMapTileVisual(tile));
      }
    }
  }

  drawTiles(graphics, tiles, visual) {
    for (const tile of tiles) {
      this.drawDiamond(graphics, tile.x, tile.y, visual);
    }
  }

  drawDiamond(graphics, tileX, tileY, visual) {
    const style = PlacementMapRenderer.normalizeDiamondVisual(visual);
    const points = this.geometry.getDiamondPoints(tileX, tileY);

    graphics.fillStyle(style.fillColor, style.fillAlpha);
    graphics.fillPoints(points, true);
    graphics.lineStyle(style.strokeWidth, style.strokeColor, style.strokeAlpha);
    graphics.strokePoints(points, true);
  }

  static normalizeDiamondVisual(visual) {
    return {
      fillColor: visual.fillColor ?? visual.color,
      fillAlpha: visual.fillAlpha ?? visual.alpha ?? 1,
      strokeColor: visual.strokeColor ?? visual.stroke,
      strokeWidth: visual.strokeWidth,
      strokeAlpha: visual.strokeAlpha ?? 0.9,
    };
  }
}
