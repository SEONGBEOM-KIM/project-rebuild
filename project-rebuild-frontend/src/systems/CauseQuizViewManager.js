const CAUSE_QUIZ_SCREEN_LAYOUT = {
  backgroundColor: 0x111827,
  progressStep: 'quiz',
  title: { y: 72, text: 'EP1. 문제 원인 생각하기', fontSize: '58px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 142, text: '탐색한 장소의 문제를 바탕으로 인구 감소의 원인을 골라보세요.', fontSize: '27px', color: '#bfdbfe' },
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

const CAUSE_QUIZ_TEXT_STYLES = {
  summaryTitle: { fontSize: '34px', color: '#ffffff', fontStyle: 'bold' },
  summaryBody: { fontSize: '24px', color: '#dbeafe', lineSpacing: 11 },
  prompt: { fontSize: '36px', color: '#172554', fontStyle: 'bold', align: 'center' },
  choice: { fontSize: '25px', color: '#0f172a' },
  feedback: { fontSize: '25px', color: '#334155', lineSpacing: 10 },
};

const CAUSE_QUIZ_BUTTON_STYLE = {
  fontSize: '32px',
  padding: { x: 34, y: 18 },
};

export default class CauseQuizViewManager {
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

  static getTextStyles() {
    return {
      summaryTitle: { ...CAUSE_QUIZ_TEXT_STYLES.summaryTitle },
      summaryBody: { ...CAUSE_QUIZ_TEXT_STYLES.summaryBody },
      prompt: { ...CAUSE_QUIZ_TEXT_STYLES.prompt },
      choice: { ...CAUSE_QUIZ_TEXT_STYLES.choice },
      feedback: { ...CAUSE_QUIZ_TEXT_STYLES.feedback },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 760, y: 955, label: '자료 다시 보기', target: 'DataBriefingScene', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      nextDisabled: { x: 1160, y: 955, label: '답 선택 필요', backgroundColor: '#94a3b8', textColor: '#0f172a' },
      nextEnabled: { label: '문제 정리', target: 'ProblemSummaryScene', backgroundColor: '#bbf7d0' },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: CAUSE_QUIZ_BUTTON_STYLE.fontSize,
      padding: { ...CAUSE_QUIZ_BUTTON_STYLE.padding },
    };
  }

  static getChoiceVisualStyle(choiceId, selectedChoice, question) {
    const selected = choiceId === selectedChoice?.id;
    const correctChoice = question.choices.find((item) => item.id === choiceId)?.correct;
    const strokeColor = selected ? CauseQuizViewManager.getSelectedStrokeColor(selectedChoice) : CAUSE_QUESTION_LAYOUT.choice.strokeColor;
    return {
      fillColor: selected ? 0xfef3c7 : CAUSE_QUESTION_LAYOUT.choice.fillColor,
      fillAlpha: 1,
      strokeWidth: selected || correctChoice ? 5 : CAUSE_QUESTION_LAYOUT.choice.strokeWidth,
      strokeColor: correctChoice && selected ? 0x22c55e : strokeColor,
    };
  }

  static getSelectedStrokeColor(choice) {
    return choice.correct ? 0x22c55e : 0xef4444;
  }
}
