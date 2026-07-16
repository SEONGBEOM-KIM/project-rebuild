import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import GameState from '../src/systems/GameState.js';
import BootFlowManager from '../src/systems/BootFlowManager.js';
import IssueDetector from '../src/systems/IssueDetector.js';
import SideEffectViewManager from '../src/systems/SideEffectViewManager.js';
import EvaluationManager from '../src/systems/EvaluationManager.js';
import ResultViewManager from '../src/systems/ResultViewManager.js';
import EndingSummaryManager from '../src/systems/EndingSummaryManager.js';
import EndingSummaryViewManager from '../src/systems/EndingSummaryViewManager.js';
import LearningProgress from '../src/systems/LearningProgress.js';
import CauseQuizManager from '../src/systems/CauseQuizManager.js';
import CauseQuizViewManager from '../src/systems/CauseQuizViewManager.js';
import SelectionViewManager from '../src/systems/SelectionViewManager.js';
import ProblemSummaryViewManager from '../src/systems/ProblemSummaryViewManager.js';
import ExplorationViewManager from '../src/systems/ExplorationViewManager.js';
import DataBriefingViewManager from '../src/systems/DataBriefingViewManager.js';
import ReflectionViewManager from '../src/systems/ReflectionViewManager.js';
import TitleViewManager from '../src/systems/TitleViewManager.js';
import AuthViewManager from '../src/systems/AuthViewManager.js';
import StoryViewManager from '../src/systems/StoryViewManager.js';
import ApiContractViewManager from '../src/systems/ApiContractViewManager.js';
import LearningDataManager from '../src/systems/LearningDataManager.js';
import LearningDataViewManager from '../src/systems/LearningDataViewManager.js';
import TeacherReportManager from '../src/systems/TeacherReportManager.js';
import TeacherReportViewManager from '../src/systems/TeacherReportViewManager.js';
import LearningDataRestoreManager from '../src/systems/LearningDataRestoreManager.js';
import LearningApiPayloadManager from '../src/systems/LearningApiPayloadManager.js';
import ApiPayloadViewManager from '../src/systems/ApiPayloadViewManager.js';
import MockApiClient, { MOCK_SUBMISSION_LOG_STORAGE_KEY } from '../src/systems/MockApiClient.js';
import MockSubmissionLogViewManager from '../src/systems/MockSubmissionLogViewManager.js';
import PlacementSystem from '../src/systems/PlacementSystem.js';
import PlacementViewManager, { TILE_COLORS, TILE_STROKES, TILE_LABELS, ZONE_LABELS, REQUIRED_PLACEMENTS, PLACEMENT_DRAG_THRESHOLD, PLACEMENT_UI_BOUNDS, PREVIEW_STYLES, PLACEMENT_UI_LAYOUT, BUILDING_CARD_LAYOUT, BUILDING_CARD_VISUALS, PLACEMENT_MAP_VISUALS } from '../src/systems/PlacementViewManager.js';
import PlacementMapGeometry from '../src/systems/PlacementMapGeometry.js';
import PlacementMapRenderer from '../src/systems/PlacementMapRenderer.js';
import PlacementResultManager from '../src/systems/PlacementResultManager.js';
import PlacementUiStateManager from '../src/systems/PlacementUiStateManager.js';
import PlacementSceneObjectRegistry from '../src/systems/PlacementSceneObjectRegistry.js';
import SaveManager, { LEARNING_SAVE_STORAGE_KEY } from '../src/systems/SaveManager.js';
import SavedDataViewManager from '../src/systems/SavedDataViewManager.js';
import StorageSummaryManager from '../src/systems/StorageSummaryManager.js';
import StorageManagerViewManager from '../src/systems/StorageManagerViewManager.js';
import { buildings } from '../src/data/buildings.js';
import { policies } from '../src/data/policies.js';
import { explorationPlaces } from '../src/data/explorationPlaces.js';
import { mapData } from '../src/data/mapData.js';
import { ISSUE_THRESHOLDS, REACTION_THRESHOLDS, RESULT_THRESHOLDS, SCORE_RULES } from '../src/data/evaluationRules.js';
import { API_CONTRACT, formatContractRequest, formatContractResponse } from '../src/data/apiContract.js';
import { CURRENT_EPISODE, EPISODE_STEPS } from '../src/data/episodes.js';
import { EP1_CAUSE_QUESTION, EP1_CORE_CAUSE_SUMMARY, EP1_CORE_CONCEPT, EP1_DATA_CARDS, EP1_EXPLORATION_CLUES, EP1_NEXT_DEVELOPMENT_GOALS, EP1_NEXT_MISSION, EP1_PROBLEM_ITEMS, EP1_REFLECTION_CHOICES } from '../src/data/episodeContent.js';
import ProgressStepper from '../src/ui/ProgressStepper.js';
import { getTextButtonColor } from '../src/ui/TextButton.js';
import { copyTextToClipboard, downloadTextFile } from '../src/ui/BrowserFileActions.js';
import { getLayoutTextStyle } from '../src/ui/LayoutText.js';


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




function createGraphicsSpy() {
  const calls = [];
  const graphics = {
    calls,
    clear() {
      calls.push(['clear']);
      return this;
    },
    fillStyle(color, alpha) {
      calls.push(['fillStyle', color, alpha]);
      return this;
    },
    fillPoints(points, closeShape) {
      calls.push(['fillPoints', points, closeShape]);
      return this;
    },
    lineStyle(width, color, alpha) {
      calls.push(['lineStyle', width, color, alpha]);
      return this;
    },
    strokePoints(points, closeShape) {
      calls.push(['strokePoints', points, closeShape]);
      return this;
    },
  };
  return graphics;
}


function createDisplayObjectSpy() {
  return {
    scrollFactor: null,
    depth: null,
    stroke: null,
    setScrollFactor(value) {
      this.scrollFactor = value;
      return this;
    },
    setDepth(value) {
      this.depth = value;
      return this;
    },
    setStrokeStyle(width, color) {
      this.stroke = { width, color };
      return this;
    },
  };
}

function createPlacementSceneObjectRegistryFixture() {
  const ignoredByMain = [];
  const ignoredByUi = [];
  const cameraAddCalls = [];
  const scene = {
    scale: { width: 1920, height: 1080 },
    add: {
      rectangle: (...args) => ({ ...createDisplayObjectSpy(), type: 'rectangle', args }),
      text: (...args) => ({ ...createDisplayObjectSpy(), type: 'text', args }),
    },
    cameras: {
      main: {
        ignore: (objects) => ignoredByMain.push(objects),
      },
      add: (...args) => {
        cameraAddCalls.push(args);
        return {
          scroll: null,
          zoom: null,
          setScroll(x, y) {
            this.scroll = { x, y };
            return this;
          },
          setZoom(value) {
            this.zoom = value;
            return this;
          },
          ignore: (objects) => ignoredByUi.push(objects),
        };
      },
    },
  };
  return { scene, ignoredByMain, ignoredByUi, cameraAddCalls };
}

function testPlacementSceneObjectRegistry() {
  const fixture = createPlacementSceneObjectRegistryFixture();
  const registry = new PlacementSceneObjectRegistry(fixture.scene, { fixedRectangleStrokeWidth: 3 });
  const worldObject = createDisplayObjectSpy();
  const uiObject = registry.createFixedRectangleFromLayout({ x: 10, y: 20, width: 30, height: 40, fillColor: 0x123456, strokeColor: 0xffffff });

  assert.equal(uiObject.type, 'rectangle');
  assert.deepEqual(uiObject.args, [10, 20, 30, 40, 0x123456, 1]);
  assert.deepEqual(uiObject.stroke, { width: 3, color: 0xffffff });
  assert.equal(uiObject.scrollFactor, 0);
  assert.equal(uiObject.depth, 100);
  assert.deepEqual(fixture.ignoredByMain, [uiObject]);

  registry.registerWorldObject(worldObject);
  registry.ignoreUiObjectsOnMainCamera();
  assert.deepEqual(fixture.ignoredByMain.at(-1), [uiObject]);

  const uiCamera = registry.createUiCamera('PlacementUiCamera');
  assert.deepEqual(fixture.cameraAddCalls[0], [0, 0, 1920, 1080, false, 'PlacementUiCamera']);
  assert.deepEqual(uiCamera.scroll, { x: 0, y: 0 });
  assert.equal(uiCamera.zoom, 1);
  assert.deepEqual(fixture.ignoredByUi[0], [worldObject]);

  const nextWorldObject = createDisplayObjectSpy();
  registry.registerWorldObject(nextWorldObject);
  assert.equal(fixture.ignoredByUi.at(-1), nextWorldObject);
}


function testBootFlowManager() {
  const entries = BootFlowManager.createInitialRegistryEntries();
  const keys = entries.map(([key]) => key);
  assert.deepEqual(keys, [
    'gameState',
    'lastPlacementResult',
    'placedBuildings',
    'selectedPolicy',
    'exploredPlaces',
    'quizResult',
    'reflectionChoice',
    'learningProgress',
  ]);
  const values = new Map(entries);
  assert.deepEqual(values.get('gameState'), GameState.createInitialState());
  assert.deepEqual(values.get('placedBuildings'), []);
  assert.deepEqual(values.get('exploredPlaces'), []);
  assert.equal(values.get('lastPlacementResult'), null);
  assert.equal(values.get('selectedPolicy'), null);
  assert.equal(values.get('quizResult'), null);
  assert.equal(values.get('reflectionChoice'), null);
  assert.equal(values.get('learningProgress').episode, 1);
  assert.equal(BootFlowManager.getTargetScene(), 'TitleScene');
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



function testCauseQuizViewManager() {
  const correctChoice = EP1_CAUSE_QUESTION.choices.find((choice) => choice.correct);
  const wrongChoice = EP1_CAUSE_QUESTION.choices.find((choice) => !choice.correct);

  assert.deepEqual(CauseQuizViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 72,
    text: 'EP1. 문제 원인 생각하기',
    fontSize: '58px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(CauseQuizViewManager.getScreenLayout(1920).progressStep, 'quiz');
  assert.equal(CauseQuizViewManager.getExplorationSummaryLayout().title.text, '탐색에서 확인한 단서');
  assert.equal(CauseQuizViewManager.getQuestionLayout().feedback.text, '답을 선택하면 피드백이 표시됩니다.');
  assert.deepEqual(CauseQuizViewManager.getChoiceLayout(1).text, { x: 820, y: 505, wordWrapWidth: 700 });
  assert.deepEqual(CauseQuizViewManager.getTextStyles().feedback, {
    fontSize: '25px',
    color: '#334155',
    lineSpacing: 10,
  });
  assert.deepEqual(CauseQuizViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(CauseQuizViewManager.getControlLayout().back, {
    x: 760,
    y: 955,
    label: '자료 다시 보기',
    target: 'DataBriefingScene',
    backgroundColor: '#93c5fd',
    textColor: '#0f172a',
  });
  assert.equal(CauseQuizViewManager.getControlLayout().nextEnabled.target, 'ProblemSummaryScene');
  assert.equal(CauseQuizViewManager.getSelectedStrokeColor(correctChoice), 0x22c55e);
  assert.equal(CauseQuizViewManager.getSelectedStrokeColor(wrongChoice), 0xef4444);
  assert.deepEqual(CauseQuizViewManager.getChoiceVisualStyle(correctChoice.id, correctChoice, EP1_CAUSE_QUESTION), {
    fillColor: 0xfef3c7,
    fillAlpha: 1,
    strokeWidth: 5,
    strokeColor: 0x22c55e,
  });
  assert.deepEqual(CauseQuizViewManager.getChoiceVisualStyle(wrongChoice.id, correctChoice, EP1_CAUSE_QUESTION), {
    fillColor: 0xe0f2fe,
    fillAlpha: 1,
    strokeWidth: 3,
    strokeColor: 0x93c5fd,
  });
}

function testCauseQuizManager() {
  const correctChoice = EP1_CAUSE_QUESTION.choices.find((choice) => choice.correct);
  const wrongChoice = EP1_CAUSE_QUESTION.choices.find((choice) => !choice.correct);

  assert.deepEqual(CauseQuizManager.formatExplorationSummaryRows(2, ['단서 A']).slice(0, 3), ['확인한 장소: 2곳', '', '단서 A']);
  assert.equal(CauseQuizManager.formatMissingChoiceFeedback(), '먼저 답을 하나 선택하세요.');
  assert.equal(CauseQuizManager.getMissingChoiceFeedbackColor(), '#b91c1c');

  assert.deepEqual(CauseQuizManager.buildQuizResult(EP1_CAUSE_QUESTION, correctChoice), {
    questionId: EP1_CAUSE_QUESTION.id,
    selected: correctChoice.id,
    correct: true,
  });
  assert.match(CauseQuizManager.formatFeedback(correctChoice), /정답입니다/);
  assert.match(CauseQuizManager.formatFeedback(wrongChoice), /다시 생각해 볼 수 있습니다/);
  assert.equal(CauseQuizManager.getFeedbackColor(correctChoice), '#166534');
  assert.equal(CauseQuizManager.getFeedbackColor(wrongChoice), '#991b1b');
}

function testSelectionViewManager() {
  const selectedPolicy = policies[0];
  const otherPolicy = policies[1];

  assert.deepEqual(SelectionViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 86,
    text: '회복 방향 선택',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(SelectionViewManager.getScreenLayout(1920).progressStep, 'selection');
  assert.deepEqual(SelectionViewManager.getScreenLayout(1920).detail, { x: 960, y: 750, wordWrapWidth: 1180 });
  assert.deepEqual(SelectionViewManager.getPolicyCardPosition(2), { x: 1490, y: 420 });
  assert.deepEqual(SelectionViewManager.getPolicyCardLayout().background, { x: 0, y: 0, width: 450, height: 430 });
  assert.equal(SelectionViewManager.getPolicyCardLayout().recommended.wordWrapWidth, 370);
  assert.deepEqual(SelectionViewManager.getTextStyles().description, {
    fontSize: '22px',
    color: '#dbeafe',
    align: 'center',
    lineSpacing: 8,
  });
  assert.deepEqual(SelectionViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(SelectionViewManager.getControlLayout(960).start, {
    x: 1140,
    y: 955,
    label: '배치 연습 시작',
    target: 'PlacementScene',
    backgroundColor: 0xbbf7d0,
    textColor: '#123524',
  });
  assert.equal(SelectionViewManager.getControlLayout(960).back.target, 'ExplorationScene');
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
  assert.deepEqual(ProblemSummaryViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 72,
    text: 'EP1. 문제 정리',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(ProblemSummaryViewManager.getScreenLayout(1920).progressStep, 'summary');
  assert.equal(ProblemSummaryViewManager.getProblemGridLayout().title.text, '확인한 지역 문제');
  assert.deepEqual(ProblemSummaryViewManager.getProblemItemCardLayout(210, 315).detail, { x: 272, y: 371, wordWrapWidth: 365 });
  assert.equal(ProblemSummaryViewManager.getLearningRecordLayout().title.text, '학습 기록');
  assert.equal(ProblemSummaryViewManager.getNextMissionLayout().body.wordWrapWidth, 510);
  assert.deepEqual(ProblemSummaryViewManager.getTextStyles().itemDetail, {
    fontSize: '20px',
    color: '#334155',
    lineSpacing: 5,
  });
  assert.deepEqual(ProblemSummaryViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(ProblemSummaryViewManager.getControlLayout().next, {
    x: 1180,
    y: 955,
    label: '회복 방향 선택',
    target: 'SelectionScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.equal(ProblemSummaryViewManager.getControlLayout().back.target, 'CauseQuizScene');
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

  assert.equal(ExplorationViewManager.getScreenLayout().progressStep, 'exploration');
  assert.deepEqual(ExplorationViewManager.getScreenLayout().title, {
    x: 80,
    y: 52,
    fontSize: '54px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(ExplorationViewManager.formatSubtitle(CURRENT_EPISODE.regionName), '장소를 클릭해 푸른군의 문제가 어디에서 드러나는지 확인하세요.');
  assert.equal(ExplorationViewManager.getMapLayout().backdrop.width, 1120);
  assert.equal(ExplorationViewManager.getMapLayout().roads.length, 2);
  assert.match(ExplorationViewManager.getMapLayout().note.text, /임시 지도 데이터/);
  assert.deepEqual(ExplorationViewManager.getPlaceMarkerLayout().check, { x: 43, y: -45, text: '✓' });
  assert.equal(ExplorationViewManager.getInfoPanelLayout().progress.wordWrapWidth, 500);
  assert.equal(ExplorationViewManager.getTextStyles().panelBody.lineSpacing, 13);
  assert.deepEqual(ExplorationViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(ExplorationViewManager.getControlLayout().next, {
    x: 1600,
    y: 955,
    label: '자료 확인',
    target: 'DataBriefingScene',
    backgroundColor: '#94a3b8',
    textColor: '#0f172a',
  });
  assert.equal(ExplorationViewManager.getControlLayout().back.target, 'StoryScene');
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
  assert.deepEqual(DataBriefingViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 70,
    text: 'EP1. 자료 확인',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(DataBriefingViewManager.getScreenLayout(1920).progressStep, 'data');
  assert.deepEqual(DataBriefingViewManager.getDataCardLayout(390, 500).panel, {
    x: 390,
    y: 500,
    width: 500,
    height: 560,
    fillColor: 0xffffff,
    fillAlpha: 0.97,
    strokeWidth: 5,
    strokeColor: 0x93c5fd,
  });
  assert.equal(DataBriefingViewManager.getDataCardLayout(390, 500).takeawayTitle.text, '읽어야 할 점');
  assert.deepEqual(DataBriefingViewManager.getConceptBoxLayout().title, { x: 350, y: 810, text: '핵심 개념' });
  assert.equal(DataBriefingViewManager.getDataCardTextStyles().title.fontSize, '33px');
  assert.equal(DataBriefingViewManager.getConceptBoxTextStyles().body.color, '#ffffff');
  assert.deepEqual(DataBriefingViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(DataBriefingViewManager.getControlLayout().next, {
    x: 1160,
    y: 980,
    label: '원인 질문 풀기',
    target: 'CauseQuizScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.equal(DataBriefingViewManager.getControlLayout().back.target, 'ExplorationScene');
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

  assert.deepEqual(ReflectionViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 82,
    text: '생각 정리',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(ReflectionViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.deepEqual(ReflectionViewManager.getScreenLayout(1920).feedback, { x: 960, y: 790, wordWrapWidth: 1150 });
  assert.deepEqual(ReflectionViewManager.getFeedbackTextStyle('initial', 1150), {
    fontSize: '28px',
    align: 'center',
    color: '#e0f2fe',
    wordWrap: { width: 1150 },
  });
  assert.equal(ReflectionViewManager.getChoiceTextStyles().description.lineSpacing, 8);
  assert.deepEqual(ReflectionViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(ReflectionViewManager.getChoiceCardPosition(0), { col: 0, row: 0, x: 610, y: 385 });
  assert.deepEqual(ReflectionViewManager.getChoiceCardPosition(3), { col: 1, row: 1, x: 1310, y: 635 });
  assert.deepEqual(ReflectionViewManager.getChoiceCardLayout(610, 385).background, { x: 610, y: 385, width: 620, height: 190 });
  assert.deepEqual(ReflectionViewManager.getChoiceCardLayout(610, 385).description, { x: 410, y: 373, wordWrapWidth: 470 });
  assert.deepEqual(ReflectionViewManager.getControlLayout().next, {
    x: 1160,
    y: 940,
    label: '학습 마무리',
    target: 'EndingScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.equal(ReflectionViewManager.getControlLayout().back.target, 'SideEffectScene');
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
  assert.deepEqual(TitleViewManager.getScreenText(), {
    backgroundColor: 0x10253f,
    title: { y: 280, text: '프로젝트 리빌드', fontSize: '92px', color: '#f7fbff', fontStyle: 'bold' },
    subtitle: { y: 380, text: '균형 있게 성장하는 지역을 위하여', fontSize: '36px', color: '#b9d7ff' },
  });
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
  assert.deepEqual(TitleViewManager.getStartButton(), { y: 620, label: '시작하기', targetScene: 'AuthScene' });
  assert.deepEqual(TitleViewManager.getLoadButton(), { savedY: 745, label: '저장 데이터 확인', targetScene: 'SavedDataScene' });
  assert.equal(TitleViewManager.getImportButton().label, 'JSON 가져오기');
  assert.deepEqual(TitleViewManager.getStorageButton(), { savedY: 910, emptyY: 820, label: '브라우저 저장 관리', targetScene: 'StorageManagerScene' });
  assert.deepEqual(TitleViewManager.getImportFileConfig(), { type: 'file', accept: 'application/json,.json', successTargetScene: 'SavedDataScene' });
  assert.equal(TitleViewManager.formatImportError(new Error('bad json')), 'bad json');
  assert.equal(TitleViewManager.formatImportError(null), 'JSON 가져오기에 실패했습니다.');
  assert.equal(TitleViewManager.getPrimaryButtonStyle().backgroundColor, '#a7f3d0');
  assert.equal(TitleViewManager.getSecondaryButtonStyle().backgroundColor, '#bfdbfe');
  assert.equal(TitleViewManager.getStorageButtonStyle().backgroundColor, '#334155');
  assert.equal(TitleViewManager.getLoadButtonStyle().backgroundColor, '#1e293b');
  assert.deepEqual(TitleViewManager.getImportStatusStyle(), {
    fontSize: '22px',
    color: '#fecaca',
    align: 'center',
  });
}


function testAuthViewManager() {
  const layout = AuthViewManager.getLayout();
  assert.equal(layout.title.text, '학습자 입장');
  assert.equal(layout.proceedButton.targetScene, 'StoryScene');
  assert.equal(layout.title.fontSize, '68px');
  assert.equal(layout.subtitle.color, '#93c5fd');
  assert.equal(layout.proceedButton.backgroundColor, '#fde68a');
  assert.deepEqual(AuthViewManager.getPanelPositions(1920, 1080).map((panel) => panel.title), ['로그인', '회원가입']);
  assert.deepEqual(AuthViewManager.getPanelPositions(1920, 1080).map((panel) => ({ x: panel.x, y: panel.y })), [
    { x: 700, y: 580 },
    { x: 1220, y: 580 },
  ]);
  assert.deepEqual(AuthViewManager.getProceedButton(1920), {
    ...layout.proceedButton,
    x: 960,
  });
  assert.deepEqual(layout.panel.fields.map((field) => field.label), ['이름', '비밀번호']);
  assert.equal(layout.panel.strokeWidth, 4);
  assert.equal(layout.panel.sampleButton.textColor, '#0f172a');
}

function testStoryViewManager() {
  const layout = StoryViewManager.getLayout();
  assert.equal(layout.startButton.label, '지역 탐색 시작');
  assert.equal(layout.startButton.targetScene, 'ExplorationScene');
  assert.equal(layout.title.fontSize, '60px');
  assert.equal(layout.intro.lineSpacing, 18);
  assert.equal(layout.startButton.strokeWidth, 4);
  assert.equal(layout.startButton.textColor, '#123524');
  assert.deepEqual(StoryViewManager.getStartButton(1920), {
    ...layout.startButton,
    x: 960,
  });
}

function testApiContractViewManager() {
  assert.deepEqual(ApiContractViewManager.getScreenLayout(1920).title, {
    y: 78,
    text: 'API 계약 보기',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
    x: 960,
  });
  assert.equal(ApiContractViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.equal(ApiContractViewManager.getScreenLayout(1920).title.fontSize, '60px');
  assert.equal(ApiContractViewManager.getPanelStyle().strokeWidth, 5);
  assert.equal(ApiContractViewManager.getNoteStyle().bodyFontSize, '22px');
  assert.deepEqual(ApiContractViewManager.getButtonStyle().padding, { x: 28, y: 16 });
  const panels = ApiContractViewManager.getPanelLayout();
  assert.equal(panels.request.title, '요청 Body 초안');
  assert.equal(panels.response.width, 620);
  assert.deepEqual(ApiContractViewManager.getPanelTitlePosition(panels.request), { x: 185, y: 227 });
  assert.deepEqual(ApiContractViewManager.getPanelBodyPosition(panels.request), { x: 185, y: 280 });
  assert.equal(ApiContractViewManager.getPanelBodyStyle(panels.request).wordWrap.width, 790);
  assert.equal(ApiContractViewManager.getNotesLayout().body.width, 1200);
  assert.equal(ApiContractViewManager.getNotesLayout().title.text, '백엔드 구현 메모');
  assert.match(ApiContractViewManager.formatBackendNote(), /서버에서 추가/);
  assert.deepEqual(ApiContractViewManager.getControlLayout().payload, {
    x: 650,
    y: 960,
    label: 'Payload 미리보기',
    target: 'ApiPayloadScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.deepEqual(ApiContractViewManager.getControlLayout().ending, {
    x: 1280,
    y: 960,
    label: '마무리로',
    target: 'EndingScene',
    backgroundColor: '#fde68a',
    textColor: '#0f172a',
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

function testResultViewManager() {
  assert.deepEqual(ResultViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 82,
    text: '종합 결과',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(ResultViewManager.getScreenLayout(1920).progressStep, 'result');
  assert.equal(ResultViewManager.getPanelStyle().yOffset, 230);
  assert.equal(ResultViewManager.getResidentReactionStyle().title, '주민 반응');
  const panels = ResultViewManager.getPanelLayout(960);
  assert.equal(panels.beforeAfter.title, '이전 → 현재');
  assert.equal(panels.trend.x, 1570);
  assert.deepEqual(ResultViewManager.getPanelTitlePosition(panels.evaluation), { x: 960, y: 270 });
  assert.deepEqual(ResultViewManager.getPanelBodyPosition(panels.evaluation), { x: 960, y: 340 });
  assert.equal(ResultViewManager.getPanelBodyStyle(panels.evaluation).wordWrap.width, 465);
  assert.deepEqual(ResultViewManager.getEvaluationTitleTextStyle('#22c55e'), {
    fontSize: '30px',
    align: 'center',
    fontStyle: 'bold',
    color: '#22c55e',
  });
  assert.equal(ResultViewManager.getResidentReactionTextStyles().body.lineSpacing, 6);
  assert.equal(ResultViewManager.getPanelTitleTextStyle().color, '#312e81');
  assert.deepEqual(ResultViewManager.getButtonStyle(), {
    fontSize: '30px',
    padding: { x: 28, y: 17 },
  });
  assert.deepEqual(ResultViewManager.getResidentReactionLayout(960).title, { x: 170, y: 806, text: '주민 반응' });
  assert.deepEqual(ResultViewManager.getControlLayout(960).sideEffect, {
    x: 960,
    y: 940,
    label: '부작용 검토',
    target: 'SideEffectScene',
    backgroundColor: '#bbf7d0',
    textColor: '#1e1b4b',
  });
  assert.equal(ResultViewManager.getControlLayout(960).restart.target, 'BootScene');
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
  assert.deepEqual(SideEffectViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 82,
    text: '부작용 검토',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(SideEffectViewManager.getScreenLayout(1920).progressStep, 'result');
  assert.equal(SideEffectViewManager.getScreenLayout(1920).subtitle.wordWrapWidth, 1450);
  assert.equal(SideEffectViewManager.getPanelStyle().hintFillColor, 0x1e293b);
  assert.equal(SideEffectViewManager.getIssueCardStyle().markerStrokeColor, 0xffffff);
  assert.deepEqual(SideEffectViewManager.getTextStyles().hintBody, {
    fontSize: '22px',
    color: '#dbeafe',
    lineSpacing: 10,
  });
  assert.deepEqual(SideEffectViewManager.getButtonStyle(), {
    fontSize: '32px',
    padding: { x: 34, y: 18 },
  });
  assert.equal(SideEffectViewManager.getIssuePanelLayout().panel.width, 980);
  assert.equal(SideEffectViewManager.getIssuePanelLayout().title.text, '감지된 주의 신호');
  assert.deepEqual(SideEffectViewManager.getIssueCardLayout(1).title, { x: 310, y: 478 });
  assert.equal(SideEffectViewManager.getHintPanelLayout().body.wordWrapWidth, 500);
  assert.equal(SideEffectViewManager.getHintPanelLayout().title.text, '다음 선택 힌트');
  assert.deepEqual(SideEffectViewManager.getControlLayout().next, {
    x: 1160,
    y: 955,
    label: '생각 정리',
    target: 'ReflectionScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.equal(SideEffectViewManager.getControlLayout().back.target, 'ResultScene');
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


function testPlacementMapGeometry() {
  const geometry = new PlacementMapGeometry({
    origin: PlacementViewManager.getScreenLayout().mapOrigin,
    tileWidth: mapData.tileWidth,
    tileHeight: mapData.tileHeight,
    mapWidth: mapData.width,
    mapHeight: mapData.height,
  });

  assert.deepEqual(geometry.tileToWorld(0, 0), { x: 940, y: 260 });
  assert.deepEqual(geometry.tileToWorld(2, 1), { x: 988, y: 332 });
  assert.deepEqual(geometry.worldToTile(988, 332), { x: 2, y: 1 });
  assert.equal(geometry.worldToTile(100, 100), null);
  assert.deepEqual(geometry.getDiamondPoints(0, 0), [
    { x: 940, y: 236 },
    { x: 988, y: 260 },
    { x: 940, y: 284 },
    { x: 892, y: 260 },
  ]);
  assert.deepEqual(geometry.getFootprintCenter(1, 1, { width: 2, height: 2 }), { x: 940, y: 332 });
}


function testPlacementMapRenderer() {
  const geometry = new PlacementMapGeometry({
    origin: PlacementViewManager.getScreenLayout().mapOrigin,
    tileWidth: mapData.tileWidth,
    tileHeight: mapData.tileHeight,
    mapWidth: mapData.width,
    mapHeight: mapData.height,
  });
  const renderer = new PlacementMapRenderer({ geometry });
  const graphics = createGraphicsSpy();

  renderer.drawDiamond(graphics, 0, 0, {
    fillColor: 0x123456,
    fillAlpha: 0.5,
    strokeColor: 0xffffff,
    strokeWidth: 2,
  });

  assert.deepEqual(graphics.calls[0], ['fillStyle', 0x123456, 0.5]);
  assert.deepEqual(graphics.calls[1], ['fillPoints', geometry.getDiamondPoints(0, 0), true]);
  assert.deepEqual(graphics.calls[2], ['lineStyle', 2, 0xffffff, 0.9]);
  assert.deepEqual(graphics.calls[3], ['strokePoints', geometry.getDiamondPoints(0, 0), true]);
  assert.deepEqual(PlacementMapRenderer.normalizeDiamondVisual({ color: 0x2f855a, alpha: 0.88, stroke: 0x86efac, strokeWidth: 1.5 }), {
    fillColor: 0x2f855a,
    fillAlpha: 0.88,
    strokeColor: 0x86efac,
    strokeWidth: 1.5,
    strokeAlpha: 0.9,
  });

  const previewGraphics = createGraphicsSpy();
  renderer.drawTiles(previewGraphics, [{ x: 1, y: 1 }, { x: 2, y: 1 }], PREVIEW_STYLES.valid);
  assert.equal(previewGraphics.calls.filter(([name]) => name === 'fillStyle').length, 2);
  assert.equal(previewGraphics.calls.filter(([name]) => name === 'strokePoints').length, 2);

  const mapGraphics = createGraphicsSpy();
  renderer.drawMap(mapGraphics, mapData);
  assert.deepEqual(mapGraphics.calls[0], ['clear']);
  assert.equal(mapGraphics.calls.filter(([name]) => name === 'fillStyle').length, mapData.width * mapData.height);
}

function testPlacementViewManager() {
  assert.equal(REQUIRED_PLACEMENTS, 3);
  assert.equal(PLACEMENT_DRAG_THRESHOLD, 8);
  assert.equal(PLACEMENT_UI_BOUNDS.leftPanelRight, 430);
  assert.deepEqual(PlacementViewManager.getScreenLayout().mapOrigin, { x: 940, y: 260 });
  assert.equal(PlacementViewManager.getScreenLayout().progressStep, 'placement');
  assert.match(PlacementViewManager.getScreenLayout().topHint.text, /휠: 확대\/축소/);
  assert.equal(PlacementViewManager.getScreenLayout().topHint.fontSize, '24px');
  assert.deepEqual(PlacementViewManager.getCameraConfig().bounds, { x: 0, y: 0, width: 1900, height: 1300 });
  assert.equal(PlacementViewManager.getRecommendationBadgeLayout(10, 20).text.text, '추천');
  assert.deepEqual(PlacementViewManager.getFixedUiStyle(), { rectangleStrokeWidth: 3 });
  assert.equal(PlacementViewManager.getTextStyles().title.fontSize, '34px');
  assert.equal(PlacementViewManager.getTextStyles().panelBody.lineSpacing, 6);
  assert.equal(PlacementViewManager.getTextStyles().recommendationBadge.color, '#78350f');
  assert.equal(PlacementViewManager.getTextStyles().impactIcon.fontStyle, 'bold');
  assert.equal(PlacementViewManager.getTextStyles().buildingLabel.fontSize, '18px');
  assert.equal(PREVIEW_STYLES.valid.fillColor, 0x22c55e);
  assert.equal(PLACEMENT_UI_LAYOUT.title.text, '건물 선택');
  assert.equal(BUILDING_CARD_LAYOUT.card.width, 300);
  assert.deepEqual(BUILDING_CARD_VISUALS.card, { fillColor: 0x1e293b, fillAlpha: 1, strokeColor: 0x475569 });
  assert.equal(PLACEMENT_MAP_VISUALS.impactMarker.bubbleRadius, 34);
  assert.equal(TILE_COLORS.empty, 0x2f855a);
  assert.equal(TILE_STROKES.buildable, 0x86efac);
  assert.equal(TILE_LABELS.river, '강');
  assert.equal(ZONE_LABELS.traffic, '교통');
  assert.deepEqual(PlacementViewManager.getTileRenderStyle({ type: 'road', buildable: false }), {
    color: 0x64748b,
    stroke: 0x334155,
  });
  assert.deepEqual(PlacementViewManager.getMapTileVisual({ type: 'road', buildable: false }), {
    color: 0x64748b,
    stroke: 0x334155,
    alpha: 0.88,
    strokeWidth: 1.5,
  });
  assert.equal(PlacementViewManager.getLegendItems().length, 4);
  assert.deepEqual(PlacementViewManager.getLegendItemLayout(1, { label: '숲', note: '배치 불가', color: 0x166534 }), {
    swatch: { ...PLACEMENT_UI_LAYOUT.legendSwatch, y: 162, fillColor: 0x166534, strokeColor: 0xffffff },
    text: { x: 1520, y: 152, text: '숲 - 배치 불가' },
  });
  assert.equal(PlacementViewManager.getLegendTextColor({ note: '배치 가능' }), '#bbf7d0');
  assert.equal(PlacementViewManager.getLegendTextColor({ note: '배치 불가' }), '#fecaca');
  assert.equal(PlacementViewManager.getPreviewStyle({ valid: true }).strokeColor, 0xbbf7d0);
  assert.equal(PlacementViewManager.getPreviewStyle({ valid: false }).strokeColor, 0xfecaca);
  assert.equal(PlacementViewManager.isDragPlacementCandidate(8, true), true);
  assert.equal(PlacementViewManager.isDragPlacementCandidate(9, true), false);
  assert.equal(PlacementViewManager.isDragPlacementCandidate(0, false), false);
  assert.equal(PlacementViewManager.isPointerOnUi({ x: 429, y: 200 }), true);
  assert.equal(PlacementViewManager.isPointerOnUi({ x: 500, y: 97 }), true);
  assert.equal(PlacementViewManager.isPointerOnUi({ x: 500, y: 500 }), false);
  assert.equal(PlacementUiStateManager.formatMapSelectMessage(), '지도 안쪽 타일을 선택하세요.');
  assert.equal(PlacementUiStateManager.formatInvalidPlacementMessage('도로 위입니다'), '배치 불가: 도로 위입니다');
  assert.equal(PlacementUiStateManager.formatBuildingSelectedMessage('청년센터'), '청년센터 선택됨');
  assert.equal(PlacementViewManager.getUiLayout().legendTitle.text, '타일 범례');
  assert.equal(PlacementViewManager.getUiLayout().continueButton.target, 'ResultScene');
  assert.equal(PlacementViewManager.getUiLayout().continueButton.backgroundColor, 0x94a3b8);

  const placementSceneSource = readProjectFile('src', 'scenes', 'PlacementScene.js');
  assert.match(placementSceneSource, /PlacementUiCamera/, 'placement scene should render fixed UI through a separate UI camera');
  assert.match(placementSceneSource, /this\.objectRegistry\.ignoreUiObjectsOnMainCamera\(\)/, 'world camera should ignore fixed UI objects through registry');
  assert.match(placementSceneSource, /this\.objectRegistry\.createUiCamera\('PlacementUiCamera'\)/, 'UI camera should ignore zoomable map objects through registry');

  const cameraControllerSource = readProjectFile('src', 'systems', 'CameraController.js');
  assert.match(cameraControllerSource, /this\.ignoreDrag\(pointer\)/, 'camera wheel zoom should ignore UI pointer regions');
  assert.deepEqual(PlacementViewManager.getBuildingCardLayout(40, 185).card, {
    ...BUILDING_CARD_LAYOUT.card,
    x: 190,
    y: 249,
  });
  assert.deepEqual(PlacementViewManager.getBuildingCardVisual(buildings.find((building) => building.id === 'youth_center')).swatch, {
    fillColor: buildings.find((building) => building.id === 'youth_center').color,
    fillAlpha: 1,
    strokeColor: 0xffffff,
  });
  assert.equal(PlacementViewManager.getBuildingCardLayout(40, 185).description.wrapWidth, 255);
  assert.equal(PlacementViewManager.getBuildingCardLayout(40, 185).description.wordWrapWidth, 255);
  assert.equal(PlacementViewManager.getUiLayout().cursorInfo.wordWrapWidth, 320);
  assert.equal(PlacementViewManager.getUiLayout().lastChangeBody.wordWrapWidth, 270);
  assert.equal(PlacementViewManager.formatBuildingDetail(buildings.find((building) => building.id === 'youth_center')), '2×2 | 비용 180');
  assert.match(PlacementViewManager.formatPlacementHint(buildings.find((building) => building.id === 'bus_station')), /^조건:/);
  assert.deepEqual(PlacementViewManager.getBuildingCardContent(buildings.find((building) => building.id === 'bus_station')), {
    title: '버스정류장',
    detail: '2×2 | 비용 120',
    description: buildings.find((building) => building.id === 'bus_station').description,
    placementHint: PlacementViewManager.formatPlacementHint(buildings.find((building) => building.id === 'bus_station')),
    effect: '인구 +40 / 만족도 +10 / 교통 -3 / 예산 -120',
  });
  assert.deepEqual(PlacementViewManager.getPlacedBuildingVisual(buildings.find((building) => building.id === 'small_park'), 6, 1), {
    fillColor: buildings.find((building) => building.id === 'small_park').color,
    alpha: 0.78,
    strokeColor: 0xffffff,
    strokeWidth: 2,
    depth: 17,
  });
  assert.deepEqual(PlacementViewManager.getBuildingLabelLayout({ x: 500, y: 300 }, 2, 3).text, {
    x: 500,
    y: 265,
    depth: 35,
  });
  assert.deepEqual(PlacementViewManager.getImpactMarkerLayout({ x: 500, y: 300 }, 2, 3).animation, {
    initialScale: 0.2,
    initialAlpha: 0.2,
    targetY: 188,
    duration: 280,
    ease: 'Back.Out',
  });
  assert.deepEqual(PlacementUiStateManager.formatCursorInfo(null), {
    text: '커서 타일: 지도 밖 또는 UI 영역',
    color: '#bfdbfe',
  });
  assert.deepEqual(PlacementUiStateManager.formatCursorInfo(
    { x: 1, y: 2 },
    { type: 'empty', zone: 'center' },
    { valid: true },
  ), {
    text: '커서 타일: (1, 2)\n지형: 빈 땅 / 구역: 중심지\n판정: 배치 가능',
    color: '#bbf7d0',
  });
  assert.match(PlacementUiStateManager.formatStatusText(GameState.createInitialState()), /현재 상태\n인구: 1000/);
  assert.equal(PlacementUiStateManager.formatLastChangeState(null).color, '#fde68a');
  assert.equal(PlacementUiStateManager.formatPlacementHistoryState([]).color, '#bfdbfe');

  const youthCenter = buildings.find((building) => building.id === 'youth_center');
  const lastChange = PlacementUiStateManager.formatLastChangeState({
    building: youthCenter,
    position: { x: 1, y: 1 },
    before: GameState.createInitialState(),
    after: GameState.applyEffect(GameState.createInitialState(), youthCenter.effect),
    delta: youthCenter.effect,
  });
  assert.match(lastChange.text, /청년센터 배치/);
  assert.match(lastChange.text, /인구: 1000 → 1080/);

  const history = PlacementUiStateManager.formatPlacementHistoryState([
    { building: youthCenter, position: { x: 1, y: 1 } },
  ]);
  assert.match(history.text, /총 배치: 1개/);
  assert.match(history.text, /1\. 청년센터 \(1, 1\)/);

  const continueState = PlacementUiStateManager.getContinueState(2, { name: '녹색 회복 계획', recommendedBuildings: ['작은 공원'] });
  assert.equal(continueState.enabled, false);
  assert.equal(continueState.buttonText, '시설 1개 더 배치');
  assert.match(continueState.missionText, /추천 시설: 작은 공원/);
  assert.equal(PlacementUiStateManager.canContinue(2), false);
  assert.equal(PlacementUiStateManager.canContinue(3), true);
  assert.equal(PlacementUiStateManager.getContinueState(3, null).buttonText, '종합 결과 확인');
  assert.equal(PlacementUiStateManager.formatPlacementSuccessMessage('청년센터', 3), '청년센터 배치 완료: 종합 결과를 확인할 수 있습니다.');
  assert.equal(PlacementUiStateManager.formatNeedMoreMessage(1), '종합 결과를 보려면 시설 2개를 더 배치하세요.');
  assert.equal(PlacementViewManager.isRecommendedBuilding(youthCenter, { recommendedBuildingIds: ['youth_center'] }), true);
  assert.equal(PlacementViewManager.isRecommendedBuilding(youthCenter, { recommendedBuildingIds: ['bus_station'] }), false);
  assert.deepEqual(PlacementViewManager.getBuildingCardStyle(youthCenter, youthCenter, null), {
    selected: true,
    recommended: false,
    strokeWidth: 5,
    strokeColor: 0xfde68a,
    fillColor: 0x334155,
    fillAlpha: 1,
  });
  assert.deepEqual(PlacementViewManager.getBuildingCardStyle(youthCenter, buildings.find((building) => building.id === 'bus_station'), { recommendedBuildingIds: ['youth_center'] }), {
    selected: false,
    recommended: true,
    strokeWidth: 4,
    strokeColor: 0xf59e0b,
    fillColor: 0x2b250f,
    fillAlpha: 1,
  });
  assert.deepEqual(PlacementViewManager.getImpactMarkerData(buildings.find((building) => building.id === 'small_park')), {
    icon: '🌿',
    label: '환경 회복',
    color: 0x22c55e,
  });
  assert.deepEqual(PlacementViewManager.getImpactMarkerData(buildings.find((building) => building.id === 'bus_station')), {
    icon: '🚌',
    label: '이동 편의',
    color: 0xfacc15,
  });
}


function testPlacementResultManager() {
  const registry = createMemoryRegistry();
  const initialState = GameState.createInitialState();
  const youthCenter = buildings.find((building) => building.id === 'youth_center');
  const tile = { x: 2, y: 7 };
  const occupiedTiles = [{ x: 2, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 8 }, { x: 3, y: 8 }];

  registry.set('gameState', initialState);
  registry.set('learningProgress', LearningProgress.createInitialProgress());

  const result = PlacementResultManager.createPlacementResult({
    building: youthCenter,
    tile,
    occupiedTiles,
    before: initialState,
  });
  assert.equal(result.building.id, 'youth_center');
  assert.deepEqual(result.position, tile);
  assert.equal(result.after.population, 1080);
  assert.equal(result.after.budget, 820);
  assert.deepEqual(result.delta, youthCenter.effect);

  const record = PlacementResultManager.createPlacementRecord({
    building: youthCenter,
    tile,
    occupiedTiles,
    placedCount: 2,
    now: 12345,
  });
  assert.equal(record.id, 'youth_center-12345-2');
  assert.deepEqual(record.position, tile);
  assert.deepEqual(record.occupiedTiles, occupiedTiles);

  const commit = PlacementResultManager.commitPlacement({
    registry,
    building: youthCenter,
    tile,
    occupiedTiles,
    placedBuildings: [],
    now: 12345,
  });
  assert.equal(commit.placedBuildings.length, 1);
  assert.equal(commit.record.id, 'youth_center-12345-0');
  assert.equal(registry.get('gameState').population, 1080);
  assert.equal(registry.get('lastPlacementResult').building.id, 'youth_center');
  assert.equal(registry.get('placedBuildings')[0].id, 'youth_center-12345-0');
  assert.deepEqual(LearningProgress.get(registry).placedBuildingIds, ['youth_center']);
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



function testEndingSummaryViewManager() {
  assert.deepEqual(EndingSummaryViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 78,
    text: '학습 마무리',
    fontSize: '62px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(EndingSummaryViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.equal(EndingSummaryViewManager.getPanelStyle().strokeColor, 0x60a5fa);
  assert.equal(EndingSummaryViewManager.getLearningRecordStyle().title, '학습 기록');
  assert.equal(EndingSummaryViewManager.getNextMissionStyle().strokeColor, 0xbbf7d0);
  const panels = EndingSummaryViewManager.getPanelLayout();
  assert.equal(panels.choice.title, '오늘의 선택 요약');
  assert.equal(panels.nextMission.width, 360);
  assert.deepEqual(EndingSummaryViewManager.getPanelTitlePosition(panels.choice), { x: 430, y: 195 });
  assert.deepEqual(EndingSummaryViewManager.getPanelBodyPosition(panels.choice), { x: 175, y: 255 });
  assert.equal(EndingSummaryViewManager.getPanelBodyStyle(panels.choice).wordWrap.width, 510);
  assert.equal(EndingSummaryViewManager.getNextMissionBodyStyle(panels.nextMission).wordWrap.width, 296);
  assert.equal(EndingSummaryViewManager.getTextStyles().learningRecordBody.lineSpacing, 9);
  assert.deepEqual(EndingSummaryViewManager.getButtonStyle(), {
    fontSize: '29px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(EndingSummaryViewManager.getLearningRecordLayout(960).title, { x: 170, y: 737, text: '학습 기록' });
  assert.deepEqual(EndingSummaryViewManager.getControlLayout(960).restart, {
    x: 1480,
    y: 955,
    label: '처음부터 다시',
    target: 'BootScene',
    backgroundColor: '#fde68a',
    textColor: '#0f172a',
  });
  assert.equal(EndingSummaryViewManager.getControlLayout(960).report.target, 'TeacherReportScene');
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

function testTeacherReportViewManager() {
  assert.deepEqual(TeacherReportViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 78,
    text: '교사용 요약',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(TeacherReportViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.equal(TeacherReportViewManager.getPanelStyle().strokeColor, 0x60a5fa);
  const panels = TeacherReportViewManager.getPanelLayout();
  assert.equal(panels.progress.title, '학습 진행');
  assert.equal(panels.teaching.width, 420);
  assert.deepEqual(TeacherReportViewManager.getPanelTitlePosition(panels.progress), { x: 400, y: 214 });
  assert.deepEqual(TeacherReportViewManager.getPanelBodyPosition(panels.progress), { x: 148, y: 270 });
  assert.equal(TeacherReportViewManager.getPanelBodyStyle(panels.progress).wordWrap.width, 504);
  assert.equal(TeacherReportViewManager.getTextStyles().panelTitle.color, '#172554');
  assert.equal(TeacherReportViewManager.getStatusColor('success'), '#bbf7d0');
  assert.equal(TeacherReportViewManager.getStatusColor('failure'), '#fecaca');
  assert.equal(TeacherReportViewManager.getStatusColor('unknown'), '#bfdbfe');
  assert.deepEqual(TeacherReportViewManager.getButtonStyle(), {
    fontSize: '29px',
    padding: { x: 34, y: 18 },
  });
  assert.deepEqual(TeacherReportViewManager.getControlLayout().data, {
    x: 1490,
    y: 940,
    label: '학습 데이터 보기',
    target: 'LearningDataScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.equal(TeacherReportViewManager.getControlLayout().copy.backgroundColor, '#93c5fd');
  assert.equal(TeacherReportViewManager.getControlLayout().ending.textColor, '#1e1b4b');
}

function testTeacherReportManager() {
  assert.equal(TeacherReportManager.getDownloadConfig().mimeType, 'text/plain;charset=utf-8');
  assert.match(TeacherReportManager.formatStatusText(), /텍스트 파일/);
  assert.match(TeacherReportManager.formatCopySuccess(), /클립보드/);
  assert.match(TeacherReportManager.formatCopyFailure(), /권한/);
  assert.match(TeacherReportManager.formatDownloadSuccess(), /다운로드/);
  assert.equal(TeacherReportManager.formatDownloadFileName(), 'project-rebuild-ep1-teacher-report.txt');

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
  assert.deepEqual(LearningDataViewManager.getScreenLayout(1920).title, {
    y: 78,
    text: '학습 데이터 확인',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
    x: 960,
  });
  assert.equal(LearningDataViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.deepEqual(LearningDataViewManager.getDownloadConfig(), { mimeType: 'application/json' });
  assert.equal(LearningDataViewManager.getDarkPanelStyle().strokeWidth, 5);
  assert.equal(LearningDataViewManager.getLightPanelStyle().titleColor, '#172554');
  assert.equal(LearningDataViewManager.getValidationTextStyle(440).wordWrap.width, 440);
  assert.equal(LearningDataViewManager.getSummaryBoxStyle(390).bodyFontSize, '20px');
  assert.equal(LearningDataViewManager.getSavePanelStyle().bodyColor, '#dbeafe');
  assert.deepEqual(LearningDataViewManager.getButtonStyle().padding, { x: 22, y: 15 });
  assert.equal(LearningDataViewManager.getFeedbackColor('success'), '#bbf7d0');
  assert.equal(LearningDataViewManager.getFeedbackColor('error'), '#fecaca');
  assert.equal(LearningDataViewManager.getDataPanelLayout().panel.width, 1120);
  assert.equal(LearningDataViewManager.getDataPanelLayout().title.text, '저장 후보 데이터');
  assert.equal(LearningDataViewManager.getValidationPanelLayout().title.text, '데이터 검증');
  assert.equal(LearningDataViewManager.getValidationPanelLayout().summaryBody.wordWrapWidth, 390);
  assert.equal(LearningDataViewManager.getSavePanelLayout().panel.height, 150);
  assert.equal(LearningDataViewManager.getSavePanelLayout().title.text, '임시 저장 상태');
  assert.deepEqual(LearningDataViewManager.getControlLayout().api, {
    x: 260,
    y: 960,
    label: 'API 미리보기',
    target: 'ApiPayloadScene',
    backgroundColor: '#fde68a',
    textColor: '#0f172a',
  });
  assert.deepEqual(LearningDataViewManager.getControlLayout().ending, {
    x: 1545,
    y: 960,
    label: '마무리로',
    target: 'EndingScene',
    backgroundColor: '#c4b5fd',
    textColor: '#1e1b4b',
  });
  assert.equal(LearningDataViewManager.getJsonTextStyle(1030).fontFamily, 'monospace');
  assert.equal(LearningDataViewManager.formatSaveCleared(), '저장된 학습 데이터를 삭제했습니다.');
  assert.match(LearningDataViewManager.formatCopySuccess(), /클립보드/);
  assert.match(LearningDataViewManager.formatCopyFailure(), /권한/);
  assert.match(LearningDataViewManager.formatDownloadSuccess(), /다운로드/);
  assert.equal(LearningDataViewManager.formatDownloadFileName({ episode: 1 }), 'project-rebuild-ep1-learning-data.json');

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
  assert.deepEqual(ApiPayloadViewManager.getScreenLayout(1920).title, {
    y: 78,
    text: 'API 저장 페이로드 미리보기',
    fontSize: '56px',
    color: '#ffffff',
    fontStyle: 'bold',
    x: 960,
  });
  assert.equal(ApiPayloadViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.deepEqual(ApiPayloadViewManager.getDownloadConfig(), { mimeType: 'application/json' });
  assert.equal(ApiPayloadViewManager.getDarkPanelStyle().titleFontSize, '31px');
  assert.equal(ApiPayloadViewManager.getLightPanelStyle().fillColor, 0xffffff);
  assert.equal(ApiPayloadViewManager.getValidationTextStyle(440).wordWrap.width, 440);
  assert.equal(ApiPayloadViewManager.getStatusTextStyle(440, '#166534').color, '#166534');
  assert.equal(ApiPayloadViewManager.getLogPanelStyle().strokeWidth, 3);
  assert.deepEqual(ApiPayloadViewManager.getButtonStyle().padding, { x: 14, y: 13 });
  assert.equal(ApiPayloadViewManager.getFeedbackColor('success'), '#166534');
  assert.equal(ApiPayloadViewManager.getFeedbackColor('error'), '#991b1b');
  assert.equal(ApiPayloadViewManager.getFeedbackColor('logUpdated'), '#bbf7d0');
  assert.equal(ApiPayloadViewManager.getPayloadPanelLayout().panel.width, 1120);
  assert.equal(ApiPayloadViewManager.getPayloadPanelLayout().title.text, 'POST /api/learning-records/ 후보 body');
  assert.equal(ApiPayloadViewManager.getValidationPanelLayout().title.text, 'API 구조 검증');
  assert.equal(ApiPayloadViewManager.getValidationPanelLayout().rows.wordWrapWidth, 440);
  assert.equal(ApiPayloadViewManager.getSubmissionLogLayout().panel.height, 105);
  assert.equal(ApiPayloadViewManager.getSubmissionLogLayout().title.text, 'Mock 제출 로그');
  assert.deepEqual(ApiPayloadViewManager.getControlLayout().contract, {
    x: 1130,
    y: 960,
    label: 'API 계약',
    target: 'ApiContractScene',
    backgroundColor: '#fde68a',
    textColor: '#0f172a',
  });
  assert.deepEqual(ApiPayloadViewManager.getControlLayout().submit, {
    x: 350,
    y: 960,
    label: 'Mock 제출',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
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
  assert.deepEqual(MockSubmissionLogViewManager.getScreenLayout(1920).title, {
    x: 960,
    y: 78,
    text: 'Mock 제출 로그',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
  });
  assert.equal(MockSubmissionLogViewManager.getScreenLayout(1920).progressStep, 'ending');
  assert.equal(MockSubmissionLogViewManager.getDownloadConfig().mimeType, 'application/json');
  assert.equal(MockSubmissionLogViewManager.getSummaryPanelStyle().titleFontSize, '36px');
  assert.equal(MockSubmissionLogViewManager.getLogPanelStyle().fillColor, 0x111827);
  assert.equal(MockSubmissionLogViewManager.getStatusTextStyle().align, 'center');
  assert.deepEqual(MockSubmissionLogViewManager.getButtonStyle().padding, { x: 22, y: 15 });
  assert.equal(MockSubmissionLogViewManager.getFeedbackColor('success'), '#bbf7d0');
  assert.equal(MockSubmissionLogViewManager.getFeedbackColor('error'), '#fecaca');
  assert.equal(MockSubmissionLogViewManager.getSummaryPanelLayout().panel.width, 520);
  assert.equal(MockSubmissionLogViewManager.getSummaryPanelLayout().title.text, '제출 요약');
  assert.equal(MockSubmissionLogViewManager.getLogPanelLayout().body.wordWrapWidth, 840);
  assert.equal(MockSubmissionLogViewManager.getLogPanelLayout().title.text, '최근 제출 JSON');
  assert.deepEqual(MockSubmissionLogViewManager.getControlLayout().api, {
    x: 1300,
    y: 940,
    label: 'API 미리보기',
    target: 'ApiPayloadScene',
    backgroundColor: '#bbf7d0',
    textColor: '#123524',
  });
  assert.equal(MockSubmissionLogViewManager.getControlLayout().copy.backgroundColor, '#93c5fd');
  assert.equal(MockSubmissionLogViewManager.getControlLayout().ending.target, 'EndingScene');
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
  assert.deepEqual(SavedDataViewManager.getLayout(1920).title, {
    y: 90,
    text: '저장 데이터 확인',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
    x: 960,
  });
  assert.equal(SavedDataViewManager.getLayout(1920).bodyPanel.strokeWidth, 5);
  assert.deepEqual(SavedDataViewManager.getButtonStyle().padding, { x: 34, y: 18 });
  assert.deepEqual(SavedDataViewManager.getLayout(1920).importFile, { type: 'file', accept: 'application/json,.json' });
  assert.deepEqual(SavedDataViewManager.getButtonLayout(1920), {
    back: { offsetX: -600, x: 360, y: 940, label: '제목으로', backgroundColor: '#c4b5fd', textColor: '#1e1b4b', targetScene: 'TitleScene' },
    import: { offsetX: -200, x: 760, y: 940, label: 'JSON 가져오기', backgroundColor: '#bfdbfe', textColor: '#0f172a' },
    continue: { offsetX: 175, x: 1135, y: 940, label: '이어보기', targetScene: 'EndingScene' },
    clear: { offsetX: 560, x: 1520, y: 940, label: '저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
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

function testStorageManagerViewManager() {
  assert.deepEqual(StorageManagerViewManager.getScreenLayout(1920).title, {
    y: 90,
    text: '브라우저 저장 관리',
    fontSize: '60px',
    color: '#ffffff',
    fontStyle: 'bold',
    x: 960,
  });
  assert.equal(StorageManagerViewManager.getPanelStyle().strokeWidth, 5);
  assert.equal(StorageManagerViewManager.getStatusTextStyle().fontSize, '24px');
  assert.deepEqual(StorageManagerViewManager.getButtonStyle().padding, { x: 24, y: 16 });
  assert.equal(StorageManagerViewManager.getPanelLayout().saved.panel.x, 575);
  assert.equal(StorageManagerViewManager.getPanelLayout().saved.title.text, '학습 저장 데이터');
  assert.equal(StorageManagerViewManager.getPanelLayout().submissions.panel.strokeColor, 0xbbf7d0);
  assert.equal(StorageManagerViewManager.getPanelLayout().submissions.title.text, 'Mock 제출 로그');
  assert.deepEqual(StorageManagerViewManager.getControlLayout(), {
    status: { x: 960, y: 835 },
    clearSave: { x: 360, y: 930, label: '학습 저장 삭제', backgroundColor: '#fecaca', textColor: '#7f1d1d' },
    clearLog: { x: 710, y: 930, label: '제출 로그 삭제', backgroundColor: '#fed7aa', textColor: '#7c2d12' },
    clearAll: { x: 1050, y: 930, label: '전체 초기화', backgroundColor: '#fca5a5', textColor: '#7f1d1d' },
    title: { x: 1370, y: 930, label: '제목으로', backgroundColor: '#c4b5fd', textColor: '#1e1b4b', targetScene: 'TitleScene' },
    savedData: { x: 1640, y: 930, label: '저장 확인', backgroundColor: '#bbf7d0', textColor: '#123524', targetScene: 'SavedDataScene' },
  });
  assert.equal(StorageManagerViewManager.getBodyTextStyle().wordWrap.width, 640);
}

function testStorageSummaryManager() {
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
  const sceneStartPattern = /scene\.start\('([^']+)'/g;
  const managerTargetPattern = /(?:(?:targetScene|successTargetScene):\s*|BOOT_TARGET_SCENE\s*=\s*)'([^']+)'/g;
  for (const file of sceneFiles) {
    const source = readFileSync(join(SCENES_DIR, file), 'utf8');
    for (const match of source.matchAll(sceneStartPattern)) {
      const target = match[1];
      if (!registeredSceneNames.has(target)) {
        missingTargets.push(`${file} -> ${target}`);
      }
    }
  }

  for (const file of readdirSync(join(SRC_DIR, 'systems')).filter((name) => name.endsWith('Manager.js'))) {
    const source = readFileSync(join(SRC_DIR, 'systems', file), 'utf8');
    for (const match of source.matchAll(managerTargetPattern)) {
      const target = match[1];
      if (!registeredSceneNames.has(target)) {
        missingTargets.push(`${file} targetScene -> ${target}`);
      }
    }
  }

  assert.deepEqual(missingTargets, [], 'Every scene.start and manager targetScene target must be registered in main.js');
}


function testSharedUiComponentStyles() {
  const progressStyle = ProgressStepper.getStyle();
  assert.equal(progressStyle.spacing, 176);
  assert.equal(progressStyle.circle.strokeWidth, 3);
  assert.deepEqual(ProgressStepper.getStepVisualState(1, 2), {
    completed: true,
    active: false,
    circleColor: 0xbbf7d0,
    lineColor: 0xbbf7d0,
    textColor: '#bbf7d0',
    radius: 14,
    strokeAlpha: 0.65,
    fontSize: '18px',
    fontStyle: 'normal',
  });
  assert.deepEqual(ProgressStepper.getStepVisualState(2, 2), {
    completed: false,
    active: true,
    circleColor: 0xfde68a,
    lineColor: 0xbbf7d0,
    textColor: '#fde68a',
    radius: 18,
    strokeAlpha: 1,
    fontSize: '20px',
    fontStyle: 'bold',
  });
  assert.equal(getTextButtonColor(0xbbf7d0), '#bbf7d0');
  assert.equal(getTextButtonColor('#0f172a'), '#0f172a');
  assert.deepEqual(getLayoutTextStyle({
    x: 10,
    y: 20,
    text: '제목',
    fontSize: '32px',
    color: '#ffffff',
    fontStyle: 'bold',
    wordWrapWidth: 360,
  }), {
    fontSize: '32px',
    color: '#ffffff',
    fontStyle: 'bold',
    wordWrap: { width: 360 },
  });
  assert.deepEqual(getLayoutTextStyle({
    x: 10,
    y: 20,
    text: '소제목',
    fontSize: '24px',
    color: '#94a3b8',
  }, {
    color: '#0f172a',
    fontStyle: 'bold',
  }), {
    fontSize: '24px',
    color: '#0f172a',
    fontStyle: 'bold',
  });
}


async function testBrowserFileActions() {
  const copied = [];
  await copyTextToClipboard('payload text', { writeText: async (text) => copied.push(text) });
  assert.deepEqual(copied, ['payload text']);

  const events = [];
  const link = {
    set href(value) { events.push(['href', value]); },
    set download(value) { events.push(['download', value]); },
    click: () => events.push(['click']),
    remove: () => events.push(['remove']),
  };
  const environment = {
    URL: {
      createObjectURL: (blob) => {
        events.push(['createObjectURL', blob.type]);
        return 'blob:mock';
      },
      revokeObjectURL: (url) => events.push(['revokeObjectURL', url]),
    },
    document: {
      createElement: (tagName) => {
        events.push(['createElement', tagName]);
        return link;
      },
      body: {
        appendChild: (node) => events.push(['appendChild', node === link]),
      },
    },
  };

  downloadTextFile({ content: 'hello', fileName: 'report.txt', mimeType: 'text/plain' }, environment);
  assert.deepEqual(events, [
    ['createObjectURL', 'text/plain'],
    ['createElement', 'a'],
    ['href', 'blob:mock'],
    ['download', 'report.txt'],
    ['appendChild', true],
    ['click'],
    ['remove'],
    ['revokeObjectURL', 'blob:mock'],
  ]);
}

async function run() {
  testBootFlowManager();
  testEpisodeMetadata();
  testEpisodeContent();
  testCauseQuizViewManager();
  testCauseQuizManager();
  testSelectionViewManager();
  testProblemSummaryViewManager();
  testExplorationViewManager();
  testDataBriefingViewManager();
  testReflectionViewManager();
  testTitleViewManager();
  testAuthViewManager();
  testStoryViewManager();
  testApiContractViewManager();
  testEvaluationRuleConstants();
  testResultViewManager();
  testEvaluationManager();
  testSideEffectViewManager();
  testGameStateAndIssues();
  testLearningProgress();
  testBuildingData();
  testPolicyData();
  testPolicyRecommendationMatchingUsesIds();
  testMapData();
  testPlacementSceneObjectRegistry();
  testPlacementMapGeometry();
  testPlacementMapRenderer();
  testPlacementViewManager();
  testPlacementResultManager();
  testPlacementRules();
  testEndingSummaryViewManager();
  testEndingSummaryManager();
  testTeacherReportViewManager();
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
  testStorageManagerViewManager();
  testStorageSummaryManager();
  testSaveImport();
  testApiContract();
  testSceneManagerImports();
  testSceneReferences();
  testSharedUiComponentStyles();
  await testBrowserFileActions();
  console.log('Smoke tests passed');
}

await run();
