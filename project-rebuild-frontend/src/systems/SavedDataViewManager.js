export default class SavedDataViewManager {
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
