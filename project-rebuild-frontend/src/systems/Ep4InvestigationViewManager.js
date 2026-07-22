import SCENE_KEYS from '../data/sceneKeys.js';

const CARD_POSITIONS = [440, 960, 1480];

export default class Ep4InvestigationViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: 0x0f172a },
      progressStep: 'ending',
      title: { x: width / 2, y: 74, text: 'EP4. 부작용 현황 확인', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
      subtitle: { x: width / 2, y: 136, text: '세 가지 문제를 모두 살펴본 뒤, 푸른군에 필요한 다음 해결 방향을 생각합니다.', fontSize: '25px', color: '#bfdbfe' },
      progress: { x: width / 2, y: 184, wordWrapWidth: 1200 },
    };
  }

  static getRiskCardLayout(index) {
    const x = CARD_POSITIONS[index];
    return {
      panel: { x, y: 410, width: 440, height: 305 },
      icon: { x, y: 300 },
      status: { x, y: 350, wordWrapWidth: 350 },
      title: { x, y: 390, wordWrapWidth: 350 },
      body: { x: x - 175, y: 438, wordWrapWidth: 350 },
    };
  }

  static getDetailPanelLayout() {
    return {
      panel: { x: 960, y: 745, width: 1510, height: 215 },
      title: { x: 250, y: 666, text: '문제 지역 관찰 기록' },
      body: { x: 250, y: 710, wordWrapWidth: 1380 },
    };
  }

  static getControlLayout(centerX) {
    return {
      back: { x: centerX - 250, y: 1000, label: 'EP4 안내로', target: SCENE_KEYS.Ep4Briefing, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      next: { x: centerX + 250, y: 1000, label: 'EP5 해결 단계 예고', target: SCENE_KEYS.Ending, backgroundColor: '#64748b', textColor: '#e2e8f0' },
    };
  }

  static getCardStyle(risk, selected = false, reviewed = false) {
    return {
      fillColor: selected ? 0xfffbeb : 0xffffff,
      fillAlpha: 0.97,
      strokeWidth: selected ? 7 : 4,
      strokeColor: reviewed ? 0x22c55e : risk.color ?? 0x93c5fd,
    };
  }

  static getCardTextStyle() {
    return {
      status: { fontSize: '17px', color: '#64748b', fontStyle: 'bold', align: 'center' },
      title: { fontSize: '28px', color: '#172554', fontStyle: 'bold', align: 'center' },
      body: { fontSize: '19px', color: '#334155', lineSpacing: 4 },
    };
  }

  static getDetailStyle() {
    return { fillColor: 0x172554, fillAlpha: 0.98, strokeWidth: 4, strokeColor: 0xfde68a, titleFontSize: '30px', titleColor: '#fde68a', titleFontStyle: 'bold' };
  }

  static formatProgress(reviewedCount, totalCount) {
    return reviewedCount >= totalCount
      ? '세 가지 부작용을 모두 확인했습니다. 이제 성장과 삶의 질을 함께 고려하는 해결 단계를 준비합니다.'
      : `확인한 부작용: ${reviewedCount}/${totalCount} · 카드를 눌러 각 문제의 원인과 다음 관찰을 확인하세요.`;
  }

  static formatCardStatus(risk, reviewed) {
    if (reviewed) return '✓ 관찰 완료';
    return risk.primary ? '우선 관찰 필요' : '함께 확인할 문제';
  }

  static formatCardBody(risk) {
    return `${risk.shortMessage}\n${risk.primary ? '이번 선택에서 특히 크게 나타났습니다.' : '다른 문제와 함께 발생했습니다.'}`;
  }

  static formatDetail(risk = null) {
    if (!risk) return '카드를 선택하면 이 문제가 왜 생겼는지와 다음 단계에서 무엇을 관찰할지 확인할 수 있습니다.';
    return [`${risk.title}이 나타난 이유`, risk.cause, '', '다음 관찰', risk.nextAction].join('\n');
  }

  static getNextButtonStyle(enabled) {
    return { backgroundColor: enabled ? '#bbf7d0' : '#64748b', textColor: enabled ? '#123524' : '#e2e8f0' };
  }
}
