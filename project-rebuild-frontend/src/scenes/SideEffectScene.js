import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import IssueDetector from '../systems/IssueDetector.js';
import SideEffectViewManager from '../systems/SideEffectViewManager.js';
import SideEffectRenderer from '../systems/SideEffectRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { getCurrentPlacementMissionBriefing } from '../data/episodeContent.js';
import PlacementContextManager from '../systems/PlacementContextManager.js';
import LearningProgress from '../systems/LearningProgress.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class SideEffectScene extends Phaser.Scene {
  constructor() {
    super('SideEffectScene');
  }

  create() {
    const { width } = this.scale;
    const gameState = this.registry.get(REGISTRY_KEYS.gameState);
    const selectedPolicy = this.registry.get(REGISTRY_KEYS.selectedPolicy);
    const learningProgress = LearningProgress.get(this.registry);
    const selectedStrategy = Ep2BriefingViewManager.resolveStrategy(
      getCurrentPlacementMissionBriefing(),
      this.registry.get(REGISTRY_KEYS.selectedPlacementStrategy) ?? learningProgress.selectedStrategyId,
      selectedPolicy?.id,
    );
    const { placementConfig, evaluationProfile } = PlacementContextManager.resolve({
      registry: this.registry,
      progress: learningProgress,
      selectedStrategy,
    });
    const issues = IssueDetector.detect(gameState, evaluationProfile);

    const layout = SideEffectViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    createLayoutText(this, layout.contextSummary, {
      text: SideEffectViewManager.formatContextSummary(placementConfig, evaluationProfile),
      style: SideEffectViewManager.getContextSummaryTextStyle(),
      origin: 0.5,
    });

    SideEffectRenderer.renderIssueArea(this, issues);
    SideEffectRenderer.renderConceptPanel(this, issues, selectedStrategy);
    this.drawControls();
  }


  drawControls() {
    const layout = SideEffectViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, SideEffectViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, SideEffectViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => this.scene.start(layout.next.target));
  }

}
