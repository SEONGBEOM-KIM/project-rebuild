import { explorationPlaces } from '../data/explorationPlaces.js';
import { DEFAULT_STATE_KEYS, STATE_LABELS } from '../data/stateLabels.js';
import { getEvaluationProfile } from '../data/evaluationRules.js';
import { EPISODE_IDS } from '../data/episodes.js';
import { getEpisodeContent } from '../data/episodeContent.js';
import { getEp5SolutionPlan } from '../data/ep5SolutionPlans.js';
import IndustrializationRiskManager from './IndustrializationRiskManager.js';
import StateHudManager from './StateHudManager.js';

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

  static getPriorityIssue(gameState, evaluationProfile = getEvaluationProfile(), placedBuildings = [], placementEpisodeId = null) {
    const issues = IndustrializationRiskManager.detect({
      gameState,
      placedBuildings,
      placementEpisodeId,
      evaluationProfile,
    });
    return issues.find((issue) => issue.primary) ?? issues[0] ?? null;
  }

  static formatFinalTakeaway({ gameState, ending, reflectionChoice, selectedStrategy = null, evaluationProfile = getEvaluationProfile(), placedBuildings = [], placementEpisodeId = null }) {
    const issue = EndingSummaryManager.getPriorityIssue(gameState, evaluationProfile, placedBuildings, placementEpisodeId);
    const issueText = issue ? issue.title : '큰 부작용 신호 없음';
    const actionText = reflectionChoice?.nextActionLabel ?? '다음 학습 관점 기록 필요';
    const strategyText = selectedStrategy
      ? `배치 전략: ${selectedStrategy.title} / 목표: ${selectedStrategy.placementGoalShort ?? selectedStrategy.stateFocus}`
      : null;

    return [
      `${ending.title}: ${ending.message}`,
      strategyText
        ? `${strategyText} / 우선 보완: ${issueText} / 다음 학습 관점: ${actionText}`
        : `우선 보완: ${issueText} / 다음 학습 관점: ${actionText}`,
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
      '기록한 관점:',
      EndingSummaryManager.formatReflectionNextAction(reflectionChoice),
    ].filter((row) => row !== null).join('\n');
  }

  static formatReflectionNextAction(reflectionChoice) {
    if (!reflectionChoice) {
      return '• 아직 기록하지 않음: 이번 결과에서 배운 점을 하나 정리합니다.';
    }

    return [
      `• ${reflectionChoice.title}`,
      reflectionChoice.nextAction ?? reflectionChoice.description,
    ].join('\n');
  }

  static formatStateSummary(gameState, ending, stateKeys = DEFAULT_STATE_KEYS, evaluationProfile = getEvaluationProfile(), placedBuildings = [], placementEpisodeId = null) {
    const stateRows = stateKeys
      .map((key) => `• ${STATE_LABELS[key] ?? key}: ${gameState[key] ?? 0}`)
      .join('\n');
    const issues = IndustrializationRiskManager.detect({ gameState, placedBuildings, placementEpisodeId, evaluationProfile });
    const issueRows = issues.length
      ? issues.map((issue) => `• ${issue.primary ? '최우선 · ' : ''}${issue.title}: ${issue.shortMessage}${issue.severity ? ` (${issue.severity.label})` : ''}`).join('\n')
      : '• 큰 부작용 신호 없음';

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
      `배치 기록: ${learningProgress.placedBuildingIds.length}개 시설 배치 / 배운 점: ${reflectionChoice?.title ?? '미선택'} / 성장 준비 관점: ${reflectionChoice?.nextActionLabel ?? '미정'}`,
    ];
  }

  static formatEpisodeJourney(worldState = {}) {
    const episodeRuns = worldState.episodeRuns ?? {};
    const recoveryRun = episodeRuns[EPISODE_IDS.PopulationRecovery] ?? {};
    const economyRun = episodeRuns[EPISODE_IDS.EconomyGrowth] ?? {};
    const sideEffectRun = episodeRuns[EPISODE_IDS.SideEffects] ?? {};
    const solutionRun = episodeRuns[EPISODE_IDS.BalancedSolutions] ?? {};
    const sustainabilityRun = episodeRuns[EPISODE_IDS.SustainabilityEvaluation] ?? {};
    const economyStrategy = getEpisodeContent(EPISODE_IDS.EconomyGrowth).missionBriefing?.strategies?.find(
      (strategy) => strategy.id === economyRun.metadata?.selectedStrategyId,
    );
    const recoveryStrategy = getEpisodeContent(EPISODE_IDS.PopulationRecovery).missionBriefing?.strategies?.find(
      (strategy) => strategy.id === recoveryRun.metadata?.selectedStrategyId,
    );
    const solutionPlan = getEp5SolutionPlan(solutionRun.metadata?.selectedSolutionPlanId);
    const primaryRisk = sideEffectRun.metadata?.riskSummary?.primaryRisk ?? null;
    const economyChanges = economyRun.startGameState && economyRun.endGameState
      ? StateHudManager.buildItems(economyRun.endGameState, {
        previousState: economyRun.startGameState,
        stateKeys: ['economy', 'traffic', 'pollution', 'inequality'],
      }).map((item) => `${item.icon} ${item.label} ${item.deltaText}`).join('  ')
      : '변화 기록 없음';
    const ep2Placements = (worldState.placements ?? []).filter(
      (record) => record.episodeId === EPISODE_IDS.PopulationRecovery,
    ).length;

    const journeyRows = [
      `EP2 회복: ${recoveryStrategy?.title ?? '회복 전략'} 선택 / 생활 기반 시설 ${ep2Placements}개를 배치해 인구 유입 조건을 살폈습니다.`,
      `EP3 성장: ${economyStrategy?.title ?? '성장 전략'} 선택 / ${economyChanges}`,
      `EP4 점검: ${primaryRisk?.title ?? '교통·환경·소득 격차'} 문제를 함께 확인했습니다.`,
      `EP5 해결: ${solutionPlan?.title ?? '균형 해결안'}으로 우선 문제를 보완하며 세 지표를 함께 관리했습니다.`,
    ];

    const sustainabilityEvaluation = sustainabilityRun.metadata?.sustainabilityEvaluation;
    if (sustainabilityEvaluation) {
      const remainingText = sustainabilityEvaluation.remainingTitles?.length
        ? `다음 보완: ${sustainabilityEvaluation.remainingTitles.join(' · ')}`
        : '모든 지속 가능성 기준 충족';
      journeyRows.push(`EP6 평가: ${sustainabilityEvaluation.score}/4 · ${sustainabilityEvaluation.outcome?.title ?? '종합 평가'} / ${remainingText}`);
    }

    return journeyRows;
  }
}
