export default class CauseQuizManager {
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

  static formatMissingChoiceFeedback() {
    return '먼저 답을 하나 선택하세요.';
  }

  static formatQuestionProgress(questionIndex, totalQuestions, quizResults = []) {
    const correctCount = quizResults.filter((result) => result.correct).length;
    return `문제 ${questionIndex + 1}/${totalQuestions} · 현재 정답 ${correctCount}개`;
  }

  static getMissingChoiceFeedbackColor() {
    return '#b91c1c';
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
    ].join('\n');
  }

  static getFeedbackColor(choice) {
    return choice.correct ? '#166534' : '#991b1b';
  }

}
