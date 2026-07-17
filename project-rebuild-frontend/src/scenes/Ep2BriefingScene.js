import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP2_MISSION_BRIEFING } from '../data/episodeContent.js';
import { policies } from '../data/policies.js';
import Ep2BriefingViewManager from '../systems/Ep2BriefingViewManager.js';
import Ep2BriefingRenderer from '../systems/Ep2BriefingRenderer.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class Ep2BriefingScene extends Phaser.Scene {
  constructor() {
    super('Ep2BriefingScene');
  }

  create() {
    const { width } = this.scale;
    const layout = Ep2BriefingViewManager.getScreenLayout(width);
    createScreenBackground(this, layout.backgroundColor);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.selectedStrategy = this.getInitialStrategy();
    this.strategyObjects = new Map();

    Ep2BriefingRenderer.renderIntroPanel(this, EP2_MISSION_BRIEFING);
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
    const savedStrategyId = this.registry.get('ep2StrategyId');
    return Ep2BriefingViewManager.findStrategyById(EP2_MISSION_BRIEFING, savedStrategyId)
      ?? Ep2BriefingViewManager.getDefaultStrategy(EP2_MISSION_BRIEFING);
  }

  renderStrategyCards() {
    EP2_MISSION_BRIEFING.strategies.forEach((strategy, index) => {
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
    this.registry.set('ep2StrategyId', strategy.id);
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
    const strategy = this.selectedStrategy ?? Ep2BriefingViewManager.getDefaultStrategy(EP2_MISSION_BRIEFING);
    const policy = policies.find((candidate) => candidate.id === strategy?.policyId);
    if (strategy) {
      this.registry.set('ep2StrategyId', strategy.id);
    }
    if (policy) {
      this.registry.set('selectedPolicy', policy);
    }
  }
}
