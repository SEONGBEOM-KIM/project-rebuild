import LearningApiPayloadManager from './LearningApiPayloadManager.js';

export default class ApiPayloadViewManager {
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
