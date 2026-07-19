import { explorationPlaces } from '../data/explorationPlaces.js';
import { CURRENT_EPISODE, CURRENT_PLACEMENT_EPISODE } from '../data/episodes.js';
import { getCurrentPlacementMissionBriefing } from '../data/episodeContent.js';
import { DEFAULT_STATE_KEYS, STATE_LABELS } from '../data/stateLabels.js';
import IssueDetector from './IssueDetector.js';
import LearningProgress from './LearningProgress.js';
import EndingSummaryManager from './EndingSummaryManager.js';
import Ep2BriefingViewManager from './Ep2BriefingViewManager.js';
import PlacementContextManager from './PlacementContextManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

const TEACHER_REPORT_DOWNLOAD_CONFIG = {
  mimeType: 'text/plain;charset=utf-8',
};

export default class TeacherReportManager {
  static getDownloadConfig() {
    return { ...TEACHER_REPORT_DOWNLOAD_CONFIG };
  }

  static formatStatusText() {
    return '리포트를 복사하거나 텍스트 파일로 저장할 수 있습니다.';
  }

  static formatCopySuccess() {
    return '교사용 리포트를 클립보드에 복사했습니다.';
  }

  static formatCopyFailure() {
    return '클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.';
  }

  static formatDownloadSuccess() {
    return '교사용 리포트 다운로드를 시작했습니다.';
  }

  static formatEpisodeFileSlug(report = null) {
    return report?.episodeContext?.current?.code ?? CURRENT_EPISODE.code;
  }

  static formatDownloadFileName(report = null) {
    return `project-rebuild-${TeacherReportManager.formatEpisodeFileSlug(report)}-teacher-report.txt`;
  }

  static build(registry) {
    const progress = LearningProgress.get(registry);
    const selectedPolicy = registry.get(REGISTRY_KEYS.selectedPolicy);
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(getCurrentPlacementMissionBriefing(), registry.get(REGISTRY_KEYS.selectedPlacementStrategy) ?? progress.selectedStrategyId, selectedPolicy?.id);
    const { placementConfig, evaluationProfile } = PlacementContextManager.resolve({
      registry,
      progress,
      selectedStrategy,
    });
    const placedBuildings = registry.get(REGISTRY_KEYS.placedBuildings) ?? [];
    const gameState = registry.get(REGISTRY_KEYS.gameState);
    const reflectionChoice = registry.get(REGISTRY_KEYS.reflectionChoice);
    const quizResult = registry.get(REGISTRY_KEYS.quizResult) ?? progress.quizResult;
    const issues = IssueDetector.detect(gameState, evaluationProfile);
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings, evaluationProfile);
    const exploredNames = explorationPlaces
      .filter((place) => progress.exploredPlaces.includes(place.id))
      .map((place) => place.name);

    return {
      progress,
      episodeContext: {
        current: TeacherReportManager.serializeEpisode(CURRENT_EPISODE),
        placement: TeacherReportManager.serializeEpisode(CURRENT_PLACEMENT_EPISODE),
      },
      selectedPolicy,
      selectedStrategy,
      placementConfig,
      evaluationProfile,
      placementContext: TeacherReportManager.buildPlacementContextSummary(placementConfig, evaluationProfile),
      placedBuildings,
      gameState,
      reflectionChoice,
      quizResult,
      issues,
      ending,
      exploredNames,
    };
  }

  static buildPlacementContextSummary(placementConfig, evaluationProfile) {
    return {
      placementConfigId: placementConfig?.id ?? null,
      placementConfigTitle: placementConfig?.title ?? null,
      requiredPlacements: placementConfig?.requiredPlacements ?? null,
      stateKeys: placementConfig?.stateKeys ?? [],
      evaluationProfileId: evaluationProfile?.id ?? null,
    };
  }

  static serializeEpisode(episode) {
    return {
      id: episode.id,
      code: episode.code,
      shortTitle: episode.shortTitle,
      title: episode.title,
      theme: episode.theme,
    };
  }

  static formatEpisodeContextReport(report) {
    const currentEpisode = report.episodeContext?.current;
    const placementEpisode = report.episodeContext?.placement;
    const placementContext = report.placementContext ?? TeacherReportManager.buildPlacementContextSummary(report.placementConfig, report.evaluationProfile);
    return [
      `학습 흐름: ${currentEpisode?.shortTitle ?? '알 수 없음'} (${currentEpisode?.code ?? '-'})`,
      `배치 실험: ${placementEpisode?.shortTitle ?? '알 수 없음'} (${placementEpisode?.code ?? '-'})`,
      `배치 설정: ${placementContext.placementConfigId ?? '없음'} / ${placementContext.placementConfigTitle ?? '제목 없음'}`,
      `필요 배치: ${placementContext.requiredPlacements ?? '-'}개`,
      `표시 지표: ${(placementContext.stateKeys ?? []).join(', ') || '없음'}`,
      `평가 기준: ${placementContext.evaluationProfileId ?? '없음'}`,
    ].join('\n');
  }

  static formatClassSummaryReport(report) {
    const priorityIssue = report.issues[0];
    const issueText = priorityIssue ? priorityIssue.title : '큰 부작용 신호 없음';
    const actionText = report.reflectionChoice?.nextActionLabel
      ?? report.reflectionChoice?.title
      ?? '보완 방향 미선택';

    return [
      `${report.ending.title}: ${report.ending.message}`,
      `우선 보완: ${issueText}`,
      `학생 다음 액션: ${actionText}`,
      `EP2 전략: ${report.selectedStrategy?.title ?? '미선택'}`,
      `회복 방향: ${report.selectedPolicy?.name ?? '미선택'} / 배치 ${report.placedBuildings.length}개`,
    ].join('\n');
  }

  static formatProgressReport(report) {
    const quizStatus = !report.quizResult
      ? '미응답'
      : report.quizResult.correct ? '정답' : '오답 후 피드백 확인';

    return [
      `탐색 장소: ${report.exploredNames.length}/${explorationPlaces.length}`,
      report.exploredNames.join(', ') || '없음',
      '',
      `자료 확인: ${report.progress.dataViewed ? '완료' : '미완료'}`,
      `원인 질문: ${quizStatus}`,
      `문제 정리: ${report.progress.problemSummaryCompleted ? '완료' : '미완료'}`,
      `생각 정리: ${report.reflectionChoice?.title ?? '미선택'}`,
      '',
      `EP1 완료: ${report.progress.completed ? '예' : '아니오'}`,
    ].join('\n');
  }

  static formatChoiceReport(report) {
    const buildingRows = report.placedBuildings.length
      ? report.placedBuildings.map((record, index) => `${index + 1}. ${record.building.name} (${record.position.x}, ${record.position.y})`).join('\n')
      : '배치 없음';
    const stateKeys = report.placementConfig?.stateKeys ?? DEFAULT_STATE_KEYS;
    const stateRows = stateKeys
      .map((key) => `${STATE_LABELS[key] ?? key}: ${report.gameState[key] ?? 0}`)
      .join(' / ');

    return [
      `EP2 전략: ${report.selectedStrategy?.title ?? '미선택'}`,
      report.selectedStrategy ? `전략 초점: ${report.selectedStrategy.stateFocus}` : null,
      `회복 방향: ${report.selectedPolicy?.name ?? '미선택'}`,
      '',
      '배치 시설:',
      buildingRows,
      '',
      '최종 상태:',
      stateRows,
    ].filter((row) => row !== null).join('\n');
  }

  static formatTeachingPointReport(report) {
    const issueRows = report.issues.length
      ? report.issues.map((issue) => `• ${issue.title}`).join('\n')
      : '• 큰 부작용 신호 없음';

    return [
      '확인 질문 예시:',
      '• 왜 이 회복 방향을 골랐나요?',
      '• 배치 시설이 선택 방향과 연결되나요?',
      '• 다음에는 어떤 지표를 보완해야 하나요?',
      '',
      '주의 신호:',
      issueRows,
      '',
      '교사 메모:',
      '현재 화면은 저장/출력 전 단계의 요약 UI입니다.',
    ].join('\n');
  }

  static formatReportTitle(report) {
    const currentEpisode = report.episodeContext?.current;
    return `[프로젝트 리빌드 ${currentEpisode?.shortTitle ?? CURRENT_EPISODE.shortTitle} 교사용 요약]`;
  }

  static buildReportText(report) {
    return [
      TeacherReportManager.formatReportTitle(report),
      '',
      '0. 에피소드/설정',
      TeacherReportManager.formatEpisodeContextReport(report),
      '',
      '1. 수업 결론',
      TeacherReportManager.formatClassSummaryReport(report),
      '',
      '2. 학습 진행',
      TeacherReportManager.formatProgressReport(report),
      '',
      '3. 선택과 결과',
      TeacherReportManager.formatChoiceReport(report),
      '',
      '4. 지도 포인트',
      TeacherReportManager.formatTeachingPointReport(report),
    ].join('\n');
  }
}
