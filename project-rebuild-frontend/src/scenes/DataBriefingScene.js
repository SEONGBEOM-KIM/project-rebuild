import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import DataBriefingViewManager from '../systems/DataBriefingViewManager.js';
import DataBriefingRenderer from '../systems/DataBriefingRenderer.js';

import { getCurrentEpisodeContent } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';

export default class DataBriefingScene extends Phaser.Scene {
  constructor() {
    super('DataBriefingScene');
  }

  create() {
    const { width } = this.scale;
    const layout = DataBriefingViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, {
      text: DataBriefingViewManager.formatSubtitle(CURRENT_EPISODE.regionName),
      origin: 0.5,
    });

    const episodeContent = getCurrentEpisodeContent();
    this.dataCards = episodeContent.dataCards;
    this.viewedDataCardIds = new Set(this.registry.get(REGISTRY_KEYS.viewedDataCardIds) ?? []);
    this.cardObjects = new Map();

    this.dataCards.forEach((card, index) => {
      const { x, y } = DataBriefingViewManager.getCardPosition(index);
      this.cardObjects.set(card.id, DataBriefingRenderer.renderDataCard(this, card, x, y, {
        viewed: this.viewedDataCardIds.has(card.id),
        onSelect: (selectedCard) => this.selectCard(selectedCard),
      }));
    });

    DataBriefingRenderer.renderConceptBox(this, episodeContent.coreConcept);
    this.progressText = createLayoutText(this, layout.progress, {
      text: DataBriefingViewManager.formatProgress(this.viewedDataCardIds.size, this.dataCards.length),
      style: DataBriefingViewManager.getDataCardTextStyles().progress,
      origin: 0.5,
    });
    this.drawControls();
  }

  selectCard(card) {
    this.viewedDataCardIds.add(card.id);
    this.registry.set(REGISTRY_KEYS.viewedDataCardIds, [...this.viewedDataCardIds]);
    LearningProgress.update(this.registry, {
      viewedDataCardIds: [...this.viewedDataCardIds],
      dataViewed: this.viewedDataCardIds.size >= this.dataCards.length,
    });
    const cardObjects = this.cardObjects.get(card.id);
    if (cardObjects?.panel) {
      const state = DataBriefingViewManager.getCardState(true);
      cardObjects.panel.setStrokeStyle(state.strokeWidth, state.strokeColor);
    }
    if (cardObjects?.statusText) {
      const status = DataBriefingViewManager.getCardStatus(true);
      cardObjects.statusText.setText(status.label).setColor(status.color);
    }
    this.updateControls();
  }


  drawControls() {
    const layout = DataBriefingViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, DataBriefingViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    this.nextButton = createTextButton(this, layout.next, DataBriefingViewManager.getButtonStyle());
    this.updateControls();
    this.nextButton.on('pointerdown', () => {
      if (this.viewedDataCardIds.size < this.dataCards.length) {
        this.progressText.setText(DataBriefingViewManager.formatProgress(this.viewedDataCardIds.size, this.dataCards.length));
        return;
      }
      this.scene.start(layout.next.target);
    });
  }

  updateControls() {
    if (!this.nextButton) {
      return;
    }
    const complete = this.viewedDataCardIds.size >= this.dataCards.length;
    this.nextButton.setText(complete ? '원인 질문 풀기' : `${this.dataCards.length - this.viewedDataCardIds.size}개 자료 더 확인`);
    this.nextButton.setStyle({ backgroundColor: complete ? '#bbf7d0' : '#94a3b8' });
    this.progressText?.setText(DataBriefingViewManager.formatProgress(this.viewedDataCardIds.size, this.dataCards.length));
  }

}
