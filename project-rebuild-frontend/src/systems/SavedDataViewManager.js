export const SAVED_DATA_LAYOUT = {
  backgroundColor: 0x10253f,
  title: { y: 90, text: '저장 데이터 확인', fontSize: '60px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 155, text: '브라우저 localStorage에 임시 저장된 학습 기록입니다. 앱 저장 JSON과 API 미리보기 JSON을 가져올 수 있습니다.', fontSize: '24px', color: '#bfdbfe' },
  bodyPanel: { y: 535, width: 1320, height: 660, fillColor: 0x111827, alpha: 0.98, strokeWidth: 5, strokeColor: 0x60a5fa },
  summaryText: { x: 340, y: 235 },
  bodyText: { x: 340, y: 350 },
  status: { y: 865 },
  importFile: { type: 'file', accept: 'application/json,.json' },
};

export const SAVED_DATA_BUTTON_STYLE = {
  fontSize: '28px',
  padding: { x: 34, y: 18 },
};

export const SAVED_DATA_BUTTONS = {
  back: { offsetX: -600, y: 940, label: '제목으로', backgroundColor: '#c4b5fd', textColor: '#1e1b4b', targetScene: 'TitleScene' },
  import: { offsetX: -200, y: 940, label: 'JSON 가져오기', backgroundColor: '#bfdbfe', textColor: '#0f172a' },
  continue: { offsetX: 175, y: 940, label: '이어보기', targetScene: 'ExplorationScene' },
  clear: { offsetX: 560, y: 940, label: '저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
};

export default class SavedDataViewManager {
  static getLayout(width) {
    return {
      backgroundColor: SAVED_DATA_LAYOUT.backgroundColor,
      title: { ...SAVED_DATA_LAYOUT.title, x: width / 2 },
      subtitle: { ...SAVED_DATA_LAYOUT.subtitle, x: width / 2 },
      bodyPanel: { ...SAVED_DATA_LAYOUT.bodyPanel, x: width / 2 },
      summaryText: SAVED_DATA_LAYOUT.summaryText,
      bodyText: SAVED_DATA_LAYOUT.bodyText,
      status: { ...SAVED_DATA_LAYOUT.status, x: width / 2 },
      importFile: SAVED_DATA_LAYOUT.importFile,
    };
  }

  static getButtonLayout(width) {
    return Object.fromEntries(
      Object.entries(SAVED_DATA_BUTTONS).map(([key, button]) => [
        key,
        {
          ...button,
          x: width / 2 + button.offsetX,
        },
      ]),
    );
  }

  static getButtonStyle() {
    return { ...SAVED_DATA_BUTTON_STYLE, padding: { ...SAVED_DATA_BUTTON_STYLE.padding } };
  }

  static getSummaryTextStyle() {
    return {
      fontSize: '22px',
      color: '#fef3c7',
      lineSpacing: 6,
      wordWrap: { width: 1240 },
    };
  }

  static getBodyTextStyle() {
    return {
      fontSize: '18px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 5,
      wordWrap: { width: 1240 },
    };
  }

  static getStatusTextStyle() {
    return {
      fontSize: '23px',
      color: '#fecaca',
      align: 'center',
    };
  }

  static getContinueButtonState(saved) {
    const canContinue = SavedDataViewManager.canContinue(saved);
    const targetScene = SavedDataViewManager.getContinueTargetScene(saved);
    return {
      canContinue,
      targetScene,
      label: canContinue ? SavedDataViewManager.formatContinueLabel(targetScene) : '이어보기 불가',
      backgroundColor: canContinue ? '#bbf7d0' : '#94a3b8',
      textColor: '#123524',
    };
  }

  static formatSummary(saved) {
    if (!saved?.data) {
      return '저장된 데이터가 없습니다. JSON 가져오기로 학습 기록을 불러올 수 있습니다.';
    }

    const data = saved.data;
    const savedAt = SavedDataViewManager.formatSavedAt(saved.savedAt);
    const policyName = data.selectedPolicy?.name ?? data.summary?.selectedPolicyName ?? '미선택';
    const strategyTitle = data.selectedStrategy?.title ?? data.summary?.selectedStrategyTitle ?? '미선택';
    const exploredCount = data.exploredPlaces?.length ?? 0;
    const placementCount = data.placements?.length ?? data.summary?.placementCount ?? 0;

    return [
      `저장 시각: ${savedAt} / Episode ${data.episode ?? '-'}`,
      `탐색 ${exploredCount}곳 / 배치 ${placementCount}개 / 완료: ${data.completed ? '예' : '아니오'}`,
      `회복 방향: ${policyName} / EP2 전략: ${strategyTitle}`,
    ].join('\n');
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

  static formatBody(saved, maxPreviewLines = 12) {
    if (!saved) {
      return '저장된 데이터가 없습니다.';
    }

    const jsonLines = JSON.stringify(saved, null, 2).split('\n');
    const previewLines = jsonLines.slice(0, maxPreviewLines);
    const omittedCount = jsonLines.length - previewLines.length;
    const suffix = omittedCount > 0
      ? [`... ${omittedCount}줄 더 있음. 전체 JSON은 저장 데이터 원본에 보존됩니다.`]
      : [];

    return ['원본 JSON 미리보기', ...previewLines, ...suffix].join('\n');
  }

  static canContinue(saved) {
    return Boolean(saved?.data);
  }

  static getContinueTargetScene(saved) {
    const data = saved?.data;
    if (!data) {
      return null;
    }
    if (data.completed) {
      return 'EndingScene';
    }
    if ((data.placements?.length ?? 0) >= 3) {
      return 'ResultScene';
    }
    if (data.selectedPolicy?.id) {
      return 'PlacementScene';
    }
    if (data.problemSummaryCompleted) {
      return 'Ep2BriefingScene';
    }
    if (data.quizResult) {
      return 'ProblemSummaryScene';
    }
    if (data.dataViewed) {
      return 'CauseQuizScene';
    }
    if ((data.exploredPlaces?.length ?? 0) >= 3) {
      return 'DataBriefingScene';
    }
    return 'ExplorationScene';
  }

  static formatContinueLabel(targetScene) {
    return {
      ExplorationScene: '탐색 이어보기',
      DataBriefingScene: '자료 확인 이어보기',
      CauseQuizScene: '원인 질문 이어보기',
      ProblemSummaryScene: '문제 정리 이어보기',
      Ep2BriefingScene: 'EP2 미션 이어보기',
      PlacementScene: '배치 이어보기',
      ResultScene: '결과 이어보기',
      EndingScene: '마무리 이어보기',
    }[targetScene] ?? '이어보기';
  }

  static getContinueButtonColor(saved) {
    return SavedDataViewManager.canContinue(saved) ? '#bbf7d0' : '#94a3b8';
  }

  static getImportErrorMessage(error) {
    return error?.message || 'JSON 가져오기에 실패했습니다.';
  }
}
