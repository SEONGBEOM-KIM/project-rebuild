const TEACHER_REPORT_SCREEN_LAYOUT = {
  backgroundColor: 0x0b1727,
  progressStep: 'ending',
  title: { y: 78, text: '교사용 요약', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: '수업 중 학생 활동을 빠르게 확인하기 위한 임시 리포트 화면입니다.', fontSize: '26px', color: '#bfdbfe' },
};

const TEACHER_REPORT_SUMMARY_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.96,
  strokeWidth: 3,
  strokeColor: 0xfde68a,
  title: '수업 결론',
};

const TEACHER_REPORT_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0x60a5fa,
};

const TEACHER_REPORT_TEXT_STYLES = {
  summaryTitle: { fontSize: '25px', color: '#fde68a', fontStyle: 'bold' },
  summaryBody: { fontSize: '21px', color: '#e0f2fe', lineSpacing: 5 },
  panelTitle: { fontSize: '31px', color: '#172554', fontStyle: 'bold' },
  status: { fontSize: '24px', color: '#bfdbfe', align: 'center' },
};

const TEACHER_REPORT_STATUS_COLORS = {
  success: '#bbf7d0',
  failure: '#fecaca',
};

const TEACHER_REPORT_BUTTON_STYLE = {
  fontSize: '29px',
  padding: { x: 34, y: 18 },
};

export default class TeacherReportViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: TEACHER_REPORT_SCREEN_LAYOUT.backgroundColor },
      progressStep: TEACHER_REPORT_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...TEACHER_REPORT_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...TEACHER_REPORT_SCREEN_LAYOUT.subtitle },
    };
  }

  static getSummaryStyle() {
    return { ...TEACHER_REPORT_SUMMARY_STYLE };
  }

  static getPanelStyle() {
    return { ...TEACHER_REPORT_PANEL_STYLE };
  }

  static getTextStyles() {
    return {
      summaryTitle: { ...TEACHER_REPORT_TEXT_STYLES.summaryTitle },
      summaryBody: { ...TEACHER_REPORT_TEXT_STYLES.summaryBody },
      panelTitle: { ...TEACHER_REPORT_TEXT_STYLES.panelTitle },
      status: { ...TEACHER_REPORT_TEXT_STYLES.status },
    };
  }

  static getStatusColor(state) {
    return TEACHER_REPORT_STATUS_COLORS[state] ?? TEACHER_REPORT_TEXT_STYLES.status.color;
  }

  static getButtonStyle() {
    return {
      fontSize: TEACHER_REPORT_BUTTON_STYLE.fontSize,
      padding: { ...TEACHER_REPORT_BUTTON_STYLE.padding },
    };
  }

  static getSummaryLayout(centerX) {
    return {
      panel: { x: centerX, y: 205, width: 1660, height: 82 },
      title: { x: centerX - 790, y: 178, text: TEACHER_REPORT_SUMMARY_STYLE.title },
      body: { x: centerX - 620, y: 176, wordWrapWidth: 1410 },
    };
  }

  static getPanelLayout() {
    return {
      progress: { x: 400, y: 485, width: 580, height: 500, title: '학습 진행' },
      choice: { x: 1010, y: 485, width: 580, height: 500, title: '선택과 결과' },
      teaching: { x: 1620, y: 485, width: 420, height: 500, title: '지도 포인트' },
    };
  }

  static getPanelTitlePosition(panel) {
    return {
      x: panel.x,
      y: panel.y - panel.height / 2 + 44,
    };
  }

  static getPanelBodyPosition(panel) {
    return {
      x: panel.x - panel.width / 2 + 38,
      y: panel.y - panel.height / 2 + 100,
    };
  }

  static getPanelBodyStyle(panel) {
    return {
      fontSize: '20px',
      color: '#1e293b',
      lineSpacing: 6,
      wordWrap: { width: panel.width - 76 },
    };
  }

  static getControlLayout() {
    return {
      status: { x: 960, y: 855 },
      copy: { x: 520, y: 940, label: '리포트 복사', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      download: { x: 820, y: 940, label: 'TXT 다운로드', backgroundColor: '#a7f3d0', textColor: '#064e3b' },
      ending: { x: 1140, y: 940, label: '마무리로 돌아가기', target: 'EndingScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      data: { x: 1490, y: 940, label: '학습 데이터 보기', target: 'LearningDataScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }
}
