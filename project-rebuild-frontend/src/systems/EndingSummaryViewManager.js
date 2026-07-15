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

export default class EndingSummaryViewManager {
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
}
