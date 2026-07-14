import LearningDataManager from './LearningDataManager.js';

export default class LearningDataViewManager {
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
