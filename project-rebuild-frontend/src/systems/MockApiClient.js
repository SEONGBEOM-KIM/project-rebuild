export const MOCK_SUBMISSION_LOG_STORAGE_KEY = 'project-rebuild:mock-api-submissions:v1';

export default class MockApiClient {
  static submitLearningRecord(payload) {
    const validation = MockApiClient.validatePayload(payload);
    if (!validation.ok) {
      return {
        ok: false,
        status: 400,
        error: validation.message,
      };
    }

    const record = {
      id: `mock-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      endpoint: '/api/learning-records/',
      method: 'POST',
      payload,
    };
    const submissions = MockApiClient.listSubmissions();
    window.localStorage.setItem(MOCK_SUBMISSION_LOG_STORAGE_KEY, JSON.stringify([record, ...submissions].slice(0, 10)));

    return {
      ok: true,
      status: 201,
      data: {
        id: record.id,
        submitted_at: record.submittedAt,
        message: 'Mock API 제출이 완료되었습니다.',
      },
    };
  }

  static listSubmissions() {
    const raw = window.localStorage.getItem(MOCK_SUBMISSION_LOG_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  static clearSubmissions() {
    window.localStorage.removeItem(MOCK_SUBMISSION_LOG_STORAGE_KEY);
  }

  static validatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, message: 'payload 객체가 없습니다.' };
    }
    if (payload.schema_version !== 1) {
      return { ok: false, message: 'schema_version이 1이 아닙니다.' };
    }
    if (!Number.isFinite(payload.episode_id)) {
      return { ok: false, message: 'episode_id가 숫자가 아닙니다.' };
    }
    if (!Array.isArray(payload.placements)) {
      return { ok: false, message: 'placements 배열이 없습니다.' };
    }
    if (!payload.final_state || typeof payload.final_state !== 'object') {
      return { ok: false, message: 'final_state 객체가 없습니다.' };
    }
    return { ok: true, message: '제출 가능' };
  }
}
