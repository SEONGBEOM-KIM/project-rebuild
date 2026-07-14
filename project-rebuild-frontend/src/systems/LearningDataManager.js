import { explorationPlaces } from '../data/explorationPlaces.js';
import LearningProgress from './LearningProgress.js';

export default class LearningDataManager {
  static build(registry) {
    const progress = LearningProgress.get(registry);
    const quizResult = registry.get('quizResult');
    const selectedPolicy = registry.get('selectedPolicy');
    const placedBuildings = registry.get('placedBuildings') ?? [];
    const gameState = registry.get('gameState');
    const reflectionChoice = registry.get('reflectionChoice');
    const exploredPlaceNames = explorationPlaces
      .filter((place) => progress.exploredPlaces.includes(place.id))
      .map((place) => place.name);

    return {
      episode: progress.episode,
      exploredPlaces: progress.exploredPlaces,
      exploredPlaceNames,
      dataViewed: progress.dataViewed,
      quizResult: quizResult ?? progress.quizResult,
      problemSummaryCompleted: progress.problemSummaryCompleted,
      selectedPolicy: selectedPolicy ? {
        id: selectedPolicy.id,
        name: selectedPolicy.name,
      } : null,
      placements: placedBuildings.map((record) => ({
        buildingId: record.building.id,
        buildingName: record.building.name,
        position: record.position,
        effect: record.delta,
      })),
      gameState,
      reflectionChoice,
      completed: progress.completed,
    };
  }

  static validate(data) {
    return [
      {
        ok: data.episode === 1,
        label: 'episode 값 확인',
        message: 'episode 값이 EP1로 저장되지 않았습니다.',
      },
      {
        ok: Array.isArray(data.exploredPlaces) && data.exploredPlaces.length >= 3,
        label: '탐색 장소 3곳 이상',
        message: '탐색 장소 기록이 3곳 미만입니다.',
      },
      {
        ok: data.dataViewed === true,
        label: '자료 확인 완료',
        message: '자료 확인 완료 기록이 없습니다.',
      },
      {
        ok: Boolean(data.quizResult?.selected),
        label: '원인 질문 응답 기록',
        message: '퀴즈 선택 기록이 없습니다.',
      },
      {
        ok: data.problemSummaryCompleted === true,
        label: '문제 정리 완료',
        message: '문제 정리 완료 기록이 없습니다.',
      },
      {
        ok: Boolean(data.selectedPolicy?.id),
        label: '회복 방향 선택',
        message: '선택한 회복 방향이 없습니다.',
      },
      {
        ok: Array.isArray(data.placements) && data.placements.length >= 3,
        label: '시설 배치 3개 이상',
        message: '배치 기록이 3개 미만입니다.',
      },
      {
        ok: Boolean(data.reflectionChoice?.id),
        label: '생각 정리 선택',
        message: '생각 정리 선택 기록이 없습니다.',
      },
      {
        ok: data.completed === true,
        label: 'EP1 완료 여부',
        message: 'EP1 완료 플래그가 true가 아닙니다.',
      },
    ];
  }

  static isReadyToSave(data) {
    return LearningDataManager.validate(data).every((row) => row.ok);
  }
}
