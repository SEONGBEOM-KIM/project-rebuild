import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import DataBriefingViewManager from '../systems/DataBriefingViewManager.js';

import { EP1_CORE_CONCEPT, EP1_DATA_CARDS } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';

export default class DataBriefingScene extends Phaser.Scene {
  constructor() {
    super('DataBriefingScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = DataBriefingViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    this.add.text(layout.title.x, layout.title.y, layout.title.text, layout.title).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, DataBriefingViewManager.formatSubtitle(CURRENT_EPISODE.regionName), {
      fontSize: layout.subtitle.fontSize,
      color: layout.subtitle.color,
    }).setOrigin(0.5);

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
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, card.title, {
      ...textStyles.title,
      wordWrap: { width: layout.title.wordWrapWidth },
    }).setOrigin(0.5);
    this.add.text(layout.subtitle.x, layout.subtitle.y, card.subtitle, textStyles.subtitle).setOrigin(0.5);

    card.bars.forEach((bar, index) => {
      const barLayout = DataBriefingViewManager.getBarLayout(bar, x, y, index);
      this.add.text(layout.barLabel.x, barLayout.y, bar.label, textStyles.barLabel).setOrigin(0, 0.5);
      this.add.rectangle(barLayout.x, barLayout.y, barLayout.backgroundWidth, barLayout.height, layout.barBackgroundColor).setOrigin(0, 0.5);
      this.add.rectangle(barLayout.x, barLayout.y, barLayout.width, barLayout.height, bar.color).setOrigin(0, 0.5);
      this.add.text(layout.barValue.x, barLayout.y, DataBriefingViewManager.formatBarValue(bar), textStyles.barValue).setOrigin(1, 0.5);
    });

    this.add.rectangle(layout.takeawayPanel.x, layout.takeawayPanel.y, layout.takeawayPanel.width, layout.takeawayPanel.height, layout.takeawayPanel.fillColor, layout.takeawayPanel.fillAlpha)
      .setStrokeStyle(layout.takeawayPanel.strokeWidth, layout.takeawayPanel.strokeColor);
    this.add.text(layout.takeawayTitle.x, layout.takeawayTitle.y, layout.takeawayTitle.text, textStyles.takeawayTitle);
    this.add.text(layout.takeawayBody.x, layout.takeawayBody.y, card.takeaway, {
      ...textStyles.takeawayBody,
      wordWrap: { width: layout.takeawayBody.wordWrapWidth },
    });
  }

  drawConceptBox() {
    const layout = DataBriefingViewManager.getConceptBoxLayout();
    const textStyles = DataBriefingViewManager.getConceptBoxTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, textStyles.title);
    this.add.text(layout.body.x, layout.body.y, EP1_CORE_CONCEPT, {
      ...textStyles.body,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawControls() {
    const layout = DataBriefingViewManager.getControlLayout();
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, layout.back.backgroundColor, layout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = this.createButton(layout.next.x, layout.next.y, layout.next.label, layout.next.backgroundColor, layout.next.textColor);
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { dataViewed: true });
      this.scene.start(layout.next.target);
    });
  }

  createButton(x, y, label, backgroundColor, color) {
    return createTextButton(this, {
      x,
      y,
      label,
      backgroundColor,
      textColor: color,
    }, DataBriefingViewManager.getButtonStyle());
  }
}
