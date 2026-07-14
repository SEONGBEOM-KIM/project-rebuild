export default class SideEffectViewManager {
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
