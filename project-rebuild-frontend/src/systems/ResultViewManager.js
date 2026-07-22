import SCENE_KEYS from '../data/sceneKeys.js';

const RESULT_SCREEN_LAYOUT = {
  backgroundColor: 0x1e1b4b,
  progressStep: 'result',
  title: { y: 82, text: '종합 결과', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  evaluationTitle: { y: 142 },
  contextSummary: { y: 184, wordWrapWidth: 1320 },
};

const RESULT_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.95,
  strokeWidth: 4,
  strokeColor: 0x818cf8,
  yOffset: 230,
};

const RESIDENT_REACTION_STYLE = {
  fillColor: 0x0f172a,
  fillAlpha: 0.9,
  strokeWidth: 3,
  strokeColor: 0xfde68a,
  title: '주민 반응',
};

const RESULT_TEXT_STYLES = {
  evaluationTitle: { fontSize: '30px', align: 'center', fontStyle: 'bold' },
  contextSummary: { fontSize: '22px', color: '#c7d2fe', align: 'center' },
  residentTitle: { fontSize: '25px', color: '#fde68a', fontStyle: 'bold' },
  residentBody: { fontSize: '23px', color: '#ffffff', lineSpacing: 6 },
  panelTitle: { fontSize: '32px', color: '#312e81', fontStyle: 'bold' },
};

const RESULT_BUTTON_STYLE = {
  fontSize: '30px',
  padding: { x: 28, y: 17 },
};

export default class ResultViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: RESULT_SCREEN_LAYOUT.backgroundColor },
      progressStep: RESULT_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...RESULT_SCREEN_LAYOUT.title },
      evaluationTitle: { x: width / 2, ...RESULT_SCREEN_LAYOUT.evaluationTitle },
      contextSummary: { x: width / 2, ...RESULT_SCREEN_LAYOUT.contextSummary },
    };
  }

  static getPanelStyle() {
    return { ...RESULT_PANEL_STYLE };
  }

  static getResidentReactionStyle() {
    return { ...RESIDENT_REACTION_STYLE };
  }

  static getEvaluationTitleTextStyle(color) {
    return {
      ...RESULT_TEXT_STYLES.evaluationTitle,
      color,
    };
  }

  static formatContextSummary(placementConfig, evaluationProfile, placementBreakdown = null) {
    const placementSummary = placementBreakdown
      ? `이번 배치: ${placementBreakdown.currentPlacementCount}개 | 이전 시설: ${placementBreakdown.inheritedPlacementCount}개 | 누적: ${placementBreakdown.totalPlacementCount}개`
      : null;
    return [
      placementConfig?.title ?? '배치 실험',
      `필요 배치: ${placementConfig?.requiredPlacements ?? '-'}개`,
      `평가 기준: ${evaluationProfile?.id ?? '기본'}`,
      placementSummary,
    ].filter(Boolean).join('  |  ');
  }

  static getContextSummaryTextStyle() {
    return { ...RESULT_TEXT_STYLES.contextSummary };
  }

  static getResidentReactionTextStyles() {
    return {
      title: { ...RESULT_TEXT_STYLES.residentTitle },
      body: { ...RESULT_TEXT_STYLES.residentBody },
    };
  }

  static getPanelTitleTextStyle() {
    return { ...RESULT_TEXT_STYLES.panelTitle };
  }

  static getPanelLayout(centerX) {
    return {
      beforeAfter: { x: centerX - 610, y: 270, width: 545, height: 575, title: '이전 → 현재' },
      evaluation: { x: centerX, y: 270, width: 545, height: 575, title: '종합 평가' },
      trend: { x: centerX + 610, y: 270, width: 545, height: 575, title: '선택 경향' },
    };
  }

  static getPanelTitlePosition(panel) {
    return {
      x: panel.x,
      y: panel.y,
    };
  }

  static getPanelBodyPosition(panel) {
    return {
      x: panel.x,
      y: panel.y + 70,
    };
  }

  static getPanelBodyStyle(panel) {
    const compactBodyTitles = new Set(['종합 평가', '선택 경향']);
    const isCompactBody = compactBodyTitles.has(panel.title);

    return {
      fontSize: isCompactBody ? '18px' : '22px',
      color: '#1e293b',
      align: 'left',
      lineSpacing: isCompactBody ? 2 : 6,
      wordWrap: { width: panel.width - 80 },
    };
  }

  static getResidentReactionLayout(centerX) {
    return {
      panel: { x: centerX, y: 830, width: 1660, height: 86 },
      title: { x: centerX - 790, y: 806, text: RESIDENT_REACTION_STYLE.title },
      body: { x: centerX - 625, y: 805, wordWrapWidth: 1400 },
    };
  }

  static getControlLayout(centerX) {
    return {
      retry: { x: centerX - 310, y: 940, label: '배치 더 하기', target: SCENE_KEYS.Placement, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      sideEffect: { x: centerX, y: 940, label: '부작용 검토', target: SCENE_KEYS.SideEffect, backgroundColor: '#bbf7d0', textColor: '#1e1b4b' },
      restart: { x: centerX + 310, y: 940, label: '처음부터 다시', target: SCENE_KEYS.Boot, backgroundColor: '#fde68a', textColor: '#1e1b4b' },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: RESULT_BUTTON_STYLE.fontSize,
      padding: { ...RESULT_BUTTON_STYLE.padding },
    };
  }
}
