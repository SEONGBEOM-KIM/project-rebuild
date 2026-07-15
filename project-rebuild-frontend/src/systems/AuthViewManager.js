export const AUTH_LAYOUT = {
  backgroundColor: 0x0b1727,
  title: { y: 170, text: '학습자 입장', fontSize: '68px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 245, text: '현재 버전은 로그인/회원가입 UI만 제공합니다.', fontSize: '28px', color: '#93c5fd' },
  panels: [
    { offsetX: -260, offsetY: 40, title: '로그인' },
    { offsetX: 260, offsetY: 40, title: '회원가입' },
  ],
  panel: {
    width: 420,
    height: 430,
    fillColor: 0x172554,
    strokeColor: 0x60a5fa,
    strokeWidth: 4,
    titleOffsetY: -160,
    titleFontSize: '38px',
    titleColor: '#ffffff',
    fieldOffsetX: -140,
    fields: [
      { offsetY: -60, label: '이름' },
      { offsetY: 30, label: '비밀번호' },
    ],
    fieldWidth: 310,
    fieldHeight: 54,
    fieldColor: 0xf8fafc,
    fieldLabelFontSize: '24px',
    fieldLabelColor: '#64748b',
    sampleButton: { offsetY: 130, width: 210, height: 58, color: 0x38bdf8, label: 'UI 샘플', fontSize: '26px', textColor: '#0f172a' },
  },
  proceedButton: { y: 850, text: '인증 없이 계속하기', targetScene: 'StoryScene', fontSize: '36px', textColor: '#10253f', backgroundColor: '#fde68a', padding: { x: 36, y: 18 } },
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
