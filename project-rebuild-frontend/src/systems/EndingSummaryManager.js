import { explorationPlaces } from '../data/explorationPlaces.js';
import { DEFAULT_STATE_KEYS, STATE_LABELS } from '../data/stateLabels.js';
import { getEvaluationProfile } from '../data/evaluationRules.js';
import IssueDetector from './IssueDetector.js';

export default class EndingSummaryManager {
  static getEndingSummary(gameState, placedBuildings, evaluationProfile = getEvaluationProfile()) {
    const uniqueBuildingTypes = new Set(placedBuildings.map((record) => record.building.id)).size;
    const resultThresholds = evaluationProfile.resultThresholds;
    const balanced = uniqueBuildingTypes >= resultThresholds.balancedMinimumBuildingTypes
      && gameState.environment >= resultThresholds.environmentGood
      && gameState.satisfaction >= resultThresholds.satisfactionBalanced
      && gameState.budget >= resultThresholds.budgetSafe;

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

  static getPriorityIssue(gameState, evaluationProfile = getEvaluationProfile()) {
    const issues = IssueDetector.detect(gameState, evaluationProfile);
    return issues[0] ?? null;
  }

  static formatFinalTakeaway({ gameState, ending, reflectionChoice, selectedStrategy = null, evaluationProfile = getEvaluationProfile() }) {
    const issue = EndingSummaryManager.getPriorityIssue(gameState, evaluationProfile);
    const issueText = issue ? issue.title : '큰 부작용 신호 없음';
    const actionText = reflectionChoice?.nextActionLabel ?? '다음 보완 방향 선택 필요';
    const strategyText = selectedStrategy
      ? `배치 전략: ${selectedStrategy.title} / 목표: ${selectedStrategy.placementGoalShort ?? selectedStrategy.stateFocus}`
      : null;

    return [
      `${ending.title}: ${ending.message}`,
      strategyText
        ? `${strategyText} / 우선 보완: ${issueText} / 다음 액션: ${actionText}`
        : `우선 보완: ${issueText} / 다음 액션: ${actionText}`,
    ].join('\n');
  }

  static formatChoiceSummary(selectedPolicy, placedBuildings, reflectionChoice = null, selectedStrategy = null) {
    const buildingCounts = placedBuildings.reduce((counts, record) => {
      counts[record.building.name] = (counts[record.building.name] ?? 0) + 1;
      return counts;
    }, {});

    const buildingRows = Object.entries(buildingCounts)
      .map(([name, count]) => `• ${name}: ${count}개`)
      .join('\n') || '• 배치 없음';

    return [
      selectedStrategy ? `배치 전략: ${selectedStrategy.title}` : null,
      `선택 방향: ${selectedPolicy?.name ?? '기본 배치 연습'}`,
      selectedStrategy ? `전략 초점: ${selectedStrategy.stateFocus}` : null,
      selectedPolicy ? `중점: ${selectedPolicy.focus.join(' · ')}` : '중점: 상태 변화 확인',
      '',
      `배치한 시설: ${placedBuildings.length}개`,
      buildingRows,
      '',
      '복기 질문:',
      '내 선택은 인구·경제·환경·만족도 중 어떤 값을 가장 크게 바꾸었나요?',
      '',
      '다음 보완 방향:',
      EndingSummaryManager.formatReflectionNextAction(reflectionChoice),
    ].filter((row) => row !== null).join('\n');
  }

  static formatReflectionNextAction(reflectionChoice) {
    if (!reflectionChoice) {
      return '• 아직 선택하지 않음: 다음에는 결과를 보고 보완 방향을 하나 정합니다.';
    }

    return [
      `• ${reflectionChoice.title}`,
      reflectionChoice.nextAction ?? reflectionChoice.description,
    ].join('\n');
  }

  static formatStateSummary(gameState, ending, stateKeys = DEFAULT_STATE_KEYS, evaluationProfile = getEvaluationProfile()) {
    const stateRows = stateKeys
      .map((key) => `• ${STATE_LABELS[key] ?? key}: ${gameState[key] ?? 0}`)
      .join('\n');
    const issueRows = IssueDetector.formatRows(gameState, '큰 부작용 신호 없음', evaluationProfile).join('\n');

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

  static formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice, selectedStrategy = null, placementConfig = null, evaluationProfile = null) {
    const exploredNames = explorationPlaces
      .filter((place) => exploredPlaces.includes(place.id))
      .map((place) => place.name)
      .join(', ') || '없음';
    const quizStatus = !quizResult ? '미응답' : quizResult.correct ? '정답' : '오답 후 피드백 확인';

    return [
      `배치 실험: ${placementConfig?.title ?? '기본 배치 실험'} / 필요 배치: ${placementConfig?.requiredPlacements ?? '-'}개 / 평가 기준: ${evaluationProfile?.id ?? '기본'}`,
      `탐색: ${exploredPlaces.length}/${explorationPlaces.length}곳 확인 (${exploredNames})`,
      `자료 확인: ${learningProgress.dataViewed ? '완료' : '미완료'} / 인구 감소 · 지역 불균형 · 고령화 자료 카드 확인`,
      `원인 질문: ${quizStatus} / 문제 정리: ${learningProgress.problemSummaryCompleted ? '완료' : '미완료'} / EP1 완료: ${learningProgress.completed ? '예' : '아니오'}`,
      `배치 전략: ${selectedStrategy?.title ?? '미선택'}${selectedStrategy?.stateFocus ? ` / 초점: ${selectedStrategy.stateFocus}` : ''}`,
      `배치 기록: ${learningProgress.placedBuildingIds.length}개 시설 배치 / 생각 정리: ${reflectionChoice?.title ?? '미선택'} / 다음 액션: ${reflectionChoice?.nextActionLabel ?? '미정'}`,
    ];
  }
}
