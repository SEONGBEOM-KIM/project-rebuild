import SCENE_KEYS from '../data/sceneKeys.js';
import { getPlacementConfig, getPlacementConfigIdForStrategy } from '../data/episodePlacementConfigs.js';

export const EP2_BRIEFING_LAYOUT = {
  backgroundColor: 0x10253f,
  progressStep: 'ending',
  title: { y: 76, text: 'EP2. 인구 유입 전략', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 142, text: '푸른군에 사람들이 다시 찾아오게 만들 조건을 비교합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const EP2_BRIEFING_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0x93c5fd,
  titleFontSize: '32px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '24px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 10,
};

const EP2_BRIEFING_CARD_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  selectedFillColor: 0xecfdf5,
  selectedFillAlpha: 1,
  strokeWidth: 4,
  selectedStrokeWidth: 7,
  strokeColor: 0x93c5fd,
  titleFontSize: '29px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
  bodyFontSize: '19px',
  bodyColor: '#1e293b',
  bodyLineSpacing: 3,
};

const EP2_BRIEFING_SELECTION_PANEL_STYLE = {
  fillColor: 0x0f172a,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0xfde68a,
  titleFontSize: '27px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '19px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 5,
};

const EP2_BRIEFING_BUTTON_STYLE = {
  fontSize: '29px',
  padding: { x: 34, y: 18 },
};

export default class Ep2BriefingViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: EP2_BRIEFING_LAYOUT.backgroundColor,
      progressStep: EP2_BRIEFING_LAYOUT.progressStep,
      title: { ...EP2_BRIEFING_LAYOUT.title, x: width / 2 },
      subtitle: { ...EP2_BRIEFING_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelStyle() {
    return { ...EP2_BRIEFING_PANEL_STYLE };
  }

  static getCardStyle(strategyId = null, selectedStrategyId = null, strategyColor = EP2_BRIEFING_CARD_STYLE.strokeColor) {
    const selected = Boolean(selectedStrategyId && strategyId === selectedStrategyId);
    return {
      ...EP2_BRIEFING_CARD_STYLE,
      fillColor: selected ? EP2_BRIEFING_CARD_STYLE.selectedFillColor : EP2_BRIEFING_CARD_STYLE.fillColor,
      fillAlpha: selected ? EP2_BRIEFING_CARD_STYLE.selectedFillAlpha : EP2_BRIEFING_CARD_STYLE.fillAlpha,
      strokeWidth: selected ? EP2_BRIEFING_CARD_STYLE.selectedStrokeWidth : EP2_BRIEFING_CARD_STYLE.strokeWidth,
      strokeColor: selected ? strategyColor : EP2_BRIEFING_CARD_STYLE.strokeColor,
      selected,
    };
  }

  static getButtonStyle() {
    return { ...EP2_BRIEFING_BUTTON_STYLE, padding: { ...EP2_BRIEFING_BUTTON_STYLE.padding } };
  }

  static getSelectionPanelStyle() {
    return { ...EP2_BRIEFING_SELECTION_PANEL_STYLE };
  }

  static getIntroPanelLayout() {
    return {
      panel: { x: 960, y: 262, width: 1510, height: 150, strokeColor: 0x93c5fd },
      title: { x: 250, y: 205, text: '다음 미션' },
      body: { x: 250, y: 250, wordWrapWidth: 1380 },
    };
  }

  static getStrategyCardLayout(index) {
    const positions = [
      { x: 440, y: 555 },
      { x: 960, y: 555 },
      { x: 1480, y: 555 },
    ];
    const position = positions[index];
    return {
      panel: { x: position.x, y: position.y, width: 440, height: 390 },
      icon: { x: position.x, y: position.y - 135 },
      title: { x: position.x, y: position.y - 78, wordWrapWidth: 360 },
      body: { x: position.x - 180, y: position.y - 25, wordWrapWidth: 360 },
      check: { x: position.x - 180, y: position.y + 124, wordWrapWidth: 360 },
      selection: { x: position.x, y: position.y + 162 },
    };
  }

  static getSelectedStrategyPanelLayout() {
    return {
      panel: { x: 960, y: 830, width: 1510, height: 150 },
      title: { x: 250, y: 775, text: '선택한 전략의 배치 목표' },
      body: { x: 250, y: 810, wordWrapWidth: 1380 },
    };
  }

  static getSelectionLabelStyle(selected) {
    return {
      fontSize: '20px',
      color: selected ? '#166534' : '#64748b',
      fontStyle: 'bold',
    };
  }

  static formatSelectionLabel(strategyId, selectedStrategyId) {
    return strategyId === selectedStrategyId ? '선택된 전략' : '클릭해서 선택';
  }

  static findStrategyById(briefing, strategyId) {
    return briefing.strategies.find((strategy) => strategy.id === strategyId) ?? null;
  }

  static findStrategyByPolicyId(briefing, policyId) {
    return briefing.strategies.find((strategy) => strategy.policyId === policyId) ?? null;
  }

  static resolveStrategy(briefing, strategyId, policyId = null) {
    return Ep2BriefingViewManager.findStrategyById(briefing, strategyId)
      ?? Ep2BriefingViewManager.findStrategyByPolicyId(briefing, policyId);
  }

  static getDefaultStrategy(briefing) {
    return briefing.strategies[0] ?? null;
  }

  static getControlLayout(centerX) {
    return {
      ending: { x: centerX - 250, y: 950, label: 'EP1 마무리로', target: SCENE_KEYS.Ending, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      start: { x: centerX + 250, y: 950, label: '배치 실험 시작', target: SCENE_KEYS.Placement, backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static formatIntroText(briefing) {
    return briefing.intro.join('\n');
  }

  static getStrategyPlacementContext(strategy) {
    const placementConfig = getPlacementConfig(getPlacementConfigIdForStrategy(strategy));
    return {
      placementConfig,
      requiredPlacements: placementConfig.requiredPlacements,
      evaluationProfileId: placementConfig.evaluationProfileId,
    };
  }

  static formatStrategyBody(strategy) {
    const context = Ep2BriefingViewManager.getStrategyPlacementContext(strategy);
    return [
      strategy.description,
      `상태 변화: ${strategy.stateFocus}`,
      `배치 목표: ${context.requiredPlacements}개`,
    ].join('\n');
  }

  static formatStrategyCheck(_strategy) {
    return '생각할 점: 아래 선택 패널에서 확인';
  }

  static formatSelectedStrategySummary(strategy) {
    if (!strategy) {
      return '전략 카드를 선택하면 배치 목표와 관찰 포인트가 표시됩니다.';
    }
    const context = Ep2BriefingViewManager.getStrategyPlacementContext(strategy);

    return [
      `${strategy.icon} ${strategy.title} — ${strategy.stateFocus}`,
      `배치 설정: ${context.placementConfig.title} / 필요 배치: ${context.requiredPlacements}개 / 평가 기준: ${context.evaluationProfileId}`,
      `배치 목표: ${strategy.placementGoal}`,
      `관찰 포인트: ${strategy.observationPoint}`,
    ].join('\n');
  }
}
