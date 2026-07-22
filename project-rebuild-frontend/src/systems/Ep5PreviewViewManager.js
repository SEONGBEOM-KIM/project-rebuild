import SCENE_KEYS from '../data/sceneKeys.js';

export default class Ep5PreviewViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: 0x0f172a },
      progressStep: 'ending',
      title: { x: width / 2, y: 72, text: 'EP5. 문제 해결 준비', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
      subtitle: { x: width / 2, y: 134, text: '한 가지를 우선 해결하되, 푸른군 전체의 균형을 지키는 계획을 고릅니다.', fontSize: '26px', color: '#bfdbfe' },
    };
  }

  static getIntroPanelLayout() {
    return { panel: { x: 960, y: 245, width: 1510, height: 170 }, title: { x: 250, y: 175, text: '해결 미션 브리핑' }, body: { x: 250, y: 215, wordWrapWidth: 1380 } };
  }

  static getPlanCardLayout(index) {
    const x = [440, 960, 1480][index];
    return { panel: { x, y: 600, width: 440, height: 420 }, icon: { x, y: 410 }, status: { x, y: 458, wordWrapWidth: 350 }, title: { x, y: 500, wordWrapWidth: 360 }, body: { x: x - 175, y: 548, wordWrapWidth: 350 } };
  }

  static getControlLayout(centerX) {
    return {
      back: { x: centerX - 240, y: 1000, label: 'EP4 정리로', target: SCENE_KEYS.Ep4Conclusion, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: centerX + 240, y: 1000, label: '해결안 저장 후 마무리', target: SCENE_KEYS.Ending, backgroundColor: '#64748b', textColor: '#e2e8f0' },
    };
  }

  static getCardStyle(plan, selected = false, recommended = false) {
    return { fillColor: selected ? 0xfffbeb : 0xffffff, fillAlpha: 0.97, strokeWidth: selected ? 7 : 4, strokeColor: selected || recommended ? plan.color : 0x93c5fd };
  }

  static getNextButtonStyle(enabled) {
    return { backgroundColor: enabled ? '#bbf7d0' : '#64748b', textColor: enabled ? '#123524' : '#e2e8f0' };
  }
}
