import { STATE_LABELS, formatSignedValue } from '../data/stateLabels.js';


export const TILE_COLORS = {
  empty: 0x2f855a,
  forest: 0x166534,
  road: 0x64748b,
  river: 0x2563eb,
};

export const TILE_STROKES = {
  buildable: 0x86efac,
  blocked: 0x334155,
};

export const TILE_LABELS = {
  empty: '빈 땅',
  forest: '숲',
  road: '도로',
  river: '강',
};

export const ZONE_LABELS = {
  center: '중심지',
  outskirts: '외곽',
  nature: '자연',
  traffic: '교통',
};

export const REQUIRED_PLACEMENTS = 3;
export const PLACEMENT_DRAG_THRESHOLD = 8;

export const PLACEMENT_UI_BOUNDS = {
  leftPanelRight: 430,
  topBarBottom: 98,
  bottomUiTop: 930,
};

export const PLACEMENT_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'placement',
  topHint: {
    x: 460,
    y: 120,
    text: '마우스 드래그: 지도 이동  |  휠: 확대/축소  |  초록: 배치 가능 / 빨강: 불가능',
    fontSize: '24px',
    color: '#bfdbfe',
  },
  mapOrigin: { x: 940, y: 260 },
};

export const PLACEMENT_CAMERA_CONFIG = {
  minZoom: 0.8,
  maxZoom: 2.2,
  bounds: { x: 0, y: 0, width: 1900, height: 1300 },
};

export const RECOMMENDATION_BADGE_STYLE = {
  width: 72,
  height: 28,
  fillColor: 0xfde68a,
  fillAlpha: 1,
  strokeColor: 0xf59e0b,
  text: '추천',
  textColor: '#78350f',
  textFontSize: '16px',
  textFontStyle: 'bold',
};

export const PREVIEW_STYLES = {
  valid: {
    fillColor: 0x22c55e,
    fillAlpha: 0.45,
    strokeColor: 0xbbf7d0,
    strokeWidth: 3,
  },
  invalid: {
    fillColor: 0xef4444,
    fillAlpha: 0.45,
    strokeColor: 0xfecaca,
    strokeWidth: 3,
  },
};


export const PLACEMENT_UI_LAYOUT = {
  leftPanel: { x: 210, y: 540, width: 380, height: 1000, fillColor: 0x111827, alpha: 0.94, strokeColor: 0x60a5fa },
  title: { x: 40, y: 54, text: '건물 선택' },
  subtitle: { x: 40, y: 100, text: '샘플 3종 중 하나를 고른 뒤\n지도 위에 배치하세요.' },
  mission: { x: 40, y: 145 },
  buildingList: { x: 40, startY: 185, gapY: 165 },
  status: { x: 40, y: 690 },
  cursorInfo: { x: 40, y: 842, text: '커서 타일: 지도 위로 이동하세요.', wordWrapWidth: 320 },
  message: { x: 40, y: 925, text: '아직 배치된 건물이 없습니다.', wordWrapWidth: 325 },
  continueButton: { x: 1615, y: 985, width: 300, height: 72, text: '시설 3개 더 배치', target: 'ResultScene', backgroundColor: 0x94a3b8, alpha: 1, strokeColor: 0xe2e8f0 },
  legendPanel: { x: 1615, y: 150, width: 330, height: 190, fillColor: 0x111827, alpha: 0.88, strokeColor: 0x475569 },
  legendTitle: { x: 1480, y: 76, text: '타일 범례' },
  legendSwatch: { x: 1492, yOffset: 10, width: 26, height: 20 },
  legendText: { x: 1520, startY: 118, gapY: 34 },
  lastChangePanel: { x: 1615, y: 385, width: 330, height: 260, fillColor: 0x111827, alpha: 0.88, strokeColor: 0xfde68a },
  lastChangeTitle: { x: 1478, y: 275, text: '최근 변화' },
  lastChangeBody: { x: 1478, y: 318, wordWrapWidth: 270 },
  historyPanel: { x: 1615, y: 655, width: 330, height: 250, fillColor: 0x111827, alpha: 0.88, strokeColor: 0x93c5fd },
  historyTitle: { x: 1478, y: 545, text: '배치 기록' },
  historyBody: { x: 1478, y: 588, wordWrapWidth: 280 },
};

export const BUILDING_CARD_LAYOUT = {
  card: { offsetX: 150, offsetY: 64, width: 300, height: 146 },
  swatch: { offsetX: 36, offsetY: 54, width: 38, height: 38 },
  title: { offsetX: 70, offsetY: 18 },
  recommendationBadge: { offsetX: 246, offsetY: 24 },
  detail: { offsetX: 70, offsetY: 52 },
  description: { offsetX: 24, offsetY: 78, wrapWidth: 255 },
  placementHint: { offsetX: 24, offsetY: 112, wrapWidth: 265 },
  effect: { offsetX: 24, offsetY: 142, wrapWidth: 265 },
};


export const PLACEMENT_MAP_VISUALS = {
  tile: { alpha: 0.88, strokeWidth: 1.5 },
  placedBuilding: { alpha: 0.78, strokeColor: 0xffffff, strokeWidth: 2, depthBase: 10 },
  buildingLabel: {
    width: 128,
    height: 34,
    radius: 8,
    offsetY: -52,
    textOffsetY: -35,
    fillColor: 0x0f172a,
    fillAlpha: 0.82,
    depthBase: 30,
    textFontSize: '18px',
    textColor: '#ffffff',
  },
  impactMarker: {
    containerOffsetY: -92,
    animatedTargetOffsetY: -112,
    depthBase: 45,
    bubbleRadius: 34,
    bubbleAlpha: 0.9,
    bubbleStrokeColor: 0xffffff,
    bubbleStrokeAlpha: 0.95,
    bubbleStrokeWidth: 3,
    iconY: -2,
    labelY: 48,
    labelWidth: 170,
    labelHeight: 34,
    labelFillColor: 0x0f172a,
    labelFillAlpha: 0.85,
    labelStrokeAlpha: 0.9,
    labelStrokeWidth: 2,
    initialScale: 0.2,
    initialAlpha: 0.2,
    tweenDuration: 280,
    tweenEase: 'Back.Out',
    iconFontSize: '30px',
    iconColor: '#ffffff',
    iconFontStyle: 'bold',
    labelFontSize: '17px',
    labelColor: '#ffffff',
  },
};

export const PLACEMENT_FIXED_UI_STYLE = {
  rectangleStrokeWidth: 3,
};

export const PLACEMENT_TEXT_STYLES = {
  title: { fontSize: '34px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { fontSize: '22px', color: '#bfdbfe', lineSpacing: 8 },
  mission: { fontSize: '20px', color: '#fde68a', lineSpacing: 6 },
  status: { fontSize: '20px', color: '#f8fafc', lineSpacing: 8 },
  cursorInfo: { fontSize: '18px', color: '#bfdbfe', lineSpacing: 6 },
  message: { fontSize: '20px', color: '#fde68a' },
  continueButton: { fontSize: '30px', color: '#0f172a' },
  panelTitle: { fontSize: '26px', color: '#ffffff', fontStyle: 'bold' },
  legendText: { fontSize: '19px' },
  panelBody: { fontSize: '18px', lineSpacing: 6 },
  cardTitle: { fontSize: '25px', color: '#ffffff', fontStyle: 'bold' },
  cardDetail: { fontSize: '18px', color: '#cbd5e1' },
  cardDescription: { fontSize: '15px', color: '#bae6fd' },
  cardPlacementHint: { fontSize: '14px', color: '#fef3c7' },
  cardEffect: { fontSize: '14px', color: '#fde68a' },
  recommendationBadge: { fontSize: RECOMMENDATION_BADGE_STYLE.textFontSize, color: RECOMMENDATION_BADGE_STYLE.textColor, fontStyle: RECOMMENDATION_BADGE_STYLE.textFontStyle },
  impactIcon: { fontSize: PLACEMENT_MAP_VISUALS.impactMarker.iconFontSize, color: PLACEMENT_MAP_VISUALS.impactMarker.iconColor, fontStyle: PLACEMENT_MAP_VISUALS.impactMarker.iconFontStyle },
  impactLabel: { fontSize: PLACEMENT_MAP_VISUALS.impactMarker.labelFontSize, color: PLACEMENT_MAP_VISUALS.impactMarker.labelColor },
  buildingLabel: { fontSize: PLACEMENT_MAP_VISUALS.buildingLabel.textFontSize, color: PLACEMENT_MAP_VISUALS.buildingLabel.textColor },
};

export default class PlacementViewManager {
  static getScreenLayout() {
    return {
      background: { color: PLACEMENT_SCREEN_LAYOUT.backgroundColor },
      progressStep: PLACEMENT_SCREEN_LAYOUT.progressStep,
      topHint: { ...PLACEMENT_SCREEN_LAYOUT.topHint },
      mapOrigin: { ...PLACEMENT_SCREEN_LAYOUT.mapOrigin },
    };
  }

  static getCameraConfig() {
    return {
      minZoom: PLACEMENT_CAMERA_CONFIG.minZoom,
      maxZoom: PLACEMENT_CAMERA_CONFIG.maxZoom,
      bounds: { ...PLACEMENT_CAMERA_CONFIG.bounds },
    };
  }

  static getRecommendationBadgeLayout(x, y) {
    return {
      background: {
        x,
        y,
        width: RECOMMENDATION_BADGE_STYLE.width,
        height: RECOMMENDATION_BADGE_STYLE.height,
        fillColor: RECOMMENDATION_BADGE_STYLE.fillColor,
        fillAlpha: RECOMMENDATION_BADGE_STYLE.fillAlpha,
        strokeColor: RECOMMENDATION_BADGE_STYLE.strokeColor,
      },
      text: { x, y, text: RECOMMENDATION_BADGE_STYLE.text },
    };
  }

  static getUiLayout() {
    return PLACEMENT_UI_LAYOUT;
  }

  static getFixedUiStyle() {
    return { ...PLACEMENT_FIXED_UI_STYLE };
  }

  static getTextStyles() {
    return {
      title: { ...PLACEMENT_TEXT_STYLES.title },
      subtitle: { ...PLACEMENT_TEXT_STYLES.subtitle },
      mission: { ...PLACEMENT_TEXT_STYLES.mission },
      status: { ...PLACEMENT_TEXT_STYLES.status },
      cursorInfo: { ...PLACEMENT_TEXT_STYLES.cursorInfo },
      message: { ...PLACEMENT_TEXT_STYLES.message },
      continueButton: { ...PLACEMENT_TEXT_STYLES.continueButton },
      panelTitle: { ...PLACEMENT_TEXT_STYLES.panelTitle },
      legendText: { ...PLACEMENT_TEXT_STYLES.legendText },
      panelBody: { ...PLACEMENT_TEXT_STYLES.panelBody },
      cardTitle: { ...PLACEMENT_TEXT_STYLES.cardTitle },
      cardDetail: { ...PLACEMENT_TEXT_STYLES.cardDetail },
      cardDescription: { ...PLACEMENT_TEXT_STYLES.cardDescription },
      cardPlacementHint: { ...PLACEMENT_TEXT_STYLES.cardPlacementHint },
      cardEffect: { ...PLACEMENT_TEXT_STYLES.cardEffect },
      recommendationBadge: { ...PLACEMENT_TEXT_STYLES.recommendationBadge },
      impactIcon: { ...PLACEMENT_TEXT_STYLES.impactIcon },
      impactLabel: { ...PLACEMENT_TEXT_STYLES.impactLabel },
      buildingLabel: { ...PLACEMENT_TEXT_STYLES.buildingLabel },
    };
  }

  static getBuildingCardLayout(x, y) {
    const layout = BUILDING_CARD_LAYOUT;
    return {
      card: { ...layout.card, x: x + layout.card.offsetX, y: y + layout.card.offsetY },
      swatch: { ...layout.swatch, x: x + layout.swatch.offsetX, y: y + layout.swatch.offsetY },
      title: { ...layout.title, x: x + layout.title.offsetX, y: y + layout.title.offsetY },
      recommendationBadge: { ...layout.recommendationBadge, x: x + layout.recommendationBadge.offsetX, y: y + layout.recommendationBadge.offsetY },
      detail: { ...layout.detail, x: x + layout.detail.offsetX, y: y + layout.detail.offsetY },
      description: { ...layout.description, x: x + layout.description.offsetX, y: y + layout.description.offsetY, wordWrapWidth: layout.description.wrapWidth },
      placementHint: { ...layout.placementHint, x: x + layout.placementHint.offsetX, y: y + layout.placementHint.offsetY, wordWrapWidth: layout.placementHint.wrapWidth },
      effect: { ...layout.effect, x: x + layout.effect.offsetX, y: y + layout.effect.offsetY, wordWrapWidth: layout.effect.wrapWidth },
    };
  }

  static formatBuildingDetail(building) {
    return `${building.footprint.width}×${building.footprint.height} | 비용 ${building.cost}`;
  }

  static formatPlacementHint(building) {
    return `조건: ${building.placementHint}`;
  }


  static getMapTileVisual(tile) {
    const tileStyle = PlacementViewManager.getTileRenderStyle(tile);
    return {
      ...tileStyle,
      alpha: PLACEMENT_MAP_VISUALS.tile.alpha,
      strokeWidth: PLACEMENT_MAP_VISUALS.tile.strokeWidth,
    };
  }

  static getPlacedBuildingVisual(building, tileX, tileY) {
    return {
      fillColor: building.color,
      alpha: PLACEMENT_MAP_VISUALS.placedBuilding.alpha,
      strokeColor: PLACEMENT_MAP_VISUALS.placedBuilding.strokeColor,
      strokeWidth: PLACEMENT_MAP_VISUALS.placedBuilding.strokeWidth,
      depth: PLACEMENT_MAP_VISUALS.placedBuilding.depthBase + tileX + tileY,
    };
  }

  static getBuildingLabelLayout(labelPosition, tileX, tileY) {
    const label = PLACEMENT_MAP_VISUALS.buildingLabel;
    return {
      background: {
        x: labelPosition.x - label.width / 2,
        y: labelPosition.y + label.offsetY,
        width: label.width,
        height: label.height,
        radius: label.radius,
        fillColor: label.fillColor,
        fillAlpha: label.fillAlpha,
      },
      text: {
        x: labelPosition.x,
        y: labelPosition.y + label.textOffsetY,
        depth: label.depthBase + tileX + tileY,
      },
    };
  }

  static getImpactMarkerLayout(center, tileX, tileY) {
    const marker = PLACEMENT_MAP_VISUALS.impactMarker;
    return {
      container: { x: center.x, y: center.y + marker.containerOffsetY, depth: marker.depthBase + tileX + tileY },
      bubble: { radius: marker.bubbleRadius, alpha: marker.bubbleAlpha, strokeColor: marker.bubbleStrokeColor, strokeAlpha: marker.bubbleStrokeAlpha, strokeWidth: marker.bubbleStrokeWidth },
      icon: { x: 0, y: marker.iconY },
      labelBackground: { x: 0, y: marker.labelY, width: marker.labelWidth, height: marker.labelHeight, fillColor: marker.labelFillColor, fillAlpha: marker.labelFillAlpha, strokeAlpha: marker.labelStrokeAlpha, strokeWidth: marker.labelStrokeWidth },
      label: { x: 0, y: marker.labelY },
      animation: {
        initialScale: marker.initialScale,
        initialAlpha: marker.initialAlpha,
        targetY: center.y + marker.animatedTargetOffsetY,
        duration: marker.tweenDuration,
        ease: marker.tweenEase,
      },
    };
  }

  static getTileRenderStyle(tile) {
    return {
      color: TILE_COLORS[tile.type] ?? TILE_COLORS.empty,
      stroke: tile.buildable ? TILE_STROKES.buildable : TILE_STROKES.blocked,
    };
  }

  static getLegendItems() {
    return [
      { label: '빈 땅', color: TILE_COLORS.empty, note: '배치 가능' },
      { label: '숲', color: TILE_COLORS.forest, note: '배치 불가' },
      { label: '도로', color: TILE_COLORS.road, note: '배치 불가' },
      { label: '강', color: TILE_COLORS.river, note: '배치 불가' },
    ];
  }

  static getLegendTextColor(item) {
    return item.note === '배치 가능' ? '#bbf7d0' : '#fecaca';
  }

  static getImpactMarkerData(building) {
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

  static getPreviewStyle(validation) {
    return validation.valid ? PREVIEW_STYLES.valid : PREVIEW_STYLES.invalid;
  }

  static isDragPlacementCandidate(dragDistance, sameTile, threshold = PLACEMENT_DRAG_THRESHOLD) {
    return dragDistance <= threshold && Boolean(sameTile);
  }

  static isPointerOnUi(pointer, bounds = PLACEMENT_UI_BOUNDS) {
    return pointer.x < bounds.leftPanelRight || pointer.y < bounds.topBarBottom || pointer.y > bounds.bottomUiTop;
  }

  static formatMapSelectMessage() {
    return '지도 안쪽 타일을 선택하세요.';
  }

  static formatInvalidPlacementMessage(reason) {
    return `배치 불가: ${reason}`;
  }

  static formatBuildingSelectedMessage(buildingName) {
    return `${buildingName} 선택됨`;
  }

  static formatCursorInfo(tile, mapTile, validation, tileLabels, zoneLabels) {
    if (!tile) {
      return {
        text: '커서 타일: 지도 밖 또는 UI 영역',
        color: '#bfdbfe',
      };
    }

    const tileLabel = tileLabels[mapTile?.type] ?? mapTile?.type ?? '알 수 없음';
    const zoneLabel = zoneLabels[mapTile?.zone] ?? mapTile?.zone ?? '알 수 없음';
    return {
      text: [
        `커서 타일: (${tile.x}, ${tile.y})`,
        `지형: ${tileLabel} / 구역: ${zoneLabel}`,
        validation.valid ? '판정: 배치 가능' : '판정: 배치 불가',
        validation.valid ? '' : `이유: ${validation.reason}`,
      ].filter(Boolean).join('\n'),
      color: validation.valid ? '#bbf7d0' : '#fecaca',
    };
  }

  static formatStatusText(state) {
    return [
      '현재 상태',
      `인구: ${state.population}`,
      `경제: ${state.economy}`,
      `환경: ${state.environment}`,
      `만족도: ${state.satisfaction}`,
      `예산: ${state.budget}`,
      `교통: ${state.traffic}`,
      `오염: ${state.pollution}`,
    ].join('\n');
  }

  static getEmptyLastChangeState() {
    return {
      text: '아직 배치된 시설이 없습니다.\n건물을 배치하면 변화 수치가\n여기에 표시됩니다.',
      color: '#fde68a',
    };
  }

  static formatLastChangeState(lastPlacementResult) {
    if (!lastPlacementResult) {
      return PlacementViewManager.getEmptyLastChangeState();
    }

    const changedRows = Object.entries(lastPlacementResult.delta)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => {
        const before = lastPlacementResult.before[key] ?? 0;
        const after = lastPlacementResult.after[key] ?? before + value;
        return `• ${STATE_LABELS[key] ?? key}: ${before} → ${after} (${formatSignedValue(value)})`;
      });

    return {
      text: [
        `${lastPlacementResult.building.name} 배치`,
        `위치: (${lastPlacementResult.position.x}, ${lastPlacementResult.position.y})`,
        '',
        ...changedRows,
      ].join('\n'),
      color: '#fef3c7',
    };
  }

  static getEmptyPlacementHistoryState() {
    return {
      text: '아직 기록이 없습니다.\n시설을 배치하면 순서대로\n기록됩니다.',
      color: '#bfdbfe',
    };
  }

  static formatPlacementHistoryState(placedBuildings) {
    if (!placedBuildings.length) {
      return PlacementViewManager.getEmptyPlacementHistoryState();
    }

    const rows = placedBuildings
      .slice(-5)
      .map((record, index) => {
        const order = Math.max(1, placedBuildings.length - 4) + index;
        return `${order}. ${record.building.name} (${record.position.x}, ${record.position.y})`;
      });

    return {
      text: [
        `총 배치: ${placedBuildings.length}개`,
        '',
        ...rows,
      ].join('\n'),
      color: '#e0f2fe',
    };
  }

  static getContinueState(placedCount, selectedPolicy, requiredPlacements = REQUIRED_PLACEMENTS) {
    const enabled = placedCount >= requiredPlacements;
    const remaining = Math.max(0, requiredPlacements - placedCount);
    const policyLine = selectedPolicy ? `선택 방향: ${selectedPolicy.name}` : '선택 방향: 기본 배치 연습';
    const recommendedLine = selectedPolicy ? `추천 시설: ${selectedPolicy.recommendedBuildings.join(', ')}` : null;

    return {
      enabled,
      remaining,
      missionText: [
        policyLine,
        recommendedLine,
        `미션: 시설 ${requiredPlacements}개를 배치해`,
        '지역 상태 변화를 비교하세요.',
        `진행: ${placedCount}/${requiredPlacements}`,
        remaining > 0 ? `남은 배치: ${remaining}개` : '종합 결과 확인 가능',
      ].filter(Boolean).join('\n'),
      buttonText: enabled ? '종합 결과 확인' : `시설 ${remaining}개 더 배치`,
      buttonAlpha: enabled ? 1 : 0.75,
      backgroundFillColor: enabled ? 0x93c5fd : 0x94a3b8,
      backgroundAlpha: enabled ? 1 : 0.8,
      strokeColor: enabled ? 0xbfdbfe : 0xcbd5e1,
    };
  }

  static formatPlacementSuccessMessage(buildingName, placedCount, requiredPlacements = REQUIRED_PLACEMENTS) {
    const remaining = Math.max(0, requiredPlacements - placedCount);
    return remaining === 0
      ? `${buildingName} 배치 완료: 종합 결과를 확인할 수 있습니다.`
      : `${buildingName} 배치 완료: 시설 ${remaining}개를 더 배치하세요.`;
  }

  static formatNeedMoreMessage(placedCount, requiredPlacements = REQUIRED_PLACEMENTS) {
    const remaining = Math.max(0, requiredPlacements - placedCount);
    return `종합 결과를 보려면 시설 ${remaining}개를 더 배치하세요.`;
  }

  static getBuildingCardStyle(buildingId, selectedBuilding, recommended) {
    const selected = buildingId === selectedBuilding.id;
    const strokeColor = selected ? 0xfde68a : recommended ? 0xf59e0b : 0x475569;
    return {
      selected,
      strokeWidth: selected ? 5 : recommended ? 4 : 3,
      strokeColor,
      fillColor: selected ? 0x334155 : recommended ? 0x2b250f : 0x1e293b,
      fillAlpha: 1,
    };
  }
}
