export default class MockSubmissionLogViewManager {
  static formatSubmittedAt(submittedAt) {
    const date = new Date(submittedAt);
    return Number.isNaN(date.getTime()) ? submittedAt : date.toLocaleString('ko-KR');
  }

  static formatJson(submissions) {
    return JSON.stringify(submissions, null, 2);
  }

  static formatSummaryRows(submissions) {
    const latest = submissions[0];
    if (!latest) {
      return [
        '아직 Mock 제출 로그가 없습니다.',
        '',
        'API 미리보기 화면에서 Mock 제출을 먼저 실행하세요.',
      ];
    }

    return [
      `총 로그: ${submissions.length}건`,
      '',
      '최근 제출',
      `ID: ${latest.id}`,
      `시각: ${MockSubmissionLogViewManager.formatSubmittedAt(latest.submittedAt)}`,
      `Endpoint: ${latest.method} ${latest.endpoint}`,
      '',
      `Episode: ${latest.payload?.episode_id ?? '알 수 없음'}`,
      `배치 기록: ${latest.payload?.placements?.length ?? 0}개`,
      `완료 여부: ${latest.payload?.completed ? '완료' : '미완료'}`,
    ];
  }

  static formatLogBody(submissions) {
    return submissions.length ? MockSubmissionLogViewManager.formatJson(submissions) : '[]';
  }
}
