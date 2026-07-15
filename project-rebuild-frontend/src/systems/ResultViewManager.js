const RESULT_SCREEN_LAYOUT = {
  backgroundColor: 0x1e1b4b,
  progressStep: 'result',
  title: { y: 82, text: '종합 결과' },
  evaluationTitle: { y: 150 },
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

export default class ResultViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: RESULT_SCREEN_LAYOUT.backgroundColor },
      progressStep: RESULT_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...RESULT_SCREEN_LAYOUT.title },
      evaluationTitle: { x: width / 2, ...RESULT_SCREEN_LAYOUT.evaluationTitle },
    };
  }

  static getPanelStyle() {
    return { ...RESULT_PANEL_STYLE };
  }

  static getResidentReactionStyle() {
    return { ...RESIDENT_REACTION_STYLE };
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
    return {
      fontSize: '24px',
      color: '#1e293b',
      align: 'left',
      lineSpacing: 8,
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
      retry: { x: centerX - 310, y: 940, label: '배치 더 하기', target: 'PlacementScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      sideEffect: { x: centerX, y: 940, label: '부작용 검토', target: 'SideEffectScene', backgroundColor: '#bbf7d0', textColor: '#1e1b4b' },
      restart: { x: centerX + 310, y: 940, label: '처음부터 다시', target: 'BootScene', backgroundColor: '#fde68a', textColor: '#1e1b4b' },
    };
  }
}
