import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP2_MISSION_BRIEFING } from '../data/episodeContent.js';
import EvaluationManager from '../systems/EvaluationManager.js';
import ResultViewManager from '../systems/ResultViewManager.js';
import ResultRenderer from '../systems/ResultRenderer.js';
import LearningProgress from '../systems/LearningProgress.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create() {
    const { width } = this.scale;
    const gameState = this.registry.get('gameState');
    const lastPlacementResult = this.registry.get('lastPlacementResult');
    const placedBuildings = this.registry.get('placedBuildings') ?? [];
    const selectedPolicy = this.registry.get('selectedPolicy');
    const learningProgress = LearningProgress.get(this.registry);
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(EP2_MISSION_BRIEFING, this.registry.get('ep2StrategyId') ?? learningProgress.selectedStrategyId, selectedPolicy?.id);
    const evaluation = EvaluationManager.evaluateState(gameState, placedBuildings);

    const layout = ResultViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.evaluationTitle, {
      text: evaluation.title,
      style: ResultViewManager.getEvaluationTitleTextStyle(evaluation.color),
      origin: 0.5,
    });

    const panels = ResultViewManager.getPanelLayout(width / 2);
    ResultRenderer.renderStatePanel(this, panels.beforeAfter, EvaluationManager.formatBeforeAfterRows(lastPlacementResult, gameState));
    ResultRenderer.renderStatePanel(this, panels.evaluation, EvaluationManager.formatEvaluationRows(evaluation, gameState, placedBuildings, selectedPolicy, selectedStrategy));
    ResultRenderer.renderStatePanel(this, panels.trend, EvaluationManager.formatChoiceTrendRows(placedBuildings, selectedPolicy, selectedStrategy));
    ResultRenderer.renderResidentReactionStrip(this, width / 2, EvaluationManager.formatResidentReactions(gameState, placedBuildings));
    this.drawControls(width / 2);
  }


  drawControls(centerX) {
    const controls = ResultViewManager.getControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = createTextButton(this, control, ResultViewManager.getButtonStyle());
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }






}
