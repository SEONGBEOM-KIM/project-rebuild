import PlacementUiStateManager from './PlacementUiStateManager.js';
import PlacementViewManager from './PlacementViewManager.js';
import StateHudRenderer from '../ui/StateHudRenderer.js';

export default class PlacementUiRenderer {
  constructor({
    objectRegistry,
    buildings,
    selectedPolicy,
    getPlacedCount,
    requiredPlacements,
    currentState = null,
    stateKeys = undefined,
    onSelectBuilding,
    onContinue,
    onContinueBlocked,
    uiStateManager = PlacementUiStateManager,
    viewManager = PlacementViewManager,
  }) {
    this.objectRegistry = objectRegistry;
    this.buildings = buildings;
    this.selectedPolicy = selectedPolicy;
    this.getPlacedCount = getPlacedCount;
    this.requiredPlacements = requiredPlacements;
    this.currentState = currentState;
    this.stateKeys = stateKeys;
    this.onSelectBuilding = onSelectBuilding;
    this.onContinue = onContinue;
    this.onContinueBlocked = onContinueBlocked;
    this.uiStateManager = uiStateManager;
    this.viewManager = viewManager;
  }

  create() {
    const cardObjects = new Map();
    const layout = this.viewManager.getUiLayout();
    const textStyles = this.viewManager.getTextStyles();

    const stateHud = this.createStateHud(layout, textStyles);

    this.objectRegistry.createFixedRectangleFromLayout(layout.leftPanel);
    this.objectRegistry.createFixedTextFromLayout(layout.title, textStyles.title);
    this.objectRegistry.createFixedTextFromLayout(layout.subtitle, textStyles.subtitle);

    const missionText = this.objectRegistry.createFixedTextFromLayout(layout.mission, textStyles.mission);

    this.buildings.forEach((building, index) => {
      cardObjects.set(
        building.id,
        this.createBuildingCard(building, layout.buildingList.x, layout.buildingList.startY + index * layout.buildingList.gapY),
      );
    });

    const statusText = this.objectRegistry.createFixedTextFromLayout(layout.status, textStyles.status);
    const cursorInfoText = this.objectRegistry.createFixedLayoutText(layout.cursorInfo, {
      style: textStyles.cursorInfo,
    });
    const messageText = this.objectRegistry.createFixedLayoutText(layout.message, {
      style: textStyles.message,
    });

    const { continueButtonBg, continueButton } = this.createContinueButton(layout, textStyles);
    this.createLegend();
    const lastChangeText = this.createLastChangePanel();
    const placementHistoryText = this.createPlacementHistoryPanel();

    return {
      cardObjects,
      stateHud,
      missionText,
      statusText,
      cursorInfoText,
      messageText,
      continueButtonBg,
      continueButton,
      lastChangeText,
      placementHistoryText,
    };
  }

  createStateHud(layout, textStyles) {
    if (!this.currentState) {
      return null;
    }

    return StateHudRenderer.render(this.objectRegistry, layout.stateHud, textStyles, this.currentState, {
      stateKeys: this.stateKeys,
    });
  }

  createContinueButton(layout, textStyles) {
    const continueButtonBg = this.objectRegistry.createFixedRectangleFromLayout(layout.continueButton, {
      fillColor: layout.continueButton.backgroundColor,
    }).setInteractive({ useHandCursor: true });
    const continueButton = this.objectRegistry.createFixedTextFromLayout(layout.continueButton, textStyles.continueButton)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const handleContinue = () => {
      if (!this.uiStateManager.canContinue(this.getPlacedCount(), this.requiredPlacements)) {
        this.onContinueBlocked?.(this.getPlacedCount());
        return;
      }
      this.onContinue?.(layout.continueButton.target);
    };
    continueButtonBg.on('pointerdown', handleContinue);
    continueButton.on('pointerdown', handleContinue);

    return { continueButtonBg, continueButton };
  }

  createLegend() {
    const legendItems = this.viewManager.getLegendItems();
    const layout = this.viewManager.getUiLayout();
    const textStyles = this.viewManager.getTextStyles();

    this.objectRegistry.createFixedRectangleFromLayout(layout.legendPanel);
    this.objectRegistry.createFixedTextFromLayout(layout.legendTitle, textStyles.panelTitle);

    legendItems.forEach((item, index) => {
      const itemLayout = this.viewManager.getLegendItemLayout(index, item);
      this.objectRegistry.createFixedRectangleFromLayout(itemLayout.swatch);
      this.objectRegistry.createFixedTextFromLayout(itemLayout.text, {
        ...textStyles.legendText,
        color: this.viewManager.getLegendTextColor(item),
      });
    });
  }

  createLastChangePanel() {
    const layout = this.viewManager.getUiLayout();
    const emptyState = this.uiStateManager.getEmptyLastChangeState();
    const textStyles = this.viewManager.getTextStyles();

    this.objectRegistry.createFixedRectangleFromLayout(layout.lastChangePanel);
    this.objectRegistry.createFixedTextFromLayout(layout.lastChangeTitle, textStyles.panelTitle);
    return this.objectRegistry.createFixedLayoutText(layout.lastChangeBody, {
      text: emptyState.text,
      style: {
        ...textStyles.panelBody,
        color: emptyState.color,
      },
    });
  }

  createPlacementHistoryPanel() {
    const layout = this.viewManager.getUiLayout();
    const emptyState = this.uiStateManager.getEmptyPlacementHistoryState();
    const textStyles = this.viewManager.getTextStyles();

    this.objectRegistry.createFixedRectangleFromLayout(layout.historyPanel);
    this.objectRegistry.createFixedTextFromLayout(layout.historyTitle, textStyles.panelTitle);
    return this.objectRegistry.createFixedLayoutText(layout.historyBody, {
      text: emptyState.text,
      style: {
        ...textStyles.panelBody,
        color: emptyState.color,
      },
    });
  }

  createBuildingCard(building, x, y) {
    const layout = this.viewManager.getBuildingCardLayout(x, y);
    const textStyles = this.viewManager.getTextStyles();
    const content = this.viewManager.getBuildingCardContent(building);
    const visual = this.viewManager.getBuildingCardVisual(building);
    const card = this.objectRegistry.createFixedRectangleFromLayout(layout.card, visual.card)
      .setInteractive({ useHandCursor: true });
    const swatch = this.objectRegistry.createFixedRectangleFromLayout(layout.swatch, visual.swatch);
    const title = this.objectRegistry.createFixedTextFromLayout(layout.title, textStyles.cardTitle, { text: content.title });
    const recommendationBadge = this.createRecommendationBadge(building, layout.recommendationBadge.x, layout.recommendationBadge.y);
    const detail = this.objectRegistry.createFixedTextFromLayout(layout.detail, textStyles.cardDetail, { text: content.detail });
    const description = this.objectRegistry.createFixedLayoutText(layout.description, {
      text: content.description,
      style: textStyles.cardDescription,
    });
    const placementHint = this.objectRegistry.createFixedLayoutText(layout.placementHint, {
      text: content.placementHint,
      style: textStyles.cardPlacementHint,
    });
    const effect = this.objectRegistry.createFixedLayoutText(layout.effect, {
      text: content.effect,
      style: textStyles.cardEffect,
    });

    const selectBuilding = () => this.onSelectBuilding?.(building);
    card.on('pointerdown', selectBuilding);
    title.setInteractive({ useHandCursor: true }).on('pointerdown', selectBuilding);

    return { building, card, swatch, title, detail, description, placementHint, effect, recommendationBadge };
  }

  createRecommendationBadge(building, x, y) {
    if (!this.viewManager.isRecommendedBuilding(building, this.selectedPolicy)) {
      return null;
    }

    const layout = this.viewManager.getRecommendationBadgeLayout(x, y);
    const badgeBg = this.objectRegistry.createFixedRectangleFromLayout(layout.background);
    const badgeText = this.objectRegistry.createFixedTextFromLayout(layout.text, this.viewManager.getTextStyles().recommendationBadge).setOrigin(0.5);
    return { badgeBg, badgeText };
  }

  updateSelectedBuildingCards(cardObjects, selectedBuilding) {
    for (const objects of cardObjects.values()) {
      const style = this.viewManager.getBuildingCardStyle(objects.building, selectedBuilding, this.selectedPolicy);
      objects.card.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.card.setFillStyle(style.fillColor, style.fillAlpha);
    }
  }
}
