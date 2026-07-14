import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { buildings } from '../data/buildings.js';
import { mapData } from '../data/mapData.js';
import GameState from '../systems/GameState.js';
import PlacementSystem from '../systems/PlacementSystem.js';
import CameraController from '../systems/CameraController.js';
import LearningProgress from '../systems/LearningProgress.js';
import { formatEffect } from '../data/stateLabels.js';
import PlacementViewManager from '../systems/PlacementViewManager.js';
import { REQUIRED_PLACEMENTS } from '../systems/PlacementViewManager.js';

const TILE_COLORS = {
  empty: 0x2f855a,
  forest: 0x166534,
  road: 0x64748b,
  river: 0x2563eb,
};

const TILE_STROKES = {
  buildable: 0x86efac,
  blocked: 0x334155,
};

const TILE_LABELS = {
  empty: '빈 땅',
  forest: '숲',
  road: '도로',
  river: '강',
};

const ZONE_LABELS = {
  center: '중심지',
  outskirts: '외곽',
  nature: '자연',
  traffic: '교통',
};


export default class PlacementScene extends Phaser.Scene {
  constructor() {
    super('PlacementScene');
  }

  create() {
    this.selectedBuilding = buildings[0];
    this.selectedPolicy = this.registry.get('selectedPolicy');
    this.placementSystem = new PlacementSystem(this.cloneMapData(mapData));
    this.placedBuildings = [...(this.registry.get('placedBuildings') ?? [])];
    this.pendingPlacementPointer = null;
    this.mapOrigin = { x: 940, y: 260 };
    this.tileWidth = mapData.tileWidth;
    this.tileHeight = mapData.tileHeight;
    this.halfTileWidth = this.tileWidth / 2;
    this.halfTileHeight = this.tileHeight / 2;

    this.drawBackground();
    this.mapGraphics = this.add.graphics().setDepth(1);
    this.buildingGraphics = this.add.graphics().setDepth(4);
    this.previewGraphics = this.add.graphics().setDepth(6);
    this.mapLabels = this.add.container(0, 0).setDepth(8);

    this.drawMap();
    this.restorePlacedBuildings();
    this.createUi();
    this.setupCamera();
    this.registerPlacementInput();
    this.updateStatusBar();
    this.updateLastChangePanel();
    this.updatePlacementHistoryPanel();
    this.updateSelectedBuildingUi();
    this.updateContinueButton();
  }

  cloneMapData(source) {
    return {
      ...source,
      tiles: source.tiles.map((row) => row.map((tile) => ({ ...tile, occupied: false }))),
    };
  }

  drawBackground() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a).setScrollFactor(0).setDepth(-10);
    ProgressStepper.render(this, 'placement');
    this.add.text(460, 120, '마우스 드래그: 지도 이동  |  휠: 확대/축소  |  초록: 배치 가능 / 빨강: 불가능', {
      fontSize: '24px',
      color: '#bfdbfe',
    }).setScrollFactor(0).setDepth(100);
  }

  setupCamera() {
    const bounds = {
      x: 0,
      y: 0,
      width: 1900,
      height: 1300,
    };

    new CameraController(this, {
      minZoom: 0.8,
      maxZoom: 2.2,
      bounds,
      ignoreDrag: (pointer) => this.isPointerOnUi(pointer),
    }).enable();
  }

  createUi() {
    this.uiObjects = [];
    this.cardObjects = new Map();

    this.createFixedRectangle(210, 540, 380, 1000, 0x111827, 0.94, 0x60a5fa);
    this.createFixedText(40, 54, '건물 선택', { fontSize: '34px', color: '#ffffff', fontStyle: 'bold' });
    this.createFixedText(40, 100, '샘플 3종 중 하나를 고른 뒤\n지도 위에 배치하세요.', {
      fontSize: '22px',
      color: '#bfdbfe',
      lineSpacing: 8,
    });

    this.missionText = this.createFixedText(40, 145, '', {
      fontSize: '20px',
      color: '#fde68a',
      lineSpacing: 6,
    });

    buildings.forEach((building, index) => {
      this.createBuildingCard(building, 40, 185 + index * 165);
    });

    this.statusText = this.createFixedText(40, 690, '', {
      fontSize: '20px',
      color: '#f8fafc',
      lineSpacing: 8,
    });

    this.cursorInfoText = this.createFixedText(40, 842, '커서 타일: 지도 위로 이동하세요.', {
      fontSize: '18px',
      color: '#bfdbfe',
      lineSpacing: 6,
      wordWrap: { width: 320 },
    });

    this.messageText = this.createFixedText(40, 925, '아직 배치된 건물이 없습니다.', {
      fontSize: '20px',
      color: '#fde68a',
      wordWrap: { width: 325 },
    });

    this.continueButtonBg = this.createFixedRectangle(1615, 985, 300, 72, 0x94a3b8, 1, 0xe2e8f0)
      .setInteractive({ useHandCursor: true });
    this.continueButton = this.createFixedText(1615, 985, '시설 3개 더 배치', {
      fontSize: '30px',
      color: '#0f172a',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const handleContinue = () => {
      if (this.placedBuildings.length < REQUIRED_PLACEMENTS) {
        this.showMessage(PlacementViewManager.formatNeedMoreMessage(this.placedBuildings.length), '#fecaca');
        return;
      }
      this.scene.start('ResultScene');
    };
    this.continueButtonBg.on('pointerdown', handleContinue);
    this.continueButton.on('pointerdown', handleContinue);
    this.createLegend();
    this.createLastChangePanel();
    this.createPlacementHistoryPanel();
  }

  createLegend() {
    const legendItems = [
      { label: '빈 땅', color: TILE_COLORS.empty, note: '배치 가능' },
      { label: '숲', color: TILE_COLORS.forest, note: '배치 불가' },
      { label: '도로', color: TILE_COLORS.road, note: '배치 불가' },
      { label: '강', color: TILE_COLORS.river, note: '배치 불가' },
    ];

    this.createFixedRectangle(1615, 150, 330, 190, 0x111827, 0.88, 0x475569);
    this.createFixedText(1480, 76, '타일 범례', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    legendItems.forEach((item, index) => {
      const y = 118 + index * 34;
      this.createFixedRectangle(1492, y + 10, 26, 20, item.color, 1, 0xffffff);
      this.createFixedText(1520, y, `${item.label} - ${item.note}`, {
        fontSize: '19px',
        color: item.note === '배치 가능' ? '#bbf7d0' : '#fecaca',
      });
    });
  }

  createLastChangePanel() {
    this.createFixedRectangle(1615, 385, 330, 260, 0x111827, 0.88, 0xfde68a);
    this.createFixedText(1478, 275, '최근 변화', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.lastChangeText = this.createFixedText(1478, 318, `아직 배치된 시설이 없습니다.\n건물을 배치하면 변화 수치가\n여기에 표시됩니다.`, {
      fontSize: '18px',
      color: '#fde68a',
      lineSpacing: 6,
      wordWrap: { width: 270 },
    });
  }

  createPlacementHistoryPanel() {
    this.createFixedRectangle(1615, 655, 330, 250, 0x111827, 0.88, 0x93c5fd);
    this.createFixedText(1478, 545, '배치 기록', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.placementHistoryText = this.createFixedText(1478, 588, `아직 기록이 없습니다.\n시설을 배치하면 순서대로\n기록됩니다.`, {
      fontSize: '18px',
      color: '#bfdbfe',
      lineSpacing: 6,
      wordWrap: { width: 280 },
    });
  }

  createBuildingCard(building, x, y) {
    const card = this.createFixedRectangle(x + 150, y + 64, 300, 146, 0x1e293b, 1, 0x475569)
      .setInteractive({ useHandCursor: true });
    const swatch = this.createFixedRectangle(x + 36, y + 54, 38, 38, building.color, 1, 0xffffff);
    const title = this.createFixedText(x + 70, y + 18, building.name, {
      fontSize: '25px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    const recommendationBadge = this.createRecommendationBadge(building, x + 246, y + 24);
    const detail = this.createFixedText(x + 70, y + 52, `${building.footprint.width}×${building.footprint.height} | 비용 ${building.cost}`, {
      fontSize: '18px',
      color: '#cbd5e1',
    });
    const description = this.createFixedText(x + 24, y + 78, building.description, {
      fontSize: '15px',
      color: '#bae6fd',
      wordWrap: { width: 255 },
    });
    const placementHint = this.createFixedText(x + 24, y + 112, `조건: ${building.placementHint}`, {
      fontSize: '14px',
      color: '#fef3c7',
      wordWrap: { width: 265 },
    });
    const effect = this.createFixedText(x + 24, y + 142, formatEffect(building.effect), {
      fontSize: '14px',
      color: '#fde68a',
      wordWrap: { width: 265 },
    });

    const selectBuilding = () => {
      this.selectedBuilding = building;
      this.updateSelectedBuildingUi();
      this.showMessage(`${building.name} 선택됨`, '#bbf7d0');
    };

    card.on('pointerdown', selectBuilding);
    title.setInteractive({ useHandCursor: true }).on('pointerdown', selectBuilding);

    this.cardObjects.set(building.id, { card, swatch, title, detail, description, placementHint, effect, recommendationBadge });
  }

  createRecommendationBadge(building, x, y) {
    if (!this.isRecommendedBuilding(building)) {
      return null;
    }

    const badgeBg = this.createFixedRectangle(x, y, 72, 28, 0xfde68a, 1, 0xf59e0b);
    const badgeText = this.createFixedText(x, y, '추천', {
      fontSize: '16px',
      color: '#78350f',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    return { badgeBg, badgeText };
  }

  isRecommendedBuilding(building) {
    return this.selectedPolicy?.recommendedBuildingIds?.includes(building.id) ?? false;
  }

  createFixedRectangle(x, y, width, height, color, alpha = 1, strokeColor = null) {
    const rectangle = this.add.rectangle(x, y, width, height, color, alpha).setScrollFactor(0).setDepth(100);
    if (strokeColor !== null) {
      rectangle.setStrokeStyle(3, strokeColor);
    }
    this.uiObjects.push(rectangle);
    return rectangle;
  }

  createFixedText(x, y, text, style) {
    const textObject = this.add.text(x, y, text, style).setScrollFactor(0).setDepth(101);
    this.uiObjects.push(textObject);
    return textObject;
  }

  updateSelectedBuildingUi() {
    for (const [buildingId, objects] of this.cardObjects.entries()) {
      const recommended = this.isRecommendedBuilding(buildings.find((building) => building.id === buildingId));
      const style = PlacementViewManager.getBuildingCardStyle(buildingId, this.selectedBuilding, recommended);
      objects.card.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.card.setFillStyle(style.fillColor, style.fillAlpha);
    }
  }

  drawMap() {
    this.mapGraphics.clear();

    for (let y = 0; y < this.placementSystem.mapData.height; y += 1) {
      for (let x = 0; x < this.placementSystem.mapData.width; x += 1) {
        const tile = this.placementSystem.mapData.tiles[y][x];
        const color = TILE_COLORS[tile.type] ?? TILE_COLORS.empty;
        const stroke = tile.buildable ? TILE_STROKES.buildable : TILE_STROKES.blocked;
        this.drawDiamond(this.mapGraphics, x, y, color, 0.88, stroke, 1.5);
      }
    }
  }

  registerPlacementInput() {
    this.input.on('pointermove', (pointer) => {
      if (this.isPointerOnUi(pointer)) {
        this.previewGraphics.clear();
        return;
      }
      this.updatePreview(pointer);
    });

    this.input.on('pointerdown', (pointer, gameObjects) => {
      if (gameObjects.length > 0 || this.isPointerOnUi(pointer)) {
        this.pendingPlacementPointer = null;
        return;
      }

      this.pendingPlacementPointer = {
        x: pointer.x,
        y: pointer.y,
        tile: this.pointerToTile(pointer),
      };
    });

    this.input.on('pointerup', (pointer, gameObjects) => {
      if (!this.pendingPlacementPointer || gameObjects.length > 0 || this.isPointerOnUi(pointer)) {
        this.pendingPlacementPointer = null;
        return;
      }

      const dragDistance = Phaser.Math.Distance.Between(
        this.pendingPlacementPointer.x,
        this.pendingPlacementPointer.y,
        pointer.x,
        pointer.y,
      );
      const releaseTile = this.pointerToTile(pointer);
      const sameTile = releaseTile
        && this.pendingPlacementPointer.tile
        && releaseTile.x === this.pendingPlacementPointer.tile.x
        && releaseTile.y === this.pendingPlacementPointer.tile.y;

      this.pendingPlacementPointer = null;

      if (dragDistance > 8 || !sameTile) {
        return;
      }

      this.tryPlace(pointer);
    });
  }

  updatePreview(pointer) {
    this.previewGraphics.clear();
    const tile = this.pointerToTile(pointer);
    if (!tile) {
      this.updateCursorInfo(null);
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    const color = validation.valid ? 0x22c55e : 0xef4444;
    const stroke = validation.valid ? 0xbbf7d0 : 0xfecaca;

    for (const footprintTile of validation.footprintTiles) {
      this.drawDiamond(this.previewGraphics, footprintTile.x, footprintTile.y, color, 0.45, stroke, 3);
    }

    this.updateCursorInfo(tile, validation);
  }

  tryPlace(pointer) {
    const tile = this.pointerToTile(pointer);
    if (!tile) {
      this.showMessage('지도 안쪽 타일을 선택하세요.', '#fecaca');
      return;
    }

    const validation = this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    if (!validation.valid) {
      this.showMessage(`배치 불가: ${validation.reason}`, '#fecaca');
      this.updateCursorInfo(tile, validation);
      return;
    }

    const before = this.registry.get('gameState');
    const after = GameState.applyEffect(before, this.selectedBuilding.effect);
    const occupiedTiles = this.placementSystem.place(tile.x, tile.y, this.selectedBuilding);

    this.registry.set('gameState', after);
    this.registry.set('lastPlacementResult', {
      building: this.selectedBuilding,
      position: { x: tile.x, y: tile.y },
      occupiedTiles,
      before,
      after,
      delta: this.selectedBuilding.effect,
    });

    const placementRecord = {
      id: `${this.selectedBuilding.id}-${Date.now()}-${this.placedBuildings.length}`,
      building: this.selectedBuilding,
      position: { x: tile.x, y: tile.y },
      occupiedTiles,
      delta: this.selectedBuilding.effect,
    };
    this.placedBuildings = [...this.placedBuildings, placementRecord];
    this.registry.set('placedBuildings', this.placedBuildings);
    LearningProgress.addPlacedBuilding(this.registry, this.selectedBuilding.id);

    this.drawPlacedBuilding(this.selectedBuilding, tile.x, tile.y);
    this.drawImpactMarkers(this.selectedBuilding, tile.x, tile.y);
    this.updateStatusBar();
    this.updateLastChangePanel(this.registry.get('lastPlacementResult'));
    this.updatePlacementHistoryPanel();
    this.updateContinueButton();
    this.showMessage(PlacementViewManager.formatPlacementSuccessMessage(this.selectedBuilding.name, this.placedBuildings.length), '#bbf7d0');
    this.updatePreview(pointer);
  }

  restorePlacedBuildings() {
    for (const record of this.placedBuildings) {
      this.placementSystem.place(record.position.x, record.position.y, record.building);
      this.drawPlacedBuilding(record.building, record.position.x, record.position.y);
      this.drawImpactMarkers(record.building, record.position.x, record.position.y, false);
    }
  }


  drawImpactMarkers(building, tileX, tileY, animate = true) {
    const center = this.getFootprintCenter(tileX, tileY, building.footprint);
    const markerData = this.getImpactMarkerData(building);
    const markerContainer = this.add.container(center.x, center.y - 92).setDepth(45 + tileX + tileY);

    const bubble = this.add.circle(0, 0, 34, markerData.color, 0.9)
      .setStrokeStyle(3, 0xffffff, 0.95);
    const icon = this.add.text(0, -2, markerData.icon, {
      fontSize: '30px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const labelBg = this.add.rectangle(0, 48, 170, 34, 0x0f172a, 0.85)
      .setStrokeStyle(2, markerData.color, 0.9);
    const label = this.add.text(0, 48, markerData.label, {
      fontSize: '17px',
      color: '#ffffff',
    }).setOrigin(0.5);

    markerContainer.add([bubble, icon, labelBg, label]);

    if (animate) {
      markerContainer.setScale(0.2);
      markerContainer.setAlpha(0.2);
      this.tweens.add({
        targets: markerContainer,
        scale: 1,
        alpha: 1,
        y: center.y - 112,
        duration: 280,
        ease: 'Back.Out',
      });
    }
  }

  getImpactMarkerData(building) {
    const effect = building.effect;
    if ((effect.environment ?? 0) > 0 || (effect.pollution ?? 0) < 0) {
      return { icon: '🌿', label: '환경 회복', color: 0x22c55e };
    }
    if ((effect.traffic ?? 0) < 0) {
      return { icon: '🚌', label: '이동 편의', color: 0xfacc15 };
    }
    if ((effect.population ?? 0) > 0 || (effect.economy ?? 0) > 0) {
      return { icon: '＋', label: '지역 활력', color: 0x38bdf8 };
    }
    return { icon: '✓', label: '시설 효과', color: 0x93c5fd };
  }

  drawPlacedBuilding(building, tileX, tileY) {    const graphics = this.add.graphics().setDepth(10 + tileX + tileY);
    for (const tile of this.placementSystem.getFootprintTiles(tileX, tileY, building.footprint)) {
      this.drawDiamond(graphics, tile.x, tile.y, building.color, 0.78, 0xffffff, 2);
    }

    const labelPosition = this.getFootprintCenter(tileX, tileY, building.footprint);
    graphics.fillStyle(0x0f172a, 0.82);
    graphics.fillRoundedRect(labelPosition.x - 64, labelPosition.y - 52, 128, 34, 8);
    const label = this.add.text(labelPosition.x, labelPosition.y - 35, building.name, {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(30 + tileX + tileY);

    this.mapLabels.add(label);
  }

  drawDiamond(graphics, tileX, tileY, fillColor, alpha, strokeColor, strokeWidth) {
    const center = this.tileToWorld(tileX, tileY);
    const points = [
      new Phaser.Geom.Point(center.x, center.y - this.halfTileHeight),
      new Phaser.Geom.Point(center.x + this.halfTileWidth, center.y),
      new Phaser.Geom.Point(center.x, center.y + this.halfTileHeight),
      new Phaser.Geom.Point(center.x - this.halfTileWidth, center.y),
    ];

    graphics.fillStyle(fillColor, alpha);
    graphics.fillPoints(points, true);
    graphics.lineStyle(strokeWidth, strokeColor, 0.9);
    graphics.strokePoints(points, true);
  }

  tileToWorld(tileX, tileY) {
    return {
      x: this.mapOrigin.x + (tileX - tileY) * this.halfTileWidth,
      y: this.mapOrigin.y + (tileX + tileY) * this.halfTileHeight,
    };
  }

  pointerToTile(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const localX = worldPoint.x - this.mapOrigin.x;
    const localY = worldPoint.y - this.mapOrigin.y;
    const approximateX = (localX / this.halfTileWidth + localY / this.halfTileHeight) / 2;
    const approximateY = (localY / this.halfTileHeight - localX / this.halfTileWidth) / 2;
    const tileX = Math.floor(approximateX + 0.5);
    const tileY = Math.floor(approximateY + 0.5);

    if (tileX < 0 || tileY < 0 || tileX >= this.placementSystem.mapData.width || tileY >= this.placementSystem.mapData.height) {
      return null;
    }

    return { x: tileX, y: tileY };
  }

  getFootprintCenter(tileX, tileY, footprint) {
    const start = this.tileToWorld(tileX, tileY);
    const end = this.tileToWorld(tileX + footprint.width - 1, tileY + footprint.height - 1);
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }

  updateCursorInfo(tile, validation = null) {
    if (!this.cursorInfoText) {
      return;
    }

    if (!tile) {
      const cursorState = PlacementViewManager.formatCursorInfo(null);
      this.cursorInfoText.setText(cursorState.text);
      this.cursorInfoText.setColor(cursorState.color);
      return;
    }

    const mapTile = this.placementSystem.getTile(tile.x, tile.y);
    const status = validation ?? this.placementSystem.validatePlacement(tile.x, tile.y, this.selectedBuilding);
    const cursorState = PlacementViewManager.formatCursorInfo(tile, mapTile, status, TILE_LABELS, ZONE_LABELS);
    this.cursorInfoText.setText(cursorState.text);
    this.cursorInfoText.setColor(cursorState.color);

  }

  updateStatusBar() {
    if (!this.statusText) {
      return;
    }
    const state = this.registry.get('gameState');
    this.statusText.setText(PlacementViewManager.formatStatusText(state));

  }

  updateLastChangePanel(lastPlacementResult = this.registry.get('lastPlacementResult')) {
    if (!this.lastChangeText) {
      return;
    }

    const lastChangeState = PlacementViewManager.formatLastChangeState(lastPlacementResult);
    this.lastChangeText.setText(lastChangeState.text);
    this.lastChangeText.setColor(lastChangeState.color);
  }

  updatePlacementHistoryPanel() {
    if (!this.placementHistoryText) {
      return;
    }

    const historyState = PlacementViewManager.formatPlacementHistoryState(this.placedBuildings);
    this.placementHistoryText.setText(historyState.text);
    this.placementHistoryText.setColor(historyState.color);
  }

  updateContinueButton() {
    const continueState = PlacementViewManager.getContinueState(this.placedBuildings.length, this.selectedPolicy);

    if (this.missionText) {
      this.missionText.setText(continueState.missionText);
    }

    if (this.continueButton) {
      this.continueButton.setText(continueState.buttonText);
      this.continueButton.setAlpha(continueState.buttonAlpha);
    }

    if (this.continueButtonBg) {
      this.continueButtonBg.setFillStyle(continueState.backgroundFillColor, continueState.backgroundAlpha);
      this.continueButtonBg.setStrokeStyle(3, continueState.strokeColor);
    }
  }

  showMessage(message, color = '#fde68a') {
    if (!this.messageText) {
      return;
    }
    this.messageText.setText(message);
    this.messageText.setColor(color);
  }

  isPointerOnUi(pointer) {
    return pointer.x < 430 || pointer.y < 98 || pointer.y > 930;
  }
}
