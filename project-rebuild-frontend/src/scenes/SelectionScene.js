import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { getCurrentPlacementMissionBriefing } from '../data/episodeContent.js';
import { policies } from '../data/policies.js';
import { getPlacementConfigIdForStrategy } from '../data/episodePlacementConfigs.js';
import LearningProgress from '../systems/LearningProgress.js';
import SelectionViewManager from '../systems/SelectionViewManager.js';
import SelectionPolicyCardRenderer from '../systems/SelectionPolicyCardRenderer.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class SelectionScene extends Phaser.Scene {
  constructor() {
    super('SelectionScene');
  }

  create() {
    const { width, height } = this.scale;
    this.selectedPolicy = this.registry.get(REGISTRY_KEYS.selectedPolicy) ?? policies[0];
    this.cardObjects = new Map();

    const layout = SelectionViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    policies.forEach((policy, index) => {
      const position = SelectionViewManager.getPolicyCardPosition(index);
      this.createPolicyCard(policy, position.x, position.y);
    });

    this.detailText = createLayoutText(this, layout.detail, {
      style: SelectionViewManager.getTextStyles().detail,
      origin: [0.5, 0],
    });

    const controls = SelectionViewManager.getControlLayout(width / 2);
    const backButton = createTextButton(this, controls.back, SelectionViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(controls.back.target));

    const startButton = createTextButton(this, controls.start, SelectionViewManager.getButtonStyle());
    startButton.on('pointerdown', () => {
      const strategy = this.syncSelectedStrategy(this.selectedPolicy);
      this.registry.set(REGISTRY_KEYS.selectedPolicy, this.selectedPolicy);
      LearningProgress.update(this.registry, {
        selectedPolicyId: this.selectedPolicy.id,
        selectedStrategyId: strategy?.id ?? null,
        placementConfigId: getPlacementConfigIdForStrategy(strategy),
      });
      this.scene.start(controls.start.target);
    });

    this.updateSelectionUi();
  }

  createPolicyCard(policy, x, y) {
    const cardObjects = SelectionPolicyCardRenderer.render(this, policy, this.selectedPolicy, { x, y }, {
      onSelect: (selectedPolicy) => {
        this.selectedPolicy = selectedPolicy;
        this.registry.set(REGISTRY_KEYS.selectedPolicy, selectedPolicy);
        const strategy = this.syncSelectedStrategy(selectedPolicy);
        LearningProgress.update(this.registry, {
          selectedPolicyId: selectedPolicy.id,
          selectedStrategyId: strategy?.id ?? null,
          placementConfigId: getPlacementConfigIdForStrategy(strategy),
        });
        this.updateSelectionUi();
      },
    });
    this.cardObjects.set(policy.id, cardObjects);
  }


  syncSelectedStrategy(policy) {
    const strategy = Ep2BriefingViewManager.findStrategyByPolicyId(getCurrentPlacementMissionBriefing(), policy?.id);
    if (strategy) {
      this.registry.set(REGISTRY_KEYS.selectedPlacementStrategy, strategy.id);
      this.registry.set(REGISTRY_KEYS.placementConfigId, getPlacementConfigIdForStrategy(strategy));
    }
    return strategy;
  }

  updateSelectionUi() {
    for (const [policyId, objects] of this.cardObjects.entries()) {
      const style = SelectionViewManager.getCardStyle(policyId, this.selectedPolicy);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
    }

    if (this.detailText) {
      const strategy = Ep2BriefingViewManager.findStrategyByPolicyId(getCurrentPlacementMissionBriefing(), this.selectedPolicy?.id);
      this.detailText.setText(SelectionViewManager.formatDetailText(this.selectedPolicy, strategy));
    }
  }
}
