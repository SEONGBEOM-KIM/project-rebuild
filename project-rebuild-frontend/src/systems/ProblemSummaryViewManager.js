const PROBLEM_SUMMARY_SCREEN_LAYOUT = {
  backgroundColor: 0x10253f,
  progressStep: 'summary',
  title: { y: 72, text: 'EP1. 문제 정리', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 140, text: '탐색과 질문을 통해 확인한 푸른군의 핵심 문제를 정리합니다.', fontSize: '27px', color: '#bfdbfe' },
};

const PROBLEM_GRID_LAYOUT = {
  panel: { x: 645, y: 540, width: 1050, height: 680, fillColor: 0xffffff, fillAlpha: 0.96, strokeWidth: 5, strokeColor: 0x93c5fd },
  title: { x: 645, y: 240, text: '확인한 지역 문제' },
  itemCard: { offsetX: 230, offsetY: 55, width: 470, height: 126, fillColor: 0xe0f2fe, fillAlpha: 1, strokeWidth: 3, strokeColor: 0x60a5fa },
  itemIcon: { offsetX: 28, offsetY: 32 },
  itemTitle: { offsetX: 62, offsetY: 16 },
  itemDetail: { offsetX: 62, offsetY: 56, wordWrapWidth: 365 },
};

const LEARNING_RECORD_LAYOUT = {
  panel: { x: 1470, y: 390, width: 560, height: 380, fillColor: 0x1e293b, fillAlpha: 0.98, strokeWidth: 4, strokeColor: 0xfde68a },
  title: { x: 1470, y: 245, text: '학습 기록' },
  body: { x: 1215, y: 305, wordWrapWidth: 510 },
};

const NEXT_MISSION_LAYOUT = {
  panel: { x: 1470, y: 735, width: 560, height: 260, fillColor: 0xffffff, fillAlpha: 0.96, strokeWidth: 4, strokeColor: 0xbbf7d0 },
  title: { x: 1470, y: 650, text: '다음 미션' },
  body: { x: 1215, y: 700, wordWrapWidth: 510 },
};

const PROBLEM_SUMMARY_TEXT_STYLES = {
  gridTitle: { fontSize: '38px', color: '#172554', fontStyle: 'bold' },
  itemIcon: { fontSize: '40px' },
  itemTitle: { fontSize: '27px', color: '#0f172a', fontStyle: 'bold' },
  itemDetail: { fontSize: '20px', color: '#334155', lineSpacing: 5 },
  learningTitle: { fontSize: '36px', color: '#ffffff', fontStyle: 'bold' },
  learningBody: { fontSize: '23px', color: '#dbeafe', lineSpacing: 10 },
  nextTitle: { fontSize: '34px', color: '#14532d', fontStyle: 'bold' },
  nextBody: { fontSize: '24px', color: '#1e293b', lineSpacing: 11 },
};

const PROBLEM_SUMMARY_BUTTON_STYLE = {
  fontSize: '32px',
  padding: { x: 34, y: 18 },
};

export default class ProblemSummaryViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: PROBLEM_SUMMARY_SCREEN_LAYOUT.backgroundColor },
      progressStep: PROBLEM_SUMMARY_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...PROBLEM_SUMMARY_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...PROBLEM_SUMMARY_SCREEN_LAYOUT.subtitle },
    };
  }

  static getProblemGridLayout() {
    return {
      panel: { ...PROBLEM_GRID_LAYOUT.panel },
      title: { ...PROBLEM_GRID_LAYOUT.title },
    };
  }

  static getProblemItemCardLayout(x, y) {
    return {
      background: {
        x: x + PROBLEM_GRID_LAYOUT.itemCard.offsetX,
        y: y + PROBLEM_GRID_LAYOUT.itemCard.offsetY,
        width: PROBLEM_GRID_LAYOUT.itemCard.width,
        height: PROBLEM_GRID_LAYOUT.itemCard.height,
        fillColor: PROBLEM_GRID_LAYOUT.itemCard.fillColor,
        fillAlpha: PROBLEM_GRID_LAYOUT.itemCard.fillAlpha,
        strokeWidth: PROBLEM_GRID_LAYOUT.itemCard.strokeWidth,
        strokeColor: PROBLEM_GRID_LAYOUT.itemCard.strokeColor,
      },
      icon: { x: x + PROBLEM_GRID_LAYOUT.itemIcon.offsetX, y: y + PROBLEM_GRID_LAYOUT.itemIcon.offsetY },
      title: { x: x + PROBLEM_GRID_LAYOUT.itemTitle.offsetX, y: y + PROBLEM_GRID_LAYOUT.itemTitle.offsetY },
      detail: { x: x + PROBLEM_GRID_LAYOUT.itemDetail.offsetX, y: y + PROBLEM_GRID_LAYOUT.itemDetail.offsetY, wordWrapWidth: PROBLEM_GRID_LAYOUT.itemDetail.wordWrapWidth },
    };
  }

  static getLearningRecordLayout() {
    return {
      panel: { ...LEARNING_RECORD_LAYOUT.panel },
      title: { ...LEARNING_RECORD_LAYOUT.title },
      body: { ...LEARNING_RECORD_LAYOUT.body },
    };
  }

  static getNextMissionLayout() {
    return {
      panel: { ...NEXT_MISSION_LAYOUT.panel },
      title: { ...NEXT_MISSION_LAYOUT.title },
      body: { ...NEXT_MISSION_LAYOUT.body },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 750, y: 955, label: '원인 질문 다시 보기', target: 'CauseQuizScene', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      next: { x: 1180, y: 955, label: '회복 방향 선택', target: 'SelectionScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static getTextStyles() {
    return {
      gridTitle: { ...PROBLEM_SUMMARY_TEXT_STYLES.gridTitle },
      itemIcon: { ...PROBLEM_SUMMARY_TEXT_STYLES.itemIcon },
      itemTitle: { ...PROBLEM_SUMMARY_TEXT_STYLES.itemTitle },
      itemDetail: { ...PROBLEM_SUMMARY_TEXT_STYLES.itemDetail },
      learningTitle: { ...PROBLEM_SUMMARY_TEXT_STYLES.learningTitle },
      learningBody: { ...PROBLEM_SUMMARY_TEXT_STYLES.learningBody },
      nextTitle: { ...PROBLEM_SUMMARY_TEXT_STYLES.nextTitle },
      nextBody: { ...PROBLEM_SUMMARY_TEXT_STYLES.nextBody },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: PROBLEM_SUMMARY_BUTTON_STYLE.fontSize,
      padding: { ...PROBLEM_SUMMARY_BUTTON_STYLE.padding },
    };
  }

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
