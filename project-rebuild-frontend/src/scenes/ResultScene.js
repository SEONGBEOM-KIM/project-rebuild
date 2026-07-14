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

    this.add.rectangle(width / 2, height / 2, width, height, 0x1e1b4b);
    ProgressStepper.render(this, 'result');
    this.add.text(width / 2, 82, '종합 결과', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 150, evaluation.title, {
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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x0f172a, 0.9).setStrokeStyle(3, 0xfde68a);
    this.add.text(layout.title.x, layout.title.y, '주민 반응', {
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
      const button = this.createButton(control.x, control.y, control.label, control.backgroundColor);
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }

  createButton(x, y, label, backgroundColor) {
    return this.add.text(x, y, label, {
      fontSize: '30px',
      color: '#1e1b4b',
      backgroundColor,
      padding: { x: 28, y: 17 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }

  drawStatePanel(panel, rows) {
    this.add.rectangle(panel.x, panel.y + 230, panel.width, panel.height, 0xffffff, 0.95).setStrokeStyle(4, 0x818cf8);
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
