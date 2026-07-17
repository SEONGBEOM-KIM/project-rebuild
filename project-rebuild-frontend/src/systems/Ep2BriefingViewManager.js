export const EP2_BRIEFING_LAYOUT = {
  backgroundColor: 0x10253f,
  progressStep: 'ending',
  title: { y: 76, text: 'EP2. 인구 유입 전략', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 142, text: '푸른군에 사람들이 다시 찾아오게 만들 조건을 비교합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const EP2_BRIEFING_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0x93c5fd,
  titleFontSize: '32px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '24px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 10,
};

const EP2_BRIEFING_CARD_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 4,
  titleFontSize: '29px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
  bodyFontSize: '22px',
  bodyColor: '#1e293b',
  bodyLineSpacing: 8,
};

const EP2_BRIEFING_BUTTON_STYLE = {
  fontSize: '29px',
  padding: { x: 34, y: 18 },
};

export default class Ep2BriefingViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: EP2_BRIEFING_LAYOUT.backgroundColor,
      progressStep: EP2_BRIEFING_LAYOUT.progressStep,
      title: { ...EP2_BRIEFING_LAYOUT.title, x: width / 2 },
      subtitle: { ...EP2_BRIEFING_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelStyle() {
    return { ...EP2_BRIEFING_PANEL_STYLE };
  }

  static getCardStyle() {
    return { ...EP2_BRIEFING_CARD_STYLE };
  }

  static getButtonStyle() {
    return { ...EP2_BRIEFING_BUTTON_STYLE, padding: { ...EP2_BRIEFING_BUTTON_STYLE.padding } };
  }

  static getIntroPanelLayout() {
    return {
      panel: { x: 960, y: 262, width: 1510, height: 150, strokeColor: 0x93c5fd },
      title: { x: 250, y: 205, text: '다음 미션' },
      body: { x: 250, y: 250, wordWrapWidth: 1380 },
    };
  }

  static getStrategyCardLayout(index) {
    const positions = [
      { x: 440, y: 555 },
      { x: 960, y: 555 },
      { x: 1480, y: 555 },
    ];
    const position = positions[index];
    return {
      panel: { x: position.x, y: position.y, width: 440, height: 390 },
      icon: { x: position.x, y: position.y - 135 },
      title: { x: position.x, y: position.y - 78, wordWrapWidth: 360 },
      body: { x: position.x - 180, y: position.y - 25, wordWrapWidth: 360 },
      check: { x: position.x - 180, y: position.y + 125, wordWrapWidth: 360 },
    };
  }

  static getControlLayout(centerX) {
    return {
      ending: { x: centerX - 250, y: 950, label: 'EP1 마무리로', target: 'EndingScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      start: { x: centerX + 250, y: 950, label: '전략 선택으로', target: 'SelectionScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static formatIntroText(briefing) {
    return briefing.intro.join('\n');
  }

  static formatStrategyBody(strategy) {
    return [
      strategy.description,
      '',
      `상태 변화: ${strategy.stateFocus}`,
    ].join('\n');
  }

  static formatStrategyCheck(strategy) {
    return `생각할 점: ${strategy.checkQuestion}`;
  }
}
