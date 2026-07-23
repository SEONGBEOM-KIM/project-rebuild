import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { getCurrentPlacementMissionBriefing } from '../data/episodeContent.js';
import { policies } from '../data/policies.js';
import { getPlacementConfigIdForStrategy } from '../data/episodePlacementConfigs.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import Ep2BriefingRenderer from '../systems/Ep2BriefingRenderer.js';
import WorldStateManager from '../systems/WorldStateManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { EPISODE_IDS } from '../data/episodes.js';

export default class Ep2BriefingScene extends Phaser.Scene {
  constructor() {
    super('Ep2BriefingScene');
  }

  create() {
    const { width } = this.scale;
    const layout = Ep2BriefingViewManager.getScreenLayout(width);
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.selectedStrategy = this.getInitialStrategy();
    this.strategyObjects = new Map();

    this.missionBriefing = getCurrentPlacementMissionBriefing();

    Ep2BriefingRenderer.renderIntroPanel(this, this.missionBriefing);
    this.renderStrategyCards();
    this.selectedStrategyPanel = Ep2BriefingRenderer.renderSelectedStrategyPanel(this, this.selectedStrategy);

    const controls = Ep2BriefingRenderer.renderControls(this, width / 2);
    controls.endingButton.on('pointerdown', () => this.scene.start(controls.layout.ending.target));
    controls.startButton.on('pointerdown', () => {
      this.applySelectedStrategy();
      this.scene.start(controls.layout.start.target);
    });
  }

  getInitialStrategy() {
    const savedStrategyId = this.registry.get(REGISTRY_KEYS.selectedPlacementStrategy);
    const missionBriefing = this.missionBriefing ?? getCurrentPlacementMissionBriefing();
    return Ep2BriefingViewManager.findStrategyById(missionBriefing, savedStrategyId)
      ?? Ep2BriefingViewManager.getDefaultStrategy(missionBriefing);
  }

  renderStrategyCards() {
    this.missionBriefing.strategies.forEach((strategy, index) => {
      const cardObjects = Ep2BriefingRenderer.renderStrategyCard(
        this,
        strategy,
        index,
        this.selectedStrategy?.id,
        (selectedStrategy) => this.selectStrategy(selectedStrategy),
      );
      this.strategyObjects.set(strategy.id, cardObjects);
    });
  }

  selectStrategy(strategy) {
    this.selectedStrategy = strategy;
    this.registry.set(REGISTRY_KEYS.selectedPlacementStrategy, strategy.id);
    this.registry.set(REGISTRY_KEYS.placementConfigId, getPlacementConfigIdForStrategy(strategy));
    this.updateStrategyUi();
  }

  updateStrategyUi() {
    for (const [strategyId, objects] of this.strategyObjects.entries()) {
      const style = Ep2BriefingViewManager.getCardStyle(strategyId, this.selectedStrategy?.id, objects.strategy.color);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
      objects.selectionLabel.setText(Ep2BriefingViewManager.formatSelectionLabel(strategyId, this.selectedStrategy?.id));
      objects.selectionLabel.setColor(Ep2BriefingViewManager.getSelectionLabelStyle(style.selected).color);
    }
    this.selectedStrategyPanel?.body.setText(Ep2BriefingViewManager.formatSelectedStrategySummary(this.selectedStrategy));
  }

  applySelectedStrategy() {
    const strategy = this.selectedStrategy ?? Ep2BriefingViewManager.getDefaultStrategy(this.missionBriefing ?? getCurrentPlacementMissionBriefing());
    const policy = policies.find((candidate) => candidate.id === strategy?.policyId);
    if (strategy) {
      this.registry.set(REGISTRY_KEYS.selectedPlacementStrategy, strategy.id);
      this.registry.set(REGISTRY_KEYS.placementConfigId, getPlacementConfigIdForStrategy(strategy));
    }
    if (policy) {
      this.registry.set(REGISTRY_KEYS.selectedPolicy, policy);
    }
    const worldState = WorldStateManager.get(this.registry);
    this.registry.set(
      REGISTRY_KEYS.worldState,
      WorldStateManager.setEpisodeRunMetadata(worldState, EPISODE_IDS.PopulationRecovery, {
        selectedStrategyId: strategy?.id ?? null,
        selectedPolicyId: policy?.id ?? null,
        placementConfigId: getPlacementConfigIdForStrategy(strategy),
      }),
    );
  }
}
