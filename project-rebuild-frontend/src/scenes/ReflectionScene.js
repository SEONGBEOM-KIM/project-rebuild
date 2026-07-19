import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import PlacementContextManager from '../systems/PlacementContextManager.js';
import IssueDetector from '../systems/IssueDetector.js';
import LearningProgress from '../systems/LearningProgress.js';
import ReflectionViewManager from '../systems/ReflectionViewManager.js';
import ReflectionRenderer from '../systems/ReflectionRenderer.js';
import EpisodeFlowManager from '../systems/EpisodeFlowManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class ReflectionScene extends Phaser.Scene {
  constructor() {
    super('ReflectionScene');
  }

  create() {
    const { width } = this.scale;
    const gameState = this.registry.get(REGISTRY_KEYS.gameState);
    const selectedPolicy = this.registry.get(REGISTRY_KEYS.selectedPolicy);
    const placedBuildings = this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [];
    const learningProgress = LearningProgress.get(this.registry);
    const selectedStrategy = EpisodeFlowManager.resolveSelectedStrategy({ registry: this.registry, learningProgress, selectedPolicy });
    const { placementConfig, evaluationProfile } = PlacementContextManager.resolve({
      registry: this.registry,
      progress: learningProgress,
      selectedStrategy,
    });
    const issues = IssueDetector.detect(gameState, evaluationProfile);
    this.selectedChoice = this.registry.get(REGISTRY_KEYS.reflectionChoice);
    this.choiceObjects = new Map();

    const layout = ReflectionViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    createLayoutText(this, layout.contextSummary, {
      text: ReflectionViewManager.formatContextSummary(placementConfig, evaluationProfile),
      style: ReflectionViewManager.getContextSummaryTextStyle(),
      origin: 0.5,
    });

    ReflectionRenderer.renderRunSummary(this, { gameState, issues, selectedPolicy, selectedStrategy, placedBuildings }, layout);

    EpisodeFlowManager.getReflectionChoices({ registry: this.registry, learningProgress, placementConfig }).forEach((choice, index) => {
      const { x, y } = ReflectionViewManager.getChoiceCardPosition(index);
      const cardObjects = ReflectionRenderer.renderChoiceCard(
        this,
        choice,
        this.selectedChoice,
        x,
        y,
        (selected) => this.selectChoice(selected),
      );
      this.choiceObjects.set(choice.id, cardObjects);
    });

    this.feedbackText = ReflectionRenderer.renderFeedback(this, layout);

    this.drawControls();
    this.updateSelectionUi();
  }


  selectChoice(choice) {
    this.selectedChoice = choice;
    this.registry.set(REGISTRY_KEYS.reflectionChoice, choice);
    LearningProgress.update(this.registry, { reflectionChoice: choice });
    this.feedbackText.setText(ReflectionViewManager.formatSelectedFeedback(choice));
    this.feedbackText.setColor(ReflectionViewManager.getFeedbackStyle('selected').color);
    this.updateSelectionUi();
  }

  updateSelectionUi() {
    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const style = ReflectionViewManager.getChoiceCardStyle(choiceId, this.selectedChoice);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
    }
  }

  drawControls() {
    const layout = ReflectionViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, ReflectionViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, ReflectionViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => {
      if (!this.selectedChoice) {
        this.feedbackText.setText(ReflectionViewManager.formatMissingChoiceFeedback());
        this.feedbackText.setColor(ReflectionViewManager.getFeedbackStyle('missing').color);
        return;
      }
      this.scene.start(layout.next.target);
    });
  }

}
