export const LEARNING_SAVE_STORAGE_KEY = 'project-rebuild:learning-save:v1';

export default class SaveManager {
  static save(data) {
    const payload = {
      savedAt: new Date().toISOString(),
      version: 1,
      data,
    };
    window.localStorage.setItem(LEARNING_SAVE_STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  static load() {
    const raw = window.localStorage.getItem(LEARNING_SAVE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }


  static importJsonText(jsonText) {
    const parsed = JSON.parse(jsonText);
    const data = parsed?.data ?? parsed;
    if (!SaveManager.isLearningDataShape(data)) {
      throw new Error('학습 데이터 JSON 형식이 아닙니다.');
    }
    return SaveManager.save(data);
  }

  static isLearningDataShape(data) {
    return Boolean(
      data
      && typeof data === 'object'
      && Number.isFinite(data.episode)
      && Array.isArray(data.exploredPlaces)
      && Array.isArray(data.placements)
    );
  }

  static clear() {
    window.localStorage.removeItem(LEARNING_SAVE_STORAGE_KEY);
  }

  static hasSave() {
    return Boolean(window.localStorage.getItem(LEARNING_SAVE_STORAGE_KEY));
  }
}
