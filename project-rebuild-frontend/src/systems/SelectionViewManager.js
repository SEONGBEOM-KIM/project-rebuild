const SELECTION_SCREEN_LAYOUT = {
  backgroundColor: 0x172554,
  progressStep: 'selection',
  title: { y: 86, text: '회복 방향 선택' },
  subtitle: { y: 150, text: '정책 밸런싱은 아직 적용하지 않고, 배치 미션의 의도만 정하는 UI 단계입니다.' },
  detail: { y: 750, wordWrapWidth: 1180 },
};

const POLICY_CARD_LAYOUT = {
  width: 450,
  height: 430,
  startX: 430,
  gapX: 530,
  y: 420,
  colorBar: { x: 0, y: -194, width: 450, height: 42 },
  title: { x: 0, y: -145 },
  tagline: { x: 0, y: -98, wordWrapWidth: 370 },
  description: { x: 0, y: -10, wordWrapWidth: 365 },
  focus: { x: 0, y: 108 },
  recommended: { x: 0, y: 156, wordWrapWidth: 370 },
};

export default class SelectionViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: SELECTION_SCREEN_LAYOUT.backgroundColor },
      progressStep: SELECTION_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...SELECTION_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...SELECTION_SCREEN_LAYOUT.subtitle },
      detail: { x: width / 2, ...SELECTION_SCREEN_LAYOUT.detail },
    };
  }

  static getPolicyCardPosition(index) {
    return {
      x: POLICY_CARD_LAYOUT.startX + index * POLICY_CARD_LAYOUT.gapX,
      y: POLICY_CARD_LAYOUT.y,
    };
  }

  static getPolicyCardLayout() {
    return {
      background: { x: 0, y: 0, width: POLICY_CARD_LAYOUT.width, height: POLICY_CARD_LAYOUT.height },
      colorBar: { ...POLICY_CARD_LAYOUT.colorBar },
      title: { ...POLICY_CARD_LAYOUT.title },
      tagline: { ...POLICY_CARD_LAYOUT.tagline },
      description: { ...POLICY_CARD_LAYOUT.description },
      focus: { ...POLICY_CARD_LAYOUT.focus },
      recommended: { ...POLICY_CARD_LAYOUT.recommended },
    };
  }

  static getControlLayout(centerX) {
    return {
      back: { x: centerX - 180, y: 955, label: '탐색 다시 보기', target: 'ExplorationScene', backgroundColor: 0x93c5fd, textColor: '#0f172a' },
      start: { x: centerX + 180, y: 955, label: '배치 연습 시작', target: 'PlacementScene', backgroundColor: 0xbbf7d0, textColor: '#123524' },
    };
  }

  static formatDetailRows(policy) {
    if (!policy) {
      return ['선택된 회복 방향이 없습니다.', '', '회복 방향을 선택한 뒤 배치 연습을 시작하세요.'];
    }

    return [
      `선택됨: ${policy.name}`,
      policy.note,
      '다음 화면에서는 이 방향을 참고해 건물 3개를 배치하고 상태 변화를 확인합니다.',
    ];
  }

  static formatDetailText(policy) {
    return SelectionViewManager.formatDetailRows(policy).join('\n');
  }

  static formatFocusText(policy) {
    return `중점 지표: ${policy.focus.join(' · ')}`;
  }

  static formatRecommendedBuildings(policy) {
    return `추천 시설: ${policy.recommendedBuildings.join(', ')}`;
  }

  static getCardStyle(policyId, selectedPolicy) {
    const selected = Boolean(selectedPolicy && policyId === selectedPolicy.id);
    return {
      selected,
      strokeWidth: selected ? 7 : 4,
      strokeColor: selected ? 0xfde68a : 0x475569,
      fillColor: selected ? 0x1e293b : 0x0f172a,
      fillAlpha: 0.96,
    };
  }
}
