import { getEpisodeActivityFlow } from '../data/episodeActivityFlows.js';
import StateHudManager from './StateHudManager.js';

export default class EpisodeActivityFlowManager {
  static get(episodeId) {
    return getEpisodeActivityFlow(episodeId);
  }

  static getNextEpisodeId(episodeId) {
    return EpisodeActivityFlowManager.get(episodeId)?.nextEpisodeId ?? null;
  }

  static formatActivityRows(episodeId) {
    const flow = EpisodeActivityFlowManager.get(episodeId);
    if (!flow) {
      return [];
    }

    return flow.activitySteps.map((step, index) => `${index + 1}. ${step.label} — ${step.description}`);
  }

  static formatCarryoverSummary(worldState = {}) {
    const completedEpisodeIds = worldState.completedEpisodeIds ?? [];
    const placements = worldState.placements ?? [];
    if (!completedEpisodeIds.length) {
      return null;
    }

    const facilityNames = [...new Set(
      placements.map((record) => record.building?.name ?? record.buildingName ?? record.buildingId).filter(Boolean),
    )];
    const facilityText = facilityNames.length
      ? `이전 시설 ${placements.length}개: ${facilityNames.slice(0, 3).join(' · ')}`
      : '이전 시설 기록 없음';
    const stateText = worldState.gameState
      ? StateHudManager.formatCompactText(worldState.gameState, {
        stateKeys: ['population', 'economy', 'environment', 'satisfaction'],
      })
      : '지역 상태 기록 없음';

    return `이전 선택 이어받기 · ${facilityText}  |  ${stateText}`;
  }
}
