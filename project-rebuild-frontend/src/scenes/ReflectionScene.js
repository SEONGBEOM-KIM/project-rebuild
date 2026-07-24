import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import PlacementContextManager from '../systems/PlacementContextManager.js';
import IndustrializationRiskManager from '../systems/IndustrializationRiskManager.js';
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
    const placementEpisodeId = EpisodeFlowManager.resolveActivePlacementEpisodeId({ registry: this.registry, learningProgress, placementConfig });
    const issues = IndustrializationRiskManager.detect({ gameState, placedBuildings, placementEpisodeId, evaluationProfile });
    const strategies = EpisodeFlowManager.getMissionBriefing({ registry: this.registry, learningProgress, placementConfig })?.strategies ?? [];
    const selectedInsight = ReflectionViewManager.buildSelectedInsight({ selectedStrategy, selectedPolicy, gameState, issues });
    const reflectionRecord = ReflectionViewManager.buildStrategyReflectionRecord(selectedInsight);
    this.registry.set(REGISTRY_KEYS.reflectionChoice, reflectionRecord);
    LearningProgress.update(this.registry, { reflectionChoice: reflectionRecord });

    const layout = ReflectionViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    createLayoutText(this, layout.contextSummary, {
      text: ReflectionViewManager.formatContextSummary(placementConfig, evaluationProfile, selectedStrategy),
      style: ReflectionViewManager.getContextSummaryTextStyle(),
      origin: 0.5,
    });

    ReflectionRenderer.renderRunSummary(this, { gameState, issues, selectedPolicy, selectedStrategy, placedBuildings }, layout);
    ReflectionRenderer.renderSelectedInsight(this, selectedInsight, layout);
    createLayoutText(this, layout.alternativesTitle, { style: { fontSize: '25px', color: '#bfdbfe', fontStyle: 'bold' } });
    ReflectionViewManager.buildAlternativeInsights(strategies, selectedStrategy)
      .forEach((insight, index) => ReflectionRenderer.renderAlternativeInsight(this, insight, index));

    this.feedbackText = ReflectionRenderer.renderFeedback(this, layout);

    this.drawControls();
  }

  drawControls() {
    const layout = ReflectionViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, ReflectionViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, ReflectionViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => this.scene.start(layout.next.target));
  }

}
