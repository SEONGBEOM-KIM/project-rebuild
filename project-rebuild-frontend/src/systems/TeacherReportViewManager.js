const TEACHER_REPORT_SCREEN_LAYOUT = {
  backgroundColor: 0x0b1727,
  progressStep: 'ending',
  title: { y: 78, text: '교사용 요약', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: '수업 중 학생 활동을 빠르게 확인하기 위한 임시 리포트 화면입니다.', fontSize: '26px', color: '#bfdbfe' },
};

const TEACHER_REPORT_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0x60a5fa,
};

const TEACHER_REPORT_TEXT_STYLES = {
  panelTitle: { fontSize: '34px', color: '#172554', fontStyle: 'bold' },
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

  static getPanelStyle() {
    return { ...TEACHER_REPORT_PANEL_STYLE };
  }

  static getTextStyles() {
    return {
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

  static getPanelLayout() {
    return {
      progress: { x: 400, y: 450, width: 580, height: 560, title: '학습 진행' },
      choice: { x: 1010, y: 450, width: 580, height: 560, title: '선택과 결과' },
      teaching: { x: 1620, y: 450, width: 420, height: 560, title: '지도 포인트' },
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
      fontSize: '23px',
      color: '#1e293b',
      lineSpacing: 10,
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
