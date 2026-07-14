export default class SelectionViewManager {
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
