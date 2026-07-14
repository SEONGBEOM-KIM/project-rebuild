export default class DataBriefingViewManager {
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
