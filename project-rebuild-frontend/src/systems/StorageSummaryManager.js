export default class StorageSummaryManager {
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

    const data = saved.data;
    const currentEpisodeText = data?.episodeContext?.current?.shortTitle ?? `Episode: ${data?.episode ?? '알 수 없음'}`;
    const placementEpisodeText = data?.episodeContext?.placement?.shortTitle ?? '배치 실험 미지정';
    const context = StorageSummaryManager.getLearningDataPlacementContext(data);
    const configText = context.placementConfigId ?? 'config 없음';
    const profileText = context.evaluationProfileId ?? 'profile 없음';

    return [
      '상태: 저장 데이터 있음',
      `저장 시각: ${StorageSummaryManager.formatDate(saved.savedAt)}`,
      `버전: ${saved.version}`,
      `학습 흐름: ${currentEpisodeText}`,
      `배치 실험: ${placementEpisodeText}`,
      `배치 설정: ${configText}`,
      `평가 기준: ${profileText}`,
      `탐색 장소: ${data?.exploredPlaces?.length ?? 0}곳`,
      `시설 현황: ${StorageSummaryManager.formatPlacementBreakdown(data)}`,
      `완료 여부: ${data?.completed ? '완료' : '미완료'}`,
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

    const currentEpisodeText = latest.payload?.episode_context?.current?.short_title ?? `Episode: ${latest.payload?.episode_id ?? '알 수 없음'}`;
    const placementEpisodeText = latest.payload?.episode_context?.placement?.short_title ?? '배치 실험 미지정';
    const context = StorageSummaryManager.getApiPayloadPlacementContext(latest.payload);
    const configText = context.placementConfigId ?? 'config 없음';
    const profileText = context.evaluationProfileId ?? 'profile 없음';

    return [
      `총 로그: ${submissions.length}건`,
      `최근 제출: ${StorageSummaryManager.formatDate(latest.submittedAt)}`,
      `ID: ${latest.id}`,
      `Endpoint: ${latest.method} ${latest.endpoint}`,
      `학습 흐름: ${currentEpisodeText}`,
      `배치 실험: ${placementEpisodeText}`,
      `배치 설정: ${configText}`,
      `평가 기준: ${profileText}`,
      `배치 기록: ${latest.payload?.placements?.length ?? 0}개`,
      '',
      '최근 10건까지만 보관합니다.',
    ];
  }

  static getLearningDataPlacementContext(data) {
    const summaryContext = data?.summary?.placementContext;
    return {
      placementConfigId: summaryContext?.placementConfigId ?? data?.placementConfig?.id ?? null,
      evaluationProfileId: summaryContext?.evaluationProfileId ?? data?.evaluationProfile?.id ?? null,
    };
  }

  static formatPlacementBreakdown(data) {
    const breakdown = data?.summary?.placementBreakdown;
    if (breakdown) {
      return `이번 ${breakdown.currentPlacementCount}개 / 이전 ${breakdown.inheritedPlacementCount}개 / 누적 ${breakdown.totalPlacementCount}개`;
    }
    return `배치 ${data?.placements?.length ?? 0}개`;
  }

  static getApiPayloadPlacementContext(payload) {
    const summaryContext = payload?.summary?.placement_context;
    return {
      placementConfigId: summaryContext?.placement_config_id ?? payload?.placement_config?.id ?? null,
      evaluationProfileId: summaryContext?.evaluation_profile_id ?? payload?.evaluation_profile?.id ?? null,
    };
  }
}
