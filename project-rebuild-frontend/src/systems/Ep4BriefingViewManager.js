import SCENE_KEYS from '../data/sceneKeys.js';
import StateHudManager from './StateHudManager.js';

const GROWTH_RECORD_STATE_KEYS = ['economy', 'traffic', 'pollution', 'inequality'];

const SCREEN_LAYOUT = {
  backgroundColor: 0x172554,
  progressStep: 'ending',
  title: { y: 72, text: 'EP4. 부작용 발생', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 134, text: '성장한 푸른군에서 주민 생활의 새로운 부담을 확인합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const PANEL_STYLE = {
  fillColor: 0x0f172a,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0xfde68a,
  titleFontSize: '30px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '21px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 5,
};

const RISK_CARD_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.97,
  strokeWidth: 4,
  titleFontSize: '28px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
  bodyFontSize: '20px',
  bodyColor: '#334155',
  bodyLineSpacing: 4,
};

export default class Ep4BriefingViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: SCREEN_LAYOUT.backgroundColor },
      progressStep: SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...SCREEN_LAYOUT.subtitle },
    };
  }

  static getPanelStyle() {
    return { ...PANEL_STYLE };
  }

  static getRiskCardStyle(risk) {
    return { ...RISK_CARD_STYLE, strokeColor: risk.color ?? 0x93c5fd };
  }

  static getIntroPanelLayout() {
    return {
      panel: { x: 960, y: 260, width: 1510, height: 190 },
      title: { x: 250, y: 180, text: '성장 이후의 푸른군' },
      body: { x: 250, y: 215, wordWrapWidth: 1380 },
    };
  }

  static getRiskCardLayout(index) {
    const positions = [440, 960, 1480];
    const x = positions[index];
    return {
      panel: { x, y: 545, width: 440, height: 350 },
      icon: { x, y: 398 },
      priority: { x, y: 444, wordWrapWidth: 360 },
      title: { x, y: 484, wordWrapWidth: 360 },
      body: { x: x - 175, y: 534, wordWrapWidth: 350 },
    };
  }

  static getLearningPanelLayout() {
    return {
      panel: { x: 960, y: 845, width: 1510, height: 170 },
      title: { x: 250, y: 777, text: '이번 에피소드에서 할 일' },
      body: { x: 250, y: 815, wordWrapWidth: 1380 },
    };
  }

  static getControlLayout(centerX) {
    return {
      back: { x: centerX - 220, y: 1000, label: 'EP3 결과로 돌아가기', target: SCENE_KEYS.Ending, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: centerX + 220, y: 1000, label: '부작용 현황 확인', target: SCENE_KEYS.Ep4Investigation, backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static formatIntroText(briefing) {
    return briefing.intro.join('\n');
  }

  static formatGrowthRecord({ strategy = null, summary = null } = {}) {
    if (!summary?.completed) {
      return 'EP3 성장 기록을 불러오는 중입니다. 경제 성장 선택과 시설 배치 결과를 확인합니다.';
    }

    const facilityNames = [...new Set(
      (summary.placements ?? []).map((record) => record.building?.name ?? record.buildingName ?? record.buildingId).filter(Boolean),
    )];
    const facilityText = facilityNames.length
      ? `새로 배치한 시설: ${facilityNames.slice(0, 3).join(' · ')}`
      : '새로 배치한 시설 기록 없음';
    const stateText = summary.startGameState && summary.endGameState
      ? StateHudManager.buildItems(summary.endGameState, {
        previousState: summary.startGameState,
        stateKeys: GROWTH_RECORD_STATE_KEYS,
      }).map((item) => `${item.icon} ${item.label} ${item.deltaText}`).join('  ')
      : '상태 변화 기록 없음';

    return [
      `EP3 선택: ${strategy?.title ?? '성장 전략'} · ${strategy?.stateFocus ?? '지역 변화 관찰'}`,
      `${facilityText}  |  성장 후 변화: ${stateText}`,
    ].join('\n');
  }

  static sortRisks(risks = []) {
    return [...risks].sort((left, right) => Number(right.primary) - Number(left.primary) || (right.impact ?? 0) - (left.impact ?? 0));
  }

  static formatRiskPriority(risk) {
    const level = risk.severity?.label ?? '확인 필요';
    return risk.primary ? `이번 성장에서 가장 두드러진 문제 · ${level}` : `함께 발생한 부작용 · ${level}`;
  }

  static formatRiskBody(risk) {
    return [risk.message, '', `다음 관찰: ${risk.nextAction}`].join('\n');
  }

  static formatLearningBody(briefing) {
    return [`학습 목표: ${briefing.learningGoal}`, '', ...briefing.activitySteps.map((step, index) => `${index + 1}. ${step}`)].join('\n');
  }
}
