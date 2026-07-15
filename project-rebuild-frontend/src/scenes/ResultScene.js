import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import EvaluationManager from '../systems/EvaluationManager.js';

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

    const layout = EvaluationManager.getResultScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.evaluationTitle.x, layout.evaluationTitle.y, evaluation.title, {
      fontSize: '30px',
      color: evaluation.color,
      align: 'center',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const panels = EvaluationManager.getResultPanelLayout(width / 2);
    this.drawStatePanel(panels.beforeAfter, EvaluationManager.formatBeforeAfterRows(lastPlacementResult, gameState));
    this.drawStatePanel(panels.evaluation, EvaluationManager.formatEvaluationRows(evaluation, gameState, placedBuildings, selectedPolicy));
    this.drawStatePanel(panels.trend, EvaluationManager.formatChoiceTrendRows(placedBuildings));
    this.drawResidentReactionStrip(width / 2, EvaluationManager.formatResidentReactions(gameState, placedBuildings));
    this.drawControls(width / 2);
  }

  drawResidentReactionStrip(centerX, rows) {
    const layout = EvaluationManager.getResidentReactionLayout(centerX);
    const reactionStyle = EvaluationManager.getResidentReactionStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, reactionStyle.fillColor, reactionStyle.fillAlpha)
      .setStrokeStyle(reactionStyle.strokeWidth, reactionStyle.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '25px',
      color: '#fde68a',
      fontStyle: 'bold',
    });
    this.add.text(layout.body.x, layout.body.y, rows, {
      fontSize: '23px',
      color: '#ffffff',
      lineSpacing: 6,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawControls(centerX) {
    const controls = EvaluationManager.getResultControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = this.createButton(control.x, control.y, control.label, control.backgroundColor, control.textColor);
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '30px',
      color,
      backgroundColor,
      padding: { x: 28, y: 17 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }

  drawStatePanel(panel, rows) {
    const panelStyle = EvaluationManager.getResultPanelStyle();
    this.add.rectangle(panel.x, panel.y + panelStyle.yOffset, panel.width, panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, panelStyle.strokeColor);
    const titlePosition = EvaluationManager.getResultPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '32px',
      color: '#312e81',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const bodyPosition = EvaluationManager.getResultPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, rows, EvaluationManager.getResultPanelBodyStyle(panel)).setOrigin(0.5, 0);
  }



}
