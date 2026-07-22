import Phaser from 'phaser';
import { EPISODE_IDS } from '../data/episodes.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import IndustrializationRiskManager from '../systems/IndustrializationRiskManager.js';
import LearningProgress from '../systems/LearningProgress.js';
import Ep4InvestigationViewManager from '../systems/Ep4InvestigationViewManager.js';
import Ep4InvestigationRenderer from '../systems/Ep4InvestigationRenderer.js';

export default class Ep4InvestigationScene extends Phaser.Scene {
  constructor() {
    super('Ep4InvestigationScene');
  }

  create() {
    const { width } = this.scale;
    this.risks = IndustrializationRiskManager.detect({
      gameState: this.registry.get(REGISTRY_KEYS.gameState),
      placedBuildings: this.registry.get(REGISTRY_KEYS.placedBuildings) ?? [],
      placementEpisodeId: EPISODE_IDS.EconomyGrowth,
    });
    this.reviewedRiskIds = new Set(LearningProgress.get(this.registry).reviewedRiskIds ?? []);
    this.selectedRiskId = null;
    this.cardObjects = new Map();
    const layout = Ep4InvestigationViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });
    this.progressText = createLayoutText(this, layout.progress, { text: '', style: { fontSize: '22px', color: '#dbeafe', align: 'center', wordWrap: { width: layout.progress.wordWrapWidth } }, origin: 0.5 });
    this.risks.forEach((risk, index) => this.cardObjects.set(risk.id, Ep4InvestigationRenderer.renderRiskCard(this, risk, index, false, false, (selectedRisk) => this.selectRisk(selectedRisk))));
    this.detailText = Ep4InvestigationRenderer.renderDetailPanel(this);
    const controls = Ep4InvestigationRenderer.renderControls(this, width / 2);
    controls.backButton.on('pointerdown', () => this.scene.start(controls.layout.back.target));
    this.nextButton = controls.nextButton;
    this.nextButton.on('pointerdown', () => {
      if (this.reviewedRiskIds.size < this.risks.length) return;
      LearningProgress.update(this.registry, { ep4InvestigationCompleted: true });
      this.scene.start(controls.layout.next.target);
    });
    this.updateUi();
  }

  selectRisk(risk) {
    this.selectedRiskId = risk.id;
    this.reviewedRiskIds.add(risk.id);
    LearningProgress.addReviewedRisk(this.registry, risk.id);
    this.detailText.setText(Ep4InvestigationViewManager.formatDetail(risk));
    this.updateUi();
  }

  updateUi() {
    const allReviewed = this.reviewedRiskIds.size === this.risks.length;
    this.progressText.setText(Ep4InvestigationViewManager.formatProgress(this.reviewedRiskIds.size, this.risks.length));
    this.nextButton.setStyle(Ep4InvestigationViewManager.getNextButtonStyle(allReviewed));
    for (const [riskId, objects] of this.cardObjects.entries()) {
      const risk = objects.risk;
      const style = Ep4InvestigationViewManager.getCardStyle(risk, riskId === this.selectedRiskId, this.reviewedRiskIds.has(riskId));
      objects.background.setFillStyle(style.fillColor, style.fillAlpha).setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.status.setText(Ep4InvestigationViewManager.formatCardStatus(risk, this.reviewedRiskIds.has(riskId)));
    }
  }
}
