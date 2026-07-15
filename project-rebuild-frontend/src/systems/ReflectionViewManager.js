const REFLECTION_SCREEN_LAYOUT = {
  backgroundColor: 0x172554,
  progressStep: 'ending',
  title: { y: 82, text: '생각 정리' },
  subtitle: { y: 150, text: '이번 선택을 돌아보고, 다음 개발에서 가장 먼저 보완할 부분을 고르세요.' },
  feedback: { y: 790, wordWrapWidth: 1150 },
};

const REFLECTION_CHOICE_CARD_LAYOUT = {
  width: 620,
  height: 190,
  iconOffset: { x: -250, y: -35 },
  titleOffset: { x: -200, y: -62 },
  descriptionOffset: { x: -200, y: -12, wordWrapWidth: 470 },
};

export default class ReflectionViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: REFLECTION_SCREEN_LAYOUT.backgroundColor },
      progressStep: REFLECTION_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.subtitle },
      feedback: { x: width / 2, ...REFLECTION_SCREEN_LAYOUT.feedback },
    };
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

  static getControlLayout() {
    return {
      back: { x: 760, y: 940, label: '부작용 다시 보기', target: 'SideEffectScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: 1160, y: 940, label: '학습 마무리', target: 'EndingScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

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
