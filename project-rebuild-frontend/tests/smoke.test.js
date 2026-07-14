import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import GameState from '../src/systems/GameState.js';
import IssueDetector from '../src/systems/IssueDetector.js';
import SideEffectViewManager from '../src/systems/SideEffectViewManager.js';
import EvaluationManager from '../src/systems/EvaluationManager.js';
import EndingSummaryManager from '../src/systems/EndingSummaryManager.js';
import LearningProgress from '../src/systems/LearningProgress.js';
import CauseQuizManager from '../src/systems/CauseQuizManager.js';
import SelectionViewManager from '../src/systems/SelectionViewManager.js';
import ProblemSummaryViewManager from '../src/systems/ProblemSummaryViewManager.js';
import ExplorationViewManager from '../src/systems/ExplorationViewManager.js';
import DataBriefingViewManager from '../src/systems/DataBriefingViewManager.js';
import ReflectionViewManager from '../src/systems/ReflectionViewManager.js';
import TitleViewManager from '../src/systems/TitleViewManager.js';
import ApiContractViewManager from '../src/systems/ApiContractViewManager.js';
import LearningDataManager from '../src/systems/LearningDataManager.js';
import LearningDataViewManager from '../src/systems/LearningDataViewManager.js';
import TeacherReportManager from '../src/systems/TeacherReportManager.js';
import LearningDataRestoreManager from '../src/systems/LearningDataRestoreManager.js';
import LearningApiPayloadManager from '../src/systems/LearningApiPayloadManager.js';
import ApiPayloadViewManager from '../src/systems/ApiPayloadViewManager.js';
import MockApiClient, { MOCK_SUBMISSION_LOG_STORAGE_KEY } from '../src/systems/MockApiClient.js';
import MockSubmissionLogViewManager from '../src/systems/MockSubmissionLogViewManager.js';
import PlacementSystem from '../src/systems/PlacementSystem.js';
import SaveManager, { LEARNING_SAVE_STORAGE_KEY } from '../src/systems/SaveManager.js';
import SavedDataViewManager from '../src/systems/SavedDataViewManager.js';
import StorageSummaryManager from '../src/systems/StorageSummaryManager.js';
import { buildings } from '../src/data/buildings.js';
import { policies } from '../src/data/policies.js';
import { explorationPlaces } from '../src/data/explorationPlaces.js';
import { mapData } from '../src/data/mapData.js';
import { ISSUE_THRESHOLDS, REACTION_THRESHOLDS, RESULT_THRESHOLDS, SCORE_RULES } from '../src/data/evaluationRules.js';
import { API_CONTRACT, formatContractRequest, formatContractResponse } from '../src/data/apiContract.js';
import { CURRENT_EPISODE, EPISODE_STEPS } from '../src/data/episodes.js';
import { EP1_CAUSE_QUESTION, EP1_CORE_CAUSE_SUMMARY, EP1_CORE_CONCEPT, EP1_DATA_CARDS, EP1_EXPLORATION_CLUES, EP1_NEXT_DEVELOPMENT_GOALS, EP1_NEXT_MISSION, EP1_PROBLEM_ITEMS, EP1_REFLECTION_CHOICES } from '../src/data/episodeContent.js';


const PROJECT_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC_DIR = join(PROJECT_ROOT, 'src');
const SCENES_DIR = join(SRC_DIR, 'scenes');

function readProjectFile(...parts) {
  return readFileSync(join(PROJECT_ROOT, ...parts), 'utf8');
}

function createMemoryRegistry() {
  const values = new Map();
  return {
    get: (key) => values.get(key),
    set: (key, value) => values.set(key, value),
  };
}

function cloneMapData(source) {
  return {
    ...source,
    tiles: source.tiles.map((row) => row.map((tile) => ({ ...tile, occupied: false }))),
  };
}

function installLocalStorageMock() {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
  };
  return store;
}

function createCompleteLearningData(overrides = {}) {
  return {
    episode: 1,
    exploredPlaces: ['school', 'market', 'bus_stop'],
    dataViewed: true,
    quizResult: { questionId: 'ep1_q1', selected: 'lack_jobs_services', correct: true },
    problemSummaryCompleted: true,
    selectedPolicy: { id: 'green_recovery', name: '녹색 회복 계획' },
    placements: [
      { buildingId: 'small_park', buildingName: '작은 공원', position: { x: 6, y: 1 }, effect: { environment: 12 } },
    ],
    gameState: GameState.createInitialState(),
    reflectionChoice: { id: 'environment', title: '환경 보완' },
    completed: true,
    ...overrides,
  };
}


function testEpisodeMetadata() {
  assert.equal(CURRENT_EPISODE.id, 1);
  assert.equal(CURRENT_EPISODE.regionName, '푸른군');
  assert.equal(CURRENT_EPISODE.requiredExploredCount, 3);
  assert.ok(CURRENT_EPISODE.intro.length >= 3, 'episode intro should provide story lines');
  assert.deepEqual(EPISODE_STEPS.map((step) => step.key), [
    'exploration',
    'data',
    'quiz',
    'summary',
    'selection',
    'placement',
    'result',
    'ending',
  ]);
  assert.equal(new Set(EPISODE_STEPS.map((step) => step.key)).size, EPISODE_STEPS.length, 'step keys should be unique');
}



function testCauseQuizManager() {
  const correctChoice = EP1_CAUSE_QUESTION.choices.find((choice) => choice.correct);
  const wrongChoice = EP1_CAUSE_QUESTION.choices.find((choice) => !choice.correct);

  assert.deepEqual(CauseQuizManager.buildQuizResult(EP1_CAUSE_QUESTION, correctChoice), {
    questionId: EP1_CAUSE_QUESTION.id,
    selected: correctChoice.id,
    correct: true,
  });
  assert.match(CauseQuizManager.formatFeedback(correctChoice), /정답입니다/);
  assert.match(CauseQuizManager.formatFeedback(wrongChoice), /다시 생각해 볼 수 있습니다/);
  assert.equal(CauseQuizManager.getFeedbackColor(correctChoice), '#166534');
  assert.equal(CauseQuizManager.getFeedbackColor(wrongChoice), '#991b1b');
  assert.equal(CauseQuizManager.getSelectedStrokeColor(correctChoice), 0x22c55e);
  assert.equal(CauseQuizManager.getSelectedStrokeColor(wrongChoice), 0xef4444);
}

function testSelectionViewManager() {
  const selectedPolicy = policies[0];
  const otherPolicy = policies[1];

  assert.match(SelectionViewManager.formatDetailText(selectedPolicy), new RegExp(`선택됨: ${selectedPolicy.name}`));
  assert.match(SelectionViewManager.formatDetailText(selectedPolicy), /건물 3개를 배치/);
  assert.deepEqual(SelectionViewManager.formatDetailRows(null), [
    '선택된 회복 방향이 없습니다.',
    '',
    '회복 방향을 선택한 뒤 배치 연습을 시작하세요.',
  ]);
  assert.equal(SelectionViewManager.formatFocusText(selectedPolicy), `중점 지표: ${selectedPolicy.focus.join(' · ')}`);
  assert.equal(SelectionViewManager.formatRecommendedBuildings(selectedPolicy), `추천 시설: ${selectedPolicy.recommendedBuildings.join(', ')}`);

  assert.deepEqual(SelectionViewManager.getCardStyle(selectedPolicy.id, selectedPolicy), {
    selected: true,
    strokeWidth: 7,
    strokeColor: 0xfde68a,
    fillColor: 0x1e293b,
    fillAlpha: 0.96,
  });
  assert.deepEqual(SelectionViewManager.getCardStyle(otherPolicy.id, selectedPolicy), {
    selected: false,
    strokeWidth: 4,
    strokeColor: 0x475569,
    fillColor: 0x0f172a,
    fillAlpha: 0.96,
  });
}

function testProblemSummaryViewManager() {
  const exploredPlaceIds = ['school', 'bus_stop', 'unknown_place'];
  assert.equal(ProblemSummaryViewManager.formatExploredNames(explorationPlaces, exploredPlaceIds), '초등학교, 버스정류장');
  assert.equal(ProblemSummaryViewManager.formatExploredNames(explorationPlaces, []), '없음');
  assert.equal(ProblemSummaryViewManager.formatQuizStatus(null), '미응답');
  assert.equal(ProblemSummaryViewManager.formatQuizStatus({ correct: true }), '정답');
  assert.equal(ProblemSummaryViewManager.formatQuizStatus({ correct: false }), '오답 후 피드백 확인');

  const text = ProblemSummaryViewManager.formatLearningRecordText(
    explorationPlaces,
    exploredPlaceIds,
    { correct: false },
    EP1_CORE_CAUSE_SUMMARY,
  );
  assert.match(text, /탐색한 장소: 3곳/);
  assert.match(text, /초등학교, 버스정류장/);
  assert.match(text, /원인 질문: 오답 후 피드백 확인/);
  assert.match(text, new RegExp(EP1_CORE_CAUSE_SUMMARY));

  assert.deepEqual(ProblemSummaryViewManager.getProblemItemLayout(0), { col: 0, row: 0, x: 210, y: 315 });
  assert.deepEqual(ProblemSummaryViewManager.getProblemItemLayout(3), { col: 1, row: 1, x: 730, y: 475 });
}

function testExplorationViewManager() {
  const school = explorationPlaces.find((place) => place.id === 'school');

  assert.equal(ExplorationViewManager.canContinue(2, 3), false);
  assert.equal(ExplorationViewManager.canContinue(3, 3), true);
  assert.equal(ExplorationViewManager.formatPanelTitle(school), '🏫 초등학교');
  assert.match(ExplorationViewManager.formatPanelBody(school), /확인한 문제/);
  assert.match(ExplorationViewManager.formatPanelBody(school), /자료 카드/);
  assert.match(ExplorationViewManager.formatPanelBody(school), /학습 개념/);
  assert.match(ExplorationViewManager.formatProgressText(2, 5, 3), /1곳 더 탐색|장소를 더 클릭/);
  assert.match(ExplorationViewManager.formatProgressText(3, 5, 3), /다음 단계로 이동/);
  assert.match(ExplorationViewManager.formatNeedMoreText(1, 5, 3), /최소 3곳/);
  assert.deepEqual(ExplorationViewManager.getNextButtonState(2, 3), {
    canContinue: false,
    label: '1곳 더 탐색',
    backgroundColor: '#94a3b8',
  });
  assert.deepEqual(ExplorationViewManager.getNextButtonState(3, 3), {
    canContinue: true,
    label: '자료 확인',
    backgroundColor: '#bbf7d0',
  });
  assert.deepEqual(ExplorationViewManager.getMarkerStyle('school', 'school'), {
    selected: true,
    strokeWidth: 8,
    strokeColor: 0xfde68a,
  });
  assert.deepEqual(ExplorationViewManager.getMarkerStyle('market', 'school'), {
    selected: false,
    strokeWidth: 5,
    strokeColor: 0xffffff,
  });
}

function testDataBriefingViewManager() {
  assert.deepEqual(DataBriefingViewManager.getCardPosition(0), { x: 390, y: 500 });
  assert.deepEqual(DataBriefingViewManager.getCardPosition(2), { x: 1530, y: 500 });
  assert.equal(DataBriefingViewManager.formatSubtitle(CURRENT_EPISODE.regionName), '탐색에서 본 푸른군 문제를 숫자 자료로 다시 확인합니다.');
  assert.equal(DataBriefingViewManager.formatBarValue({ value: 4200 }), '4,200명');
  assert.equal(DataBriefingViewManager.formatBarValue({ value: 39, suffix: '%' }), '39%');

  assert.deepEqual(DataBriefingViewManager.getBarLayout({ value: 4200, max: 8000 }, 390, 500, 1), {
    x: 370,
    y: 530,
    backgroundWidth: 340,
    width: 173,
    height: 38,
  });
  assert.equal(DataBriefingViewManager.getBarLayout({ value: 1, max: 8000 }, 390, 500, 0).width, 24);
  assert.equal(DataBriefingViewManager.validateCards(EP1_DATA_CARDS).every((row) => row.ok), true);
  assert.equal(DataBriefingViewManager.validateCards([{ id: 'broken', bars: [] }])[0].ok, false);
}

function testReflectionViewManager() {
  const selectedChoice = EP1_REFLECTION_CHOICES[0];
  const otherChoice = EP1_REFLECTION_CHOICES[1];

  assert.deepEqual(ReflectionViewManager.getChoiceCardPosition(0), { col: 0, row: 0, x: 610, y: 385 });
  assert.deepEqual(ReflectionViewManager.getChoiceCardPosition(3), { col: 1, row: 1, x: 1310, y: 635 });
  assert.equal(ReflectionViewManager.formatInitialFeedback(), '하나를 선택하면 학습 기록에 저장됩니다.');
  assert.match(ReflectionViewManager.formatSelectedFeedback(selectedChoice), new RegExp(`선택됨: ${selectedChoice.title}`));
  assert.match(ReflectionViewManager.formatSelectedFeedback(selectedChoice), new RegExp(selectedChoice.description));
  assert.equal(ReflectionViewManager.formatMissingChoiceFeedback(), '학습 기록에 남길 보완 방향을 하나 선택하세요.');
  assert.deepEqual(ReflectionViewManager.getFeedbackStyle('initial'), { color: '#e0f2fe' });
  assert.deepEqual(ReflectionViewManager.getFeedbackStyle('selected'), { color: '#bbf7d0' });
  assert.deepEqual(ReflectionViewManager.getFeedbackStyle('missing'), { color: '#fecaca' });
  assert.deepEqual(ReflectionViewManager.getChoiceCardStyle(selectedChoice.id, selectedChoice), {
    selected: true,
    strokeWidth: 7,
    strokeColor: 0xfde68a,
    fillColor: 0x1e293b,
    fillAlpha: 0.96,
  });
  assert.deepEqual(ReflectionViewManager.getChoiceCardStyle(otherChoice.id, selectedChoice), {
    selected: false,
    strokeWidth: 4,
    strokeColor: 0x475569,
    fillColor: 0x0f172a,
    fillAlpha: 0.96,
  });
}

function testTitleViewManager() {
  assert.deepEqual(TitleViewManager.getLayout(false), {
    startButtonY: 620,
    loadButtonY: null,
    importButtonY: 745,
    storageButtonY: 820,
    importStatusY: 885,
  });
  assert.deepEqual(TitleViewManager.getLayout(true), {
    startButtonY: 620,
    loadButtonY: 745,
    importButtonY: 835,
    storageButtonY: 910,
    importStatusY: 975,
  });
  assert.equal(TitleViewManager.formatImportError(new Error('bad json')), 'bad json');
  assert.equal(TitleViewManager.formatImportError(null), 'JSON 가져오기에 실패했습니다.');
  assert.equal(TitleViewManager.getPrimaryButtonStyle().backgroundColor, '#a7f3d0');
  assert.equal(TitleViewManager.getSecondaryButtonStyle().backgroundColor, '#bfdbfe');
  assert.equal(TitleViewManager.getStorageButtonStyle().backgroundColor, '#334155');
  assert.equal(TitleViewManager.getLoadButtonStyle().backgroundColor, '#1e293b');
}

function testApiContractViewManager() {
  const panels = ApiContractViewManager.getPanelLayout();
  assert.equal(panels.request.title, '요청 Body 초안');
  assert.equal(panels.response.width, 620);
  assert.deepEqual(ApiContractViewManager.getPanelTitlePosition(panels.request), { x: 185, y: 227 });
  assert.deepEqual(ApiContractViewManager.getPanelBodyPosition(panels.request), { x: 185, y: 280 });
  assert.equal(ApiContractViewManager.getPanelBodyStyle(panels.request).wordWrap.width, 790);
  assert.equal(ApiContractViewManager.getNotesLayout().body.width, 1200);
  assert.match(ApiContractViewManager.formatBackendNote(), /서버에서 추가/);
  assert.deepEqual(ApiContractViewManager.getControlLayout().payload, {
    x: 650,
    y: 960,
    label: 'Payload 미리보기',
    target: 'ApiPayloadScene',
  });
}

function testEpisodeContent() {
  assert.equal(EP1_DATA_CARDS.length, 3, 'EP1 should expose three data cards');
  assert.equal(new Set(EP1_DATA_CARDS.map((card) => card.id)).size, EP1_DATA_CARDS.length, 'data card ids should be unique');
  for (const card of EP1_DATA_CARDS) {
    assert.ok(card.title, 'data card should have a title');
    assert.ok(card.takeaway, 'data card should have a takeaway');
    assert.ok(card.bars.length >= 2, 'data card should compare at least two values');
    for (const bar of card.bars) {
      assert.ok(Number.isFinite(bar.value), 'data card bar value should be numeric');
      assert.ok(Number.isFinite(bar.max) && bar.max > 0, 'data card bar max should be positive');
      assert.ok(bar.value <= bar.max, 'data card bar value should not exceed max');
    }
  }

  assert.ok(EP1_CORE_CONCEPT.includes('인구 감소'));
  assert.ok(EP1_EXPLORATION_CLUES.length >= CURRENT_EPISODE.requiredExploredCount);
  assert.equal(EP1_CAUSE_QUESTION.id, 'ep1_q1_population_decline_reason');
  assert.equal(EP1_CAUSE_QUESTION.choices.filter((choice) => choice.correct).length, 1, 'cause question should have exactly one correct choice');
  assert.equal(new Set(EP1_CAUSE_QUESTION.choices.map((choice) => choice.id)).size, EP1_CAUSE_QUESTION.choices.length, 'quiz choice ids should be unique');
  assert.equal(EP1_PROBLEM_ITEMS.length, 6, 'EP1 should expose six problem summary items');
  assert.equal(new Set(EP1_PROBLEM_ITEMS.map((item) => item.id)).size, EP1_PROBLEM_ITEMS.length, 'problem item ids should be unique');
  assert.ok(EP1_PROBLEM_ITEMS.every((item) => item.title && item.detail && item.icon), 'problem items should have title/detail/icon');
  assert.ok(EP1_CORE_CAUSE_SUMMARY.includes('인구 유출'));
  assert.ok(EP1_NEXT_MISSION.length >= 3, 'next mission should provide guidance lines');
  assert.ok(EP1_NEXT_DEVELOPMENT_GOALS.length >= 5, 'ending next development goals should provide visible guidance lines');
  assert.ok(EP1_NEXT_DEVELOPMENT_GOALS.some((line) => line.includes('EP2')), 'ending next development goals should mention EP2 connection');
  assert.equal(EP1_REFLECTION_CHOICES.length, 4, 'EP1 should expose four reflection choices');
  assert.equal(new Set(EP1_REFLECTION_CHOICES.map((choice) => choice.id)).size, EP1_REFLECTION_CHOICES.length, 'reflection choice ids should be unique');
  assert.ok(EP1_REFLECTION_CHOICES.every((choice) => choice.title && choice.icon && choice.description && Number.isFinite(choice.color)), 'reflection choices should have title/icon/description/color');
}


function testEvaluationRuleConstants() {
  assert.equal(ISSUE_THRESHOLDS.environmentMin, 60);
  assert.equal(ISSUE_THRESHOLDS.pollutionMax, 15);
  assert.equal(ISSUE_THRESHOLDS.trafficMax, 12);
  assert.equal(ISSUE_THRESHOLDS.budgetMin, 500);
  assert.equal(ISSUE_THRESHOLDS.satisfactionMin, 70);

  assert.equal(RESULT_THRESHOLDS.populationImproved, 1100);
  assert.equal(RESULT_THRESHOLDS.economyImproved, 60);
  assert.equal(RESULT_THRESHOLDS.environmentGood, 70);
  assert.equal(RESULT_THRESHOLDS.satisfactionBalanced, 70);
  assert.equal(RESULT_THRESHOLDS.satisfactionHigh, 75);
  assert.equal(RESULT_THRESHOLDS.budgetSafe, 500);
  assert.equal(RESULT_THRESHOLDS.balancedScore, 75);
  assert.equal(RESULT_THRESHOLDS.recoveryScore, 60);
  assert.equal(RESULT_THRESHOLDS.balancedMinimumBuildingTypes, 2);

  assert.equal(SCORE_RULES.maxPartScore, 20);
  assert.equal(SCORE_RULES.populationBase, 1000);
  assert.equal(SCORE_RULES.economyBase, 50);
  assert.equal(SCORE_RULES.environmentBase, 60);
  assert.equal(SCORE_RULES.satisfactionBase, 60);
  assert.equal(REACTION_THRESHOLDS.satisfactionHigh, 85);
  assert.equal(REACTION_THRESHOLDS.satisfactionModerate, 70);
  assert.equal(REACTION_THRESHOLDS.trafficComfortable, 7);
}


function createPlacementRecord(buildingId, position = { x: 1, y: 1 }) {
  const building = buildings.find((item) => item.id === buildingId);
  return { building, position, delta: building.effect };
}

function testEvaluationManager() {
  const placedBuildings = [
    createPlacementRecord('youth_center'),
    createPlacementRecord('bus_station', { x: 3, y: 2 }),
    createPlacementRecord('small_park', { x: 6, y: 1 }),
  ];
  const finalState = placedBuildings.reduce(
    (state, record) => GameState.applyEffect(state, record.delta),
    GameState.createInitialState(),
  );

  assert.equal(EvaluationManager.calculateScore(GameState.createInitialState()), 40, 'initial state score should remain documented baseline');
  const evaluation = EvaluationManager.evaluateState(finalState, placedBuildings);
  assert.equal(evaluation.score, 92);
  assert.equal(evaluation.title, '균형 있는 회복 가능성이 보입니다');

  const youthPolicy = policies.find((policy) => policy.id === 'youth_living_support');
  assert.equal(EvaluationManager.calculatePolicyAlignment(youthPolicy, placedBuildings).label, '방향 일치: 2/3개');
  assert.equal(EvaluationManager.calculatePolicyAlignment(null, placedBuildings).label, '방향 일치: 기준 없음');

  const totals = EvaluationManager.calculateEffectTotals(placedBuildings);
  assert.deepEqual(totals, {
    population: 120,
    economy: 10,
    satisfaction: 36,
    budget: -440,
    traffic: -3,
    environment: 12,
    pollution: -4,
  });
  assert.equal(EvaluationManager.getChoiceTrendMessage(totals, placedBuildings), '경향: 생활·환경을 함께 고려했습니다.');
  assert.ok(EvaluationManager.getTopEffectRows(totals)[0].includes('예산'), 'largest absolute effect should be shown first');
  const trendRows = EvaluationManager.formatChoiceTrendRows(placedBuildings);
  assert.match(trendRows, /누적 효과 상위:/);
  assert.match(trendRows, /선택 유형 수: 3종/);
  assert.match(trendRows, /최근 배치:/);
  assert.equal(EvaluationManager.formatChoiceTrendRows([]), '배치 없음');
  assert.match(EvaluationManager.formatResidentReactions(finalState, placedBuildings), /생활이 더 편리/);
  assert.match(EvaluationManager.formatResidentReactions(finalState, [createPlacementRecord('bus_station')]), /이동이 쉬워지면/);
  assert.match(EvaluationManager.formatResidentReactions({ ...finalState, traffic: 10 }, [createPlacementRecord('small_park')]), /쉴 수 있는 공간/);
  assert.match(EvaluationManager.formatBeforeAfterRows({ before: GameState.createInitialState(), after: finalState }, finalState), /인구: 1000 → 1120 \(\+120\)/);
  assert.deepEqual(EvaluationManager.formatJudgementRows(finalState), [
    '• 인구 변화: 증가 확인',
    '• 경제 수준: 개선됨',
    '• 환경 상태: 양호',
    '• 주민 만족도: 높아짐',
    '• 예산: 여유 있음',
  ]);
  const evaluationRows = EvaluationManager.formatEvaluationRows(evaluation, finalState, placedBuildings, youthPolicy);
  assert.match(evaluationRows, /선택 방향: 청년 생활 지원/);
  assert.match(evaluationRows, /방향 일치: 2\/3개/);
  assert.match(evaluationRows, /균형 점수: 92\/100/);
  assert.match(evaluationRows, /주의 신호:/);
  assert.match(evaluationRows, /학습 포인트:/);
  assert.deepEqual(EvaluationManager.formatIssueRows(finalState), ['• 현재 큰 부작용 신호는 없습니다.']);
}


function testSideEffectViewManager() {
  assert.match(SideEffectViewManager.formatEmptyIssueMessage(), /현재 큰 부작용 신호는 없습니다/);
  assert.deepEqual(SideEffectViewManager.formatHintRows([]), [
    '• 균형 확인',
    '현재는 큰 부작용 신호가 없지만, 인구·경제·환경·만족도를 함께 확인하는 습관이 중요합니다.',
    '대응: 다음 미션에서는 더 많은 정책 조합을 비교합니다.',
  ]);

  const issues = IssueDetector.detect({ ...GameState.createInitialState(), budget: 400, satisfaction: 50 });
  const rows = SideEffectViewManager.formatHintRows(issues);
  assert.ok(rows.includes('• 예산 부족'));
  assert.ok(rows.includes('• 만족도 보완'));
  assert.match(SideEffectViewManager.formatHintText(issues), /대응:/);
}

function testGameStateAndIssues() {
  const initial = GameState.createInitialState();
  const next = GameState.applyEffect(initial, { population: 80, budget: -600, satisfaction: 5 });

  assert.equal(initial.population, 1000, 'initial state must stay immutable after applyEffect');
  assert.equal(next.population, 1080);
  assert.equal(next.budget, 400);

  const issues = IssueDetector.detect(next).map((issue) => issue.id);
  assert.deepEqual(issues, ['budget', 'satisfaction']);
}

function testLearningProgress() {
  const registry = createMemoryRegistry();

  LearningProgress.update(registry, { dataViewed: true });
  LearningProgress.addExploredPlace(registry, 'school');
  LearningProgress.addExploredPlace(registry, 'school');
  LearningProgress.addExploredPlace(registry, 'market');
  LearningProgress.addPlacedBuilding(registry, 'youth_center');

  const progress = LearningProgress.get(registry);
  assert.equal(progress.dataViewed, true);
  assert.deepEqual(progress.exploredPlaces, ['school', 'market'], 'explored places should be unique');
  assert.deepEqual(progress.placedBuildingIds, ['youth_center']);
}



function testBuildingData() {
  assert.equal(buildings.length, 3, 'EP1 placement prototype should expose three sample buildings');
  assert.equal(new Set(buildings.map((building) => building.id)).size, buildings.length, 'building ids should be unique');
  assert.equal(new Set(buildings.map((building) => building.name)).size, buildings.length, 'building names should be unique for display');

  for (const building of buildings) {
    assert.ok(building.id && building.name && building.description, 'building should have visible identity fields');
    assert.ok(Number.isFinite(building.cost) && building.cost > 0, `${building.id} should have a positive cost`);
    assert.ok(Number.isFinite(building.color), `${building.id} should have a numeric placeholder color`);
    assert.ok(Number.isInteger(building.footprint.width) && building.footprint.width > 0, `${building.id} footprint width should be positive integer`);
    assert.ok(Number.isInteger(building.footprint.height) && building.footprint.height > 0, `${building.id} footprint height should be positive integer`);
    assert.ok(Array.isArray(building.allowedZones) && building.allowedZones.length > 0, `${building.id} should declare allowed zones`);
    assert.ok(building.effect && typeof building.effect === 'object', `${building.id} should declare state effects`);
    assert.equal(building.effect.budget, -building.cost, `${building.id} budget effect should match negative cost`);
    assert.ok(Object.values(building.effect).every(Number.isFinite), `${building.id} effects should be numeric`);
  }

  const busStation = buildings.find((building) => building.id === 'bus_station');
  const smallPark = buildings.find((building) => building.id === 'small_park');
  assert.equal(busStation.requiresAdjacentType, 'road', 'bus station should keep road adjacency rule');
  assert.deepEqual(smallPark.requiresAdjacentAnyType, ['forest', 'river'], 'small park should keep nature adjacency rule');
}

function testPolicyData() {
  assert.equal(policies.length, 3, 'EP1 should expose three recovery policies');
  assert.equal(new Set(policies.map((policy) => policy.id)).size, policies.length, 'policy ids should be unique');
  const buildingIds = new Set(buildings.map((building) => building.id));
  const buildingNames = new Set(buildings.map((building) => building.name));

  for (const policy of policies) {
    assert.ok(policy.name && policy.tagline && policy.description, 'policy should have visible copy');
    assert.ok(policy.focus.length >= 2, 'policy should declare at least two focus indicators');
    assert.ok(policy.recommendedBuildingIds.length >= 2, 'policy should recommend at least two building ids');
    assert.equal(policy.recommendedBuildings.length, policy.recommendedBuildingIds.length, 'recommended names should be derived for every id');
    for (const buildingId of policy.recommendedBuildingIds) {
      assert.ok(buildingIds.has(buildingId), `policy ${policy.id} references unknown building id ${buildingId}`);
    }
    for (const buildingName of policy.recommendedBuildings) {
      assert.ok(buildingNames.has(buildingName), `policy ${policy.id} references unknown building name ${buildingName}`);
    }
  }
}


function testPolicyRecommendationMatchingUsesIds() {
  const greenPolicy = policies.find((policy) => policy.id === 'green_recovery');
  const renamedPark = { ...buildings.find((building) => building.id === 'small_park'), name: '이름이 바뀐 공원' };
  const youthCenter = buildings.find((building) => building.id === 'youth_center');
  const recommendedIds = new Set(greenPolicy.recommendedBuildingIds);

  assert.equal(recommendedIds.has(renamedPark.id), true, 'policy recommendation matching should survive building display-name changes');
  assert.equal(recommendedIds.has(youthCenter.id), true);
  assert.equal(greenPolicy.recommendedBuildings.includes(renamedPark.name), false, 'legacy name matching would fail after display-name changes');
}


function testMapData() {
  assert.equal(mapData.width, 12);
  assert.equal(mapData.height, 10);
  assert.equal(mapData.tiles.length, mapData.height, 'map should have one row per height');
  assert.ok(mapData.tiles.every((row) => row.length === mapData.width), 'every map row should match width');
  assert.equal(mapData.tileWidth, 96);
  assert.equal(mapData.tileHeight, 48);

  const counts = mapData.tiles.flat().reduce((acc, tile) => {
    acc[tile.type] = (acc[tile.type] ?? 0) + 1;
    return acc;
  }, {});
  assert.ok(counts.empty > 0, 'map should include buildable empty tiles');
  assert.ok(counts.road > 0, 'map should include road tiles for bus station adjacency');
  assert.ok(counts.river > 0, 'map should include river tiles for park adjacency');
  assert.ok(counts.forest > 0, 'map should include forest border tiles');

  for (let y = 0; y < mapData.height; y += 1) {
    for (let x = 0; x < mapData.width; x += 1) {
      const tile = mapData.tiles[y][x];
      assert.equal(tile.occupied, false, 'source map data should start unoccupied');
      assert.ok(['empty', 'forest', 'road', 'river'].includes(tile.type), `unexpected tile type at ${x},${y}`);
      assert.ok(['center', 'outskirts', 'nature', 'traffic'].includes(tile.zone), `unexpected zone at ${x},${y}`);
      if (x === 0 || y === 0 || x === mapData.width - 1 || y === mapData.height - 1) {
        assert.equal(tile.type, 'forest', `map border should stay forest at ${x},${y}`);
        assert.equal(tile.buildable, false, `map border should stay non-buildable at ${x},${y}`);
      }
      if (tile.type === 'empty') {
        assert.equal(tile.buildable, true, `empty tile should be buildable at ${x},${y}`);
      } else {
        assert.equal(tile.buildable, false, `${tile.type} tile should be non-buildable at ${x},${y}`);
      }
    }
  }

  assert.equal(mapData.tiles[2][5].type, 'road', 'known road anchor should stay in place');
  assert.equal(mapData.tiles[1][9].type, 'river', 'known river anchor should stay in place');
  assert.equal(mapData.tiles[1][1].zone, 'center', 'known center buildable tile should stay in place');
  assert.equal(mapData.tiles[6][1].zone, 'outskirts', 'known outskirts buildable tile should stay in place');
}

function testPlacementRules() {
  const placementSystem = new PlacementSystem(cloneMapData(mapData));
  const youthCenter = buildings.find((building) => building.id === 'youth_center');
  const busStation = buildings.find((building) => building.id === 'bus_station');
  const smallPark = buildings.find((building) => building.id === 'small_park');

  assert.equal(placementSystem.validatePlacement(1, 1, youthCenter).valid, true, 'youth center should be placeable on empty center tile');
  assert.equal(placementSystem.validatePlacement(1, 1, busStation).valid, false, 'bus station needs road adjacency');
  assert.equal(placementSystem.validatePlacement(3, 2, busStation).valid, true, 'bus station should be valid next to road');
  assert.equal(placementSystem.validatePlacement(6, 1, smallPark).valid, true, 'park should be valid next to river area');

  placementSystem.place(1, 1, youthCenter);
  assert.equal(placementSystem.validatePlacement(1, 1, youthCenter).valid, false, 'occupied footprint should block later placement');
}



function testEndingSummaryManager() {
  const placedBuildings = [
    createPlacementRecord('youth_center'),
    createPlacementRecord('bus_station', { x: 3, y: 2 }),
    createPlacementRecord('small_park', { x: 6, y: 1 }),
  ];
  const finalState = placedBuildings.reduce(
    (state, record) => GameState.applyEffect(state, record.delta),
    GameState.createInitialState(),
  );
  const selectedPolicy = policies.find((policy) => policy.id === 'youth_living_support');
  const ending = EndingSummaryManager.getEndingSummary(finalState, placedBuildings);

  assert.equal(ending.title, '균형형 회복안');
  assert.match(EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings), /선택 방향: 청년 생활 지원/);
  assert.match(EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings), /배치한 시설: 3개/);
  assert.match(EndingSummaryManager.formatStateSummary(finalState, ending), /최종 상태:/);
  assert.match(EndingSummaryManager.formatStateSummary(finalState, ending), /큰 부작용 신호 없음/);

  const progress = {
    ...LearningProgress.createInitialProgress(),
    exploredPlaces: ['school', 'market', 'bus_stop'],
    dataViewed: true,
    problemSummaryCompleted: true,
    placedBuildingIds: placedBuildings.map((record) => record.building.id),
    completed: true,
  };
  const rows = EndingSummaryManager.formatLearningRecordRows(
    progress,
    ['school', 'market', 'bus_stop'],
    { selected: 'lack_jobs_services', correct: true },
    { id: 'budget_balance', title: '예산 균형 보완' },
  );
  assert.equal(rows.length, 4);
  assert.match(rows[0], /탐색: 3\/5곳 확인/);
  assert.match(rows[2], /원인 질문: 정답/);
  assert.match(rows[3], /생각 정리: 예산 균형 보완/);
}

function testTeacherReportManager() {
  const registry = createMemoryRegistry();
  const placedBuildings = [
    createPlacementRecord('youth_center'),
    createPlacementRecord('bus_station', { x: 3, y: 2 }),
    createPlacementRecord('small_park', { x: 6, y: 1 }),
  ];
  const finalState = placedBuildings.reduce(
    (state, record) => GameState.applyEffect(state, record.delta),
    GameState.createInitialState(),
  );
  const selectedPolicy = policies.find((policy) => policy.id === 'youth_living_support');
  const reflectionChoice = { id: 'budget_balance', title: '예산 균형 보완' };
  const quizResult = { questionId: 'ep1_q1', selected: 'lack_jobs_services', correct: true };

  registry.set('learningProgress', {
    ...LearningProgress.createInitialProgress(),
    exploredPlaces: ['school', 'market', 'bus_stop'],
    dataViewed: true,
    quizResult,
    problemSummaryCompleted: true,
    selectedPolicyId: selectedPolicy.id,
    placedBuildingIds: placedBuildings.map((record) => record.building.id),
    reflectionChoice,
    completed: true,
  });
  registry.set('selectedPolicy', selectedPolicy);
  registry.set('placedBuildings', placedBuildings);
  registry.set('gameState', finalState);
  registry.set('reflectionChoice', reflectionChoice);
  registry.set('quizResult', quizResult);

  const report = TeacherReportManager.build(registry);
  assert.equal(report.exploredNames.length, 3);
  assert.equal(report.selectedPolicy.id, 'youth_living_support');
  assert.equal(report.placedBuildings.length, 3);
  assert.equal(report.issues.length, 0);

  assert.match(TeacherReportManager.formatProgressReport(report), /탐색 장소: 3\/5/);
  assert.match(TeacherReportManager.formatProgressReport(report), /EP1 완료: 예/);
  assert.match(TeacherReportManager.formatChoiceReport(report), /회복 방향: 청년 생활 지원/);
  assert.match(TeacherReportManager.formatChoiceReport(report), /1\. 청년센터/);
  assert.match(TeacherReportManager.formatTeachingPointReport(report), /큰 부작용 신호 없음/);
  assert.match(TeacherReportManager.buildReportText(report), /\[프로젝트 리빌드 EP1 교사용 요약\]/);
}


function testLearningDataViewManager() {
  const completeData = createCompleteLearningData({
    placements: [
      { buildingId: 'youth_center', buildingName: '청년센터', position: { x: 1, y: 1 }, effect: { population: 80, budget: -180 } },
      { buildingId: 'bus_station', buildingName: '버스정류장', position: { x: 3, y: 2 }, effect: { population: 40, budget: -120 } },
      { buildingId: 'small_park', buildingName: '작은 공원', position: { x: 6, y: 1 }, effect: { environment: 12, budget: -140 } },
    ],
  });
  assert.match(LearningDataViewManager.formatJson(completeData), /"episode": 1/);
  const completeSummary = LearningDataViewManager.getValidationSummary(completeData);
  assert.equal(completeSummary.ok, true);
  assert.equal(completeSummary.title, '저장 준비 상태');
  assert.match(LearningDataViewManager.formatValidationRows(completeSummary.rows), /PASS episode 값 확인/);

  const incompleteSummary = LearningDataViewManager.getValidationSummary({ ...completeData, placements: [], completed: false });
  assert.equal(incompleteSummary.ok, false);
  assert.equal(incompleteSummary.title, '검토 필요');
  assert.match(incompleteSummary.body, /배치 기록이 3개 미만입니다/);
  assert.match(incompleteSummary.body, /EP1 완료 플래그가 true가 아닙니다/);

  assert.equal(LearningDataViewManager.formatSavedAt(null), '알 수 없음');
  assert.equal(LearningDataViewManager.formatSavedAt('not-a-date'), 'not-a-date');
  assert.equal(LearningDataViewManager.formatSaveStatus(null), '저장된 학습 데이터가 없습니다.');
  assert.match(LearningDataViewManager.formatSaveStatus({ savedAt: '2026-07-12T10:00:00+09:00' }), /저장됨:/);
}

function testLearningDataManager() {
  const registry = createMemoryRegistry();
  const youthCenter = buildings.find((building) => building.id === 'youth_center');
  const busStation = buildings.find((building) => building.id === 'bus_station');
  const smallPark = buildings.find((building) => building.id === 'small_park');

  registry.set('learningProgress', {
    ...LearningProgress.createInitialProgress(),
    exploredPlaces: ['school', 'market', 'bus_stop'],
    dataViewed: true,
    quizResult: { questionId: 'ep1_q1', selected: 'lack_jobs_services', correct: true },
    problemSummaryCompleted: true,
    selectedPolicyId: 'youth_living_support',
    placedBuildingIds: ['youth_center', 'bus_station', 'small_park'],
    reflectionChoice: { id: 'budget_balance', title: '예산 균형 보완' },
    completed: true,
  });
  registry.set('quizResult', { questionId: 'ep1_q1', selected: 'lack_jobs_services', correct: true });
  registry.set('selectedPolicy', { id: 'youth_living_support', name: '청년 생활 지원' });
  registry.set('gameState', GameState.createInitialState());
  registry.set('reflectionChoice', { id: 'budget_balance', title: '예산 균형 보완' });
  registry.set('placedBuildings', [
    { building: youthCenter, position: { x: 1, y: 1 }, delta: youthCenter.effect },
    { building: busStation, position: { x: 3, y: 2 }, delta: busStation.effect },
    { building: smallPark, position: { x: 6, y: 1 }, delta: smallPark.effect },
  ]);

  const data = LearningDataManager.build(registry);
  assert.equal(data.episode, 1);
  assert.equal(data.exploredPlaceNames.length, 3);
  assert.equal(data.placements.length, 3);
  assert.equal(LearningDataManager.isReadyToSave(data), true);

  const incompleteData = { ...data, reflectionChoice: null };
  assert.equal(LearningDataManager.isReadyToSave(incompleteData), false);
  assert.equal(LearningDataManager.validate(incompleteData).some((row) => !row.ok && row.label === '생각 정리 선택'), true);
}


function testApiPayloadViewManager() {
  const payload = LearningApiPayloadManager.build(createCompleteLearningData());
  assert.match(ApiPayloadViewManager.formatJson(payload), /"schema_version": 1/);
  assert.equal(ApiPayloadViewManager.getPayloadPanelLayout().panel.width, 1120);
  assert.equal(ApiPayloadViewManager.getValidationPanelLayout().rows.wordWrapWidth, 440);
  assert.equal(ApiPayloadViewManager.getSubmissionLogLayout().panel.height, 105);
  assert.deepEqual(ApiPayloadViewManager.getControlLayout().contract, {
    x: 1130,
    y: 960,
    label: 'API 계약',
    target: 'ApiContractScene',
  });
  assert.equal(ApiPayloadViewManager.getPayloadTextStyle(1030).fontFamily, 'monospace');
  assert.equal(ApiPayloadViewManager.formatCopySuccess(), 'API payload를 클립보드에 복사했습니다.');
  assert.match(ApiPayloadViewManager.formatCopyFailure(), /클립보드/);
  assert.equal(ApiPayloadViewManager.formatDownloadSuccess(), 'API payload 다운로드를 시작했습니다.');
  assert.equal(ApiPayloadViewManager.formatDownloadFileName(payload), 'project-rebuild-ep1-api-payload.json');

  const summary = ApiPayloadViewManager.getValidationSummary(payload);
  assert.equal(summary.ok, true);
  assert.equal(summary.warnings.length, 0);
  assert.equal(summary.statusColor, '#166534');
  assert.match(ApiPayloadViewManager.formatValidationRows(summary.rows), /PASS schema_version 확인/);

  const invalidSummary = ApiPayloadViewManager.getValidationSummary({ ...payload, schema_version: 0, placements: null });
  assert.equal(invalidSummary.ok, false);
  assert.equal(invalidSummary.statusColor, '#991b1b');
  assert.match(invalidSummary.statusText, /schema_version이 1이 아닙니다/);

  assert.equal(ApiPayloadViewManager.formatSubmissionLog([]), '아직 제출 로그가 없습니다.');
  assert.match(ApiPayloadViewManager.formatSubmissionLog([{ submittedAt: 'not-a-date' }, { submittedAt: 'older' }]), /최근 제출: not-a-date\n총 로그: 2건/);
  assert.equal(ApiPayloadViewManager.formatSubmitSuccess({ status: 201, data: { id: 'mock-1' } }), 'Mock 제출 성공 (201)\nrecord_id: mock-1');
  assert.equal(ApiPayloadViewManager.formatSubmitFailure({ status: 400, error: 'bad payload' }), 'Mock 제출 실패 (400): bad payload');
}

function testLearningApiPayloadManager() {
  const learningData = createCompleteLearningData();

  const payload = LearningApiPayloadManager.build(learningData);
  assert.equal(payload.schema_version, 1);
  assert.equal(payload.episode_id, 1);
  assert.equal(payload.learning_steps.quiz_result.question_id, 'ep1_q1');
  assert.equal(payload.placements[0].building_id, 'small_park');
  assert.equal(payload.placements[0].order, 1);
  assert.equal(LearningApiPayloadManager.validate(payload).every((row) => row.ok), true);
}


function testMockSubmissionLogViewManager() {
  assert.equal(MockSubmissionLogViewManager.getSummaryPanelLayout().panel.width, 520);
  assert.equal(MockSubmissionLogViewManager.getLogPanelLayout().body.wordWrapWidth, 840);
  assert.deepEqual(MockSubmissionLogViewManager.getControlLayout().api, {
    x: 1300,
    y: 940,
    label: 'API 미리보기',
    target: 'ApiPayloadScene',
  });
  assert.equal(MockSubmissionLogViewManager.getSummaryTextStyle(450).wordWrap.width, 450);
  assert.equal(MockSubmissionLogViewManager.getLogTextStyle(840).fontFamily, 'monospace');
  assert.match(MockSubmissionLogViewManager.formatStatusText(), /localStorage/);
  assert.match(MockSubmissionLogViewManager.formatCopySuccess(), /클립보드/);
  assert.match(MockSubmissionLogViewManager.formatCopyFailure(), /권한/);
  assert.match(MockSubmissionLogViewManager.formatDownloadSuccess(), /다운로드/);
  assert.equal(MockSubmissionLogViewManager.formatDownloadFileName(), 'project-rebuild-mock-submission-log.json');
  assert.equal(MockSubmissionLogViewManager.formatSubmittedAt('not-a-date'), 'not-a-date');
  assert.equal(MockSubmissionLogViewManager.formatLogBody([]), '[]');
  assert.deepEqual(MockSubmissionLogViewManager.formatSummaryRows([]), [
    '아직 Mock 제출 로그가 없습니다.',
    '',
    'API 미리보기 화면에서 Mock 제출을 먼저 실행하세요.',
  ]);

  const submissions = [{
    id: 'mock-1',
    submittedAt: '2026-07-12T10:00:00+09:00',
    method: 'POST',
    endpoint: '/api/learning-records/',
    payload: { episode_id: 1, placements: [{ order: 1 }], completed: true },
  }];
  const rows = MockSubmissionLogViewManager.formatSummaryRows(submissions);
  assert.equal(rows[0], '총 로그: 1건');
  assert.ok(rows.includes('ID: mock-1'));
  assert.ok(rows.includes('Endpoint: POST /api/learning-records/'));
  assert.ok(rows.includes('Episode: 1'));
  assert.ok(rows.includes('배치 기록: 1개'));
  assert.ok(rows.includes('완료 여부: 완료'));
  assert.match(MockSubmissionLogViewManager.formatLogBody(submissions), /"id": "mock-1"/);
}

function testMockApiClient() {
  installLocalStorageMock();
  const payload = LearningApiPayloadManager.build(createCompleteLearningData());

  const response = MockApiClient.submitLearningRecord(payload);
  assert.equal(response.ok, true);
  assert.equal(response.status, 201);
  assert.equal(MockApiClient.listSubmissions().length, 1);

  const failed = MockApiClient.submitLearningRecord({ schema_version: 0 });
  assert.equal(failed.ok, false);
  MockApiClient.clearSubmissions();
  assert.equal(MockApiClient.listSubmissions().length, 0);
}

function testMockApiClientLogSafety() {
  const store = installLocalStorageMock();
  const payload = LearningApiPayloadManager.build(createCompleteLearningData());

  for (let index = 0; index < 12; index += 1) {
    const response = MockApiClient.submitLearningRecord({
      ...payload,
      placements: [{ ...payload.placements[0], order: index + 1 }],
    });
    assert.equal(response.ok, true);
  }

  const submissions = MockApiClient.listSubmissions();
  assert.equal(submissions.length, 10, 'mock submission log should keep only the latest 10 records');
  assert.equal(submissions[0].payload.placements[0].order, 12, 'latest mock submission should be first');
  assert.equal(submissions[9].payload.placements[0].order, 3, 'oldest overflow entries should be dropped');

  store.set(MOCK_SUBMISSION_LOG_STORAGE_KEY, '{broken json');
  assert.deepEqual(MockApiClient.listSubmissions(), [], 'broken mock log JSON should not crash the app');
}

function testLearningDataRestoreManager() {
  const registry = createMemoryRegistry();
  const data = {
    episode: 1,
    exploredPlaces: ['school', 'market', 'bus_stop'],
    dataViewed: true,
    quizResult: { questionId: 'ep1_q1', selected: 'lack_jobs_services', correct: true },
    problemSummaryCompleted: true,
    selectedPolicy: { id: 'green_recovery', name: '녹색 회복 계획' },
    placements: [
      { buildingId: 'small_park', position: { x: 6, y: 1 }, effect: { environment: 12, satisfaction: 14, pollution: -4, budget: -140 } },
      { buildingId: 'unknown_building', position: { x: 9, y: 9 }, effect: {} },
    ],
    gameState: { ...GameState.createInitialState(), environment: 92, budget: 860 },
    reflectionChoice: { id: 'environment', title: '환경 보완' },
    completed: true,
  };

  const restored = LearningDataRestoreManager.restore(registry, data);
  assert.equal(restored.selectedPolicy.id, 'green_recovery');
  assert.equal(restored.placedBuildings.length, 1, 'unknown building ids should be skipped safely');
  assert.equal(registry.get('gameState').environment, 92);
  assert.deepEqual(registry.get('exploredPlaces'), ['school', 'market', 'bus_stop']);
  assert.equal(registry.get('reflectionChoice').id, 'environment');
  assert.deepEqual(registry.get('learningProgress').placedBuildingIds, ['small_park']);
}



function testSavedDataViewManager() {
  assert.equal(SavedDataViewManager.formatBody(null), '저장된 데이터가 없습니다.');
  assert.equal(SavedDataViewManager.canContinue(null), false);
  assert.equal(SavedDataViewManager.getContinueButtonColor(null), '#94a3b8');
  assert.deepEqual(SavedDataViewManager.getContinueButtonState(null), {
    canContinue: false,
    backgroundColor: '#94a3b8',
    textColor: '#123524',
  });
  assert.deepEqual(SavedDataViewManager.getButtonLayout(1920), {
    back: { x: 360, y: 940 },
    import: { x: 760, y: 940 },
    continue: { x: 1135, y: 940 },
    clear: { x: 1520, y: 940 },
  });
  assert.equal(SavedDataViewManager.getBodyTextStyle().fontFamily, 'monospace');
  assert.equal(SavedDataViewManager.getStatusTextStyle().color, '#fecaca');

  const saved = {
    savedAt: '2026-07-12T10:00:00+09:00',
    version: 1,
    data: {
      episode: 1,
      exploredPlaces: ['school', 'market', 'bus_stop'],
      placements: [],
    },
  };
  assert.equal(SavedDataViewManager.canContinue(saved), true);
  assert.equal(SavedDataViewManager.getContinueButtonColor(saved), '#bbf7d0');
  assert.deepEqual(SavedDataViewManager.getContinueButtonState(saved), {
    canContinue: true,
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.match(SavedDataViewManager.formatBody(saved), /"episode": 1/);
  assert.equal(SavedDataViewManager.getImportErrorMessage(new Error('bad json')), 'bad json');
  assert.equal(SavedDataViewManager.getImportErrorMessage(null), 'JSON 가져오기에 실패했습니다.');
}

function testStorageSummaryManager() {
  assert.equal(StorageSummaryManager.getPanelLayout().saved.panel.x, 575);
  assert.equal(StorageSummaryManager.getPanelLayout().submissions.panel.strokeColor, 0xbbf7d0);
  assert.deepEqual(StorageSummaryManager.getControlLayout(), {
    status: { x: 960, y: 835 },
    clearSave: { x: 360, y: 930 },
    clearLog: { x: 710, y: 930 },
    clearAll: { x: 1050, y: 930 },
    title: { x: 1370, y: 930 },
    savedData: { x: 1640, y: 930 },
  });
  assert.equal(StorageSummaryManager.getBodyTextStyle().wordWrap.width, 640);
  assert.match(StorageSummaryManager.formatStatusText(), /개별 삭제/);
  assert.equal(StorageSummaryManager.formatDate(null), '알 수 없음');
  assert.equal(StorageSummaryManager.formatDate('not-a-date'), 'not-a-date');

  assert.deepEqual(StorageSummaryManager.formatSavedDataRows(null), [
    '상태: 저장 데이터 없음',
    '',
    '학습 데이터 화면에서 임시 저장하거나 제목 화면에서 JSON을 가져오면 여기에 표시됩니다.',
  ]);

  const savedRows = StorageSummaryManager.formatSavedDataRows({
    savedAt: '2026-07-12T10:00:00+09:00',
    version: 1,
    data: {
      episode: 1,
      exploredPlaces: ['school', 'market', 'bus_stop'],
      placements: [{ buildingId: 'small_park' }],
      completed: true,
    },
  });
  assert.equal(savedRows[0], '상태: 저장 데이터 있음');
  assert.ok(savedRows.includes('Episode: 1'));
  assert.ok(savedRows.includes('탐색 장소: 3곳'));
  assert.ok(savedRows.includes('배치 기록: 1개'));
  assert.ok(savedRows.includes('완료 여부: 완료'));

  assert.deepEqual(StorageSummaryManager.formatSubmissionRows([]), [
    '상태: 제출 로그 없음',
    '',
    'API 미리보기 화면에서 Mock 제출을 실행하면 여기에 표시됩니다.',
  ]);

  const submissionRows = StorageSummaryManager.formatSubmissionRows([{ id: 'mock-1', submittedAt: '2026-07-12T10:00:00+09:00', method: 'POST', endpoint: '/api/learning-records/', payload: { episode_id: 1, placements: [{ order: 1 }] } }]);
  assert.equal(submissionRows[0], '총 로그: 1건');
  assert.ok(submissionRows.includes('ID: mock-1'));
  assert.ok(submissionRows.includes('Episode: 1'));
  assert.ok(submissionRows.includes('배치 기록: 1개'));
}

function testSaveImport() {
  const store = installLocalStorageMock();
  const learningData = {
    episode: 1,
    exploredPlaces: ['school', 'market', 'bus_stop'],
    placements: [
      { buildingId: 'youth_center', buildingName: '청년센터', position: { x: 1, y: 1 }, effect: { population: 80 } },
    ],
  };

  const saved = SaveManager.importJsonText(JSON.stringify(learningData));
  assert.equal(saved.version, 1);
  assert.equal(SaveManager.hasSave(), true);
  assert.deepEqual(SaveManager.load().data.exploredPlaces, learningData.exploredPlaces);

  SaveManager.importJsonText(JSON.stringify({ data: learningData }));
  assert.throws(() => SaveManager.importJsonText('{"episode":1}'), /학습 데이터 JSON 형식/);
  assert.throws(() => SaveManager.importJsonText('{broken json'), SyntaxError);

  store.set(LEARNING_SAVE_STORAGE_KEY, '{broken json');
  assert.equal(SaveManager.load(), null, 'broken save JSON should be ignored safely');

  SaveManager.clear();
  assert.equal(SaveManager.hasSave(), false);
}


function testApiContract() {
  assert.equal(API_CONTRACT.endpoint, '/api/learning-records/');
  assert.equal(API_CONTRACT.method, 'POST');
  assert.equal(API_CONTRACT.schemaVersion, 1);
  assert.deepEqual(Object.keys(API_CONTRACT.requestExample), [
    'schema_version',
    'episode_id',
    'completed',
    'learning_steps',
    'selected_policy',
    'placements',
    'final_state',
  ]);
  assert.equal(LearningApiPayloadManager.validate(API_CONTRACT.requestExample).every((row) => row.ok), true);
  assert.equal(MockApiClient.validatePayload(API_CONTRACT.requestExample).ok, true);
  assert.match(formatContractRequest(), /POST \/api\/learning-records\//);
  assert.match(formatContractResponse(), /201 Created/);
}



function testSceneManagerImports() {
  const missingImports = [];
  for (const file of readdirSync(SCENES_DIR).filter((name) => name.endsWith('Scene.js'))) {
    const source = readFileSync(join(SCENES_DIR, file), 'utf8');
    const importedManagers = new Set(
      [...source.matchAll(/import\s+(\w+Manager)\s+from\s+'[^']+';/g)].map((match) => match[1]),
    );
    const usedManagers = new Set(
      [...source.matchAll(/\b(\w+Manager)\b/g)]
        .map((match) => match[1])
        .filter((name) => name !== 'Manager'),
    );

    for (const managerName of usedManagers) {
      if (!importedManagers.has(managerName)) {
        missingImports.push(`${file} uses ${managerName} without importing it`);
      }
    }
  }

  assert.deepEqual(missingImports, [], 'Scene files should import every *Manager identifier they use');
}

function testSceneReferences() {
  const mainSource = readProjectFile('src', 'main.js');
  const registeredScenes = [...mainSource.matchAll(/import\s+(\w+)\s+from\s+'\.\/scenes\/(\w+)\.js';/g)]
    .map((match) => ({ className: match[1], fileName: match[2] }));
  const registeredSceneNames = new Set(registeredScenes.map((scene) => scene.fileName));
  const sceneFiles = readdirSync(SCENES_DIR).filter((file) => file.endsWith('Scene.js'));

  assert.ok(registeredSceneNames.has('BootScene'), 'BootScene must be registered');
  assert.ok(registeredSceneNames.has('TitleScene'), 'TitleScene must be registered');

  for (const { className, fileName } of registeredScenes) {
    assert.ok(sceneFiles.includes(`${fileName}.js`), `${fileName}.js must exist for registered scene ${className}`);
    assert.match(mainSource, new RegExp(`scene:\\s*\\[[\\s\\S]*${className}[,\\s]`), `${className} must be included in Phaser scene array`);
  }

  const missingTargets = [];
  for (const file of sceneFiles) {
    const source = readFileSync(join(SCENES_DIR, file), 'utf8');
    for (const match of source.matchAll(/scene\.start\('([^']+)'/g)) {
      const target = match[1];
      if (!registeredSceneNames.has(target)) {
        missingTargets.push(`${file} -> ${target}`);
      }
    }
  }

  assert.deepEqual(missingTargets, [], 'Every scene.start target must be registered in main.js');
}

function run() {
  testEpisodeMetadata();
  testEpisodeContent();
  testCauseQuizManager();
  testSelectionViewManager();
  testProblemSummaryViewManager();
  testExplorationViewManager();
  testDataBriefingViewManager();
  testReflectionViewManager();
  testTitleViewManager();
  testApiContractViewManager();
  testEvaluationRuleConstants();
  testEvaluationManager();
  testSideEffectViewManager();
  testGameStateAndIssues();
  testLearningProgress();
  testBuildingData();
  testPolicyData();
  testPolicyRecommendationMatchingUsesIds();
  testMapData();
  testPlacementRules();
  testEndingSummaryManager();
  testTeacherReportManager();
  testLearningDataViewManager();
  testLearningDataManager();
  testApiPayloadViewManager();
  testLearningApiPayloadManager();
  testMockSubmissionLogViewManager();
  testMockApiClient();
  testMockApiClientLogSafety();
  testLearningDataRestoreManager();
  testSavedDataViewManager();
  testStorageSummaryManager();
  testSaveImport();
  testApiContract();
  testSceneManagerImports();
  testSceneReferences();
  console.log('Smoke tests passed');
}

run();
