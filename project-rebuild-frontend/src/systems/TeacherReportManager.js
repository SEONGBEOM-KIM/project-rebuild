import { explorationPlaces } from '../data/explorationPlaces.js';
import { EP2_MISSION_BRIEFING } from '../data/episodeContent.js';
import { DEFAULT_STATE_KEYS, STATE_LABELS } from '../data/stateLabels.js';
import IssueDetector from './IssueDetector.js';
import LearningProgress from './LearningProgress.js';
import EndingSummaryManager from './EndingSummaryManager.js';
import Ep2BriefingViewManager from './Ep2BriefingViewManager.js';
import { getPlacementConfig, getPlacementConfigIdForStrategy } from '../data/episodePlacementConfigs.js';
import { getEvaluationProfile } from '../data/evaluationRules.js';

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

  static formatDownloadFileName() {
    return 'project-rebuild-ep1-teacher-report.txt';
  }

  static build(registry) {
    const progress = LearningProgress.get(registry);
    const selectedPolicy = registry.get('selectedPolicy');
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(EP2_MISSION_BRIEFING, registry.get('ep2StrategyId') ?? progress.selectedStrategyId, selectedPolicy?.id);
    const placementConfigId = registry.get('placementConfigId') ?? progress.placementConfigId ?? getPlacementConfigIdForStrategy(selectedStrategy);
    const placementConfig = getPlacementConfig(placementConfigId);
    const evaluationProfile = getEvaluationProfile(placementConfig.evaluationProfileId);
    const placedBuildings = registry.get('placedBuildings') ?? [];
    const gameState = registry.get('gameState');
    const reflectionChoice = registry.get('reflectionChoice');
    const quizResult = registry.get('quizResult') ?? progress.quizResult;
    const issues = IssueDetector.detect(gameState, evaluationProfile);
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings, evaluationProfile);
    const exploredNames = explorationPlaces
      .filter((place) => progress.exploredPlaces.includes(place.id))
      .map((place) => place.name);

    return {
      progress,
      selectedPolicy,
      selectedStrategy,
      placementConfig,
      evaluationProfile,
      placedBuildings,
      gameState,
      reflectionChoice,
      quizResult,
      issues,
      ending,
      exploredNames,
    };
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

  static buildReportText(report) {
    return [
      '[프로젝트 리빌드 EP1 교사용 요약]',
      '',
      '0. 수업 결론',
      TeacherReportManager.formatClassSummaryReport(report),
      '',
      '1. 학습 진행',
      TeacherReportManager.formatProgressReport(report),
      '',
      '2. 선택과 결과',
      TeacherReportManager.formatChoiceReport(report),
      '',
      '3. 지도 포인트',
      TeacherReportManager.formatTeachingPointReport(report),
    ].join('\n');
  }
}
