import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { getEpisodeContent } from '../data/episodeContent.js';
import { economyBuildings } from '../data/economyBuildings.js';
import { economyPolicies } from '../data/economyPolicies.js';
import { EPISODE_IDS } from '../data/episodes.js';
import Ep3PreviewViewManager from '../systems/Ep3PreviewViewManager.js';
import Ep3PreviewRenderer from '../systems/Ep3PreviewRenderer.js';
import EpisodePlacementLaunchManager from '../systems/EpisodePlacementLaunchManager.js';
import WorldStateManager from '../systems/WorldStateManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class Ep3PreviewScene extends Phaser.Scene {
  constructor() {
    super('Ep3PreviewScene');
  }

  create() {
    const { width } = this.scale;
    const briefing = getEpisodeContent(EPISODE_IDS.EconomyGrowth).missionBriefing;
    const layout = Ep3PreviewViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.backgroundColor);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });
    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.missionBriefing = briefing;
    this.selectedStrategy = this.getInitialStrategy();
    this.strategyObjects = new Map();
    this.worldState = WorldStateManager.get(this.registry);
    this.cumulativeMode = false;

    Ep3PreviewRenderer.renderIntroPanel(this, briefing);
    this.worldProgressObjects = Ep3PreviewRenderer.renderWorldProgress(
      this,
      this.worldState,
      this.cumulativeMode,
      (cumulativeMode) => this.selectCumulativeMode(cumulativeMode),
    );
    this.renderStrategyCards();
    Ep3PreviewRenderer.renderTransitionNote(this, briefing, economyPolicies, economyBuildings);

    const controls = Ep3PreviewRenderer.renderControls(this, width / 2);
    controls.endingButton.on('pointerdown', () => this.scene.start(controls.layout.ending.target));
    controls.startButton.on('pointerdown', () => {
      this.prepareEp3Placement();
      this.scene.start(controls.layout.start.target);
    });
    controls.restartButton.on('pointerdown', () => this.scene.start(controls.layout.restart.target));
  }

  getInitialStrategy() {
    const savedStrategyId = this.registry.get(REGISTRY_KEYS.selectedPlacementStrategy);
    return Ep3PreviewViewManager.findStrategyById(this.missionBriefing, savedStrategyId)
      ?? Ep3PreviewViewManager.getDefaultStrategy(this.missionBriefing);
  }

  renderStrategyCards() {
    this.missionBriefing.strategies.forEach((strategy, index) => {
      const cardObjects = Ep3PreviewRenderer.renderFocusCard(
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
    this.updateStrategyUi();
  }

  updateStrategyUi() {
    for (const [strategyId, objects] of this.strategyObjects.entries()) {
      const style = Ep3PreviewViewManager.getCardStyle(strategyId, this.selectedStrategy?.id, objects.strategy.color);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
      objects.selectionLabel.setText(Ep3PreviewViewManager.formatSelectionLabel(strategyId, this.selectedStrategy?.id));
      objects.selectionLabel.setColor(Ep3PreviewViewManager.getSelectionLabelStyle(style.selected).color);
    }
  }

  selectCumulativeMode(cumulativeMode) {
    this.cumulativeMode = cumulativeMode;
    this.worldProgressObjects.modeStatus.setText(
      Ep3PreviewViewManager.formatWorldModeStatus(this.worldState, cumulativeMode),
    );
    for (const option of this.worldProgressObjects.modeButtons) {
      option.button.setStyle(Ep3PreviewViewManager.getWorldModeButtonStyle(option.mode === cumulativeMode));
    }
  }

  prepareEp3Placement() {
    EpisodePlacementLaunchManager.prepareEp3EconomyPlacement(this.registry, {
      selectedStrategy: this.selectedStrategy,
      cumulative: this.cumulativeMode,
    });
  }
}
