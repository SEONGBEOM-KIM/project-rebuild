import { CURRENT_EPISODE, CURRENT_PLACEMENT_EPISODE } from './episodes.js';
import { getCurrentEpisodeContent, getCurrentPlacementMissionBriefing } from './episodeContent.js';
import { getPlacementConfig } from './episodePlacementConfigs.js';
import { getEvaluationProfile } from './evaluationRules.js';
import { policies } from './policies.js';

const API_SCHEMA_VERSION = 1;
const API_ENDPOINT = '/api/learning-records/';
const API_CONTENT_TYPE = 'application/json';
const EXAMPLE_STRATEGY_ID = 'balanced_growth';
const EXAMPLE_PLACEMENT_BUILDING_ID = 'small_park';

function serializeEpisode(episode) {
  return {
    id: episode.id,
    code: episode.code,
    title: episode.title,
    short_title: episode.shortTitle,
    region_name: episode.regionName,
    theme: episode.theme,
  };
}

function selectExampleStrategy() {
  const missionBriefing = getCurrentPlacementMissionBriefing();
  return missionBriefing.strategies.find((strategy) => strategy.id === EXAMPLE_STRATEGY_ID)
    ?? missionBriefing.strategies[0];
}

function buildRequestExample() {
  const episodeContent = getCurrentEpisodeContent();
  const strategy = selectExampleStrategy();
  const policy = policies.find((candidate) => candidate.id === strategy.policyId) ?? policies[0];
  const placementConfig = getPlacementConfig(strategy.placementConfigId);
  const evaluationProfile = getEvaluationProfile(placementConfig.evaluationProfileId);
  const reflectionChoice = episodeContent.reflectionChoices.find((choice) => choice.id === 'budget_balance')
    ?? episodeContent.reflectionChoices[0];
  const placementBuilding = placementConfig.buildings.find((building) => building.id === EXAMPLE_PLACEMENT_BUILDING_ID)
    ?? placementConfig.buildings[0];

  return {
    schema_version: API_SCHEMA_VERSION,
    episode_id: CURRENT_EPISODE.id,
    episode_context: {
      current: serializeEpisode(CURRENT_EPISODE),
      placement: serializeEpisode(CURRENT_PLACEMENT_EPISODE),
    },
    completed: true,
    summary: {
      outcome_type: '환경 우선 회복안',
      outcome_message: '생활 환경 개선 효과가 뚜렷합니다.',
      priority_issue: null,
      selected_policy_name: policy.name,
      selected_strategy_title: strategy.title,
      placement_count: 1,
      next_action: {
        id: reflectionChoice.id,
        title: reflectionChoice.title,
        label: reflectionChoice.nextActionLabel,
      },
    },
    learning_steps: {
      explored_places: ['school', 'market', 'bus_stop'],
      data_viewed: true,
      quiz_result: {
        question_id: episodeContent.causeQuestion.id,
        selected: episodeContent.causeQuestion.choices.find((choice) => choice.correct)?.id ?? null,
        correct: true,
      },
      problem_summary_completed: true,
      reflection_choice: {
        id: reflectionChoice.id,
        title: reflectionChoice.title,
      },
    },
    selected_policy: {
      id: policy.id,
      name: policy.name,
    },
    selected_strategy: {
      id: strategy.id,
      title: strategy.title,
      state_focus: strategy.stateFocus,
      policy_id: strategy.policyId,
      placement_config_id: placementConfig.id,
    },
    placement_config: {
      id: placementConfig.id,
      episode_id: placementConfig.episodeId,
      title: placementConfig.title,
      required_placements: placementConfig.requiredPlacements,
      state_keys: placementConfig.stateKeys,
      evaluation_profile_id: placementConfig.evaluationProfileId,
    },
    evaluation_profile: {
      id: evaluationProfile.id,
    },
    placements: [
      {
        order: 1,
        building_id: placementBuilding.id,
        building_name: placementBuilding.name,
        position: { x: 6, y: 1 },
        effect: placementBuilding.effect,
      },
    ],
    final_state: {
      population: 1000,
      economy: 50,
      environment: 92,
      satisfaction: 74,
      budget: 860,
      traffic: 10,
      pollution: 6,
    },
  };
}

function buildSuccessResponseExample(requestExample) {
  return {
    id: 123,
    student_id: 45,
    episode_id: requestExample.episode_id,
    episode_context: requestExample.episode_context,
    completed: true,
    created_at: '2026-07-12T10:00:00+09:00',
    updated_at: '2026-07-12T10:00:00+09:00',
  };
}

const requestExample = buildRequestExample();

export const API_CONTRACT = {
  method: 'POST',
  endpoint: API_ENDPOINT,
  contentType: API_CONTENT_TYPE,
  schemaVersion: API_SCHEMA_VERSION,
  requestExample,
  successResponseExample: buildSuccessResponseExample(requestExample),
  errorResponseExample: {
    error: 'validation_error',
    fields: {
      episode_id: ['This field is required.'],
      placements: ['At least one placement is required.'],
    },
  },
};

export function formatContractRequest() {
  return `${API_CONTRACT.method} ${API_CONTRACT.endpoint}\nContent-Type: ${API_CONTRACT.contentType}\n\n${JSON.stringify(API_CONTRACT.requestExample, null, 2)}`;
}

export function formatContractResponse() {
  return `201 Created\n${JSON.stringify(API_CONTRACT.successResponseExample, null, 2)}\n\n400 Bad Request\n${JSON.stringify(API_CONTRACT.errorResponseExample, null, 2)}`;
}
