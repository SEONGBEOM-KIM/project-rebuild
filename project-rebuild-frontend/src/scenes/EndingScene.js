import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_NEXT_DEVELOPMENT_GOALS } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';
import EndingSummaryManager from '../systems/EndingSummaryManager.js';
import EndingSummaryViewManager from '../systems/EndingSummaryViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

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
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    const panels = EndingSummaryViewManager.getPanelLayout();
    this.drawPanel(panels.choice, EndingSummaryManager.formatChoiceSummary(selectedPolicy, placedBuildings));
    this.drawPanel(panels.state, EndingSummaryManager.formatStateSummary(gameState, ending));
    this.drawNextMissionPanel(panels.nextMission);
    this.drawLearningRecordStrip(width / 2, learningProgress, exploredPlaces, quizResult, reflectionChoice);
    this.drawControls(width / 2);
  }

  drawPanel(panel, body) {
    const panelStyle = EndingSummaryViewManager.getPanelStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(this, panel, panelStyle);
    const titlePosition = EndingSummaryViewManager.getPanelTitlePosition(panel);
    createPanelTitle(this, titlePosition, textStyles.panelTitle, { text: panel.title, origin: 0.5 });
    const bodyPosition = EndingSummaryViewManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, EndingSummaryViewManager.getPanelBodyStyle(panel));
  }

  drawLearningRecordStrip(centerX, learningProgress, exploredPlaces, quizResult, reflectionChoice) {
    const layout = EndingSummaryViewManager.getLearningRecordLayout(centerX);
    const recordStyle = EndingSummaryViewManager.getLearningRecordStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(this, layout.panel, recordStyle);
    createPanelTitle(this, layout.title, textStyles.learningRecordTitle);

    const rows = EndingSummaryManager.formatLearningRecordRows(learningProgress, exploredPlaces, quizResult, reflectionChoice);

    createLayoutText(this, layout.body, {
      text: rows.join('\n'),
      style: textStyles.learningRecordBody,
    });
  }

  drawNextMissionPanel(panel) {
    const panelStyle = EndingSummaryViewManager.getNextMissionStyle();
    const textStyles = EndingSummaryViewManager.getTextStyles();
    createPanelBackground(this, panel, panelStyle);
    const titlePosition = EndingSummaryViewManager.getPanelTitlePosition(panel);
    createPanelTitle(this, titlePosition, textStyles.nextMissionTitle, { text: panel.title, origin: 0.5 });

    const bodyPosition = EndingSummaryViewManager.getPanelBodyPosition(panel, 32, 108);
    this.add.text(bodyPosition.x, bodyPosition.y, EP1_NEXT_DEVELOPMENT_GOALS.join('\n'), EndingSummaryViewManager.getNextMissionBodyStyle(panel));
  }

  drawControls(centerX) {
    const controls = EndingSummaryViewManager.getControlLayout(centerX);
    Object.values(controls).forEach((control) => {
      const button = createTextButton(this, control, EndingSummaryViewManager.getButtonStyle());
      button.on('pointerdown', () => this.scene.start(control.target));
    });
  }


}
