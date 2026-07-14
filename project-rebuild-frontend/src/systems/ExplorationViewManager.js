export default class ExplorationViewManager {
  static canContinue(exploredCount, requiredCount) {
    return exploredCount >= requiredCount;
  }

  static formatPanelTitle(place) {
    return `${place.icon} ${place.name}`;
  }

  static formatPanelBody(place) {
    return [
      '확인한 문제',
      place.problem,
      '',
      '자료 카드',
      place.data,
      '',
      '학습 개념',
      place.concept,
    ].join('\n');
  }

  static formatProgressText(exploredCount, totalCount, requiredCount) {
    const canContinue = ExplorationViewManager.canContinue(exploredCount, requiredCount);
    return [
      `탐색 진행: ${exploredCount}/${totalCount}`,
      `필수 확인: ${requiredCount}곳 이상`,
      canContinue ? '다음 단계로 이동할 수 있습니다.' : '장소를 더 클릭해 문제를 확인하세요.',
    ].join('\n');
  }

  static formatNeedMoreText(exploredCount, totalCount, requiredCount) {
    return [
      `탐색 진행: ${exploredCount}/${totalCount}`,
      `최소 ${requiredCount}곳을 확인해야 다음 단계로 갈 수 있습니다.`,
      '지도 위 장소 마커를 클릭하세요.',
    ].join('\n');
  }

  static getNextButtonState(exploredCount, requiredCount) {
    const canContinue = ExplorationViewManager.canContinue(exploredCount, requiredCount);
    return {
      canContinue,
      label: canContinue ? '자료 확인' : `${requiredCount - exploredCount}곳 더 탐색`,
      backgroundColor: canContinue ? '#bbf7d0' : '#94a3b8',
    };
  }

  static getMarkerStyle(placeId, selectedPlaceId) {
    const selected = placeId === selectedPlaceId;
    return {
      selected,
      strokeWidth: selected ? 8 : 5,
      strokeColor: selected ? 0xfde68a : 0xffffff,
    };
  }
}
