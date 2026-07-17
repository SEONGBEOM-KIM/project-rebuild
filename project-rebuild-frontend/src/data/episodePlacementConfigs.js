import { buildings } from './buildings.js';
import { mapData } from './mapData.js';

export const DEFAULT_PLACEMENT_CONFIG_ID = 'ep2_population_recovery';

export const episodePlacementConfigs = {
  [DEFAULT_PLACEMENT_CONFIG_ID]: {
    id: DEFAULT_PLACEMENT_CONFIG_ID,
    episodeId: 'ep2',
    title: '푸른군 인구 회복 배치 실험',
    map: mapData,
    buildings,
    requiredPlacements: 3,
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
};


export function getPlacementConfigIdForStrategy(strategy) {
  return strategy?.placementConfigId ?? DEFAULT_PLACEMENT_CONFIG_ID;
}

export function getPlacementConfig(configId = DEFAULT_PLACEMENT_CONFIG_ID) {
  return episodePlacementConfigs[configId] ?? episodePlacementConfigs[DEFAULT_PLACEMENT_CONFIG_ID];
}

export function getDefaultPlacementConfig() {
  return getPlacementConfig(DEFAULT_PLACEMENT_CONFIG_ID);
}
