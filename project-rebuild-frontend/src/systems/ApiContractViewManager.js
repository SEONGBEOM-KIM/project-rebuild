export const API_CONTRACT_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 78, text: 'API 계약 보기', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: 'Django REST Framework 연동 시 사용할 저장 endpoint와 요청/응답 구조 초안입니다.', fontSize: '25px', color: '#bfdbfe' },
};

const API_CONTRACT_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 5,
  strokeColor: 0x60a5fa,
  titleFontSize: '30px',
  titleColor: '#ffffff',
  titleFontStyle: 'bold',
};

const API_CONTRACT_NOTE_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.98,
  strokeWidth: 3,
  titleFontSize: '23px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '22px',
  bodyColor: '#ffffff',
};

const API_CONTRACT_BUTTON_STYLE = {
  fontSize: '29px',
  padding: { x: 28, y: 16 },
};

export default class ApiContractViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: API_CONTRACT_SCREEN_LAYOUT.backgroundColor,
      progressStep: API_CONTRACT_SCREEN_LAYOUT.progressStep,
      title: { ...API_CONTRACT_SCREEN_LAYOUT.title, x: width / 2 },
      subtitle: { ...API_CONTRACT_SCREEN_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelStyle() {
    return { ...API_CONTRACT_PANEL_STYLE };
  }

  static getNoteStyle() {
    return { ...API_CONTRACT_NOTE_STYLE };
  }

  static getButtonStyle() {
    return { ...API_CONTRACT_BUTTON_STYLE, padding: { ...API_CONTRACT_BUTTON_STYLE.padding } };
  }

  static getPanelLayout() {
    return {
      request: { x: 580, y: 525, width: 860, height: 660, title: '요청 Body 초안' },
      response: { x: 1370, y: 525, width: 620, height: 660, title: '응답 예시' },
    };
  }

  static getPanelTitlePosition(panel) {
    return {
      x: panel.x - panel.width / 2 + 35,
      y: panel.y - panel.height / 2 + 32,
    };
  }

  static getPanelBodyPosition(panel) {
    return {
      x: panel.x - panel.width / 2 + 35,
      y: panel.y - panel.height / 2 + 85,
    };
  }

  static getPanelBodyStyle(panel) {
    return {
      fontSize: '17px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 3,
      wordWrap: { width: panel.width - 70 },
    };
  }

  static getNotesLayout() {
    return {
      panel: { x: 960, y: 855, width: 1480, height: 76, strokeColor: 0xfde68a },
      title: { x: 250, y: 834, text: '백엔드 구현 메모' },
      body: { x: 455, y: 834, width: 1200 },
    };
  }

  static formatBackendNote() {
    return '실제 연동 시 student/user, class_id, created_at은 서버에서 추가하는 편이 안전합니다. 프론트는 학습 결과 payload만 전송합니다.';
  }

  static getControlLayout() {
    return {
      payload: { x: 650, y: 960, label: 'Payload 미리보기', target: 'ApiPayloadScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
      data: { x: 970, y: 960, label: '학습 데이터로', target: 'LearningDataScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      ending: { x: 1280, y: 960, label: '마무리로', target: 'EndingScene', backgroundColor: '#fde68a', textColor: '#0f172a' },
    };
  }
}
