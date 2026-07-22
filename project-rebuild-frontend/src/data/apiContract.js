import { CURRENT_EPISODE, CURRENT_PLACEMENT_EPISODE, EPISODE_IDS, getEpisode } from './episodes.js';
import { getCurrentEpisodeContent, getEpisodeContent, getReflectionChoices } from './episodeContent.js';
import { getPlacementConfig } from './episodePlacementConfigs.js';
import { getEvaluationProfile } from './evaluationRules.js';
import { policies } from './policies.js';
import { economyPolicies } from './economyPolicies.js';

const API_SCHEMA_VERSION = 1;
const API_ENDPOINT = '/api/learning-records/';
const API_CONTENT_TYPE = 'application/json';
const DEFAULT_EXAMPLE_KEY = 'ep2';

const API_REQUEST_EXAMPLE_CONFIGS = {
  ep2: {
    placementEpisodeCode: CURRENT_PLACEMENT_EPISODE.code,
    strategyId: 'balanced_growth',
    placementBuildingId: 'small_park',
    outcomeType: '환경 우선 회복안',
    outcomeMessage: '생활 환경 개선 효과가 뚜렷합니다.',
    finalState: {
      population: 1000,
      economy: 50,
      environment: 92,
      satisfaction: 74,
      budget: 860,
      traffic: 10,
      pollution: 6,
    },
  },
  ep3: {
    placementEpisodeCode: EPISODE_IDS.EconomyGrowth,
    strategyId: 'visitor_commerce_growth',
    placementBuildingId: 'tour_complex',
    outcomeType: '방문 경제 성장안',
    outcomeMessage: '상권과 방문객 증가 효과가 나타났지만 교통 부담을 함께 관찰해야 합니다.',
    finalState: {
      population: 1080,
      economy: 92,
      environment: 74,
      satisfaction: 78,
      budget: 720,
      traffic: 24,
      pollution: 16,
    },
  },
};

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

function getPolicyPool() {
  return [...policies, ...economyPolicies];
}

function selectExampleStrategy(placementEpisodeCode, strategyId) {
  const missionBriefing = getEpisodeContent(placementEpisodeCode).missionBriefing;
  return missionBriefing.strategies.find((strategy) => strategy.id === strategyId)
    ?? missionBriefing.strategies[0];
}

function buildRequestExample(config = API_REQUEST_EXAMPLE_CONFIGS[DEFAULT_EXAMPLE_KEY]) {
  const currentEpisodeContent = getCurrentEpisodeContent();
  const placementEpisode = getEpisode(config.placementEpisodeCode);
  const strategy = selectExampleStrategy(placementEpisode.code, config.strategyId);
  const policy = getPolicyPool().find((candidate) => candidate.id === strategy.policyId) ?? getPolicyPool()[0];
  const placementConfig = getPlacementConfig(strategy.placementConfigId);
  const evaluationProfile = getEvaluationProfile(placementConfig.evaluationProfileId);
  const reflectionChoices = getReflectionChoices(placementEpisode.code);
  const reflectionChoice = reflectionChoices.find((choice) => choice.id === 'budget_balance')
    ?? reflectionChoices[0]
    ?? currentEpisodeContent.reflectionChoices[0];
  const placementBuilding = placementConfig.buildings.find((building) => building.id === config.placementBuildingId)
    ?? placementConfig.buildings[0];

  return {
    schema_version: API_SCHEMA_VERSION,
    episode_id: CURRENT_EPISODE.id,
    episode_context: {
      current: serializeEpisode(CURRENT_EPISODE),
      placement: serializeEpisode(placementEpisode),
    },
    completed: true,
    summary: {
      outcome_type: config.outcomeType,
      outcome_message: config.outcomeMessage,
      priority_issue: null,
      selected_policy_name: policy.name,
      selected_strategy_title: strategy.title,
      placement_context: {
        placement_config_id: placementConfig.id,
        placement_config_title: placementConfig.title,
        required_placements: placementConfig.requiredPlacements,
        evaluation_profile_id: evaluationProfile.id,
      },
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
        question_id: currentEpisodeContent.causeQuestion.id,
        selected: currentEpisodeContent.causeQuestion.choices.find((choice) => choice.correct)?.id ?? null,
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
    final_state: config.finalState,
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

const requestExamples = Object.fromEntries(
  Object.entries(API_REQUEST_EXAMPLE_CONFIGS).map(([key, config]) => [key, buildRequestExample(config)]),
);
const requestExample = requestExamples[DEFAULT_EXAMPLE_KEY];

export const API_CONTRACT = {
  method: 'POST',
  endpoint: API_ENDPOINT,
  contentType: API_CONTENT_TYPE,
  schemaVersion: API_SCHEMA_VERSION,
  requestExample,
  requestExamples,
  successResponseExample: buildSuccessResponseExample(requestExample),
  errorResponseExample: {
    error: 'validation_error',
    fields: {
      episode_id: ['This field is required.'],
      placements: ['At least one placement is required.'],
    },
  },
};

export function formatContractRequest(exampleKey = DEFAULT_EXAMPLE_KEY) {
  const example = API_CONTRACT.requestExamples[exampleKey] ?? API_CONTRACT.requestExample;
  return `${API_CONTRACT.method} ${API_CONTRACT.endpoint}\nContent-Type: ${API_CONTRACT.contentType}\n\n${JSON.stringify(example, null, 2)}`;
}

export function formatContractResponse(exampleKey = DEFAULT_EXAMPLE_KEY) {
  const requestExample = API_CONTRACT.requestExamples[exampleKey] ?? API_CONTRACT.requestExample;
  const successResponseExample = buildSuccessResponseExample(requestExample);
  return `201 Created\n${JSON.stringify(successResponseExample, null, 2)}\n\n400 Bad Request\n${JSON.stringify(API_CONTRACT.errorResponseExample, null, 2)}`;
}
