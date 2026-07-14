export default class MockSubmissionLogViewManager {
  static getSummaryPanelLayout() {
    return {
      panel: { x: 420, y: 535, width: 520, height: 640, strokeColor: 0x93c5fd },
      title: { x: 420, y: 260 },
      body: { x: 195, y: 325, wordWrapWidth: 450 },
    };
  }

  static getLogPanelLayout() {
    return {
      panel: { x: 1185, y: 535, width: 920, height: 640, strokeColor: 0x60a5fa },
      title: { x: 760, y: 260 },
      body: { x: 760, y: 315, wordWrapWidth: 840 },
    };
  }

  static getControlLayout() {
    return {
      status: { x: 960, y: 855 },
      copy: { x: 420, y: 940, label: '로그 복사' },
      download: { x: 700, y: 940, label: '로그 다운로드' },
      clear: { x: 1010, y: 940, label: '로그 삭제' },
      api: { x: 1300, y: 940, label: 'API 미리보기', target: 'ApiPayloadScene' },
      ending: { x: 1580, y: 940, label: '마무리로', target: 'EndingScene' },
    };
  }

  static getSummaryTextStyle(wordWrapWidth) {
    return {
      fontSize: '24px',
      color: '#1e293b',
      lineSpacing: 11,
      wordWrap: { width: wordWrapWidth },
    };
  }

  static getLogTextStyle(wordWrapWidth) {
    return {
      fontSize: '19px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: wordWrapWidth },
    };
  }

  static formatStatusText() {
    return 'Mock 제출 로그는 브라우저 localStorage에 임시 저장됩니다.';
  }

  static formatCopySuccess() {
    return 'Mock 제출 로그를 클립보드에 복사했습니다.';
  }

  static formatCopyFailure() {
    return '클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.';
  }

  static formatDownloadSuccess() {
    return 'Mock 제출 로그 다운로드를 시작했습니다.';
  }

  static formatDownloadFileName() {
    return 'project-rebuild-mock-submission-log.json';
  }

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
