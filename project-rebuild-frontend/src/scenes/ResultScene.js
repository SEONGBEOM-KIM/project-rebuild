import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import EvaluationManager from '../systems/EvaluationManager.js';
import ResultViewManager from '../systems/ResultViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create() {
    const { width, height } = this.scale;
    const gameState = this.registry.get('gameState');
    const lastPlacementResult = this.registry.get('lastPlacementResult');
    const placedBuildings = this.registry.get('placedBuildings') ?? [];
    const selectedPolicy = this.registry.get('selectedPolicy');
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
    this.drawStatePanel(panels.beforeAfter, EvaluationManager.formatBeforeAfterRows(lastPlacementResult, gameState));
    this.drawStatePanel(panels.evaluation, EvaluationManager.formatEvaluationRows(evaluation, gameState, placedBuildings, selectedPolicy));
    this.drawStatePanel(panels.trend, EvaluationManager.formatChoiceTrendRows(placedBuildings, selectedPolicy));
    this.drawResidentReactionStrip(width / 2, EvaluationManager.formatResidentReactions(gameState, placedBuildings));
    this.drawControls(width / 2);
  }

  drawResidentReactionStrip(centerX, rows) {
    const layout = ResultViewManager.getResidentReactionLayout(centerX);
    const reactionStyle = ResultViewManager.getResidentReactionStyle();
    const textStyles = ResultViewManager.getResidentReactionTextStyles();
    createPanelBackground(this, layout.panel, reactionStyle);
    createPanelTitle(this, layout.title, textStyles.title);
    createLayoutText(this, layout.body, {
      text: rows,
      style: textStyles.body,
    });
  }

  drawControls(centerX) {
    const controls = ResultViewManager.getControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = createTextButton(this, control, ResultViewManager.getButtonStyle());
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }


  drawStatePanel(panel, rows) {
    const panelStyle = ResultViewManager.getPanelStyle();
    createPanelBackground(this, { ...panel, y: panel.y + panelStyle.yOffset }, panelStyle);
    const titlePosition = ResultViewManager.getPanelTitlePosition(panel);
    createPanelTitle(this, titlePosition, ResultViewManager.getPanelTitleTextStyle(), { text: panel.title, origin: 0.5 });
    const bodyPosition = ResultViewManager.getPanelBodyPosition(panel);
    createLayoutText(this, bodyPosition, {
      text: rows,
      style: ResultViewManager.getPanelBodyStyle(panel),
      origin: [0.5, 0],
    });
  }



}
