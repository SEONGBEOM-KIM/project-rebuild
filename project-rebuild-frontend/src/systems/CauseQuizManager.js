const CAUSE_QUIZ_SCREEN_LAYOUT = {
  backgroundColor: 0x111827,
  progressStep: 'quiz',
  title: { y: 72, text: 'EP1. 문제 원인 생각하기' },
  subtitle: { y: 142, text: '탐색한 장소의 문제를 바탕으로 인구 감소의 원인을 골라보세요.' },
};

const EXPLORATION_SUMMARY_LAYOUT = {
  panel: { x: 420, y: 525, width: 560, height: 630, fillColor: 0x1e293b, fillAlpha: 0.98, strokeWidth: 4, strokeColor: 0x60a5fa },
  title: { x: 420, y: 260, text: '탐색에서 확인한 단서' },
  body: { x: 170, y: 320, wordWrapWidth: 500 },
};

const CAUSE_QUESTION_LAYOUT = {
  panel: { x: 1170, y: 525, width: 900, height: 630, fillColor: 0xffffff, fillAlpha: 0.97, strokeWidth: 5, strokeColor: 0xfde68a },
  prompt: { x: 1170, y: 255, wordWrapWidth: 780 },
  choice: { x: 1170, startY: 390, gapY: 115, width: 760, height: 82, fillColor: 0xe0f2fe, fillAlpha: 1, strokeWidth: 3, strokeColor: 0x93c5fd, textOffsetX: -350, wordWrapWidth: 700 },
  feedback: { x: 760, y: 760, text: '답을 선택하면 피드백이 표시됩니다.', wordWrapWidth: 820 },
};

export default class CauseQuizManager {
  static getScreenLayout(width) {
    return {
      background: { color: CAUSE_QUIZ_SCREEN_LAYOUT.backgroundColor },
      progressStep: CAUSE_QUIZ_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...CAUSE_QUIZ_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...CAUSE_QUIZ_SCREEN_LAYOUT.subtitle },
    };
  }

  static getExplorationSummaryLayout() {
    return {
      panel: { ...EXPLORATION_SUMMARY_LAYOUT.panel },
      title: { ...EXPLORATION_SUMMARY_LAYOUT.title },
      body: { ...EXPLORATION_SUMMARY_LAYOUT.body },
    };
  }

  static formatExplorationSummaryRows(exploredCount, clues) {
    return [
      `확인한 장소: ${exploredCount}곳`,
      '',
      ...clues,
      '',
      '핵심:',
      '지역 문제는 하나의 원인만이 아니라 생활 조건의 약화가 서로 연결되어 나타납니다.',
    ];
  }

  static getQuestionLayout() {
    return {
      panel: { ...CAUSE_QUESTION_LAYOUT.panel },
      prompt: { ...CAUSE_QUESTION_LAYOUT.prompt },
      feedback: { ...CAUSE_QUESTION_LAYOUT.feedback },
    };
  }

  static getChoiceLayout(index) {
    const y = CAUSE_QUESTION_LAYOUT.choice.startY + index * CAUSE_QUESTION_LAYOUT.choice.gapY;
    return {
      background: {
        x: CAUSE_QUESTION_LAYOUT.choice.x,
        y,
        width: CAUSE_QUESTION_LAYOUT.choice.width,
        height: CAUSE_QUESTION_LAYOUT.choice.height,
        fillColor: CAUSE_QUESTION_LAYOUT.choice.fillColor,
        fillAlpha: CAUSE_QUESTION_LAYOUT.choice.fillAlpha,
        strokeWidth: CAUSE_QUESTION_LAYOUT.choice.strokeWidth,
        strokeColor: CAUSE_QUESTION_LAYOUT.choice.strokeColor,
      },
      text: { x: CAUSE_QUESTION_LAYOUT.choice.x + CAUSE_QUESTION_LAYOUT.choice.textOffsetX, y, wordWrapWidth: CAUSE_QUESTION_LAYOUT.choice.wordWrapWidth },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 760, y: 955, label: '자료 다시 보기', target: 'DataBriefingScene', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      nextDisabled: { x: 1160, y: 955, label: '답 선택 필요', backgroundColor: '#94a3b8', textColor: '#0f172a' },
      nextEnabled: { label: '문제 정리', target: 'ProblemSummaryScene', backgroundColor: '#bbf7d0' },
    };
  }

  static formatMissingChoiceFeedback() {
    return '먼저 답을 하나 선택하세요.';
  }

  static getMissingChoiceFeedbackColor() {
    return '#b91c1c';
  }

  static getChoiceVisualStyle(choiceId, selectedChoice, question) {
    const selected = choiceId === selectedChoice?.id;
    const correctChoice = question.choices.find((item) => item.id === choiceId)?.correct;
    const strokeColor = selected ? CauseQuizManager.getSelectedStrokeColor(selectedChoice) : CAUSE_QUESTION_LAYOUT.choice.strokeColor;
    return {
      fillColor: selected ? 0xfef3c7 : CAUSE_QUESTION_LAYOUT.choice.fillColor,
      fillAlpha: 1,
      strokeWidth: selected || correctChoice ? 5 : CAUSE_QUESTION_LAYOUT.choice.strokeWidth,
      strokeColor: correctChoice && selected ? 0x22c55e : strokeColor,
    };
  }

  static buildQuizResult(question, choice) {
    return {
      questionId: question.id,
      selected: choice.id,
      correct: choice.correct,
    };
  }

  static formatFeedback(choice) {
    return [
      choice.correct ? '정답입니다.' : '다시 생각해 볼 수 있습니다.',
      choice.feedback,
      '',
      '다음 단계에서는 확인한 문제를 정리합니다.',
    ].join('\n');
  }

  static getFeedbackColor(choice) {
    return choice.correct ? '#166534' : '#991b1b';
  }

  static getSelectedStrokeColor(choice) {
    return choice.correct ? 0x22c55e : 0xef4444;
  }
}
