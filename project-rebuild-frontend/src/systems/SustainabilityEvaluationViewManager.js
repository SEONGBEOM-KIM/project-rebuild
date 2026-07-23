import SCENE_KEYS from '../data/sceneKeys.js';

export default class SustainabilityEvaluationViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: 0x10253f,
      title: { x: width / 2, y: 76, text: 'EP6. 지속 가능성 평가', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
      subtitle: { x: width / 2, y: 140, text: '성장과 삶의 질이 함께 이어질 수 있는 푸른군인지 평가합니다.', fontSize: '26px', color: '#bfdbfe' },
    };
  }

  static getTakeawayLayout(centerX) {
    return {
      panel: { x: centerX, y: 245, width: 1510, height: 150 },
      title: { x: centerX - 700, y: 185, text: '종합 평가 결론' },
      body: { x: centerX - 700, y: 220, wordWrapWidth: 1380 },
    };
  }

  static getDimensionLayout(index) {
    const positions = [440, 960, 1480, 960];
    const yPositions = [530, 530, 530, 790];
    return {
      panel: { x: positions[index], y: yPositions[index], width: index === 3 ? 1510 : 440, height: index === 3 ? 180 : 290 },
      icon: { x: index === 3 ? 250 : positions[index], y: yPositions[index] - (index === 3 ? 55 : 98) },
      title: { x: index === 3 ? 330 : positions[index], y: yPositions[index] - (index === 3 ? 62 : 45), wordWrapWidth: index === 3 ? 360 : 340 },
      body: { x: index === 3 ? 330 : positions[index] - 170, y: yPositions[index] - (index === 3 ? 26 : 5), wordWrapWidth: index === 3 ? 1260 : 340 },
    };
  }

  static getDimensionStyle(dimension) {
    return {
      fillColor: 0xffffff,
      fillAlpha: 0.97,
      strokeWidth: dimension.passed ? 6 : 4,
      strokeColor: dimension.passed ? 0x4ade80 : 0xfacc15,
    };
  }

  static getControls(centerX) {
    return {
      learningData: { x: centerX - 220, y: 1000, label: '학습 기록 보기', target: SCENE_KEYS.LearningData, backgroundColor: '#bfdbfe', textColor: '#172554' },
      ending: { x: centerX + 40, y: 1000, label: '최종 결과 보기', target: SCENE_KEYS.Ending, backgroundColor: '#bbf7d0', textColor: '#123524' },
      restart: { x: centerX + 300, y: 1000, label: '처음 화면으로', target: SCENE_KEYS.Boot, backgroundColor: '#fde68a', textColor: '#0f172a' },
    };
  }
}
