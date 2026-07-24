import SCENE_KEYS from '../data/sceneKeys.js';

const DATA_BRIEFING_SCREEN_LAYOUT = {
  backgroundColor: 0x172554,
  progressStep: 'data',
  title: { y: 70, text: 'EP1. 자료 확인', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 138, fontSize: '28px', color: '#bfdbfe' },
  progress: { x: 960, y: 910, wordWrapWidth: 900 },
};

const DATA_CARD_LAYOUT = {
  width: 500,
  height: 560,
  fillColor: 0xffffff,
  fillAlpha: 0.97,
  strokeWidth: 5,
  strokeColor: 0x93c5fd,
  title: { offsetY: -230, wordWrapWidth: 440 },
  subtitle: { offsetY: -185 },
  status: { offsetX: 176, offsetY: -145 },
  barLabel: { offsetX: -205 },
  barValue: { offsetX: 335 },
  barBackgroundColor: 0xe2e8f0,
  takeawayPanel: { offsetY: 170, width: 430, height: 150, fillColor: 0xe0f2fe, fillAlpha: 1, strokeWidth: 3, strokeColor: 0x60a5fa },
  takeawayTitle: { offsetX: -190, offsetY: 112, text: '읽어야 할 점' },
  takeawayBody: { offsetX: -190, offsetY: 150, wordWrapWidth: 380 },
};

const CONCEPT_BOX_LAYOUT = {
  panel: { x: 960, y: 840, width: 1280, height: 110, fillColor: 0x0f172a, fillAlpha: 0.88, strokeWidth: 3, strokeColor: 0xfde68a },
  title: { x: 350, y: 810, text: '핵심 개념' },
  body: { x: 350, y: 848, wordWrapWidth: 1220 },
};

const DATA_CARD_TEXT_STYLES = {
  title: { fontSize: '33px', color: '#172554', fontStyle: 'bold', align: 'center' },
  subtitle: { fontSize: '22px', color: '#475569' },
  status: { fontSize: '18px', color: '#166534', fontStyle: 'bold' },
  barLabel: { fontSize: '23px', color: '#1e293b', fontStyle: 'bold' },
  barValue: { fontSize: '23px', color: '#0f172a' },
  takeawayTitle: { fontSize: '23px', color: '#172554', fontStyle: 'bold' },
  takeawayBody: { fontSize: '21px', color: '#334155', lineSpacing: 7 },
  progress: { fontSize: '24px', color: '#dbeafe', fontStyle: 'bold' },
};

const CONCEPT_BOX_TEXT_STYLES = {
  title: { fontSize: '27px', color: '#fde68a', fontStyle: 'bold' },
  body: { fontSize: '25px', color: '#ffffff' },
};

const DATA_BRIEFING_BUTTON_STYLE = {
  fontSize: '32px',
  padding: { x: 34, y: 18 },
};

export default class DataBriefingViewManager {
  static getScreenLayout(width) {
    return {
      background: { color: DATA_BRIEFING_SCREEN_LAYOUT.backgroundColor },
      progressStep: DATA_BRIEFING_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...DATA_BRIEFING_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...DATA_BRIEFING_SCREEN_LAYOUT.subtitle },
      progress: { ...DATA_BRIEFING_SCREEN_LAYOUT.progress },
    };
  }

  static getDataCardLayout(x, y) {
    return {
      panel: { x, y, width: DATA_CARD_LAYOUT.width, height: DATA_CARD_LAYOUT.height, fillColor: DATA_CARD_LAYOUT.fillColor, fillAlpha: DATA_CARD_LAYOUT.fillAlpha, strokeWidth: DATA_CARD_LAYOUT.strokeWidth, strokeColor: DATA_CARD_LAYOUT.strokeColor },
      title: { x, y: y + DATA_CARD_LAYOUT.title.offsetY, wordWrapWidth: DATA_CARD_LAYOUT.title.wordWrapWidth },
      subtitle: { x, y: y + DATA_CARD_LAYOUT.subtitle.offsetY },
      status: { x: x + DATA_CARD_LAYOUT.status.offsetX, y: y + DATA_CARD_LAYOUT.status.offsetY },
      barLabel: { x: x + DATA_CARD_LAYOUT.barLabel.offsetX },
      barValue: { x: x + DATA_CARD_LAYOUT.barValue.offsetX },
      barBackgroundColor: DATA_CARD_LAYOUT.barBackgroundColor,
      takeawayPanel: { x, y: y + DATA_CARD_LAYOUT.takeawayPanel.offsetY, width: DATA_CARD_LAYOUT.takeawayPanel.width, height: DATA_CARD_LAYOUT.takeawayPanel.height, fillColor: DATA_CARD_LAYOUT.takeawayPanel.fillColor, fillAlpha: DATA_CARD_LAYOUT.takeawayPanel.fillAlpha, strokeWidth: DATA_CARD_LAYOUT.takeawayPanel.strokeWidth, strokeColor: DATA_CARD_LAYOUT.takeawayPanel.strokeColor },
      takeawayTitle: { x: x + DATA_CARD_LAYOUT.takeawayTitle.offsetX, y: y + DATA_CARD_LAYOUT.takeawayTitle.offsetY, text: DATA_CARD_LAYOUT.takeawayTitle.text },
      takeawayBody: { x: x + DATA_CARD_LAYOUT.takeawayBody.offsetX, y: y + DATA_CARD_LAYOUT.takeawayBody.offsetY, wordWrapWidth: DATA_CARD_LAYOUT.takeawayBody.wordWrapWidth },
    };
  }

  static getConceptBoxLayout() {
    return {
      panel: { ...CONCEPT_BOX_LAYOUT.panel },
      title: { ...CONCEPT_BOX_LAYOUT.title },
      body: { ...CONCEPT_BOX_LAYOUT.body },
    };
  }

  static getDataCardTextStyles() {
    return {
      title: { ...DATA_CARD_TEXT_STYLES.title },
      subtitle: { ...DATA_CARD_TEXT_STYLES.subtitle },
      status: { ...DATA_CARD_TEXT_STYLES.status },
      barLabel: { ...DATA_CARD_TEXT_STYLES.barLabel },
      barValue: { ...DATA_CARD_TEXT_STYLES.barValue },
      takeawayTitle: { ...DATA_CARD_TEXT_STYLES.takeawayTitle },
      takeawayBody: { ...DATA_CARD_TEXT_STYLES.takeawayBody },
      progress: { ...DATA_CARD_TEXT_STYLES.progress },
    };
  }

  static getConceptBoxTextStyles() {
    return {
      title: { ...CONCEPT_BOX_TEXT_STYLES.title },
      body: { ...CONCEPT_BOX_TEXT_STYLES.body },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 760, y: 980, label: '탐색 다시 보기', target: SCENE_KEYS.Exploration, backgroundColor: '#93c5fd', textColor: '#0f172a' },
      next: { x: 1160, y: 980, label: '원인 질문 풀기', target: SCENE_KEYS.CauseQuiz, backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: DATA_BRIEFING_BUTTON_STYLE.fontSize,
      padding: { ...DATA_BRIEFING_BUTTON_STYLE.padding },
    };
  }

  static getCardPosition(index) {
    return {
      x: 390 + index * 570,
      y: 500,
    };
  }

  static getBarLayout(bar, cardX, cardY, index) {
    const ratio = bar.max > 0 ? bar.value / bar.max : 0;
    return {
      x: cardX - 20,
      y: cardY - 80 + index * 110,
      backgroundWidth: 340,
      width: Math.max(24, Math.round(ratio * 330)),
      height: 38,
    };
  }

  static formatBarValue(bar) {
    return `${bar.value.toLocaleString()}${bar.suffix ?? '명'}`;
  }

  static formatSubtitle(regionName) {
    return `탐색에서 본 ${regionName} 문제를 숫자 자료로 다시 확인합니다.`;
  }

  static formatProgress(viewedCount, totalCount) {
    return viewedCount >= totalCount
      ? `자료 확인 완료: ${viewedCount}/${totalCount}개 · 이제 원인 질문을 풀어보세요.`
      : `자료 확인: ${viewedCount}/${totalCount}개 · 카드를 클릭해 각 자료를 자세히 살펴보세요.`;
  }

  static getCardState(viewed) {
    return viewed
      ? { strokeColor: 0x22c55e, strokeWidth: 7, fillAlpha: 1 }
      : { strokeColor: 0x93c5fd, strokeWidth: 5, fillAlpha: 0.97 };
  }

  static getCardStatus(viewed) {
    return viewed
      ? { label: '✓ 확인 완료', color: '#166534' }
      : { label: '카드를 눌러 확인', color: '#64748b' };
  }

  static validateCards(cards) {
    return cards.map((card) => ({
      id: card.id,
      ok: Boolean(
        card.id
        && card.title
        && card.subtitle
        && card.takeaway
        && Array.isArray(card.bars)
        && card.bars.length >= 2
        && card.bars.every((bar) => Number.isFinite(bar.value) && Number.isFinite(bar.max) && bar.max > 0),
      ),
    }));
  }
}
