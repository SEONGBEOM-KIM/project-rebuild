import SCENE_KEYS from '../data/sceneKeys.js';
import { EPISODE_IDS } from '../data/episodes.js';

const ENDING_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 78, text: '학습 마무리', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: 'EP1 탐색부터 시설 배치까지의 학습 기록을 요약합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const ENDING_TAKEAWAY_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.96,
  strokeWidth: 3,
  strokeColor: 0x93c5fd,
  title: '학습 결론',
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

const ENDING_TEXT_STYLES = {
  takeawayTitle: { fontSize: '25px', color: '#fde68a', fontStyle: 'bold' },
  takeawayBody: { fontSize: '22px', color: '#e0f2fe', lineSpacing: 5 },
  panelTitle: { fontSize: '32px', color: '#172554', fontStyle: 'bold' },
  learningRecordTitle: { fontSize: '28px', color: '#fde68a', fontStyle: 'bold' },
  learningRecordBody: { fontSize: '22px', color: '#ffffff', lineSpacing: 9 },
  nextMissionTitle: { fontSize: '32px', color: '#ffffff', fontStyle: 'bold' },
};

const ENDING_BUTTON_STYLE = {
  fontSize: '26px',
  padding: { x: 34, y: 18 },
};

export default class EndingSummaryViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: ENDING_SCREEN_LAYOUT.backgroundColor },
      progressStep: ENDING_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...ENDING_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...ENDING_SCREEN_LAYOUT.subtitle },
    };
  }

  static getTakeawayStyle() {
    return { ...ENDING_TAKEAWAY_STYLE };
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

  static getTextStyles() {
    return {
      takeawayTitle: { ...ENDING_TEXT_STYLES.takeawayTitle },
      takeawayBody: { ...ENDING_TEXT_STYLES.takeawayBody },
      panelTitle: { ...ENDING_TEXT_STYLES.panelTitle },
      learningRecordTitle: { ...ENDING_TEXT_STYLES.learningRecordTitle },
      learningRecordBody: { ...ENDING_TEXT_STYLES.learningRecordBody },
      nextMissionTitle: { ...ENDING_TEXT_STYLES.nextMissionTitle },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: ENDING_BUTTON_STYLE.fontSize,
      padding: { ...ENDING_BUTTON_STYLE.padding },
    };
  }

  static getTakeawayLayout(centerX) {
    return {
      panel: { x: centerX, y: 205, width: 1660, height: 82 },
      title: { x: centerX - 790, y: 178, text: ENDING_TAKEAWAY_STYLE.title },
      body: { x: centerX - 620, y: 176, wordWrapWidth: 1410 },
    };
  }

  static getPanelLayout() {
    return {
      choice: { x: 430, y: 470, width: 600, height: 500, title: '오늘의 선택 요약' },
      state: { x: 1110, y: 470, width: 600, height: 500, title: '지역 상태 요약' },
      nextMission: { x: 1585, y: 470, width: 360, height: 500, title: '다음 개발 목표' },
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
      fontSize: '20px',
      color: '#1e293b',
      lineSpacing: 5,
      wordWrap: { width: panel.width - 90 },
    };
  }

  static getNextMissionBodyStyle(panel) {
    return {
      fontSize: '20px',
      color: '#dbeafe',
      lineSpacing: 8,
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

  static getControlLayout(centerX, placementEpisodeId = null) {
    const nextEpisodeControl = placementEpisodeId === EPISODE_IDS.EconomyGrowth
      ? { label: 'EP4 부작용 보기', target: SCENE_KEYS.Ep4Briefing, backgroundColor: '#fda4af', textColor: '#4c0519' }
      : placementEpisodeId === EPISODE_IDS.PopulationRecovery
        ? { label: 'EP3 예고 보기', target: SCENE_KEYS.Ep3Preview, backgroundColor: '#fde68a', textColor: '#422006' }
        : { label: 'EP2 미션 보기', target: SCENE_KEYS.Ep2Briefing, backgroundColor: '#a7f3d0', textColor: '#064e3b' };
    const extraControl = placementEpisodeId === EPISODE_IDS.PopulationRecovery
      ? { label: 'EP2 전략 다시 보기', target: SCENE_KEYS.Ep2Briefing, backgroundColor: '#93c5fd', textColor: '#0f172a' }
      : { label: 'EP3 예고 보기', target: SCENE_KEYS.Ep3Preview, backgroundColor: '#fde68a', textColor: '#422006' };
    return {
      retry: { x: centerX - 760, y: 955, label: '배치 다시 조정', target: SCENE_KEYS.Placement, backgroundColor: '#c4b5fd', textColor: '#0f172a' },
      report: { x: centerX - 455, y: 955, label: '교사용 요약', target: SCENE_KEYS.TeacherReport, backgroundColor: '#93c5fd', textColor: '#0f172a' },
      data: { x: centerX - 150, y: 955, label: '학습 데이터 보기', target: SCENE_KEYS.LearningData, backgroundColor: '#bbf7d0', textColor: '#0f172a' },
      ep2: { x: centerX + 170, y: 955, ...nextEpisodeControl },
      ep3: { x: centerX + 480, y: 955, ...extraControl },
      restart: { x: centerX + 780, y: 955, label: '처음부터 다시', target: SCENE_KEYS.Boot, backgroundColor: '#fca5a5', textColor: '#450a0a' },
    };
  }
}
