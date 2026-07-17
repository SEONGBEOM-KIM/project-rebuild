export const SAVED_DATA_LAYOUT = {
  backgroundColor: 0x10253f,
  title: { y: 90, text: '저장 데이터 확인', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 155, text: '브라우저 localStorage에 임시 저장된 학습 기록입니다. 앱 저장 JSON과 API 미리보기 JSON을 가져올 수 있습니다.', fontSize: '24px', color: '#bfdbfe' },
  bodyPanel: { y: 535, width: 1320, height: 660, fillColor: 0x111827, alpha: 0.98, strokeWidth: 5, strokeColor: 0x60a5fa },
  bodyText: { x: 340, y: 245 },
  status: { y: 865 },
  importFile: { type: 'file', accept: 'application/json,.json' },
};

export const SAVED_DATA_BUTTON_STYLE = {
  fontSize: '28px',
  padding: { x: 34, y: 18 },
};

export const SAVED_DATA_BUTTONS = {
  back: { offsetX: -600, y: 940, label: '제목으로', backgroundColor: '#c4b5fd', textColor: '#1e1b4b', targetScene: 'TitleScene' },
  import: { offsetX: -200, y: 940, label: 'JSON 가져오기', backgroundColor: '#bfdbfe', textColor: '#0f172a' },
  continue: { offsetX: 175, y: 940, label: '이어보기', targetScene: 'EndingScene' },
  clear: { offsetX: 560, y: 940, label: '저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
};

export default class SavedDataViewManager {
  static getLayout(width) {
    return {
      backgroundColor: SAVED_DATA_LAYOUT.backgroundColor,
      title: { ...SAVED_DATA_LAYOUT.title, x: width / 2 },
      subtitle: { ...SAVED_DATA_LAYOUT.subtitle, x: width / 2 },
      bodyPanel: { ...SAVED_DATA_LAYOUT.bodyPanel, x: width / 2 },
      bodyText: SAVED_DATA_LAYOUT.bodyText,
      status: { ...SAVED_DATA_LAYOUT.status, x: width / 2 },
      importFile: SAVED_DATA_LAYOUT.importFile,
    };
  }

  static getButtonLayout(width) {
    return Object.fromEntries(
      Object.entries(SAVED_DATA_BUTTONS).map(([key, button]) => [
        key,
        {
          ...button,
          x: width / 2 + button.offsetX,
        },
      ]),
    );
  }

  static getButtonStyle() {
    return { ...SAVED_DATA_BUTTON_STYLE, padding: { ...SAVED_DATA_BUTTON_STYLE.padding } };
  }

  static getBodyTextStyle() {
    return {
      fontSize: '21px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 5,
      wordWrap: { width: 1240 },
    };
  }

  static getStatusTextStyle() {
    return {
      fontSize: '23px',
      color: '#fecaca',
      align: 'center',
    };
  }

  static getContinueButtonState(saved) {
    const canContinue = SavedDataViewManager.canContinue(saved);
    return {
      canContinue,
      backgroundColor: canContinue ? '#bbf7d0' : '#94a3b8',
      textColor: '#123524',
    };
  }

  static formatBody(saved) {
    return saved
      ? JSON.stringify(saved, null, 2)
      : '저장된 데이터가 없습니다.';
  }

  static canContinue(saved) {
    return Boolean(saved?.data);
  }

  static getContinueButtonColor(saved) {
    return SavedDataViewManager.canContinue(saved) ? '#bbf7d0' : '#94a3b8';
  }

  static getImportErrorMessage(error) {
    return error?.message || 'JSON 가져오기에 실패했습니다.';
  }
}
