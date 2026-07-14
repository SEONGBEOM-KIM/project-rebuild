export default class SavedDataViewManager {

  static getButtonLayout(width) {
    return {
      back: { x: width / 2 - 600, y: 940 },
      import: { x: width / 2 - 200, y: 940 },
      continue: { x: width / 2 + 175, y: 940 },
      clear: { x: width / 2 + 560, y: 940 },
    };
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
