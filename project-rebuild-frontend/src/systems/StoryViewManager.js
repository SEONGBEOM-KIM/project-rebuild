import SCENE_KEYS from '../data/sceneKeys.js';

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
    targetScene: SCENE_KEYS.Exploration,
  },
};

export const STORY_DIALOGUE_LAYOUT = {
  panel: { x: 960, y: 510, width: 1240, height: 470, fillColor: 0x1e293b, fillAlpha: 0.98, strokeWidth: 5, strokeColor: 0x86efac },
  speaker: { x: 960, y: 350 },
  text: { x: 960, y: 515, wordWrapWidth: 1020 },
  progress: { x: 960, y: 730 },
  nextButton: {
    y: 875,
    width: 360,
    height: 82,
    nextLabel: '다음 이야기',
    finalLabel: '지역 탐색 시작',
    fillColor: 0xbbf7d0,
    hoverFillColor: 0x86efac,
    strokeColor: 0x86efac,
    strokeWidth: 4,
    textColor: '#123524',
    fontSize: '34px',
    fontStyle: 'bold',
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

  static getDialogueLayout(width, index, total) {
    return {
      panel: { ...STORY_DIALOGUE_LAYOUT.panel },
      speaker: { x: width / 2, ...STORY_DIALOGUE_LAYOUT.speaker },
      text: { x: width / 2, ...STORY_DIALOGUE_LAYOUT.text },
      progress: { x: width / 2, ...STORY_DIALOGUE_LAYOUT.progress, text: `${index + 1} / ${total}` },
      nextButton: { ...STORY_DIALOGUE_LAYOUT.nextButton, x: width / 2 },
    };
  }
}
