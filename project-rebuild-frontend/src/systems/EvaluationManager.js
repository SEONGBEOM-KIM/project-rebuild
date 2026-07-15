import { REACTION_THRESHOLDS, RESULT_THRESHOLDS, SCORE_RULES } from '../data/evaluationRules.js';
import { STATE_LABELS, formatSignedValue } from '../data/stateLabels.js';
import IssueDetector from './IssueDetector.js';

export default class EvaluationManager {
  static calculateScore(gameState) {
    const scoreParts = [
      Math.min(SCORE_RULES.maxPartScore, Math.max(0, (gameState.population - SCORE_RULES.populationBase) / SCORE_RULES.populationDivisor)),
      Math.min(SCORE_RULES.maxPartScore, Math.max(0, (gameState.economy - SCORE_RULES.economyBase) * SCORE_RULES.economyMultiplier)),
      Math.min(SCORE_RULES.maxPartScore, Math.max(0, gameState.environment - SCORE_RULES.environmentBase)),
      Math.min(SCORE_RULES.maxPartScore, Math.max(0, gameState.satisfaction - SCORE_RULES.satisfactionBase)),
      gameState.budget >= RESULT_THRESHOLDS.budgetSafe ? SCORE_RULES.maxPartScore : Math.max(0, gameState.budget / SCORE_RULES.budgetDivisor),
    ];
    return Math.round(scoreParts.reduce((sum, value) => sum + value, 0));
  }

  static evaluateState(gameState, placedBuildings) {
    const score = EvaluationManager.calculateScore(gameState);
    const uniqueBuildingTypes = new Set(placedBuildings.map((record) => record.building.id)).size;
    const hasBalancedChoices = uniqueBuildingTypes >= RESULT_THRESHOLDS.balancedMinimumBuildingTypes
      && gameState.environment >= RESULT_THRESHOLDS.environmentGood
      && gameState.satisfaction >= RESULT_THRESHOLDS.satisfactionBalanced;

    if (hasBalancedChoices && score >= RESULT_THRESHOLDS.balancedScore) {
      return {
        score,
        title: '균형 있는 회복 가능성이 보입니다',
        color: '#bbf7d0',
        message: '여러 시설을 조합해 인구·생활 만족·환경을 함께 살펴보는 방향이 좋습니다.',
      };
    }

    if (score >= RESULT_THRESHOLDS.recoveryScore) {
      return {
        score,
        title: '지역 회복의 출발점이 마련되었습니다',
        color: '#fde68a',
        message: '일부 지표는 좋아졌지만, 다음 단계에서는 부족한 지표를 보완하는 선택이 필요합니다.',
      };
    }

    return {
      score,
      title: '추가 조정이 필요한 계획입니다',
      color: '#fecaca',
      message: '한두 지표만 높이는 선택보다 인구·경제·환경·만족도를 함께 고려해야 합니다.',
    };
  }


  static formatBeforeAfterRows(lastPlacementResult, fallbackState) {
    if (!lastPlacementResult) {
      return Object.entries(STATE_LABELS)
        .map(([key, label]) => `${label}: ${fallbackState[key]}`)
        .join('\n');
    }

    return Object.entries(STATE_LABELS)
      .map(([key, label]) => {
        const before = lastPlacementResult.before[key];
        const after = lastPlacementResult.after[key];
        const delta = after - before;
        const marker = delta === 0 ? '' : ` (${formatSignedValue(delta)})`;
        return `${label}: ${before} → ${after}${marker}`;
      })
      .join('\n');
  }

  static formatJudgementRows(gameState) {
    return [
      `• 인구 변화: ${gameState.population >= RESULT_THRESHOLDS.populationImproved ? '증가 확인' : '아직 제한적'}`,
      `• 경제 수준: ${gameState.economy >= RESULT_THRESHOLDS.economyImproved ? '개선됨' : '추가 개선 필요'}`,
      `• 환경 상태: ${gameState.environment >= RESULT_THRESHOLDS.environmentGood ? '양호' : '주의 필요'}`,
      `• 주민 만족도: ${gameState.satisfaction >= RESULT_THRESHOLDS.satisfactionHigh ? '높아짐' : '추가 개선 필요'}`,
      `• 예산: ${gameState.budget >= RESULT_THRESHOLDS.budgetSafe ? '여유 있음' : '주의 필요'}`,
    ];
  }


  static formatIssueRows(gameState) {
    const issues = IssueDetector.detect(gameState);
    if (!issues.length) {
      return ['• 현재 큰 부작용 신호는 없습니다.'];
    }
    return issues.map((issue) => `• ${issue.title}: ${issue.message}`);
  }

  static formatEvaluationRows(evaluation, gameState, placedBuildings, selectedPolicy) {
    const policyAlignment = EvaluationManager.calculatePolicyAlignment(selectedPolicy, placedBuildings);
    return [
      `선택 방향: ${selectedPolicy?.name ?? '기본 배치 연습'}`,
      `배치 수: ${placedBuildings.length}개`,
      policyAlignment.label,
      `균형 점수: ${evaluation.score}/100`,
      '',
      '주의 신호:',
      ...EvaluationManager.formatIssueRows(gameState),
      '',
      '판단 기준:',
      ...EvaluationManager.formatJudgementRows(gameState),
      '',
      '학습 포인트:',
      evaluation.message,
      policyAlignment.message,
      '',
      '※ 현재 평가는 시스템 검증용 임시 기준입니다.',
    ].join('\n');
  }

  static calculatePolicyAlignment(selectedPolicy, placedBuildings) {
    if (!selectedPolicy?.recommendedBuildingIds?.length) {
      return {
        label: '방향 일치: 기준 없음',
        message: '선택한 회복 방향 없이 기본 배치 연습으로 진행했습니다.',
      };
    }

    const recommendedSet = new Set(selectedPolicy.recommendedBuildingIds);
    const matchedCount = placedBuildings.filter((record) => recommendedSet.has(record.building.id)).length;
    const label = `방향 일치: ${matchedCount}/${placedBuildings.length}개`;

    if (matchedCount >= 2) {
      return {
        label,
        message: '선택한 회복 방향과 시설 배치가 대체로 연결되어 있습니다.',
      };
    }

    if (matchedCount === 1) {
      return {
        label,
        message: '선택한 방향과 연결되는 시설이 일부 포함되었습니다. 다음에는 추천 시설 조합도 비교해 볼 수 있습니다.',
      };
    }

    return {
      label,
      message: '선택한 방향과 실제 배치가 다릅니다. 왜 다른 시설을 선택했는지 설명해 보는 활동으로 연결할 수 있습니다.',
    };
  }

  static calculateEffectTotals(placedBuildings) {
    return placedBuildings.reduce((totals, record) => {
      for (const [key, value] of Object.entries(record.delta)) {
        totals[key] = (totals[key] ?? 0) + value;
      }
      return totals;
    }, {});
  }

  static getTopEffectRows(totals) {
    return Object.entries(totals)
      .filter(([, value]) => value !== 0)
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
      .slice(0, 5)
      .map(([key, value]) => `• ${STATE_LABELS[key] ?? key}: ${formatSignedValue(value)}`);
  }

  static getChoiceTrendMessage(totals, placedBuildings) {
    const uniqueBuildingTypes = new Set(placedBuildings.map((record) => record.building.id)).size;
    if ((totals.environment ?? 0) > 0 && (totals.population ?? 0) > 0 && uniqueBuildingTypes >= 2) {
      return '경향: 생활·환경을 함께 고려했습니다.';
    }
    if ((totals.population ?? 0) > 120 || (totals.economy ?? 0) > 20) {
      return '경향: 인구·경제 회복을 강하게 선택했습니다.';
    }
    if ((totals.environment ?? 0) > 15 || (totals.pollution ?? 0) < -5) {
      return '경향: 환경 회복을 중시했습니다.';
    }
    return '경향: 아직 선택 경향이 뚜렷하지 않습니다.';
  }


  static formatChoiceTrendRows(placedBuildings) {
    if (!placedBuildings.length) {
      return '배치 없음';
    }

    const totals = EvaluationManager.calculateEffectTotals(placedBuildings);
    const focusRows = EvaluationManager.getTopEffectRows(totals);
    const placementRows = placedBuildings
      .slice(-5)
      .map((record, index) => `${Math.max(1, placedBuildings.length - 4) + index}. ${record.building.name} (${record.position.x}, ${record.position.y})`)
      .join('\n');

    return [
      '누적 효과 상위:',
      ...(focusRows.length ? focusRows : ['• 변화 없음']),
      '',
      `선택 유형 수: ${new Set(placedBuildings.map((record) => record.building.id)).size}종`,
      EvaluationManager.getChoiceTrendMessage(totals, placedBuildings),
      '',
      '최근 배치:',
      placementRows,
    ].join('\n');
  }

  static formatResidentReactions(gameState, placedBuildings) {
    const reactions = [];
    const placedBuildingIds = new Set(placedBuildings.map((record) => record.building.id));

    if (gameState.satisfaction >= REACTION_THRESHOLDS.satisfactionHigh) {
      reactions.push('주민: 생활이 더 편리해질 것 같아요.');
    } else if (gameState.satisfaction >= REACTION_THRESHOLDS.satisfactionModerate) {
      reactions.push('주민: 변화가 보이지만 아직 더 필요한 시설이 있어요.');
    } else {
      reactions.push('주민: 시설은 생겼지만 생활 만족도 개선은 아직 부족해요.');
    }

    if (placedBuildingIds.has('bus_station') || gameState.traffic <= REACTION_THRESHOLDS.trafficComfortable) {
      reactions.push('고령 주민: 이동이 쉬워지면 병원과 시장에 가기 좋아져요.');
    } else if (placedBuildingIds.has('small_park')) {
      reactions.push('학생 주민: 쉴 수 있는 공간이 생겨 마을 분위기가 좋아졌어요.');
    } else {
      reactions.push('시장 상인: 사람이 더 찾아오려면 교통과 상권 회복도 중요해요.');
    }

    return reactions.slice(0, 2).join('  /  ');
  }

}
