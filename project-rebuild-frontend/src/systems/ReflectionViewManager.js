import SCENE_KEYS from '../data/sceneKeys.js';

const REFLECTION_SCREEN_LAYOUT = {
  backgroundColor: 0x172554,
  progressStep: 'ending',
  title: { y: 82, text: '배운 점 정리', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 142, text: '이번 배치에서 확인한 관점을 하나 골라 학습 기록에 남기세요. 다음 미션은 EP3 경제 성장으로 이어집니다.', fontSize: '27px', color: '#bfdbfe' },
  contextSummary: { y: 184, wordWrapWidth: 1320 },
  summaryPanel: { x: 960, y: 260, width: 1510, height: 96, strokeColor: 0x93c5fd },
  summaryTitle: { x: 265, y: 227, text: '이번 결과 요약' },
  summaryBody: { x: 470, y: 226, wordWrapWidth: 1240 },
  feedback: { y: 825, wordWrapWidth: 1150 },
};

const REFLECTION_SUMMARY_PANEL_STYLE = {
  fillColor: 0x0f172a,
  fillAlpha: 0.9,
  strokeWidth: 3,
};

const REFLECTION_CHOICE_CARD_LAYOUT = {
  width: 620,
  height: 190,
  iconOffset: { x: -250, y: -35 },
  titleOffset: { x: -200, y: -62 },
  descriptionOffset: { x: -200, y: -12, wordWrapWidth: 470 },
};

const REFLECTION_CONTEXT_TEXT_STYLE = {
  fontSize: '21px',
  color: '#c7d2fe',
  align: 'center',
};

const REFLECTION_SUMMARY_TEXT_STYLES = {
  title: { fontSize: '24px', color: '#fde68a', fontStyle: 'bold' },
  body: { fontSize: '21px', color: '#e0f2fe', lineSpacing: 5 },
};

const REFLECTION_FEEDBACK_TEXT_STYLE = {
  fontSize: '28px',
  align: 'center',
};

const REFLECTION_CHOICE_TEXT_STYLES = {
  icon: { fontSize: '44px' },
  title: { fontSize: '31px', color: '#ffffff', fontStyle: 'bold' },
  description: { fontSize: '23px', color: '#dbeafe', lineSpacing: 8 },
};

const REFLECTION_ISSUE_PRIORITY_ORDER = ['budget', 'environment', 'traffic', 'satisfaction'];

const REFLECTION_BUTTON_STYLE = {
  fontSize: '32px',
  padding: { x: 34, y: 18 },
};

export default class ReflectionViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: REFLECTION_SCREEN_LAYOUT.backgroundColor },
      progressStep: REFLECTION_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.subtitle },
      contextSummary: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.contextSummary },
      summaryPanel: { ...REFLECTION_SCREEN_LAYOUT.summaryPanel, x: width / 2 },
      summaryTitle: { ...REFLECTION_SCREEN_LAYOUT.summaryTitle },
      summaryBody: { ...REFLECTION_SCREEN_LAYOUT.summaryBody },
      feedback: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.feedback },
    };
  }

  static formatContextSummary(placementConfig, evaluationProfile) {
    return [
      placementConfig?.title ?? '배치 실험',
      `필요 배치: ${placementConfig?.requiredPlacements ?? '-'}개`,
      `평가 기준: ${evaluationProfile?.id ?? '기본'}`,
    ].join('  |  ');
  }

  static getContextSummaryTextStyle() {
    return { ...REFLECTION_CONTEXT_TEXT_STYLE };
  }

  static getChoiceCardLayout(x, y) {
    return {
      background: { x, y, width: REFLECTION_CHOICE_CARD_LAYOUT.width, height: REFLECTION_CHOICE_CARD_LAYOUT.height },
      icon: { x: x + REFLECTION_CHOICE_CARD_LAYOUT.iconOffset.x, y: y + REFLECTION_CHOICE_CARD_LAYOUT.iconOffset.y },
      title: { x: x + REFLECTION_CHOICE_CARD_LAYOUT.titleOffset.x, y: y + REFLECTION_CHOICE_CARD_LAYOUT.titleOffset.y },
      description: {
        x: x + REFLECTION_CHOICE_CARD_LAYOUT.descriptionOffset.x,
        y: y + REFLECTION_CHOICE_CARD_LAYOUT.descriptionOffset.y,
        wordWrapWidth: REFLECTION_CHOICE_CARD_LAYOUT.descriptionOffset.wordWrapWidth,
      },
    };
  }

  static getSummaryPanelStyle() {
    return { ...REFLECTION_SUMMARY_PANEL_STYLE };
  }

  static getSummaryTextStyles() {
    return {
      title: { ...REFLECTION_SUMMARY_TEXT_STYLES.title },
      body: { ...REFLECTION_SUMMARY_TEXT_STYLES.body },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 760, y: 940, label: '부작용 다시 보기', target: SCENE_KEYS.SideEffect, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: 1160, y: 940, label: '학습 마무리', target: SCENE_KEYS.Ending, backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static getFeedbackTextStyle(state, wordWrapWidth) {
    return {
      ...REFLECTION_FEEDBACK_TEXT_STYLE,
      color: ReflectionViewManager.getFeedbackStyle(state).color,
      wordWrap: { width: wordWrapWidth },
    };
  }

  static getChoiceTextStyles() {
    return {
      icon: { ...REFLECTION_CHOICE_TEXT_STYLES.icon },
      title: { ...REFLECTION_CHOICE_TEXT_STYLES.title },
      description: { ...REFLECTION_CHOICE_TEXT_STYLES.description },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: REFLECTION_BUTTON_STYLE.fontSize,
      padding: { ...REFLECTION_BUTTON_STYLE.padding },
    };
  }

  static getChoiceCardPosition(index) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      col,
      row,
      x: 610 + col * 700,
      y: 420 + row * 230,
    };
  }

  static getPriorityIssue(issues) {
    if (!issues.length) {
      return null;
    }

    return [...issues].sort((a, b) => {
      const rankA = REFLECTION_ISSUE_PRIORITY_ORDER.indexOf(a.id);
      const rankB = REFLECTION_ISSUE_PRIORITY_ORDER.indexOf(b.id);
      return (rankA === -1 ? REFLECTION_ISSUE_PRIORITY_ORDER.length : rankA) - (rankB === -1 ? REFLECTION_ISSUE_PRIORITY_ORDER.length : rankB);
    })[0];
  }

  static formatRunContext(selectedPolicy, selectedStrategy) {
    if (selectedStrategy) {
      return `배치 전략: ${selectedStrategy.title}  |  목표: ${selectedStrategy.placementGoalShort ?? selectedStrategy.stateFocus}`;
    }

    return `선택 방향: ${selectedPolicy?.name ?? '기본 배치 연습'}`;
  }

  static formatRunSummary({ gameState, issues = [], selectedPolicy = null, selectedStrategy = null, placedBuildings = [] }) {
    const priorityIssue = ReflectionViewManager.getPriorityIssue(issues);
    const issueText = priorityIssue ? priorityIssue.title : '큰 부작용 신호 없음';
    const contextText = ReflectionViewManager.formatRunContext(selectedPolicy, selectedStrategy);

    return [
      `${contextText}  |  배치: ${placedBuildings.length}개  |  우선 보완: ${issueText}`,
      `최종 상태: 인구 ${gameState.population}, 경제 ${gameState.economy}, 만족도 ${gameState.satisfaction}, 예산 ${gameState.budget}`,
    ].join('\n');
  }

  static formatInitialFeedback() {
    return '하나를 선택하면 이번 배치에서 배운 점으로 학습 기록에 저장됩니다.';
  }

  static formatSelectedFeedback(choice) {
    return [
      `기록됨: ${choice.title}`,
      choice.description,
      '',
      `EP3 연결: ${choice.nextAction}`,
    ].join('\n');
  }

  static formatMissingChoiceFeedback() {
    return '학습 기록에 남길 배운 점을 하나 선택하세요.';
  }

  static getFeedbackStyle(state) {
    if (state === 'selected') {
      return { color: '#bbf7d0' };
    }
    if (state === 'missing') {
      return { color: '#fecaca' };
    }
    return { color: '#e0f2fe' };
  }

  static getChoiceCardStyle(choiceId, selectedChoice) {
    const selected = selectedChoice?.id === choiceId;
    return {
      selected,
      strokeWidth: selected ? 7 : 4,
      strokeColor: selected ? 0xfde68a : 0x475569,
      fillColor: selected ? 0x1e293b : 0x0f172a,
      fillAlpha: 0.96,
    };
  }
}
