import { REGISTRY_KEYS } from '../data/registryKeys.js';
import GameState from './GameState.js';

const INITIAL_WORLD_STATE = Object.freeze({
  regionId: 'blue-county',
  regionName: '푸른군',
  activeEpisodeId: null,
  completedEpisodeIds: [],
  gameState: null,
  placements: [],
  episodeRuns: {},
});

function cloneGameState(gameState) {
  return { ...(gameState ?? GameState.createInitialState()) };
}

function clonePlacement(record) {
  return {
    ...record,
    position: record.position ? { ...record.position } : record.position,
    occupiedTiles: Array.isArray(record.occupiedTiles)
      ? record.occupiedTiles.map((tile) => ({ ...tile }))
      : record.occupiedTiles,
    effect: record.effect ? { ...record.effect } : record.effect,
    delta: record.delta ? { ...record.delta } : record.delta,
  };
}

function cloneEpisodeRuns(episodeRuns = {}) {
  return Object.fromEntries(
    Object.entries(episodeRuns).map(([episodeId, run]) => [
      episodeId,
      {
        ...run,
        placementIds: [...(run.placementIds ?? [])],
      },
    ]),
  );
}

function normalizeWorldState(worldState = {}) {
  return {
    ...INITIAL_WORLD_STATE,
    ...worldState,
    gameState: cloneGameState(worldState.gameState),
    placements: (worldState.placements ?? []).map(clonePlacement),
    completedEpisodeIds: [...(worldState.completedEpisodeIds ?? [])],
    episodeRuns: cloneEpisodeRuns(worldState.episodeRuns),
  };
}

export default class WorldStateManager {
  static createInitialWorldState(overrides = {}) {
    return normalizeWorldState(overrides);
  }

  static get(registry) {
    return normalizeWorldState(registry.get(REGISTRY_KEYS.worldState));
  }

  static set(registry, worldState) {
    const normalized = normalizeWorldState(worldState);
    registry.set(REGISTRY_KEYS.worldState, normalized);
    return normalized;
  }

  static update(registry, patch) {
    return WorldStateManager.set(registry, {
      ...WorldStateManager.get(registry),
      ...patch,
    });
  }

  static startEpisode(worldState, episodeId) {
    const normalized = normalizeWorldState(worldState);
    return normalizeWorldState({
      ...normalized,
      activeEpisodeId: episodeId,
      episodeRuns: {
        ...normalized.episodeRuns,
        [episodeId]: {
          ...(normalized.episodeRuns[episodeId] ?? {}),
          started: true,
          placementIds: normalized.episodeRuns[episodeId]?.placementIds ?? [],
        },
      },
    });
  }

  static appendPlacements(worldState, placements, episodeId = null) {
    const normalized = normalizeWorldState(worldState);
    const resolvedEpisodeId = episodeId ?? normalized.activeEpisodeId;
    const taggedPlacements = placements.map((record) => ({
      ...clonePlacement(record),
      episodeId: record.episodeId ?? resolvedEpisodeId,
    }));
    const placementIds = taggedPlacements.map((record) => record.id).filter(Boolean);

    return normalizeWorldState({
      ...normalized,
      placements: [...normalized.placements, ...taggedPlacements],
      episodeRuns: resolvedEpisodeId
        ? {
            ...normalized.episodeRuns,
            [resolvedEpisodeId]: {
              ...(normalized.episodeRuns[resolvedEpisodeId] ?? {}),
              started: true,
              placementIds: [
                ...(normalized.episodeRuns[resolvedEpisodeId]?.placementIds ?? []),
                ...placementIds,
              ],
            },
          }
        : normalized.episodeRuns,
    });
  }

  static completeEpisode(worldState, episodeId, { gameState = null, placements = [] } = {}) {
    const withPlacements = placements.length > 0
      ? WorldStateManager.appendPlacements(worldState, placements, episodeId)
      : normalizeWorldState(worldState);

    return normalizeWorldState({
      ...withPlacements,
      activeEpisodeId: episodeId,
      gameState: gameState ? cloneGameState(gameState) : withPlacements.gameState,
      completedEpisodeIds: Array.from(new Set([...withPlacements.completedEpisodeIds, episodeId])),
      episodeRuns: {
        ...withPlacements.episodeRuns,
        [episodeId]: {
          ...(withPlacements.episodeRuns[episodeId] ?? {}),
          started: true,
          completed: true,
        },
      },
    });
  }

  static buildPlacementSeed(worldState, { cumulative = false } = {}) {
    const normalized = normalizeWorldState(worldState);
    return {
      gameState: cumulative ? cloneGameState(normalized.gameState) : GameState.createInitialState(),
      placedBuildings: cumulative ? normalized.placements.map(clonePlacement) : [],
    };
  }
}
