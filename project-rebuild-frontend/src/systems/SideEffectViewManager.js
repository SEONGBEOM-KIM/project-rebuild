import SCENE_KEYS from '../data/sceneKeys.js';

const SIDE_EFFECT_SCREEN_LAYOUT = {
  backgroundColor: 0x111827,
  progressStep: 'result',
  title: { y: 82, text: '부작용 검토', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: {
    y: 142,
    text: '좋은 선택에도 비용과 부작용이 생길 수 있습니다. 다음 선택 전에 주의 신호를 확인합니다.',
    wordWrapWidth: 1450,
    fontSize: '26px',
    color: '#bfdbfe',
    align: 'center',
  },
  contextSummary: { y: 188, wordWrapWidth: 1320 },
};

const SIDE_EFFECT_PANEL_STYLE = {
  issueFillColor: 0xffffff,
  issueFillAlpha: 0.96,
  issueStrokeWidth: 5,
  hintFillColor: 0x1e293b,
  hintFillAlpha: 0.98,
  hintStrokeWidth: 5,
};

const SIDE_EFFECT_ISSUE_CARD_STYLE = {
  fillColor: 0xe0f2fe,
  fillAlpha: 1,
  strokeWidth: 3,
  markerAlpha: 1,
  markerStrokeWidth: 3,
  markerStrokeColor: 0xffffff,
};

const SIDE_EFFECT_TEXT_STYLES = {
  issueTitle: { fontSize: '38px', color: '#172554', fontStyle: 'bold' },
  contextSummary: { fontSize: '21px', color: '#c7d2fe', align: 'center' },
  issueSummary: { fontSize: '22px', color: '#334155', fontStyle: 'bold' },
  emptyBody: { fontSize: '30px', color: '#1e293b', lineSpacing: 14 },
  cardPriority: { fontSize: '16px', color: '#475569', fontStyle: 'bold' },
  cardTitle: { fontSize: '25px', color: '#0f172a', fontStyle: 'bold' },
  cardMessage: { fontSize: '20px', color: '#334155' },
  hintTitle: { fontSize: '36px', color: '#ffffff', fontStyle: 'bold' },
  hintBody: { fontSize: '22px', color: '#dbeafe', lineSpacing: 10 },
};

const SIDE_EFFECT_PRIORITY_ORDER = ['traffic', 'environment', 'inequality', 'budget', 'satisfaction'];

const SIDE_EFFECT_PRIORITY_LABELS = {
  traffic: '교통 · 이동 편의',
  environment: '환경 · 안전',
  inequality: '격차 · 성장 혜택',
  budget: '예산 · 비용 균형',
  satisfaction: '만족 · 생활 편의',
};

const SIDE_EFFECT_BUTTON_STYLE = {
  fontSize: '32px',
  padding: { x: 34, y: 18 },
};

export default class SideEffectViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: SIDE_EFFECT_SCREEN_LAYOUT.backgroundColor },
      progressStep: SIDE_EFFECT_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...SIDE_EFFECT_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...SIDE_EFFECT_SCREEN_LAYOUT.subtitle },
      contextSummary: { x: width / 2, ...SIDE_EFFECT_SCREEN_LAYOUT.contextSummary },
    };
  }

  static formatContextSummary(placementConfig, evaluationProfile, selectedStrategy = null) {
    return [
      placementConfig?.title ?? '배치 실험',
      `필요 배치: ${placementConfig?.requiredPlacements ?? '-'}개`,
      selectedStrategy?.title ? `전략: ${selectedStrategy.title}` : null,
    ].filter(Boolean).join('  |  ');
  }

  static getContextSummaryTextStyle() {
    return { ...SIDE_EFFECT_TEXT_STYLES.contextSummary };
  }

  static getPanelStyle() {
    return { ...SIDE_EFFECT_PANEL_STYLE };
  }

  static getIssueCardStyle() {
    return { ...SIDE_EFFECT_ISSUE_CARD_STYLE };
  }

  static getTextStyles() {
    return {
      issueTitle: { ...SIDE_EFFECT_TEXT_STYLES.issueTitle },
      issueSummary: { ...SIDE_EFFECT_TEXT_STYLES.issueSummary },
      emptyBody: { ...SIDE_EFFECT_TEXT_STYLES.emptyBody },
      cardPriority: { ...SIDE_EFFECT_TEXT_STYLES.cardPriority },
      cardTitle: { ...SIDE_EFFECT_TEXT_STYLES.cardTitle },
      cardMessage: { ...SIDE_EFFECT_TEXT_STYLES.cardMessage },
      hintTitle: { ...SIDE_EFFECT_TEXT_STYLES.hintTitle },
      hintBody: { ...SIDE_EFFECT_TEXT_STYLES.hintBody },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: SIDE_EFFECT_BUTTON_STYLE.fontSize,
      padding: { ...SIDE_EFFECT_BUTTON_STYLE.padding },
    };
  }

  static getIssuePanelLayout() {
    return {
      panel: { x: 665, y: 545, width: 980, height: 650, strokeColor: 0xfde68a },
      title: { x: 665, y: 250, text: '감지된 주의 신호' },
      summary: { x: 235, y: 296, wordWrapWidth: 860 },
      emptyBody: { x: 230, y: 385, wordWrapWidth: 860 },
    };
  }

  static getIssueCardLayout(index) {
    const y = 335 + index * 125;
    return {
      background: { x: 665, y: y + 52, width: 860, height: 108 },
      marker: { x: 270, y: y + 52, radius: 22 },
      priority: { x: 310, y: y + 8 },
      title: { x: 310, y: y + 30 },
      message: { x: 310, y: y + 64, wordWrapWidth: 760 },
    };
  }

  static getHintPanelLayout() {
    return {
      panel: { x: 1480, y: 545, width: 560, height: 650, strokeColor: 0x93c5fd },
      title: { x: 1480, y: 260, text: '다음 선택 힌트' },
      body: { x: 1230, y: 330, wordWrapWidth: 500 },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 760, y: 955, label: '결과 다시 보기', target: SCENE_KEYS.Result, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: 1160, y: 955, label: '생각 정리', target: SCENE_KEYS.Reflection, backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static getIssuePriorityRank(issue) {
    const rank = SIDE_EFFECT_PRIORITY_ORDER.indexOf(issue.id);
    return rank === -1 ? SIDE_EFFECT_PRIORITY_ORDER.length : rank;
  }

  static getIssuePriorityLabel(issue) {
    const emphasis = issue.primary ? '최우선 · ' : '';
    const severity = issue.severity?.label ? ` · ${issue.severity.label}` : '';
    return `${emphasis}${SIDE_EFFECT_PRIORITY_LABELS[issue.id] ?? '확인 필요'}${severity}`;
  }

  static sortIssuesByPriority(issues) {
    return [...issues].sort((a, b) => SideEffectViewManager.getIssuePriorityRank(a) - SideEffectViewManager.getIssuePriorityRank(b));
  }

  static formatIssueSummary(issues) {
    if (!issues.length) {
      return '우선 확인: 현재 즉시 조정할 신호는 없습니다.';
    }

    const [firstIssue] = SideEffectViewManager.sortIssuesByPriority(issues);
    return `우선 확인: ${firstIssue.title} · 총 ${issues.length}개 신호`;
  }

  static formatEmptyIssueMessage() {
    return [
      '현재 큰 부작용 신호는 없습니다.',
      '',
      '다만 실제 정책 판단에서는 시간이 지나며 새로운 문제가 생길 수 있습니다.',
      '다음 단계에서는 더 많은 시설과 정책 조합을 비교할 수 있게 확장합니다.',
    ].join('\n');
  }

  static formatStrategyHintRows(selectedStrategy) {
    if (!selectedStrategy) {
      return [];
    }

    return [
      `배치 전략: ${selectedStrategy.title}`,
      selectedStrategy.observationPointShort ? `관찰 기준: ${selectedStrategy.observationPointShort}` : null,
      '',
    ].filter((row) => row !== null);
  }

  static formatHintRows(issues, selectedStrategy = null) {
    const strategyRows = SideEffectViewManager.formatStrategyHintRows(selectedStrategy);
    const issueRows = issues.length
      ? SideEffectViewManager.sortIssuesByPriority(issues).flatMap((issue) => [
        `• ${issue.title}`,
        issue.cause,
        `대응: ${issue.nextAction}`,
        '',
      ])
      : [
        '• 균형 확인',
        selectedStrategy?.placementGoalShort
          ? `${selectedStrategy.placementGoalShort} 목표는 유지하되, 부작용 신호도 함께 확인합니다.`
          : '현재는 큰 부작용 신호가 없지만, 인구·경제·환경·만족도를 함께 확인하는 습관이 중요합니다.',
        '대응: 다음 미션에서는 더 많은 정책 조합을 비교합니다.',
      ];

    return [...strategyRows, ...issueRows];
  }

  static formatHintText(issues, selectedStrategy = null) {
    return SideEffectViewManager.formatHintRows(issues, selectedStrategy).join('\n');
  }
}
