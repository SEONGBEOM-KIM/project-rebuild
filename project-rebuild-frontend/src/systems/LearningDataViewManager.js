import LearningDataManager from './LearningDataManager.js';

export default class LearningDataViewManager {
  static getDataPanelLayout() {
    return {
      panel: { x: 760, y: 560, width: 1120, height: 720, strokeColor: 0x60a5fa },
      title: { x: 240, y: 235 },
      body: { x: 245, y: 290, wordWrapWidth: 1030 },
    };
  }

  static getValidationPanelLayout() {
    return {
      panel: { x: 1550, y: 560, width: 500, height: 720, strokeColor: 0xfde68a },
      title: { x: 1550, y: 235 },
      rows: { x: 1325, y: 290, wordWrapWidth: 440 },
      summaryBox: { x: 1550, y: 620, width: 430, height: 190 },
      summaryTitle: { x: 1355, y: 545 },
      summaryBody: { x: 1355, y: 585, wordWrapWidth: 390 },
    };
  }

  static getSavePanelLayout() {
    return {
      panel: { x: 1550, y: 815, width: 500, height: 150, strokeColor: 0xbbf7d0 },
      title: { x: 1325, y: 760 },
      body: { x: 1325, y: 800, wordWrapWidth: 440 },
    };
  }

  static getControlLayout() {
    return {
      api: { x: 260, y: 960, label: 'API 미리보기', target: 'ApiPayloadScene' },
      save: { x: 520, y: 960, label: '임시 저장' },
      copy: { x: 760, y: 960, label: 'JSON 복사' },
      download: { x: 1015, y: 960, label: 'JSON 다운로드' },
      clear: { x: 1275, y: 960, label: '저장 삭제' },
      ending: { x: 1545, y: 960, label: '마무리로', target: 'EndingScene' },
    };
  }

  static getJsonTextStyle(wordWrapWidth) {
    return {
      fontSize: '20px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: wordWrapWidth },
    };
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
