import { explorationPlaces } from '../data/explorationPlaces.js';
import { STATE_LABELS } from '../data/stateLabels.js';
import IssueDetector from './IssueDetector.js';
import LearningProgress from './LearningProgress.js';

export default class TeacherReportManager {
  static build(registry) {
    const progress = LearningProgress.get(registry);
    const selectedPolicy = registry.get('selectedPolicy');
    const placedBuildings = registry.get('placedBuildings') ?? [];
    const gameState = registry.get('gameState');
    const reflectionChoice = registry.get('reflectionChoice');
    const quizResult = registry.get('quizResult') ?? progress.quizResult;
    const issues = IssueDetector.detect(gameState);
    const exploredNames = explorationPlaces
      .filter((place) => progress.exploredPlaces.includes(place.id))
      .map((place) => place.name);

    return {
      progress,
      selectedPolicy,
      placedBuildings,
      gameState,
      reflectionChoice,
      quizResult,
      issues,
      exploredNames,
    };
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
    const stateRows = Object.entries(STATE_LABELS)
      .map(([key, label]) => `${label}: ${report.gameState[key]}`)
      .join(' / ');

    return [
      `회복 방향: ${report.selectedPolicy?.name ?? '미선택'}`,
      '',
      '배치 시설:',
      buildingRows,
      '',
      '최종 상태:',
      stateRows,
    ].join('\n');
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
