import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_NEXT_DEVELOPMENT_GOALS } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';
import EndingSummaryManager from '../systems/EndingSummaryManager.js';
import EndingSummaryViewManager from '../systems/EndingSummaryViewManager.js';

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    const { width, height } = this.scale;
    const gameState = this.registry.get('gameState');
    const placedBuildings = this.registry.get('placedBuildings') ?? [];
    const selectedPolicy = this.registry.get('selectedPolicy');
    const exploredPlaces = this.registry.get('exploredPlaces') ?? [];
    const quizResult = this.registry.get('quizResult');
    const reflectionChoice = this.registry.get('reflectionChoice');
    const learningProgress = LearningProgress.update(this.registry, { completed: true });
    const ending = EndingSummaryManager.getEndingSummary(gameState, placedBuildings);

    const layout = EndingSummaryViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '62px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    const panels = EndingSummaryViewManager.getPanelLayout();
    this.drawPanel(panels.choice, EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings));
    this.drawPanel(panels.state, EndingSummaryManager.formatStateSummary(gameState, ending));
    this.drawNextMissionPanel(panels.nextMission);
    this.drawLearningRecordStrip(width / 2, learningProgress, exploredPlaces, quizResult, reflectionChoice);
    this.drawControls(width / 2);
  }

  drawPanel(panel, body) {
    const panelStyle = EndingSummaryViewManager.getPanelStyle();
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, panelStyle.strokeColor);
    const titlePosition = EndingSummaryViewManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const bodyPosition = EndingSummaryViewManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, EndingSummaryViewManager.getPanelBodyStyle(panel));
  }

  drawLearningRecordStrip(centerX, learningProgress, exploredPlaces, quizResult, reflectionChoice) {
    const layout = EndingSummaryViewManager.getLearningRecordLayout(centerX);
    const recordStyle = EndingSummaryViewManager.getLearningRecordStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, recordStyle.fillColor, recordStyle.fillAlpha)
      .setStrokeStyle(recordStyle.strokeWidth, recordStyle.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '28px',
      color: '#fde68a',
      fontStyle: 'bold',
    });

    const rows = EndingSummaryManager.formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), {
      fontSize: '22px',
      color: '#ffffff',
      lineSpacing: 9,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawNextMissionPanel(panel) {
    const panelStyle = EndingSummaryViewManager.getNextMissionStyle();
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, panelStyle.strokeColor);
    const titlePosition = EndingSummaryViewManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const bodyPosition = EndingSummaryViewManager.getPanelBodyPosition(panel, 32, 108);
    this.add.text(bodyPosition.x, bodyPosition.y, EP1_NEXT_DEVELOPMENT_GOALS.join('\n'), EndingSummaryViewManager.getNextMissionBodyStyle(panel));
  }

  drawControls(centerX) {
    const controls = EndingSummaryViewManager.getControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = this.createButton(control.x, control.y, control.label, control.backgroundColor, control.textColor);
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '29px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }

}
