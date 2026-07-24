import Phaser from 'phaser';
import './style.css';

import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import AuthScene from './scenes/AuthScene.js';
import StoryScene from './scenes/StoryScene.js';
import ExplorationScene from './scenes/ExplorationScene.js';
import DataBriefingScene from './scenes/DataBriefingScene.js';
import CauseQuizScene from './scenes/CauseQuizScene.js';
import ProblemSummaryScene from './scenes/ProblemSummaryScene.js';
import EpisodeTransitionScene from './scenes/EpisodeTransitionScene.js';
import SelectionScene from './scenes/SelectionScene.js';
import PlacementScene from './scenes/PlacementScene.js';
import ResultScene from './scenes/ResultScene.js';
import SideEffectScene from './scenes/SideEffectScene.js';
import ReflectionScene from './scenes/ReflectionScene.js';
import EndingScene from './scenes/EndingScene.js';
import Ep2BriefingScene from './scenes/Ep2BriefingScene.js';
import Ep3PreviewScene from './scenes/Ep3PreviewScene.js';
import Ep4BriefingScene from './scenes/Ep4BriefingScene.js';
import Ep4InvestigationScene from './scenes/Ep4InvestigationScene.js';
import Ep4ConclusionScene from './scenes/Ep4ConclusionScene.js';
import Ep5PreviewScene from './scenes/Ep5PreviewScene.js';
import SustainabilityEvaluationScene from './scenes/SustainabilityEvaluationScene.js';
import LearningDataScene from './scenes/LearningDataScene.js';
import ApiPayloadScene from './scenes/ApiPayloadScene.js';
import ApiContractScene from './scenes/ApiContractScene.js';
import MockSubmissionLogScene from './scenes/MockSubmissionLogScene.js';
import TeacherReportScene from './scenes/TeacherReportScene.js';
import SavedDataScene from './scenes/SavedDataScene.js';
import StorageManagerScene from './scenes/StorageManagerScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 1920,
  height: 1080,
  backgroundColor: '#10253f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  scene: [
    BootScene,
    TitleScene,
    SavedDataScene,
    StorageManagerScene,
    AuthScene,
    StoryScene,
    ExplorationScene,
    DataBriefingScene,
    CauseQuizScene,
    ProblemSummaryScene,
    EpisodeTransitionScene,
    SelectionScene,
    PlacementScene,
    ResultScene,
    SideEffectScene,
    ReflectionScene,
    EndingScene,
    Ep2BriefingScene,
    Ep3PreviewScene,
    Ep4BriefingScene,
    Ep4InvestigationScene,
    Ep4ConclusionScene,
    Ep5PreviewScene,
    SustainabilityEvaluationScene,
    LearningDataScene,
    ApiPayloadScene,
    ApiContractScene,
    MockSubmissionLogScene,
    TeacherReportScene,
  ],
};

new Phaser.Game(config);
