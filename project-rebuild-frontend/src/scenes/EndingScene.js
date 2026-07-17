import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_NEXT_DEVELOPMENT_GOALS, EP2_MISSION_BRIEFING } from '../data/episodeContent.js';
import { getPlacementConfig } from '../data/episodePlacementConfigs.js';
import { getEvaluationProfile } from '../data/evaluationRules.js';
import LearningProgress from '../systems/LearningProgress.js';
import EndingSummaryManager from '../systems/EndingSummaryManager.js';
import EndingSummaryViewManager from '../systems/EndingSummaryViewManager.js';
import EndingSummaryRenderer from '../systems/EndingSummaryRenderer.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    const { width } = this.scale;
    const gameState = this.registry.get('gameState');
    const placedBuildings = this.registry.get('placedBuildings') ?? [];
    const selectedPolicy = this.registry.get('selectedPolicy');
    const exploredPlaces = this.registry.get('exploredPlaces') ?? [];
    const quizResult = this.registry.get('quizResult');
    const reflectionChoice = this.registry.get('reflectionChoice');
    const learningProgress = LearningProgress.update(this.registry, { completed: true });
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(EP2_MISSION_BRIEFING, this.registry.get('ep2StrategyId') ?? learningProgress.selectedStrategyId, selectedPolicy?.id);
    const placementConfig = getPlacementConfig(this.registry.get('placementConfigId') ?? learningProgress.placementConfigId);
    const evaluationProfile = getEvaluationProfile(placementConfig.evaluationProfileId);
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings, evaluationProfile);

    const layout = EndingSummaryViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    EndingSummaryRenderer.renderTakeawayStrip(this, width / 2, EndingSummaryManager.formatFinalTakeaway({ gameState, ending, reflectionChoice, selectedStrategy, evaluationProfile }));

    const panels = EndingSummaryViewManager.getPanelLayout();
    EndingSummaryRenderer.renderPanel(this, panels.choice, EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings, reflectionChoice, selectedStrategy));
    EndingSummaryRenderer.renderPanel(this, panels.state, EndingSummaryManager.formatStateSummary(gameState, ending, placementConfig.stateKeys, evaluationProfile));
    EndingSummaryRenderer.renderNextMissionPanel(this, panels.nextMission, EP1_NEXT_DEVELOPMENT_GOALS);
    EndingSummaryRenderer.renderLearningRecordStrip(
      this,
      width / 2,
      EndingSummaryManager.formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice, selectedStrategy),
    );
    this.drawControls(width / 2);
  }


  drawControls(centerX) {
    const controls = EndingSummaryViewManager.getControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = createTextButton(this, control, EndingSummaryViewManager.getButtonStyle());
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }


}
