import { buildings } from './buildings.js';
import { mapData } from './mapData.js';
import { CURRENT_PLACEMENT_EPISODE, EPISODE_IDS } from './episodes.js';
import { DEFAULT_EVALUATION_PROFILE_ID, ENVIRONMENT_EVALUATION_PROFILE_ID } from './evaluationRules.js';

export const DEFAULT_PLACEMENT_CONFIG_ID = 'ep2_population_recovery';
export const ENVIRONMENT_PLACEMENT_CONFIG_ID = 'ep2_environment_focus';

export const episodePlacementConfigs = {
  [DEFAULT_PLACEMENT_CONFIG_ID]: {
    id: DEFAULT_PLACEMENT_CONFIG_ID,
    episodeId: EPISODE_IDS.PopulationRecovery,
    title: '푸른군 인구 회복 배치 실험',
    map: mapData,
    buildings,
    requiredPlacements: 3,
    evaluationProfileId: DEFAULT_EVALUATION_PROFILE_ID,
    stateKeys: [
      'population',
      'economy',
      'environment',
      'satisfaction',
      'budget',
      'traffic',
      'pollution',
    ],
  },
  [ENVIRONMENT_PLACEMENT_CONFIG_ID]: {
    id: ENVIRONMENT_PLACEMENT_CONFIG_ID,
    episodeId: EPISODE_IDS.PopulationRecovery,
    title: '푸른군 환경 균형 배치 실험',
    map: mapData,
    buildings,
    requiredPlacements: 2,
    evaluationProfileId: ENVIRONMENT_EVALUATION_PROFILE_ID,
    stateKeys: [
      'environment',
      'pollution',
      'budget',
    ],
  },
};


export function getPlacementConfigIdForStrategy(strategy) {
  return strategy?.placementConfigId ?? DEFAULT_PLACEMENT_CONFIG_ID;
}

export function getPlacementConfigsForEpisode(episodeCode = CURRENT_PLACEMENT_EPISODE.code) {
  return Object.values(episodePlacementConfigs).filter((config) => config.episodeId === episodeCode);
}

export function getDefaultPlacementConfigIdForEpisode(episodeCode = CURRENT_PLACEMENT_EPISODE.code) {
  return getPlacementConfigsForEpisode(episodeCode)[0]?.id ?? DEFAULT_PLACEMENT_CONFIG_ID;
}

export function getPlacementConfig(configId = getDefaultPlacementConfigIdForEpisode()) {
  return episodePlacementConfigs[configId] ?? episodePlacementConfigs[getDefaultPlacementConfigIdForEpisode()];
}

export function getDefaultPlacementConfig(episodeCode = CURRENT_PLACEMENT_EPISODE.code) {
  return getPlacementConfig(getDefaultPlacementConfigIdForEpisode(episodeCode));
}
