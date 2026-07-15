export const STORAGE_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  title: { y: 90, text: '브라우저 저장 관리', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 155, text: 'localStorage에 남아 있는 학습 저장 데이터와 Mock 제출 로그를 관리합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const STORAGE_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 5,
  titleFontSize: '36px',
  titleFontStyle: 'bold',
};

const STORAGE_STATUS_TEXT_STYLE = {
  fontSize: '24px',
  color: '#bfdbfe',
};

const STORAGE_BUTTON_STYLE = {
  fontSize: '28px',
  padding: { x: 24, y: 16 },
};

export const STORAGE_CONTROL_BUTTONS = {
  clearSave: { x: 360, y: 930, label: '학습 저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
  clearLog: { x: 710, y: 930, label: '제출 로그 삭제', backgroundColor: '#fed7aa', textColor: '#7c2d12' },
  clearAll: { x: 1050, y: 930, label: '전체 초기화', backgroundColor: '#fca5a5', textColor: '#7f1d1d' },
  title: { x: 1370, y: 930, label: '제목으로', backgroundColor: '#c4b5fd', textColor: '#1e1b4b', targetScene: 'TitleScene' },
  savedData: { x: 1640, y: 930, label: '저장 확인', backgroundColor: '#bbf7d0', textColor: '#123524', targetScene: 'SavedDataScene' },
};

export default class StorageManagerViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: STORAGE_SCREEN_LAYOUT.backgroundColor,
      title: { ...STORAGE_SCREEN_LAYOUT.title, x: width / 2 },
      subtitle: { ...STORAGE_SCREEN_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelStyle() {
    return { ...STORAGE_PANEL_STYLE };
  }

  static getStatusTextStyle() {
    return { ...STORAGE_STATUS_TEXT_STYLE };
  }

  static getButtonStyle() {
    return { ...STORAGE_BUTTON_STYLE, padding: { ...STORAGE_BUTTON_STYLE.padding } };
  }

  static getPanelLayout() {
    return {
      saved: {
        panel: { x: 575, y: 520, width: 760, height: 580, strokeColor: 0x93c5fd },
        title: { x: 575, y: 275, text: '학습 저장 데이터', color: '#172554' },
        body: { x: 255, y: 345 },
      },
      submissions: {
        panel: { x: 1345, y: 520, width: 760, height: 580, strokeColor: 0xbbf7d0 },
        title: { x: 1345, y: 275, text: 'Mock 제출 로그', color: '#14532d' },
        body: { x: 1025, y: 345 },
      },
    };
  }

  static getBodyTextStyle() {
    return {
      fontSize: '26px',
      color: '#1e293b',
      lineSpacing: 13,
      wordWrap: { width: 640 },
    };
  }

  static getControlLayout() {
    return {
      status: { x: 960, y: 835 },
      ...STORAGE_CONTROL_BUTTONS,
    };
  }
}
