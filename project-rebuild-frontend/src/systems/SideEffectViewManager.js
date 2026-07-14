export default class SideEffectViewManager {
  static getIssuePanelLayout() {
    return {
      panel: { x: 665, y: 545, width: 980, height: 650, strokeColor: 0xfde68a },
      title: { x: 665, y: 260 },
      emptyBody: { x: 230, y: 385, wordWrapWidth: 860 },
    };
  }

  static getIssueCardLayout(index) {
    const y = 335 + index * 135;
    return {
      background: { x: 665, y: y + 48, width: 860, height: 112 },
      marker: { x: 270, y: y + 48, radius: 22 },
      title: { x: 310, y: y + 8 },
      message: { x: 310, y: y + 45, wordWrapWidth: 760 },
    };
  }

  static getHintPanelLayout() {
    return {
      panel: { x: 1480, y: 545, width: 560, height: 650, strokeColor: 0x93c5fd },
      title: { x: 1480, y: 260 },
      body: { x: 1230, y: 330, wordWrapWidth: 500 },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 760, y: 955, label: '결과 다시 보기', target: 'ResultScene' },
      next: { x: 1160, y: 955, label: '생각 정리', target: 'ReflectionScene' },
    };
  }

  static formatEmptyIssueMessage() {
    return [
      '현재 큰 부작용 신호는 없습니다.',
      '',
      '다만 실제 정책 판단에서는 시간이 지나며 새로운 문제가 생길 수 있습니다.',
      '다음 단계에서는 더 많은 시설과 정책 조합을 비교할 수 있게 확장합니다.',
    ].join('\n');
  }

  static formatHintRows(issues) {
    return issues.length
      ? issues.flatMap((issue) => [
        `• ${issue.title}`,
        issue.cause,
        `대응: ${issue.nextAction}`,
        '',
      ])
      : [
        '• 균형 확인',
        '현재는 큰 부작용 신호가 없지만, 인구·경제·환경·만족도를 함께 확인하는 습관이 중요합니다.',
        '대응: 다음 미션에서는 더 많은 정책 조합을 비교합니다.',
      ];
  }

  static formatHintText(issues) {
    return SideEffectViewManager.formatHintRows(issues).join('\n');
  }
}
