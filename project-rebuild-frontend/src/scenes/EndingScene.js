import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import PlacementContextManager from '../systems/PlacementContextManager.js';
import LearningProgress from '../systems/LearningProgress.js';
import EndingSummaryManager from '../systems/EndingSummaryManager.js';
import EndingSummaryViewManager from '../systems/EndingSummaryViewManager.js';
import EndingSummaryRenderer from '../systems/EndingSummaryRenderer.js';
import EpisodeFlowManager from '../systems/EpisodeFlowManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    const { width } = this.scale;
    const gameState = this.registry.get(REGISTRY_KEYS.gameState);
    const placedBuildings = this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [];
    const selectedPolicy = this.registry.get(REGISTRY_KEYS.selectedPolicy);
    const exploredPlaces = this.registry.get(REGISTRY_KEYS.exploredPlaces) ?? [];
    const quizResult = this.registry.get(REGISTRY_KEYS.quizResult);
    const reflectionChoice = this.registry.get(REGISTRY_KEYS.reflectionChoice);
    const learningProgress = LearningProgress.update(this.registry, { completed: true });
    const selectedStrategy = EpisodeFlowManager.resolveSelectedStrategy({ registry: this.registry, learningProgress, selectedPolicy });
    const { placementConfig, evaluationProfile } = PlacementContextManager.resolve({
      registry: this.registry,
      progress: learningProgress,
      selectedStrategy,
    });
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings, evaluationProfile);

    const layout = EndingSummaryViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    EndingSummaryRenderer.renderTakeawayStrip(this, width / 2, EndingSummaryManager.formatFinalTakeaway({
      gameState, ending, reflectionChoice, selectedStrategy, evaluationProfile, placedBuildings, placementEpisodeId: placementConfig.episodeId,
    }));

    const panels = EndingSummaryViewManager.getPanelLayout();
    EndingSummaryRenderer.renderPanel(this, panels.choice, EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings, reflectionChoice, selectedStrategy));
    EndingSummaryRenderer.renderPanel(this, panels.state, EndingSummaryManager.formatStateSummary(
      gameState, ending, placementConfig.stateKeys, evaluationProfile, placedBuildings, placementConfig.episodeId,
    ));
    EndingSummaryRenderer.renderNextMissionPanel(this, panels.nextMission, EpisodeFlowManager.getNextDevelopmentGoals({ registry: this.registry, learningProgress, placementConfig }));
    EndingSummaryRenderer.renderLearningRecordStrip(
      this,
      width / 2,
      EndingSummaryManager.formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice, selectedStrategy, placementConfig, evaluationProfile),
    );
    this.drawControls(width / 2, placementConfig.episodeId);
  }


  drawControls(centerX, placementEpisodeId) {
    const controls = EndingSummaryViewManager.getControlLayout(centerX, placementEpisodeId);
    Object.values(controls).forEach((control) => {
      const button = createTextButton(this, control, EndingSummaryViewManager.getButtonStyle());
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }


}
