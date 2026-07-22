import SCENE_KEYS from '../data/sceneKeys.js';

export default class Ep4ConclusionViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: 0x172554 },
      progressStep: 'ending',
      title: { x: width / 2, y: 88, text: 'EP4. 성장의 부작용 정리', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
      subtitle: { x: width / 2, y: 150, text: '성장은 지역을 바꾸지만, 주민의 삶과 환경을 함께 살피는 해결이 필요합니다.', fontSize: '26px', color: '#bfdbfe' },
    };
  }

  static getMainPanelLayout() {
    return {
      panel: { x: 960, y: 430, width: 1510, height: 480 },
      title: { x: 250, y: 230, text: '이번 성장에서 배운 점' },
      body: { x: 250, y: 280, wordWrapWidth: 1380 },
    };
  }

  static getNextPanelLayout() {
    return {
      panel: { x: 960, y: 775, width: 1510, height: 160 },
      title: { x: 250, y: 712, text: '다음: EP5. 문제 해결' },
      body: { x: 250, y: 750, wordWrapWidth: 1380 },
    };
  }

  static getPanelStyle(variant = 'main') {
    return variant === 'next'
      ? { fillColor: 0x0f172a, fillAlpha: 0.98, strokeWidth: 4, strokeColor: 0xbbf7d0, titleFontSize: '30px', titleColor: '#bbf7d0', titleFontStyle: 'bold' }
      : { fillColor: 0xffffff, fillAlpha: 0.97, strokeWidth: 4, strokeColor: 0xfde68a, titleFontSize: '32px', titleColor: '#172554', titleFontStyle: 'bold' };
  }

  static getControlLayout(centerX) {
    return {
      back: { x: centerX - 220, y: 970, label: 'EP4 현황 다시 보기', target: SCENE_KEYS.Ep4Investigation, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: centerX + 220, y: 970, label: 'EP5 시작하기', target: SCENE_KEYS.EpisodeTransition, backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static formatMainBody(risks = []) {
    const primary = risks.find((risk) => risk.primary) ?? risks[0] ?? null;
    const riskRows = risks.map((risk) => `• ${risk.primary ? '가장 두드러진 문제 · ' : ''}${risk.title}: ${risk.shortMessage}`).join('\n');
    return [
      '경제 성장에는 일자리와 활력이라는 긍정적 변화가 있지만, 교통·환경·생활 격차의 부담도 함께 생길 수 있습니다.',
      '',
      '이번 푸른군에서 확인한 부작용',
      riskRows || '• 아직 확인한 부작용이 없습니다.',
      '',
      primary ? `우선 해결 관점: ${primary.title}을 먼저 낮추되, 나머지 문제도 함께 악화되지 않도록 살펴야 합니다.` : '우선 해결 관점: 여러 지표를 함께 비교합니다.',
    ].join('\n');
  }

  static formatNextBody() {
    return '다음 에피소드에서는 교통, 환경, 생활 격차 문제를 하나씩 따로 없애는 것이 아니라, 지역 전체의 균형을 회복하는 정책과 시설 조합을 고민합니다.';
  }
}
