export default class StorageSummaryManager {
  static formatDate(value) {
    if (!value) {
      return '알 수 없음';
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ko-KR');
  }

  static formatSavedDataRows(saved) {
    if (!saved) {
      return [
        '상태: 저장 데이터 없음',
        '',
        '학습 데이터 화면에서 임시 저장하거나 제목 화면에서 JSON을 가져오면 여기에 표시됩니다.',
      ];
    }

    return [
      '상태: 저장 데이터 있음',
      `저장 시각: ${StorageSummaryManager.formatDate(saved.savedAt)}`,
      `버전: ${saved.version}`,
      `Episode: ${saved.data?.episode ?? '알 수 없음'}`,
      `탐색 장소: ${saved.data?.exploredPlaces?.length ?? 0}곳`,
      `배치 기록: ${saved.data?.placements?.length ?? 0}개`,
      `완료 여부: ${saved.data?.completed ? '완료' : '미완료'}`,
    ];
  }

  static formatSubmissionRows(submissions) {
    const latest = submissions[0];
    if (!latest) {
      return [
        '상태: 제출 로그 없음',
        '',
        'API 미리보기 화면에서 Mock 제출을 실행하면 여기에 표시됩니다.',
      ];
    }

    return [
      `총 로그: ${submissions.length}건`,
      `최근 제출: ${StorageSummaryManager.formatDate(latest.submittedAt)}`,
      `ID: ${latest.id}`,
      `Endpoint: ${latest.method} ${latest.endpoint}`,
      `Episode: ${latest.payload?.episode_id ?? '알 수 없음'}`,
      `배치 기록: ${latest.payload?.placements?.length ?? 0}개`,
      '',
      '최근 10건까지만 보관합니다.',
    ];
  }
}
