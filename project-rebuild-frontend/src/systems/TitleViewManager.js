export default class TitleViewManager {
  static getLayout(hasSave) {
    return {
      startButtonY: 620,
      loadButtonY: hasSave ? 745 : null,
      importButtonY: hasSave ? 835 : 745,
      storageButtonY: hasSave ? 910 : 820,
      importStatusY: hasSave ? 975 : 885,
    };
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
