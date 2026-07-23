import SCENE_KEYS from '../data/sceneKeys.js';

const EXPLORATION_SCREEN_LAYOUT = {
  backgroundColor: 0x0f2f3f,
  progressStep: 'exploration',
  title: { x: 80, y: 52, fontSize: '54px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { x: 82, y: 118, fontSize: '26px', color: '#bfdbfe' },
};

const EXPLORATION_MAP_LAYOUT = {
  backdrop: { x: 825, y: 560, width: 1120, height: 760, fillColor: 0x14532d, fillAlpha: 0.95, strokeWidth: 5, strokeColor: 0x86efac },
  hills: [
    { x: 680, y: 520, width: 520, height: 280, fillColor: 0x166534, fillAlpha: 0.9 },
    { x: 1030, y: 680, width: 620, height: 260, fillColor: 0x166534, fillAlpha: 0.9 },
  ],
  roads: [
    { x: 930, y: 545, width: 1040, height: 44, fillColor: 0x64748b, fillAlpha: 1, angle: -14 },
    { x: 1010, y: 430, width: 760, height: 34, fillColor: 0x64748b, fillAlpha: 1, angle: 28 },
  ],
  river: { x: 1040, y: 260, width: 80, height: 760, fillColor: 0x2563eb, fillAlpha: 0.82, angle: 36 },
  note: { x: 410, y: 875, text: '※ 지도 배경은 흐름 검증용 임시 데이터이며 장소 아이콘은 EP1 생성 아트입니다.' },
};

const PLACE_MARKER_LAYOUT = {
  marker: { x: 0, y: 0, radius: 56, fillAlpha: 0.96, strokeWidth: 5, strokeColor: 0xffffff },
  icon: { x: 0, y: -7 },
  labelBackground: { x: 0, y: 72, width: 170, height: 38, fillColor: 0x0f172a, fillAlpha: 0.9, strokeWidth: 2 },
  label: { x: 0, y: 72 },
  check: { x: 43, y: -45, text: '✓' },
};

const INFO_PANEL_LAYOUT = {
  panel: { x: 1570, y: 520, width: 560, height: 780, fillColor: 0xffffff, fillAlpha: 0.96, strokeWidth: 5, strokeColor: 0x93c5fd },
  title: { x: 1320, y: 185, wordWrapWidth: 500 },
  body: { x: 1320, y: 265, wordWrapWidth: 500 },
  progress: { x: 1320, y: 780, wordWrapWidth: 500 },
};

const EXPLORATION_TEXT_STYLES = {
  mapNote: { fontSize: '21px', color: '#d1fae5' },
  markerIcon: { fontSize: '38px' },
  markerLabel: { fontSize: '22px', color: '#ffffff', fontStyle: 'bold' },
  markerCheck: { fontSize: '30px', color: '#bbf7d0', fontStyle: 'bold' },
  panelTitle: { fontSize: '38px', color: '#172554', fontStyle: 'bold' },
  panelBody: { fontSize: '21px', color: '#1e293b', lineSpacing: 5 },
  progress: { fontSize: '22px', color: '#172554', lineSpacing: 5 },
};

const EXPLORATION_BUTTON_STYLE = {
  fontSize: '32px',
  padding: { x: 34, y: 18 },
};

export default class ExplorationViewManager {
  static getScreenLayout() {
    return {
      background: { color: EXPLORATION_SCREEN_LAYOUT.backgroundColor },
      progressStep: EXPLORATION_SCREEN_LAYOUT.progressStep,
      title: { ...EXPLORATION_SCREEN_LAYOUT.title },
      subtitle: { ...EXPLORATION_SCREEN_LAYOUT.subtitle },
    };
  }

  static formatSubtitle(regionName, requiredCount = null) {
    return requiredCount
      ? `${regionName}의 장소 ${requiredCount}곳을 클릭해 문제와 변화를 한눈에 확인하세요.`
      : `장소를 클릭해 ${regionName}의 문제가 어디에서 드러나는지 확인하세요.`;
  }

  static getMapLayout() {
    return {
      backdrop: { ...EXPLORATION_MAP_LAYOUT.backdrop },
      hills: EXPLORATION_MAP_LAYOUT.hills.map((hill) => ({ ...hill })),
      roads: EXPLORATION_MAP_LAYOUT.roads.map((road) => ({ ...road })),
      river: { ...EXPLORATION_MAP_LAYOUT.river },
      note: { ...EXPLORATION_MAP_LAYOUT.note },
    };
  }

  static getPlaceMarkerLayout() {
    return {
      marker: { ...PLACE_MARKER_LAYOUT.marker },
      icon: { ...PLACE_MARKER_LAYOUT.icon },
      labelBackground: { ...PLACE_MARKER_LAYOUT.labelBackground },
      label: { ...PLACE_MARKER_LAYOUT.label },
      check: { ...PLACE_MARKER_LAYOUT.check },
    };
  }

  static getInfoPanelLayout() {
    return {
      panel: { ...INFO_PANEL_LAYOUT.panel },
      title: { ...INFO_PANEL_LAYOUT.title },
      body: { ...INFO_PANEL_LAYOUT.body },
      progress: { ...INFO_PANEL_LAYOUT.progress },
    };
  }

  static getControlLayout() {
    return {
      back: { x: 1230, y: 955, label: '스토리 다시 보기', target: SCENE_KEYS.Story, backgroundColor: '#93c5fd', textColor: '#0f172a' },
      next: { x: 1600, y: 955, label: '자료 확인', target: SCENE_KEYS.DataBriefing, backgroundColor: '#94a3b8', textColor: '#0f172a' },
    };
  }

  static getTextStyles() {
    return {
      mapNote: { ...EXPLORATION_TEXT_STYLES.mapNote },
      markerIcon: { ...EXPLORATION_TEXT_STYLES.markerIcon },
      markerLabel: { ...EXPLORATION_TEXT_STYLES.markerLabel },
      markerCheck: { ...EXPLORATION_TEXT_STYLES.markerCheck },
      panelTitle: { ...EXPLORATION_TEXT_STYLES.panelTitle },
      panelBody: { ...EXPLORATION_TEXT_STYLES.panelBody },
      progress: { ...EXPLORATION_TEXT_STYLES.progress },
    };
  }

  static getButtonStyle() {
    return {
      fontSize: EXPLORATION_BUTTON_STYLE.fontSize,
      padding: { ...EXPLORATION_BUTTON_STYLE.padding },
    };
  }

  static canContinue(exploredCount, requiredCount) {
    return exploredCount >= requiredCount;
  }

  static formatPanelTitle(place) {
    return `${place.icon} ${place.name}`;
  }

  static formatPanelBody(place) {
    return [
      '핵심 문제',
      place.problem,
      '',
      '변화 자료',
      place.data,
      '',
      '주민 한마디',
      place.voice,
      '',
      '왜 중요할까?',
      place.concept,
    ].join('\n');
  }

  static formatProgressText(exploredCount, totalCount, requiredCount) {
    const canContinue = ExplorationViewManager.canContinue(exploredCount, requiredCount);
    return [
      `확인한 장소: ${exploredCount}/${totalCount}`,
      `필수 확인: ${requiredCount}곳`,
      canContinue ? '다음 단계로 이동할 수 있습니다.' : `${requiredCount - exploredCount}곳을 더 확인하세요.`,
    ].join('\n');
  }

  static formatNeedMoreText(exploredCount, totalCount, requiredCount) {
    return [
      `확인한 장소: ${exploredCount}/${totalCount}`,
      `최소 ${requiredCount}곳을 확인해야 합니다.`,
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
