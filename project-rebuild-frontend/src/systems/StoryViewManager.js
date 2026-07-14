export const STORY_LAYOUT = {
  backgroundColor: 0x123524,
  titleY: 150,
  introY: 430,
  startButton: {
    y: 830,
    width: 360,
    height: 86,
    label: '지역 탐색 시작',
    fillColor: 0xbbf7d0,
    hoverFillColor: 0x86efac,
    strokeColor: 0x86efac,
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
