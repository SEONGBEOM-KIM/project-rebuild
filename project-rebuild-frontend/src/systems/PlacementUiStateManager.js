import { STATE_LABELS, formatEffect, formatSignedValue } from '../data/stateLabels.js';
import { REQUIRED_PLACEMENTS, TILE_LABELS, ZONE_LABELS } from './PlacementViewManager.js';

export default class PlacementUiStateManager {
  static formatMapSelectMessage() {
    return '지도 안쪽 타일을 선택하세요.';
  }

  static formatInvalidPlacementMessage(reason) {
    return `배치 불가: ${reason}`;
  }

  static formatBuildingSelectedMessage(building) {
    if (typeof building === 'string') {
      return `${building} 선택됨`;
    }

    return [
      `${building.name} 선택됨`,
      `조건: ${building.placementHint}`,
      building.balanceNote ? `균형: ${building.balanceNote}` : null,
      `효과: ${formatEffect(building.effect)}`,
    ].filter(Boolean).join('\n');
  }

  static formatCursorInfo(tile, mapTile, validation) {
    if (!tile) {
      return {
        text: '커서 타일: 지도 밖 또는 UI 영역',
        color: '#bfdbfe',
      };
    }

    const tileLabel = TILE_LABELS[mapTile?.type] ?? mapTile?.type ?? '알 수 없음';
    const zoneLabel = ZONE_LABELS[mapTile?.zone] ?? mapTile?.zone ?? '알 수 없음';
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
      return PlacementUiStateManager.getEmptyLastChangeState();
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
      return PlacementUiStateManager.getEmptyPlacementHistoryState();
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

  static canContinue(placedCount, requiredPlacements = REQUIRED_PLACEMENTS) {
    return placedCount >= requiredPlacements;
  }

  static getContinueState(placedCount, selectedPolicy, requiredPlacements = REQUIRED_PLACEMENTS) {
    const enabled = PlacementUiStateManager.canContinue(placedCount, requiredPlacements);
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
}
