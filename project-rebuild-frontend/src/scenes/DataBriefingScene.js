import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import DataBriefingViewManager from '../systems/DataBriefingViewManager.js';

import { EP1_CORE_CONCEPT, EP1_DATA_CARDS } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class DataBriefingScene extends Phaser.Scene {
  constructor() {
    super('DataBriefingScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = DataBriefingViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, {
      text: DataBriefingViewManager.formatSubtitle(CURRENT_EPISODE.regionName),
      origin: 0.5,
    });

    EP1_DATA_CARDS.forEach((card, index) => {
      const { x, y } = DataBriefingViewManager.getCardPosition(index);
      this.drawDataCard(card, x, y);
    });

    this.drawConceptBox();
    this.drawControls();
  }

  drawDataCard(card, x, y) {
    const layout = DataBriefingViewManager.getDataCardLayout(x, y);
    const textStyles = DataBriefingViewManager.getDataCardTextStyles();
    createPanelBackground(this, layout.panel, layout.panel);
    createPanelTitle(this, layout.title, textStyles.title, { text: card.title, origin: 0.5 });
    this.add.text(layout.subtitle.x, layout.subtitle.y, card.subtitle, textStyles.subtitle).setOrigin(0.5);

    card.bars.forEach((bar, index) => {
      const barLayout = DataBriefingViewManager.getBarLayout(bar, x, y, index);
      this.add.text(layout.barLabel.x, barLayout.y, bar.label, textStyles.barLabel).setOrigin(0, 0.5);
      this.add.rectangle(barLayout.x, barLayout.y, barLayout.backgroundWidth, barLayout.height, layout.barBackgroundColor).setOrigin(0, 0.5);
      this.add.rectangle(barLayout.x, barLayout.y, barLayout.width, barLayout.height, bar.color).setOrigin(0, 0.5);
      this.add.text(layout.barValue.x, barLayout.y, DataBriefingViewManager.formatBarValue(bar), textStyles.barValue).setOrigin(1, 0.5);
    });

    createPanelBackground(this, layout.takeawayPanel, layout.takeawayPanel);
    createPanelTitle(this, layout.takeawayTitle, textStyles.takeawayTitle);
    createLayoutText(this, layout.takeawayBody, {
      text: card.takeaway,
      style: textStyles.takeawayBody,
    });
  }

  drawConceptBox() {
    const layout = DataBriefingViewManager.getConceptBoxLayout();
    const textStyles = DataBriefingViewManager.getConceptBoxTextStyles();
    createPanelBackground(this, layout.panel, layout.panel);
    createPanelTitle(this, layout.title, textStyles.title);
    createLayoutText(this, layout.body, {
      text: EP1_CORE_CONCEPT,
      style: textStyles.body,
    });
  }

  drawControls() {
    const layout = DataBriefingViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, DataBriefingViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, DataBriefingViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { dataViewed: true });
      this.scene.start(layout.next.target);
    });
  }

}
