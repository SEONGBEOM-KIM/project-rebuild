export default class ProblemSummaryViewManager {
  static formatExploredNames(allPlaces, exploredPlaceIds) {
    const exploredSet = new Set(exploredPlaceIds ?? []);
    return allPlaces
      .filter((place) => exploredSet.has(place.id))
      .map((place) => place.name)
      .join(', ') || '없음';
  }

  static formatQuizStatus(quizResult) {
    if (!quizResult) {
      return '미응답';
    }
    return quizResult.correct ? '정답' : '오답 후 피드백 확인';
  }

  static formatLearningRecordRows(allPlaces, exploredPlaceIds, quizResult, coreCauseSummary) {
    const exploredIds = exploredPlaceIds ?? [];
    return [
      `탐색한 장소: ${exploredIds.length}곳`,
      ProblemSummaryViewManager.formatExploredNames(allPlaces, exploredIds),
      '',
      `원인 질문: ${ProblemSummaryViewManager.formatQuizStatus(quizResult)}`,
      '',
      '핵심 원인:',
      coreCauseSummary,
    ];
  }

  static formatLearningRecordText(allPlaces, exploredPlaceIds, quizResult, coreCauseSummary) {
    return ProblemSummaryViewManager
      .formatLearningRecordRows(allPlaces, exploredPlaceIds, quizResult, coreCauseSummary)
      .join('\n');
  }

  static getProblemItemLayout(index) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      col,
      row,
      x: 210 + col * 520,
      y: 315 + row * 160,
    };
  }
}
