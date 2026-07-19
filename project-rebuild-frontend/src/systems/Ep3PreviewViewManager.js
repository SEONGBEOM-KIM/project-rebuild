import SCENE_KEYS from '../data/sceneKeys.js';

const EP3_PREVIEW_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 76, text: 'EP3. 경제 성장 미션', fontSize: '62px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 142, text: '푸른군의 일자리·상권·물류 성장 방향을 선택할 준비를 합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const EP3_PREVIEW_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0xfde68a,
  titleFontSize: '32px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '24px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 10,
};

const EP3_PREVIEW_CARD_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0x93c5fd,
  titleFontSize: '30px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
  bodyFontSize: '21px',
  bodyColor: '#1e293b',
  bodyLineSpacing: 5,
};

const EP3_PREVIEW_NOTE_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.98,
  strokeWidth: 4,
  strokeColor: 0x86efac,
  titleFontSize: '28px',
  titleColor: '#bbf7d0',
  titleFontStyle: 'bold',
  bodyFontSize: '22px',
  bodyColor: '#dbeafe',
  bodyLineSpacing: 8,
};

const EP3_PREVIEW_BUTTON_STYLE = {
  fontSize: '28px',
  padding: { x: 34, y: 18 },
};

export default class Ep3PreviewViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: EP3_PREVIEW_LAYOUT.backgroundColor,
      progressStep: EP3_PREVIEW_LAYOUT.progressStep,
      title: { ...EP3_PREVIEW_LAYOUT.title, x: width / 2 },
      subtitle: { ...EP3_PREVIEW_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelStyle() {
    return { ...EP3_PREVIEW_PANEL_STYLE };
  }

  static getCardStyle() {
    return { ...EP3_PREVIEW_CARD_STYLE };
  }

  static getNoteStyle() {
    return { ...EP3_PREVIEW_NOTE_STYLE };
  }

  static getButtonStyle() {
    return { ...EP3_PREVIEW_BUTTON_STYLE, padding: { ...EP3_PREVIEW_BUTTON_STYLE.padding } };
  }

  static getIntroPanelLayout() {
    return {
      panel: { x: 960, y: 260, width: 1510, height: 150 },
      title: { x: 250, y: 202, text: '경제 성장 미션 브리핑' },
      body: { x: 250, y: 246, wordWrapWidth: 1380 },
    };
  }

  static getFocusCardLayout(index) {
    const positions = [
      { x: 440, y: 548 },
      { x: 960, y: 548 },
      { x: 1480, y: 548 },
    ];
    const position = positions[index];
    return {
      panel: { x: position.x, y: position.y, width: 440, height: 330 },
      icon: { x: position.x, y: position.y - 112 },
      title: { x: position.x, y: position.y - 56, wordWrapWidth: 360 },
      body: { x: position.x - 180, y: position.y, wordWrapWidth: 360 },
    };
  }

  static getTransitionNoteLayout() {
    return {
      panel: { x: 960, y: 805, width: 1510, height: 170 },
      title: { x: 250, y: 740, text: 'EP3 배치 준비' },
      policyBody: { x: 250, y: 782, wordWrapWidth: 650 },
      buildingBody: { x: 975, y: 782, wordWrapWidth: 650 },
    };
  }

  static getControlLayout(centerX) {
    return {
      ending: { x: centerX - 420, y: 955, label: '마무리로 돌아가기', target: SCENE_KEYS.Ending, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      start: { x: centerX, y: 955, label: 'EP3 배치 연습 시작', target: SCENE_KEYS.Placement, backgroundColor: '#bbf7d0', textColor: '#123524' },
      restart: { x: centerX + 420, y: 955, label: '처음부터 다시', target: SCENE_KEYS.Boot, backgroundColor: '#fde68a', textColor: '#0f172a' },
    };
  }

  static formatIntroText(preview) {
    return preview.intro.join('\n');
  }

  static formatFocusBody(strategy) {
    return [
      `상태 초점: ${strategy.stateFocus}`,
      strategy.description,
      '',
      `관찰: ${strategy.observationPointShort ?? strategy.observationPoint}`,
    ].join('\n');
  }

  static formatTransitionNote(briefing) {
    return [
      'EP3는 이제 예고가 아니라 경제 성장 미션 브리핑 데이터로 구성됩니다.',
      `배치 설정: ${briefing.placementConfigId}`,
      '이번 단계에서는 대표 성장 방향 3가지를 보여주고 기본 정책으로 배치 연습에 진입합니다.',
      '다음 개발 단위에서 EP3 전용 정책 선택 화면으로 확장할 수 있습니다.',
    ].join('\n');
  }

  static formatPolicyPreviewRows(policies) {
    return [
      '산업 정책 후보:',
      ...policies.map((policy) => `• ${policy.name}: ${policy.focus.join(' · ')}`),
    ].join('\n');
  }

  static formatBuildingPreviewRows(buildings) {
    return [
      '산업 시설 후보:',
      ...buildings.map((building) => `• ${building.name}: ${building.balanceSummary}`),
    ].join('\n');
  }
}
