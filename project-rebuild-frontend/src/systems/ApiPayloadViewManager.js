import LearningApiPayloadManager from './LearningApiPayloadManager.js';

export const API_PAYLOAD_SCREEN_LAYOUT = {
  backgroundColor: 0x111827,
  progressStep: 'ending',
  title: { y: 78, text: 'API 저장 페이로드 미리보기', fontSize: '56px', color: '#ffffff', fontStyle: 'bold' },
  subtitle: { y: 145, text: 'Django API 연동 전, 프론트엔드 학습 데이터를 서버 저장용 구조로 변환해 확인합니다.', fontSize: '21px', color: '#bfdbfe' },
};

const API_PAYLOAD_DARK_PANEL_STYLE = {
  fillColor: 0x0f172a,
  fillAlpha: 0.98,
  strokeWidth: 5,
  titleFontSize: '31px',
  titleColor: '#ffffff',
  titleFontStyle: 'bold',
};

const API_PAYLOAD_LIGHT_PANEL_STYLE = {
  fillColor: 0xffffff,
  fillAlpha: 0.96,
  strokeWidth: 5,
  titleFontSize: '34px',
  titleColor: '#172554',
  titleFontStyle: 'bold',
};

const API_PAYLOAD_VALIDATION_TEXT_STYLE = {
  fontSize: '21px',
  color: '#1e293b',
  lineSpacing: 9,
};

const API_PAYLOAD_STATUS_TEXT_STYLE = {
  fontSize: '21px',
  lineSpacing: 9,
};

const API_PAYLOAD_LOG_PANEL_STYLE = {
  fillColor: 0x1e293b,
  fillAlpha: 0.98,
  strokeWidth: 3,
  titleFontSize: '22px',
  titleColor: '#ffffff',
  titleFontStyle: 'bold',
};

const API_PAYLOAD_LOG_TEXT_STYLE = {
  fontSize: '18px',
  color: '#dbeafe',
  lineSpacing: 6,
};

const API_PAYLOAD_BUTTON_STYLE = {
  fontSize: '21px',
  padding: { x: 14, y: 13 },
};

const API_PAYLOAD_FEEDBACK_COLORS = {
  success: '#166534',
  error: '#991b1b',
  logUpdated: '#bbf7d0',
};

export const API_PAYLOAD_DOWNLOAD_CONFIG = {
  mimeType: 'application/json',
};


export default class ApiPayloadViewManager {
  static getScreenLayout(width) {
    return {
      backgroundColor: API_PAYLOAD_SCREEN_LAYOUT.backgroundColor,
      progressStep: API_PAYLOAD_SCREEN_LAYOUT.progressStep,
      title: { ...API_PAYLOAD_SCREEN_LAYOUT.title, x: width / 2 },
      subtitle: { ...API_PAYLOAD_SCREEN_LAYOUT.subtitle, x: width / 2 },
    };
  }

  static getDownloadConfig() {
    return API_PAYLOAD_DOWNLOAD_CONFIG;
  }

  static getDarkPanelStyle() {
    return { ...API_PAYLOAD_DARK_PANEL_STYLE };
  }

  static getLightPanelStyle() {
    return { ...API_PAYLOAD_LIGHT_PANEL_STYLE };
  }

  static getValidationTextStyle(wordWrapWidth) {
    return { ...API_PAYLOAD_VALIDATION_TEXT_STYLE, wordWrap: { width: wordWrapWidth } };
  }

  static getStatusTextStyle(wordWrapWidth, color) {
    return { ...API_PAYLOAD_STATUS_TEXT_STYLE, color, wordWrap: { width: wordWrapWidth } };
  }

  static getLogPanelStyle() {
    return { ...API_PAYLOAD_LOG_PANEL_STYLE };
  }

  static getLogTextStyle(wordWrapWidth) {
    return { ...API_PAYLOAD_LOG_TEXT_STYLE, wordWrap: { width: wordWrapWidth } };
  }

  static getButtonStyle() {
    return { ...API_PAYLOAD_BUTTON_STYLE, padding: { ...API_PAYLOAD_BUTTON_STYLE.padding } };
  }

  static getFeedbackColor(kind) {
    return API_PAYLOAD_FEEDBACK_COLORS[kind];
  }

  static getPayloadPanelLayout() {
    return {
      panel: { x: 760, y: 555, width: 1120, height: 710, strokeColor: 0x60a5fa },
      title: { x: 240, y: 230, text: 'POST /api/learning-records/ 후보 body' },
      body: { x: 245, y: 285, wordWrapWidth: 1030 },
    };
  }

  static getValidationPanelLayout() {
    return {
      panel: { x: 1550, y: 555, width: 500, height: 710 },
      title: { x: 1550, y: 230, text: 'API 구조 검증' },
      rows: { x: 1325, y: 290, wordWrapWidth: 440 },
      status: { x: 1325, y: 770, wordWrapWidth: 440 },
    };
  }

  static getSubmissionLogLayout() {
    return {
      panel: { x: 1550, y: 850, width: 500, height: 105 },
      title: { x: 1325, y: 815, text: 'Mock 제출 로그', strokeColor: 0x93c5fd },
      body: { x: 1325, y: 848, wordWrapWidth: 440 },
    };
  }

  static getControlLayout() {
    return {
      submit: { x: 350, y: 960, label: 'Mock 제출', backgroundColor: '#bbf7d0', textColor: '#123524' },
      copy: { x: 610, y: 960, label: 'Payload 복사', backgroundColor: '#93c5fd', textColor: '#0f172a' },
      download: { x: 910, y: 960, label: 'Payload 다운로드', backgroundColor: '#a7f3d0', textColor: '#064e3b' },
      contract: { x: 1130, y: 960, label: 'API 계약', target: 'ApiContractScene', backgroundColor: '#fde68a', textColor: '#0f172a' },
      log: { x: 1335, y: 960, label: '제출 로그', target: 'MockSubmissionLogScene', backgroundColor: '#bfdbfe', textColor: '#0f172a' },
      data: { x: 1545, y: 960, label: '학습 데이터', target: 'LearningDataScene', backgroundColor: '#c4b5fd', textColor: '#1e1b4b' },
      ending: { x: 1745, y: 960, label: '마무리', target: 'EndingScene', backgroundColor: '#fde68a', textColor: '#0f172a' },
    };
  }

  static getPayloadTextStyle(wordWrapWidth) {
    return {
      fontSize: '20px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 4,
      wordWrap: { width: wordWrapWidth },
    };
  }

  static formatCopySuccess() {
    return 'API payload를 클립보드에 복사했습니다.';
  }

  static formatCopyFailure() {
    return '클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.';
  }

  static formatDownloadSuccess() {
    return 'API payload 다운로드를 시작했습니다.';
  }

  static formatDownloadFileName(payload) {
    return `project-rebuild-ep${payload.episode_id}-api-payload.json`;
  }

  static formatJson(payload) {
    return JSON.stringify(payload, null, 2);
  }

  static getValidationRows(payload) {
    return LearningApiPayloadManager.validate(payload);
  }

  static getValidationSummary(payload) {
    const rows = ApiPayloadViewManager.getValidationRows(payload);
    const warnings = rows.filter((row) => !row.ok);
    return {
      rows,
      warnings,
      ok: warnings.length === 0,
      statusText: warnings.length
        ? warnings.map((row) => `• ${row.message}`).join('\n')
        : 'API 저장 후보 구조가 준비되었습니다. 실제 Django 연동 시 인증 사용자, 제출 시각, 수업/학생 식별자만 추가하면 됩니다.',
      statusColor: warnings.length ? '#991b1b' : '#166534',
      strokeColor: warnings.length ? 0xf87171 : 0xbbf7d0,
    };
  }

  static formatValidationRows(rows) {
    return rows.map((row) => `${row.ok ? 'PASS' : 'WARN'} ${row.label}`).join('\n');
  }

  static formatSubmittedAt(submittedAt) {
    const date = new Date(submittedAt);
    return Number.isNaN(date.getTime()) ? submittedAt : date.toLocaleString('ko-KR');
  }

  static formatSubmissionLog(submissions) {
    return submissions.length
      ? `최근 제출: ${ApiPayloadViewManager.formatSubmittedAt(submissions[0].submittedAt)}\n총 로그: ${submissions.length}건`
      : '아직 제출 로그가 없습니다.';
  }

  static formatSubmitSuccess(response) {
    return `Mock 제출 성공 (${response.status})\nrecord_id: ${response.data.id}`;
  }

  static formatSubmitFailure(response) {
    return `Mock 제출 실패 (${response.status}): ${response.error}`;
  }
}
