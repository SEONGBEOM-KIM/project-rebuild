import SCENE_KEYS from '../data/sceneKeys.js';

export const TITLE_LAYOUT = {
  backgroundColor: 0x10253f,
  title: { y: 280, text: '프로젝트 리빌드', fontSize: '92px', color: '#f7fbff', fontStyle: 'bold' },
  subtitle: { y: 380, text: '균형 있게 성장하는 지역을 위하여', fontSize: '36px', color: '#b9d7ff' },
  importHint: { savedY: 700, emptyY: 700, text: '앱 저장 JSON과 API 미리보기 JSON을 가져올 수 있습니다.', fontSize: '20px', color: '#bfdbfe' },
  buttons: {
    start: { y: 620, label: '시작하기', targetScene: SCENE_KEYS.Auth },
    load: { savedY: 745, label: '저장 데이터 확인', targetScene: SCENE_KEYS.SavedData },
    import: { savedY: 835, emptyY: 745, label: 'JSON 가져오기' },
    storage: { savedY: 910, emptyY: 820, label: '브라우저 저장 관리', targetScene: SCENE_KEYS.StorageManager },
  },
  importStatus: { savedY: 975, emptyY: 885 },
  importFile: { type: 'file', accept: 'application/json,.json', successTargetScene: SCENE_KEYS.SavedData },
  importStatusStyle: { fontSize: '22px', color: '#fecaca', align: 'center' },
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
      importHint: {
        ...TITLE_LAYOUT.importHint,
        y: hasSave ? TITLE_LAYOUT.importHint.savedY : TITLE_LAYOUT.importHint.emptyY,
      },
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

  static getImportHint(hasSave) {
    return {
      ...TITLE_LAYOUT.importHint,
      y: hasSave ? TITLE_LAYOUT.importHint.savedY : TITLE_LAYOUT.importHint.emptyY,
    };
  }

  static getImportFileConfig() {
    return TITLE_LAYOUT.importFile;
  }

  static getImportStatusStyle() {
    return { ...TITLE_LAYOUT.importStatusStyle };
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
