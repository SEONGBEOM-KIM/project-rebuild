import { DEFAULT_STATE_KEYS, STATE_LABELS, formatEffect, formatSignedValue } from '../data/stateLabels.js';
import StateHudManager from './StateHudManager.js';
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
      building.balanceSummary ? `균형: ${building.balanceSummary}` : null,
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

  static formatStatusText(state, stateKeys = DEFAULT_STATE_KEYS) {
    return StateHudManager.formatStackedText(state, { stateKeys });
  }

  static getEmptyLastChangeState() {
    return {
      text: '아직 배치된 시설이 없습니다.\n건물을 배치하면 변화 수치가\n여기에 표시됩니다.',
      color: '#fde68a',
    };
  }

  static formatLastChangeState(lastPlacementResult, stateKeys = null) {
    if (!lastPlacementResult) {
      return PlacementUiStateManager.getEmptyLastChangeState();
    }

    const visibleStateKeys = stateKeys ? new Set(stateKeys) : null;
    const changedRows = Object.entries(lastPlacementResult.delta)
      .filter(([key, value]) => value !== 0 && (!visibleStateKeys || visibleStateKeys.has(key)))
      .map(([key, value]) => {
        const before = lastPlacementResult.before[key] ?? 0;
        const after = lastPlacementResult.after[key] ?? before + value;
        return `• ${STATE_LABELS[key] ?? key}: ${before} → ${after} (${formatSignedValue(value)})`;
      });

    return {
      text: [
        `${lastPlacementResult.building.name} 배치`,
        `위치: (${lastPlacementResult.position.x}, ${lastPlacementResult.position.y})`,
        lastPlacementResult.building.balanceSummary ? `균형: ${lastPlacementResult.building.balanceSummary}` : null,
        '',
        ...changedRows,
      ].filter((row) => row !== null).join('\n'),
      color: '#fef3c7',
    };
  }

  static getEmptyPlacementHistoryState() {
    return {
      text: '아직 기록이 없습니다.\n시설을 배치하면 순서대로\n기록됩니다.',
      color: '#bfdbfe',
    };
  }


  static formatPlacementDeltaSummary(delta = {}, stateKeys = null) {
    const visibleStateKeys = stateKeys ? new Set(stateKeys) : null;
    return Object.entries(delta)
      .filter(([key, value]) => value !== 0 && (!visibleStateKeys || visibleStateKeys.has(key)))
      .map(([key, value]) => `${STATE_LABELS[key] ?? key} ${formatSignedValue(value)}`)
      .join(' / ');
  }

  static formatPlacementHistoryState(placedBuildings, stateKeys = null) {
    if (!placedBuildings.length) {
      return PlacementUiStateManager.getEmptyPlacementHistoryState();
    }

    const rows = placedBuildings
      .slice(-5)
      .map((record, index) => {
        const order = Math.max(1, placedBuildings.length - 4) + index;
        const deltaSummary = PlacementUiStateManager.formatPlacementDeltaSummary(record.delta, stateKeys);
        return [
          `${order}. ${record.building.name} (${record.position.x}, ${record.position.y})`,
          deltaSummary ? `   ${deltaSummary}` : null,
        ].filter(Boolean).join('\n');
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

  static formatStrategySuccessProgress(strategy, currentState = null) {
    if (!strategy?.successChecks?.length) {
      return null;
    }

    if (!currentState) {
      return `성공 기준: ${strategy.successChecks.map((check) => check.label).join(' · ')}`;
    }

    const checked = strategy.successChecks.map((check) => {
      const value = currentState[check.key] ?? 0;
      const passedMin = check.min == null || value >= check.min;
      const passedMax = check.max == null || value <= check.max;
      const target = check.min != null ? check.min : check.max;
      const comparator = check.min != null ? '≥' : '≤';
      return {
        ...check,
        value,
        target,
        comparator,
        passed: passedMin && passedMax,
      };
    });
    const passedCount = checked.filter((check) => check.passed).length;
    const checkText = checked
      .map((check) => `${check.passed ? '✓' : '·'} ${STATE_LABELS[check.key] ?? check.key} ${check.value}${check.comparator}${check.target}`)
      .join(' / ');
    return `성공 기준: ${passedCount}/${checked.length} · ${checkText}`;
  }

  static getContinueState(placedCount, selectedPolicy, selectedStrategy = null, requiredPlacements = REQUIRED_PLACEMENTS, currentState = null) {
    const resolvedRequiredPlacements = typeof selectedStrategy === 'number' ? selectedStrategy : requiredPlacements;
    const strategy = typeof selectedStrategy === 'number' ? null : selectedStrategy;
    const enabled = PlacementUiStateManager.canContinue(placedCount, resolvedRequiredPlacements);
    const remaining = Math.max(0, resolvedRequiredPlacements - placedCount);
    const strategyLine = strategy ? `EP2 전략: ${strategy.title}` : null;
    const strategyGoalLine = strategy?.placementGoalShort ? `목표: ${strategy.placementGoalShort}` : null;
    const strategyObservationLine = strategy?.observationPointShort ? `관찰: ${strategy.observationPointShort}` : null;
    const strategySuccessLine = PlacementUiStateManager.formatStrategySuccessProgress(strategy, currentState);
    const policyLine = strategy ? null : selectedPolicy ? `선택 방향: ${selectedPolicy.name}` : '선택 방향: 기본 배치 연습';
    const recommendedLine = strategy ? null : selectedPolicy ? `추천 시설: ${selectedPolicy.recommendedBuildings.join(', ')}` : null;

    return {
      enabled,
      remaining,
      missionText: [
        strategyLine,
        strategyGoalLine,
        strategyObservationLine,
        strategySuccessLine,
        policyLine,
        recommendedLine,
        remaining > 0
          ? `배치: ${placedCount}/${resolvedRequiredPlacements} · 남은 ${remaining}개`
          : `배치: ${placedCount}/${resolvedRequiredPlacements} · 종합 결과 확인 가능`,
      ].filter(Boolean).join('\n'),
      buttonText: enabled ? '종합 결과 확인' : `시설 ${remaining}개 더 배치`,
      buttonAlpha: enabled ? 1 : 0.75,
      backgroundFillColor: enabled ? 0x93c5fd : 0x94a3b8,
      backgroundAlpha: enabled ? 1 : 0.8,
      strokeColor: enabled ? 0xbfdbfe : 0xcbd5e1,
    };
  }

  static formatPlacementSuccessMessage(building, placedCount, requiredPlacements = REQUIRED_PLACEMENTS) {
    const remaining = Math.max(0, requiredPlacements - placedCount);
    const buildingName = typeof building === 'string' ? building : building.name;
    const effectLine = typeof building === 'string' ? null : `변화: ${formatEffect(building.effect)}`;
    const nextStepLine = remaining === 0
      ? '종합 결과를 확인할 수 있습니다.'
      : `시설 ${remaining}개를 더 배치하세요.`;

    return [
      `${buildingName} 배치 완료`,
      effectLine,
      nextStepLine,
    ].filter(Boolean).join('\n');
  }

  static formatNeedMoreMessage(placedCount, requiredPlacements = REQUIRED_PLACEMENTS) {
    const remaining = Math.max(0, requiredPlacements - placedCount);
    return `종합 결과를 보려면 시설 ${remaining}개를 더 배치하세요.`;
  }
}
