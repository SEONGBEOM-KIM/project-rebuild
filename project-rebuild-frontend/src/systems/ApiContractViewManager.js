export default class ApiContractViewManager {
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
      panel: { x: 960, y: 855, width: 1480, height: 76 },
      title: { x: 250, y: 834 },
      body: { x: 455, y: 834, width: 1200 },
    };
  }

  static formatBackendNote() {
    return '실제 연동 시 student/user, class_id, created_at은 서버에서 추가하는 편이 안전합니다. 프론트는 학습 결과 payload만 전송합니다.';
  }

  static getControlLayout() {
    return {
      payload: { x: 650, y: 960, label: 'Payload 미리보기', target: 'ApiPayloadScene' },
      data: { x: 970, y: 960, label: '학습 데이터로', target: 'LearningDataScene' },
      ending: { x: 1280, y: 960, label: '마무리로', target: 'EndingScene' },
    };
  }
}
