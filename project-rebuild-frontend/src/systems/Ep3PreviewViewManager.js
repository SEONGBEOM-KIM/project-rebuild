import SCENE_KEYS from '../data/sceneKeys.js';
import { EPISODE_IDS } from '../data/episodes.js';
import StateHudManager from './StateHudManager.js';

const EP3_PREVIEW_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 76, text: 'EP3. 경제 성장 미션', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 142, text: '푸른군의 일자리·상권·물류 성장 방향을 선택할 준비를 합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const EP3_PREVIEW_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0xfde68a,
  titleFontSize: '32px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '21px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 5,
};

const EP3_PREVIEW_CARD_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  selectedFillColor: 0xfffbeb,
  selectedFillAlpha: 1,
  strokeWidth: 4,
  selectedStrokeWidth: 7,
  strokeColor: 0x93c5fd,
  titleFontSize: '30px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
  bodyFontSize: '21px',
  bodyColor: '#1e293b',
  bodyLineSpacing: 5,
};

const EP3_PREVIEW_NOTE_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0x86efac,
  titleFontSize: '28px',
  titleColor: '#bbf7d0',
  titleFontStyle: 'bold',
  bodyFontSize: '17px',
  bodyColor: '#dbeafe',
  bodyLineSpacing: 3,
};

const EP3_PREVIEW_BUTTON_STYLE = {
  fontSize: '28px',
  padding: { x: 34, y: 18 },
};

export default class Ep3PreviewViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: EP3_PREVIEW_LAYOUT.backgroundColor,
      progressStep: EP3_PREVIEW_LAYOUT.progressStep,
      title: { ...EP3_PREVIEW_LAYOUT.title, x: width / 2 },
      subtitle: { ...EP3_PREVIEW_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelStyle() {
    return { ...EP3_PREVIEW_PANEL_STYLE };
  }

  static getCardStyle(strategyId = null, selectedStrategyId = null, strategyColor = EP3_PREVIEW_CARD_STYLE.strokeColor) {
    const selected = Boolean(selectedStrategyId && strategyId === selectedStrategyId);
    return {
      ...EP3_PREVIEW_CARD_STYLE,
      fillColor: selected ? EP3_PREVIEW_CARD_STYLE.selectedFillColor : EP3_PREVIEW_CARD_STYLE.fillColor,
      fillAlpha: selected ? EP3_PREVIEW_CARD_STYLE.selectedFillAlpha : EP3_PREVIEW_CARD_STYLE.fillAlpha,
      strokeWidth: selected ? EP3_PREVIEW_CARD_STYLE.selectedStrokeWidth : EP3_PREVIEW_CARD_STYLE.strokeWidth,
      strokeColor: selected ? strategyColor : EP3_PREVIEW_CARD_STYLE.strokeColor,
      selected,
    };
  }

  static getNoteStyle() {
    return { ...EP3_PREVIEW_NOTE_STYLE };
  }

  static getButtonStyle() {
    return { ...EP3_PREVIEW_BUTTON_STYLE, padding: { ...EP3_PREVIEW_BUTTON_STYLE.padding } };
  }

  static getIntroPanelLayout() {
    return {
      panel: { x: 960, y: 250, width: 1510, height: 130 },
      title: { x: 250, y: 202, text: '경제 성장 미션 브리핑' },
      body: { x: 250, y: 240, wordWrapWidth: 1380 },
    };
  }

  static getWorldProgressLayout() {
    return {
      panel: { x: 960, y: 385, width: 1510, height: 110 },
      title: { x: 250, y: 345, text: '푸른군 현재 현황' },
      body: { x: 505, y: 342, wordWrapWidth: 780 },
      modeStatus: { x: 505, y: 404, wordWrapWidth: 780 },
    };
  }

  static getFocusCardLayout(index) {
    const positions = [
      { x: 420, y: 620 },
      { x: 960, y: 620 },
      { x: 1500, y: 620 },
    ];
    const position = positions[index];
    return {
      panel: { x: position.x, y: position.y, width: 440, height: 300 },
      icon: { x: position.x, y: position.y - 112 },
      title: { x: position.x, y: position.y - 56, wordWrapWidth: 360 },
      body: { x: position.x - 195, y: position.y - 16, wordWrapWidth: 390 },
      selection: { x: position.x, y: position.y + 132 },
    };
  }

  static getTransitionNoteLayout() {
    return {
      panel: { x: 960, y: 855, width: 1510, height: 170 },
      title: { x: 250, y: 790, text: 'EP3 배치 준비' },
      policyBody: { x: 250, y: 820, wordWrapWidth: 650 },
      buildingBody: { x: 975, y: 820, wordWrapWidth: 650 },
    };
  }

  static getControlLayout(centerX) {
    return {
      ending: { x: centerX - 420, y: 1000, label: '마무리로 돌아가기', target: SCENE_KEYS.Ending, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      start: { x: centerX, y: 1000, label: 'EP3 배치 연습 시작', target: SCENE_KEYS.Placement, backgroundColor: '#bbf7d0', textColor: '#123524' },
      restart: { x: centerX + 420, y: 1000, label: '처음부터 다시', target: SCENE_KEYS.Boot, backgroundColor: '#fde68a', textColor: '#0f172a' },
    };
  }

  static formatIntroText(preview) {
    return preview.intro.join('\n');
  }

  static formatWorldProgress(worldState = {}) {
    const completedEpisodeIds = worldState.completedEpisodeIds ?? [];
    const completedEp2 = completedEpisodeIds.includes(EPISODE_IDS.PopulationRecovery);
    const placements = worldState.placements ?? [];
    const facilityNames = [...new Set(
      placements.map((record) => record.building?.name ?? record.buildingName ?? record.buildingId).filter(Boolean),
    )];
    const facilityText = facilityNames.length
      ? `완료 시설 ${placements.length}개: ${facilityNames.slice(0, 3).join(' · ')}`
      : '완료 시설: 아직 없음';
    const stateText = worldState.gameState
      ? StateHudManager.formatCompactText(worldState.gameState, { stateKeys: ['population', 'economy', 'budget'] })
      : '이전 지역 상태: 아직 저장된 결과 없음';

    return [
      completedEp2 ? 'EP2 배치 완료 · 경제 성장 단계로 진입합니다.' : 'EP2 배치 결과를 완료하면 푸른군 기록에 반영됩니다.',
      `${facilityText}  |  ${stateText}`,
    ].join('\n');
  }

  static formatWorldModeStatus(worldState = {}) {
    const completedEp2 = (worldState.completedEpisodeIds ?? []).includes(EPISODE_IDS.PopulationRecovery);
    return completedEp2
      ? 'EP2 결과 이어받기 · 기존 시설과 지역 상태를 지도에 복원한 뒤 경제 성장 효과를 더합니다.'
      : '이전 기록이 없어 기본 푸른군 상태에서 경제 성장 미션을 시작합니다.';
  }

  static getSelectionLabelStyle(selected) {
    return {
      fontSize: '20px',
      color: selected ? '#92400e' : '#64748b',
      fontStyle: 'bold',
    };
  }

  static formatSelectionLabel(strategyId, selectedStrategyId) {
    return strategyId === selectedStrategyId ? '선택된 성장 전략' : '클릭해서 선택';
  }

  static getDefaultStrategy(briefing) {
    return briefing.strategies[0] ?? null;
  }

  static findStrategyById(briefing, strategyId) {
    return briefing.strategies.find((strategy) => strategy.id === strategyId) ?? null;
  }

  static formatFocusBody(strategy) {
    return [
      `초점: ${strategy.stateFocus}`,
      strategy.description,
      `관찰: ${strategy.observationPointShort ?? strategy.observationPoint}`,
    ].join('\n');
  }

  static formatTransitionNote(briefing, selectedStrategy = null) {
    return [
      `선택한 성장 전략: ${selectedStrategy?.title ?? briefing.strategies?.[0]?.title ?? '기본 전략'}`,
      '선택한 전략에 맞는 산업 정책과 시설 후보를 확인한 뒤 배치 실험으로 이동합니다.',
      '경제 효과와 함께 교통·환경 부담도 계속 관찰합니다.',
    ].join('\n');
  }

  static formatPolicyPreviewRows(policies, selectedStrategy = null) {
    const selectedPolicyId = selectedStrategy?.policyId;
    return [
      `선택 정책: ${policies.find((policy) => policy.id === selectedPolicyId)?.name ?? '기본 정책'}`,
      '산업 정책 후보:',
      ...policies.map((policy) => `${policy.id === selectedPolicyId ? '✓' : '•'} ${policy.name}: ${policy.focus.join(' · ')}`),
    ].join('\n');
  }

  static formatBuildingPreviewRows(buildings) {
    return [
      '산업 시설 후보:',
      ...buildings.map((building) => `• ${building.name}: ${building.balanceSummary}`),
    ].join('\n');
  }
}
