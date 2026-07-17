import SCENE_KEYS from '../data/sceneKeys.js';
import LearningDataManager from './LearningDataManager.js';

export const LEARNING_DATA_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 78, text: '학습 데이터 확인', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: '현재는 서버 저장 없이 registry에 쌓인 학습 기록을 화면에서 확인하는 UI 단계입니다.', fontSize: '26px', color: '#bfdbfe' },
};

const LEARNING_DATA_SUMMARY_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.96,
  strokeWidth: 3,
  strokeColor: 0xfde68a,
  title: '저장 요약',
  titleFontSize: '25px',
  titleColor: '#fde68a',
  titleFontStyle: 'bold',
  bodyFontSize: '21px',
  bodyColor: '#e0f2fe',
  bodyLineSpacing: 5,
};

const LEARNING_DATA_DARK_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 5,
  titleFontSize: '34px',
  titleColor: '#ffffff',
  titleFontStyle: 'bold',
};

const LEARNING_DATA_LIGHT_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 5,
  titleFontSize: '34px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
};

const LEARNING_DATA_VALIDATION_TEXT_STYLE = {
  fontSize: '21px',
  color: '#1e293b',
  lineSpacing: 9,
};

const LEARNING_DATA_SUMMARY_BOX_STYLE = {
  fillAlpha: 1,
  strokeWidth: 3,
  titleFontSize: '24px',
  titleFontStyle: 'bold',
  bodyFontSize: '20px',
  lineSpacing: 8,
};

const LEARNING_DATA_SAVE_PANEL_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.98,
  strokeWidth: 4,
  titleFontSize: '25px',
  titleColor: '#ffffff',
  titleFontStyle: 'bold',
  bodyFontSize: '20px',
  bodyColor: '#dbeafe',
  bodyLineSpacing: 8,
};

const LEARNING_DATA_BUTTON_STYLE = {
  fontSize: '25px',
  padding: { x: 22, y: 15 },
};

const LEARNING_DATA_FEEDBACK_COLORS = {
  success: '#bbf7d0',
  error: '#fecaca',
};

export const LEARNING_DATA_DOWNLOAD_CONFIG = {
  mimeType: 'application/json',
};


export default class LearningDataViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: LEARNING_DATA_SCREEN_LAYOUT.backgroundColor,
      progressStep: LEARNING_DATA_SCREEN_LAYOUT.progressStep,
      title: { ...LEARNING_DATA_SCREEN_LAYOUT.title, x: width / 2 },
      subtitle: { ...LEARNING_DATA_SCREEN_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getDownloadConfig() {
    return LEARNING_DATA_DOWNLOAD_CONFIG;
  }

  static getSummaryStyle() {
    return { ...LEARNING_DATA_SUMMARY_STYLE };
  }

  static getDarkPanelStyle() {
    return { ...LEARNING_DATA_DARK_PANEL_STYLE };
  }

  static getLightPanelStyle() {
    return { ...LEARNING_DATA_LIGHT_PANEL_STYLE };
  }

  static getValidationTextStyle(wordWrapWidth) {
    return { ...LEARNING_DATA_VALIDATION_TEXT_STYLE, wordWrap: { width: wordWrapWidth } };
  }

  static getSummaryBoxStyle(wordWrapWidth) {
    return { ...LEARNING_DATA_SUMMARY_BOX_STYLE, wordWrap: { width: wordWrapWidth } };
  }

  static getSavePanelStyle() {
    return { ...LEARNING_DATA_SAVE_PANEL_STYLE };
  }

  static getButtonStyle() {
    return { ...LEARNING_DATA_BUTTON_STYLE, padding: { ...LEARNING_DATA_BUTTON_STYLE.padding } };
  }

  static getFeedbackColor(kind) {
    return LEARNING_DATA_FEEDBACK_COLORS[kind];
  }

  static getSummaryLayout(centerX) {
    return {
      panel: { x: centerX, y: 205, width: 1660, height: 82, strokeColor: LEARNING_DATA_SUMMARY_STYLE.strokeColor },
      title: { x: centerX - 790, y: 178, text: LEARNING_DATA_SUMMARY_STYLE.title },
      body: { x: centerX - 620, y: 176, wordWrapWidth: 1410 },
    };
  }

  static getDataPanelLayout() {
    return {
      panel: { x: 760, y: 605, width: 1120, height: 630, strokeColor: 0x60a5fa },
      title: { x: 240, y: 315, text: '저장 후보 데이터' },
      body: { x: 245, y: 365, wordWrapWidth: 1030 },
    };
  }

  static getValidationPanelLayout() {
    return {
      panel: { x: 1550, y: 605, width: 500, height: 630, strokeColor: 0xfde68a },
      title: { x: 1550, y: 315, text: '데이터 검증' },
      rows: { x: 1325, y: 365, wordWrapWidth: 440 },
      summaryBox: { x: 1550, y: 655, width: 430, height: 170 },
      summaryTitle: { x: 1355, y: 590 },
      summaryBody: { x: 1355, y: 630, wordWrapWidth: 390 },
    };
  }

  static getSavePanelLayout() {
    return {
      panel: { x: 1550, y: 840, width: 500, height: 120, strokeColor: 0xbbf7d0 },
      title: { x: 1325, y: 795, text: '임시 저장 상태' },
      body: { x: 1325, y: 830, wordWrapWidth: 440 },
    };
  }

  static getControlLayout() {
    return {
      api: { x: 260, y: 960, label: 'API 미리보기', target: SCENE_KEYS.ApiPayload, backgroundColor: '#fde68a', textColor: '#0f172a' },
      save: { x: 520, y: 960, label: '임시 저장', backgroundColor: '#bbf7d0', textColor: '#123524' },
      copy: { x: 760, y: 960, label: 'JSON 복사', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      download: { x: 1015, y: 960, label: 'JSON 다운로드', backgroundColor: '#a7f3d0', textColor: '#064e3b' },
      clear: { x: 1275, y: 960, label: '저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
      ending: { x: 1545, y: 960, label: '마무리로', target: SCENE_KEYS.Ending, backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
    };
  }

  static getJsonTextStyle(wordWrapWidth) {
    return {
      fontSize: '18px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: wordWrapWidth },
    };
  }

  static formatSummaryText(learningData) {
    const summary = learningData.summary;
    if (!summary) {
      return '저장 요약 없음: 학습 결론이 아직 생성되지 않았습니다.';
    }

    const issueText = summary.priorityIssue?.title ?? '큰 부작용 신호 없음';
    const actionText = summary.nextAction?.label ?? '다음 액션 미선택';
    const policyText = summary.selectedPolicyName ?? '회복 방향 미선택';
    const strategyText = summary.selectedStrategyTitle ?? learningData.selectedStrategy?.title ?? 'EP2 전략 미선택';
    return [
      `${summary.outcomeType}: ${summary.outcomeMessage}`,
      `EP2 전략: ${strategyText} / 회복 방향: ${policyText}`,
      `우선 보완: ${issueText} / 다음 액션: ${actionText} / 배치 ${summary.placementCount}개`,
    ].join('\n');
  }

  static formatSaveCleared() {
    return '저장된 학습 데이터를 삭제했습니다.';
  }

  static formatCopySuccess() {
    return 'JSON을 클립보드에 복사했습니다.';
  }

  static formatCopyFailure() {
    return '클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.';
  }

  static formatDownloadSuccess() {
    return 'JSON 다운로드를 시작했습니다.';
  }

  static formatDownloadFileName(learningData) {
    return `project-rebuild-ep${learningData.episode}-learning-data.json`;
  }

  static formatJson(learningData) {
    return JSON.stringify(learningData, null, 2);
  }

  static getValidationSummary(learningData) {
    const rows = LearningDataManager.validate(learningData);
    const warnings = rows.filter((row) => !row.ok);
    return {
      rows,
      warnings,
      ok: warnings.length === 0,
      title: warnings.length ? '검토 필요' : '저장 준비 상태',
      titleColor: warnings.length ? '#991b1b' : '#166534',
      body: warnings.length
        ? warnings.map((row) => `• ${row.message}`).join('\n')
        : '필수 학습 기록이 모두 포함되어 있습니다. 다음 백엔드 단계에서 이 구조를 API 저장 형식으로 매핑하면 됩니다.',
      bodyColor: warnings.length ? '#7f1d1d' : '#14532d',
      backgroundColor: warnings.length ? 0xfef2f2 : 0xecfdf5,
      strokeColor: warnings.length ? 0xf87171 : 0x22c55e,
    };
  }

  static formatValidationRows(rows) {
    return rows.map((row) => `${row.ok ? 'PASS' : 'WARN'} ${row.label}`).join('\n');
  }

  static formatSavedAt(savedAt) {
    if (!savedAt) {
      return '알 수 없음';
    }
    const date = new Date(savedAt);
    if (Number.isNaN(date.getTime())) {
      return savedAt;
    }
    return date.toLocaleString('ko-KR');
  }

  static formatSaveStatus(saved) {
    return saved
      ? `저장됨: ${LearningDataViewManager.formatSavedAt(saved.savedAt)}`
      : '저장된 학습 데이터가 없습니다.';
  }
}
