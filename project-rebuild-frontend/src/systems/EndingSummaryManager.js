import { explorationPlaces } from '../data/explorationPlaces.js';
import { STATE_LABELS } from '../data/stateLabels.js';
import { RESULT_THRESHOLDS } from '../data/evaluationRules.js';
import IssueDetector from './IssueDetector.js';

const ENDING_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 78, text: '학습 마무리' },
  subtitle: { y: 145, text: 'EP1 탐색부터 시설 배치까지의 학습 기록을 요약합니다.' },
};

const ENDING_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0x60a5fa,
};

const ENDING_LEARNING_RECORD_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0xfde68a,
  title: '학습 기록',
};

const ENDING_NEXT_MISSION_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0xbbf7d0,
};

export default class EndingSummaryManager {
  static getScreenLayout(width) {
    return {
      background: { color: ENDING_SCREEN_LAYOUT.backgroundColor },
      progressStep: ENDING_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...ENDING_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...ENDING_SCREEN_LAYOUT.subtitle },
    };
  }

  static getPanelStyle() {
    return { ...ENDING_PANEL_STYLE };
  }

  static getLearningRecordStyle() {
    return { ...ENDING_LEARNING_RECORD_STYLE };
  }

  static getNextMissionStyle() {
    return { ...ENDING_NEXT_MISSION_STYLE };
  }

  static getPanelLayout() {
    return {
      choice: { x: 430, y: 430, width: 600, height: 560, title: '오늘의 선택 요약' },
      state: { x: 1110, y: 430, width: 600, height: 560, title: '지역 상태 요약' },
      nextMission: { x: 1585, y: 430, width: 360, height: 560, title: '다음 개발 목표' },
    };
  }

  static getPanelTitlePosition(panel) {
    return {
      x: panel.x,
      y: panel.y - panel.height / 2 + 45,
    };
  }

  static getPanelBodyPosition(panel, xPadding = 45, yOffset = 105) {
    return {
      x: panel.x - panel.width / 2 + xPadding,
      y: panel.y - panel.height / 2 + yOffset,
    };
  }

  static getPanelBodyStyle(panel) {
    return {
      fontSize: '23px',
      color: '#1e293b',
      lineSpacing: 9,
      wordWrap: { width: panel.width - 90 },
    };
  }

  static getNextMissionBodyStyle(panel) {
    return {
      fontSize: '22px',
      color: '#dbeafe',
      lineSpacing: 11,
      wordWrap: { width: panel.width - 64 },
    };
  }

  static getLearningRecordLayout(centerX) {
    return {
      panel: { x: centerX, y: 785, width: 1660, height: 140 },
      title: { x: centerX - 790, y: 737, text: ENDING_LEARNING_RECORD_STYLE.title },
      body: { x: centerX - 620, y: 735, wordWrapWidth: 1410 },
    };
  }

  static getControlLayout(centerX) {
    return {
      retry: { x: centerX - 520, y: 955, label: '배치 다시 조정', target: 'PlacementScene', backgroundColor: '#c4b5fd', textColor: '#0f172a' },
      report: { x: centerX - 175, y: 955, label: '교사용 요약', target: 'TeacherReportScene', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      data: { x: centerX + 175, y: 955, label: '학습 데이터 보기', target: 'LearningDataScene', backgroundColor: '#bbf7d0', textColor: '#0f172a' },
      restart: { x: centerX + 520, y: 955, label: '처음부터 다시', target: 'BootScene', backgroundColor: '#fde68a', textColor: '#0f172a' },
    };
  }

  static getEndingSummary(gameState, placedBuildings) {
    const uniqueBuildingTypes = new Set(placedBuildings.map((record) => record.building.id)).size;
    const balanced = uniqueBuildingTypes >= RESULT_THRESHOLDS.balancedMinimumBuildingTypes
      && gameState.environment >= RESULT_THRESHOLDS.environmentGood
      && gameState.satisfaction >= RESULT_THRESHOLDS.satisfactionBalanced
      && gameState.budget >= RESULT_THRESHOLDS.budgetSafe;

    if (balanced) {
      return {
        title: '균형형 회복안',
        message: '생활 편의와 환경을 함께 고려한 계획입니다.',
      };
    }

    if (gameState.population >= 1120 || gameState.economy >= 65) {
      return {
        title: '성장 우선 회복안',
        message: '인구·경제 회복 효과가 크지만 다른 지표 점검이 필요합니다.',
      };
    }

    if (gameState.environment >= 90 || gameState.pollution <= 4) {
      return {
        title: '환경 우선 회복안',
        message: '생활 환경 개선 효과가 뚜렷합니다. 다음에는 인구·경제 조건도 함께 살펴볼 수 있습니다.',
      };
    }

    return {
      title: '탐색형 회복안',
      message: '아직 뚜렷한 방향은 약하지만 상태 변화 비교를 시작했습니다.',
    };
  }

  static formatChoiceSummary(selectedPolicy, placedBuildings) {
    const buildingCounts = placedBuildings.reduce((counts, record) => {
      counts[record.building.name] = (counts[record.building.name] ?? 0) + 1;
      return counts;
    }, {});

    const buildingRows = Object.entries(buildingCounts)
      .map(([name, count]) => `• ${name}: ${count}개`)
      .join('\n') || '• 배치 없음';

    return [
      `선택 방향: ${selectedPolicy?.name ?? '기본 배치 연습'}`,
      selectedPolicy ? `중점: ${selectedPolicy.focus.join(' · ')}` : '중점: 상태 변화 확인',
      '',
      `배치한 시설: ${placedBuildings.length}개`,
      buildingRows,
      '',
      '복기 질문:',
      '내 선택은 인구·경제·환경·만족도 중 어떤 값을 가장 크게 바꾸었나요?',
    ].join('\n');
  }

  static formatStateSummary(gameState, ending) {
    const stateRows = Object.entries(STATE_LABELS)
      .map(([key, label]) => `• ${label}: ${gameState[key]}`)
      .join('\n');
    const issueRows = IssueDetector.formatRows(gameState).join('\n');

    return [
      ending.title,
      ending.message,
      '',
      '최종 상태:',
      stateRows,
      '',
      '주의 신호:',
      issueRows,
      '',
      '핵심 개념:',
      '지역 회복은 한 지표만 높이는 문제가 아니라 여러 조건의 균형을 맞추는 의사결정입니다.',
    ].join('\n');
  }

  static formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice) {
    const exploredNames = explorationPlaces
      .filter((place) => exploredPlaces.includes(place.id))
      .map((place) => place.name)
      .join(', ') || '없음';
    const quizStatus = !quizResult ? '미응답' : quizResult.correct ? '정답' : '오답 후 피드백 확인';

    return [
      `탐색: ${exploredPlaces.length}/${explorationPlaces.length}곳 확인 (${exploredNames})`,
      `자료 확인: ${learningProgress.dataViewed ? '완료' : '미완료'} / 인구 감소 · 지역 불균형 · 고령화 자료 카드 확인`,
      `원인 질문: ${quizStatus} / 문제 정리: ${learningProgress.problemSummaryCompleted ? '완료' : '미완료'} / EP1 완료: ${learningProgress.completed ? '예' : '아니오'}`,
      `배치 기록: ${learningProgress.placedBuildingIds.length}개 시설 배치 / 생각 정리: ${reflectionChoice?.title ?? '미선택'}`,
    ];
  }
}
