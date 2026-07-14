export const AUTH_LAYOUT = {
  backgroundColor: 0x0b1727,
  title: { y: 170, text: '학습자 입장' },
  subtitle: { y: 245, text: '현재 버전은 로그인/회원가입 UI만 제공합니다.' },
  panels: [
    { offsetX: -260, offsetY: 40, title: '로그인' },
    { offsetX: 260, offsetY: 40, title: '회원가입' },
  ],
  panel: {
    width: 420,
    height: 430,
    fillColor: 0x172554,
    strokeColor: 0x60a5fa,
    titleOffsetY: -160,
    fieldOffsetX: -140,
    fields: [
      { offsetY: -60, label: '이름' },
      { offsetY: 30, label: '비밀번호' },
    ],
    fieldWidth: 310,
    fieldHeight: 54,
    fieldColor: 0xf8fafc,
    sampleButton: { offsetY: 130, width: 210, height: 58, color: 0x38bdf8, label: 'UI 샘플' },
  },
  proceedButton: { y: 850, text: '인증 없이 계속하기', targetScene: 'StoryScene' },
};

export default class AuthViewManager {
  static getLayout() {
    return AUTH_LAYOUT;
  }

  static getPanelPositions(width, height) {
    return AUTH_LAYOUT.panels.map((panel) => ({
      ...panel,
      x: width / 2 + panel.offsetX,
      y: height / 2 + panel.offsetY,
    }));
  }

  static getProceedButton(width) {
    return {
      ...AUTH_LAYOUT.proceedButton,
      x: width / 2,
    };
  }
}
