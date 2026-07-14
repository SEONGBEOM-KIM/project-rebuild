import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_NEXT_DEVELOPMENT_GOALS } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';
import EndingSummaryManager from '../systems/EndingSummaryManager.js';

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

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    ProgressStepper.render(this, 'ending');
    this.add.text(width / 2, 78, '학습 마무리', {
      fontSize: '62px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, 'EP1 탐색부터 시설 배치까지의 학습 기록을 요약합니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    const panels = EndingSummaryManager.getPanelLayout();
    this.drawPanel(panels.choice, EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings));
    this.drawPanel(panels.state, EndingSummaryManager.formatStateSummary(gameState, ending));
    this.drawNextMissionPanel(panels.nextMission);
    this.drawLearningRecordStrip(width / 2, learningProgress, exploredPlaces, quizResult, reflectionChoice);
    this.drawControls(width / 2);
  }

  drawPanel(panel, body) {
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, 0xffffff, 0.96).setStrokeStyle(4, 0x60a5fa);
    const titlePosition = EndingSummaryManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const bodyPosition = EndingSummaryManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, EndingSummaryManager.getPanelBodyStyle(panel));
  }

  drawLearningRecordStrip(centerX, learningProgress, exploredPlaces, quizResult, reflectionChoice) {
    const layout = EndingSummaryManager.getLearningRecordLayout(centerX);
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x1e293b, 0.96).setStrokeStyle(4, 0xfde68a);
    this.add.text(layout.title.x, layout.title.y, '학습 기록', {
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
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, 0x1e293b, 0.98).setStrokeStyle(4, 0xbbf7d0);
    const titlePosition = EndingSummaryManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const bodyPosition = EndingSummaryManager.getPanelBodyPosition(panel, 32, 108);
    this.add.text(bodyPosition.x, bodyPosition.y, EP1_NEXT_DEVELOPMENT_GOALS.join('\n'), EndingSummaryManager.getNextMissionBodyStyle(panel));
  }

  drawControls(centerX) {
    const controls = EndingSummaryManager.getControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = this.createButton(control.x, control.y, control.label, control.backgroundColor);
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }

  createButton(x, y, label, backgroundColor) {
    return this.add.text(x, y, label, {
      fontSize: '29px',
      color: '#0f172a',
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }

}
