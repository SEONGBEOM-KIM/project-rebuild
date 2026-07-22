import Phaser from 'phaser';
import { EPISODE_IDS } from '../data/episodes.js';
import { getEpisodeContent } from '../data/episodeContent.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import IndustrializationRiskManager from '../systems/IndustrializationRiskManager.js';
import LearningProgress from '../systems/LearningProgress.js';
import Ep5SolutionPlanManager from '../systems/Ep5SolutionPlanManager.js';
import Ep5PreviewViewManager from '../systems/Ep5PreviewViewManager.js';
import Ep5PreviewRenderer from '../systems/Ep5PreviewRenderer.js';

export default class Ep5PreviewScene extends Phaser.Scene {
  constructor() {
    super('Ep5PreviewScene');
  }

  create() {
    const { width } = this.scale;
    this.preview = getEpisodeContent(EPISODE_IDS.BalancedSolutions).missionPreview;
    this.risks = IndustrializationRiskManager.detect({ gameState: this.registry.get(REGISTRY_KEYS.gameState), placedBuildings: this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [], placementEpisodeId: EPISODE_IDS.EconomyGrowth });
    this.selectedPlan = this.registry.get(REGISTRY_KEYS.selectedSolutionPlan)
      ?? this.preview.solutionPlans.find((plan) => plan.primaryRiskId === Ep5SolutionPlanManager.getRecommendedPlanId(this.risks))
      ?? this.preview.solutionPlans[0];
    this.cardObjects = new Map();
    const layout = Ep5PreviewViewManager.getScreenLayout(width);
    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    Ep5PreviewRenderer.renderIntroPanel(this, this.preview, Ep5SolutionPlanManager.getPrimaryRisk(this.risks));
    this.preview.solutionPlans.forEach((plan, index) => this.cardObjects.set(plan.id, Ep5PreviewRenderer.renderPlanCard(this, plan, index, this.selectedPlan?.id, this.risks, (selectedPlan) => this.selectPlan(selectedPlan))));
    const controls = Ep5PreviewRenderer.renderControls(this, width / 2);
    controls.backButton.on('pointerdown', () => this.scene.start(controls.layout.back.target));
    this.nextButton = controls.nextButton;
    this.nextButton.on('pointerdown', () => this.scene.start(controls.layout.next.target));
    this.persistSelection();
    this.updateUi();
  }

  selectPlan(plan) {
    this.selectedPlan = plan;
    this.persistSelection();
    this.updateUi();
  }

  persistSelection() {
    this.registry.set(REGISTRY_KEYS.selectedSolutionPlan, this.selectedPlan);
    LearningProgress.update(this.registry, { selectedSolutionPlanId: this.selectedPlan?.id ?? null });
  }

  updateUi() {
    this.nextButton.setStyle(Ep5PreviewViewManager.getNextButtonStyle(Boolean(this.selectedPlan)));
    for (const [planId, objects] of this.cardObjects.entries()) {
      const selected = planId === this.selectedPlan?.id;
      const recommended = Ep5SolutionPlanManager.isRecommended(objects.plan, this.risks);
      const style = Ep5PreviewViewManager.getCardStyle(objects.plan, selected, recommended);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha).setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.status.setText(Ep5SolutionPlanManager.formatSelectionStatus(objects.plan, this.selectedPlan?.id, this.risks));
    }
  }
}
