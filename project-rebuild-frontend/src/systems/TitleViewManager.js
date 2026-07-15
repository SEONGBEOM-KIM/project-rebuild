export const TITLE_LAYOUT = {
  backgroundColor: 0x10253f,
  title: { y: 280, text: '프로젝트 리빌드' },
  subtitle: { y: 380, text: '균형 있게 성장하는 지역을 위하여' },
  buttons: {
    start: { y: 620, label: '시작하기', targetScene: 'AuthScene' },
    load: { savedY: 745, label: '저장 데이터 확인', targetScene: 'SavedDataScene' },
    import: { savedY: 835, emptyY: 745, label: 'JSON 가져오기' },
    storage: { savedY: 910, emptyY: 820, label: '브라우저 저장 관리', targetScene: 'StorageManagerScene' },
  },
  importStatus: { savedY: 975, emptyY: 885 },
  importFile: { type: 'file', accept: 'application/json,.json', successTargetScene: 'SavedDataScene' },
};

export default class TitleViewManager {
  static getScreenText() {
    return {
      backgroundColor: TITLE_LAYOUT.backgroundColor,
      title: TITLE_LAYOUT.title,
      subtitle: TITLE_LAYOUT.subtitle,
    };
  }

  static getLayout(hasSave) {
    return {
      startButtonY: TITLE_LAYOUT.buttons.start.y,
      loadButtonY: hasSave ? TITLE_LAYOUT.buttons.load.savedY : null,
      importButtonY: hasSave ? TITLE_LAYOUT.buttons.import.savedY : TITLE_LAYOUT.buttons.import.emptyY,
      storageButtonY: hasSave ? TITLE_LAYOUT.buttons.storage.savedY : TITLE_LAYOUT.buttons.storage.emptyY,
      importStatusY: hasSave ? TITLE_LAYOUT.importStatus.savedY : TITLE_LAYOUT.importStatus.emptyY,
    };
  }

  static getStartButton() {
    return TITLE_LAYOUT.buttons.start;
  }

  static getLoadButton() {
    return TITLE_LAYOUT.buttons.load;
  }

  static getImportButton() {
    return TITLE_LAYOUT.buttons.import;
  }

  static getStorageButton() {
    return TITLE_LAYOUT.buttons.storage;
  }

  static getImportFileConfig() {
    return TITLE_LAYOUT.importFile;
  }

  static formatImportError(error) {
    return error?.message || 'JSON 가져오기에 실패했습니다.';
  }

  static getPrimaryButtonStyle() {
    return {
      fontSize: '44px',
      color: '#10253f',
      backgroundColor: '#a7f3d0',
      padding: { x: 44, y: 22 },
    };
  }

  static getSecondaryButtonStyle() {
    return {
      fontSize: '30px',
      color: '#0f172a',
      backgroundColor: '#bfdbfe',
      padding: { x: 32, y: 15 },
    };
  }

  static getStorageButtonStyle() {
    return {
      fontSize: '24px',
      color: '#dbeafe',
      backgroundColor: '#334155',
      padding: { x: 24, y: 12 },
    };
  }

  static getLoadButtonStyle() {
    return {
      fontSize: '32px',
      color: '#dbeafe',
      backgroundColor: '#1e293b',
      padding: { x: 34, y: 16 },
    };
  }
}
