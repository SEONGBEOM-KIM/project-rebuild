export default class ReflectionViewManager {
  static getChoiceCardPosition(index) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      col,
      row,
      x: 610 + col * 700,
      y: 385 + row * 250,
    };
  }

  static formatInitialFeedback() {
    return '하나를 선택하면 학습 기록에 저장됩니다.';
  }

  static formatSelectedFeedback(choice) {
    return `선택됨: ${choice.title}\n${choice.description}`;
  }

  static formatMissingChoiceFeedback() {
    return '학습 기록에 남길 보완 방향을 하나 선택하세요.';
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
