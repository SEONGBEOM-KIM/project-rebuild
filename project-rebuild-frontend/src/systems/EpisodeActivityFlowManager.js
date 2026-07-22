import { getEpisodeActivityFlow } from '../data/episodeActivityFlows.js';

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
}
