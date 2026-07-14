export default class CauseQuizManager {
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
