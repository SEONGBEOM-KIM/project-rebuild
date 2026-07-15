export const STORAGE_SCREEN_LAYOUT = {
  backgroundColor: 0x0f172a,
  title: { y: 90, text: '브라우저 저장 관리' },
  subtitle: { y: 155, text: 'localStorage에 남아 있는 학습 저장 데이터와 Mock 제출 로그를 관리합니다.' },
};

export const STORAGE_CONTROL_BUTTONS = {
  clearSave: { x: 360, y: 930, label: '학습 저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
  clearLog: { x: 710, y: 930, label: '제출 로그 삭제', backgroundColor: '#fed7aa', textColor: '#7c2d12' },
  clearAll: { x: 1050, y: 930, label: '전체 초기화', backgroundColor: '#fca5a5', textColor: '#7f1d1d' },
  title: { x: 1370, y: 930, label: '제목으로', backgroundColor: '#c4b5fd', textColor: '#1e1b4b', targetScene: 'TitleScene' },
  savedData: { x: 1640, y: 930, label: '저장 확인', backgroundColor: '#bbf7d0', textColor: '#123524', targetScene: 'SavedDataScene' },
};

export default class StorageSummaryManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: STORAGE_SCREEN_LAYOUT.backgroundColor,
      title: { ...STORAGE_SCREEN_LAYOUT.title, x: width / 2 },
      subtitle: { ...STORAGE_SCREEN_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getPanelLayout() {
    return {
      saved: {
        panel: { x: 575, y: 520, width: 760, height: 580, strokeColor: 0x93c5fd },
        title: { x: 575, y: 275, text: '학습 저장 데이터', color: '#172554' },
        body: { x: 255, y: 345 },
      },
      submissions: {
        panel: { x: 1345, y: 520, width: 760, height: 580, strokeColor: 0xbbf7d0 },
        title: { x: 1345, y: 275, text: 'Mock 제출 로그', color: '#14532d' },
        body: { x: 1025, y: 345 },
      },
    };
  }

  static getBodyTextStyle() {
    return {
      fontSize: '26px',
      color: '#1e293b',
      lineSpacing: 13,
      wordWrap: { width: 640 },
    };
  }

  static getControlLayout() {
    return {
      status: { x: 960, y: 835 },
      ...STORAGE_CONTROL_BUTTONS,
    };
  }

  static formatStatusText() {
    return '필요한 저장 항목만 개별 삭제하거나 전체 초기화할 수 있습니다.';
  }

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
