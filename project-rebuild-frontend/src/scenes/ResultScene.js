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

    this.drawStatePanel(width / 2 - 610, 270, '이전 → 현재', EvaluationManager.formatBeforeAfterRows(lastPlacementResult, gameState));
    this.drawStatePanel(width / 2, 270, '종합 평가', EvaluationManager.formatEvaluationRows(evaluation, gameState, placedBuildings, selectedPolicy));
    this.drawStatePanel(width / 2 + 610, 270, '선택 경향', EvaluationManager.formatChoiceTrendRows(placedBuildings));
    this.drawResidentReactionStrip(width / 2, 830, EvaluationManager.formatResidentReactions(gameState, placedBuildings));

    const retry = this.createButton(width / 2 - 310, 940, '배치 더 하기', '#c4b5fd');
    retry.on('pointerdown', () => this.scene.start('PlacementScene'));

    const next = this.createButton(width / 2, 940, '부작용 검토', '#bbf7d0');
    next.on('pointerdown', () => this.scene.start('SideEffectScene'));

    const restart = this.createButton(width / 2 + 310, 940, '처음부터 다시', '#fde68a');
    restart.on('pointerdown', () => this.scene.start('BootScene'));
  }

  drawResidentReactionStrip(x, y, rows) {
    this.add.rectangle(x, y, 1660, 86, 0x0f172a, 0.9).setStrokeStyle(3, 0xfde68a);
    this.add.text(x - 790, y - 24, '주민 반응', {
      fontSize: '25px',
      color: '#fde68a',
      fontStyle: 'bold',
    });
    this.add.text(x - 625, y - 25, rows, {
      fontSize: '23px',
      color: '#ffffff',
      lineSpacing: 6,
      wordWrap: { width: 1400 },
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

  drawStatePanel(x, y, title, rows) {
    this.add.rectangle(x, y + 230, 545, 575, 0xffffff, 0.95).setStrokeStyle(4, 0x818cf8);
    this.add.text(x, y, title, {
      fontSize: '32px',
      color: '#312e81',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(x, y + 70, rows, {
      fontSize: '24px',
      color: '#1e293b',
      align: 'left',
      lineSpacing: 8,
      wordWrap: { width: 465 },
    }).setOrigin(0.5, 0);
  }


}
