const MOCK_SUBMISSION_LOG_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  progressStep: 'ending',
  title: { y: 78, text: 'Mock 제출 로그', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: '실제 백엔드 연결 전, API 제출 시뮬레이션 기록을 확인합니다.', fontSize: '26px', color: '#bfdbfe' },
};

const MOCK_SUBMISSION_SUMMARY_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 5,
  titleFontSize: '36px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
};

const MOCK_SUBMISSION_LOG_PANEL_STYLE = {
  fillColor: 0x111827,
  fillAlpha: 0.98,
  strokeWidth: 5,
  titleFontSize: '34px',
  titleColor: '#ffffff',
  titleFontStyle: 'bold',
};

const MOCK_SUBMISSION_STATUS_STYLE = {
  fontSize: '23px',
  color: '#bfdbfe',
  align: 'center',
};

const MOCK_SUBMISSION_BUTTON_STYLE = {
  fontSize: '27px',
  padding: { x: 22, y: 15 },
};

const MOCK_SUBMISSION_LOG_DOWNLOAD_CONFIG = {
  mimeType: 'application/json',
};

export default class MockSubmissionLogViewManager {
  static getScreenLayout(width) {
    return {
      background: { x: width / 2, y: null, color: MOCK_SUBMISSION_LOG_SCREEN_LAYOUT.backgroundColor },
      progressStep: MOCK_SUBMISSION_LOG_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...MOCK_SUBMISSION_LOG_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...MOCK_SUBMISSION_LOG_SCREEN_LAYOUT.subtitle },
    };
  }

  static getDownloadConfig() {
    return { ...MOCK_SUBMISSION_LOG_DOWNLOAD_CONFIG };
  }

  static getSummaryPanelStyle() {
    return { ...MOCK_SUBMISSION_SUMMARY_PANEL_STYLE };
  }

  static getLogPanelStyle() {
    return { ...MOCK_SUBMISSION_LOG_PANEL_STYLE };
  }

  static getStatusTextStyle() {
    return { ...MOCK_SUBMISSION_STATUS_STYLE };
  }

  static getButtonStyle() {
    return { ...MOCK_SUBMISSION_BUTTON_STYLE, padding: { ...MOCK_SUBMISSION_BUTTON_STYLE.padding } };
  }

  static getSummaryPanelLayout() {
    return {
      panel: { x: 420, y: 535, width: 520, height: 640, strokeColor: 0x93c5fd },
      title: { x: 420, y: 260, text: '제출 요약' },
      body: { x: 195, y: 325, wordWrapWidth: 450 },
    };
  }

  static getLogPanelLayout() {
    return {
      panel: { x: 1185, y: 535, width: 920, height: 640, strokeColor: 0x60a5fa },
      title: { x: 760, y: 260, text: '최근 제출 JSON' },
      body: { x: 760, y: 315, wordWrapWidth: 840 },
    };
  }

  static getControlLayout() {
    return {
      status: { x: 960, y: 855 },
      copy: { x: 420, y: 940, label: '로그 복사', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      download: { x: 700, y: 940, label: '로그 다운로드', backgroundColor: '#a7f3d0', textColor: '#064e3b' },
      clear: { x: 1010, y: 940, label: '로그 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
      api: { x: 1300, y: 940, label: 'API 미리보기', target: 'ApiPayloadScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
      ending: { x: 1580, y: 940, label: '마무리로', target: 'EndingScene', backgroundColor: '#fde68a', textColor: '#0f172a' },
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
