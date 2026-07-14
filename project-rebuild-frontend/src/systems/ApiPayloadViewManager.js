import LearningApiPayloadManager from './LearningApiPayloadManager.js';

export default class ApiPayloadViewManager {
  static getPayloadPanelLayout() {
    return {
      panel: { x: 760, y: 555, width: 1120, height: 710, strokeColor: 0x60a5fa },
      title: { x: 240, y: 230 },
      body: { x: 245, y: 285, wordWrapWidth: 1030 },
    };
  }

  static getValidationPanelLayout() {
    return {
      panel: { x: 1550, y: 555, width: 500, height: 710 },
      title: { x: 1550, y: 230 },
      rows: { x: 1325, y: 290, wordWrapWidth: 440 },
      status: { x: 1325, y: 770, wordWrapWidth: 440 },
    };
  }

  static getSubmissionLogLayout() {
    return {
      panel: { x: 1550, y: 850, width: 500, height: 105 },
      title: { x: 1325, y: 815 },
      body: { x: 1325, y: 848, wordWrapWidth: 440 },
    };
  }

  static getControlLayout() {
    return {
      submit: { x: 350, y: 960, label: 'Mock 제출' },
      copy: { x: 610, y: 960, label: 'Payload 복사' },
      download: { x: 910, y: 960, label: 'Payload 다운로드' },
      contract: { x: 1130, y: 960, label: 'API 계약', target: 'ApiContractScene' },
      log: { x: 1335, y: 960, label: '제출 로그', target: 'MockSubmissionLogScene' },
      data: { x: 1545, y: 960, label: '학습 데이터', target: 'LearningDataScene' },
      ending: { x: 1745, y: 960, label: '마무리', target: 'EndingScene' },
    };
  }

  static getPayloadTextStyle(wordWrapWidth) {
    return {
      fontSize: '20px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: wordWrapWidth },
    };
  }

  static formatCopySuccess() {
    return 'API payload를 클립보드에 복사했습니다.';
  }

  static formatCopyFailure() {
    return '클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.';
  }

  static formatDownloadSuccess() {
    return 'API payload 다운로드를 시작했습니다.';
  }

  static formatDownloadFileName(payload) {
    return `project-rebuild-ep${payload.episode_id}-api-payload.json`;
  }

  static formatJson(payload) {
    return JSON.stringify(payload, null, 2);
  }

  static getValidationRows(payload) {
    return LearningApiPayloadManager.validate(payload);
  }

  static getValidationSummary(payload) {
    const rows = ApiPayloadViewManager.getValidationRows(payload);
    const warnings = rows.filter((row) => !row.ok);
    return {
      rows,
      warnings,
      ok: warnings.length === 0,
      statusText: warnings.length
        ? warnings.map((row) => `• ${row.message}`).join('\n')
        : 'API 저장 후보 구조가 준비되었습니다. 실제 Django 연동 시 인증 사용자, 제출 시각, 수업/학생 식별자만 추가하면 됩니다.',
      statusColor: warnings.length ? '#991b1b' : '#166534',
      strokeColor: warnings.length ? 0xf87171 : 0xbbf7d0,
    };
  }

  static formatValidationRows(rows) {
    return rows.map((row) => `${row.ok ? 'PASS' : 'WARN'} ${row.label}`).join('\n');
  }

  static formatSubmittedAt(submittedAt) {
    const date = new Date(submittedAt);
    return Number.isNaN(date.getTime()) ? submittedAt : date.toLocaleString('ko-KR');
  }

  static formatSubmissionLog(submissions) {
    return submissions.length
      ? `최근 제출: ${ApiPayloadViewManager.formatSubmittedAt(submissions[0].submittedAt)}\n총 로그: ${submissions.length}건`
      : '아직 제출 로그가 없습니다.';
  }

  static formatSubmitSuccess(response) {
    return `Mock 제출 성공 (${response.status})\nrecord_id: ${response.data.id}`;
  }

  static formatSubmitFailure(response) {
    return `Mock 제출 실패 (${response.status}): ${response.error}`;
  }
}
