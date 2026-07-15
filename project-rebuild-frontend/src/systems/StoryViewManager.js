export const STORY_LAYOUT = {
  backgroundColor: 0x123524,
  title: { y: 150, fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  intro: { y: 430, fontSize: '34px', color: '#dcfce7', align: 'center', lineSpacing: 18 },
  startButton: {
    y: 830,
    width: 360,
    height: 86,
    label: '지역 탐색 시작',
    fillColor: 0xbbf7d0,
    hoverFillColor: 0x86efac,
    strokeColor: 0x86efac,
    strokeWidth: 4,
    textColor: '#123524',
    fontSize: '38px',
    fontStyle: 'bold',
    targetScene: 'ExplorationScene',
  },
};

export default class StoryViewManager {
  static getLayout() {
    return STORY_LAYOUT;
  }

  static getStartButton(width) {
    return {
      ...STORY_LAYOUT.startButton,
      x: width / 2,
    };
  }
}
