import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import DataBriefingViewManager from '../systems/DataBriefingViewManager.js';
import DataBriefingRenderer from '../systems/DataBriefingRenderer.js';

import { EP1_CORE_CONCEPT, EP1_DATA_CARDS } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class DataBriefingScene extends Phaser.Scene {
  constructor() {
    super('DataBriefingScene');
  }

  create() {
    const { width } = this.scale;
    const layout = DataBriefingViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, {
      text: DataBriefingViewManager.formatSubtitle(CURRENT_EPISODE.regionName),
      origin: 0.5,
    });

    EP1_DATA_CARDS.forEach((card, index) => {
      const { x, y } = DataBriefingViewManager.getCardPosition(index);
      DataBriefingRenderer.renderDataCard(this, card, x, y);
    });

    DataBriefingRenderer.renderConceptBox(this, EP1_CORE_CONCEPT);
    this.drawControls();
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
