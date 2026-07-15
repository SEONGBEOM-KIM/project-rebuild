import { explorationPlaces } from '../data/explorationPlaces.js';
import { STATE_LABELS } from '../data/stateLabels.js';
import IssueDetector from './IssueDetector.js';
import LearningProgress from './LearningProgress.js';

const TEACHER_REPORT_SCREEN_LAYOUT = {
  backgroundColor: 0x0b1727,
  progressStep: 'ending',
  title: { y: 78, text: '교사용 요약' },
  subtitle: { y: 145, text: '수업 중 학생 활동을 빠르게 확인하기 위한 임시 리포트 화면입니다.' },
};

const TEACHER_REPORT_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 4,
  strokeColor: 0x60a5fa,
};

const TEACHER_REPORT_DOWNLOAD_CONFIG = {
  mimeType: 'text/plain;charset=utf-8',
};

export default class TeacherReportManager {
  static getScreenLayout(width) {
    return {
      background: { color: TEACHER_REPORT_SCREEN_LAYOUT.backgroundColor },
      progressStep: TEACHER_REPORT_SCREEN_LAYOUT.progressStep,
      title: { x: width / 2, ...TEACHER_REPORT_SCREEN_LAYOUT.title },
      subtitle: { x: width / 2, ...TEACHER_REPORT_SCREEN_LAYOUT.subtitle },
    };
  }

  static getPanelStyle() {
    return { ...TEACHER_REPORT_PANEL_STYLE };
  }

  static getDownloadConfig() {
    return { ...TEACHER_REPORT_DOWNLOAD_CONFIG };
  }

  static getPanelLayout() {
    return {
      progress: { x: 400, y: 450, width: 580, height: 560, title: '학습 진행' },
      choice: { x: 1010, y: 450, width: 580, height: 560, title: '선택과 결과' },
      teaching: { x: 1620, y: 450, width: 420, height: 560, title: '지도 포인트' },
    };
  }

  static getPanelTitlePosition(panel) {
    return {
      x: panel.x,
      y: panel.y - panel.height / 2 + 44,
    };
  }

  static getPanelBodyPosition(panel) {
    return {
      x: panel.x - panel.width / 2 + 38,
      y: panel.y - panel.height / 2 + 100,
    };
  }

  static getPanelBodyStyle(panel) {
    return {
      fontSize: '23px',
      color: '#1e293b',
      lineSpacing: 10,
      wordWrap: { width: panel.width - 76 },
    };
  }

  static getControlLayout() {
    return {
      status: { x: 960, y: 855 },
      copy: { x: 520, y: 940, label: '리포트 복사', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      download: { x: 820, y: 940, label: 'TXT 다운로드', backgroundColor: '#a7f3d0', textColor: '#064e3b' },
      ending: { x: 1140, y: 940, label: '마무리로 돌아가기', target: 'EndingScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      data: { x: 1490, y: 940, label: '학습 데이터 보기', target: 'LearningDataScene', backgroundColor: '#bbf7d0', textColor: '#123524' },
    };
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
