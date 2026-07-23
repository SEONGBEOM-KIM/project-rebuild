import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import LearningProgress from '../systems/LearningProgress.js';
import ProblemSummaryViewManager from '../systems/ProblemSummaryViewManager.js';
import ProblemSummaryRenderer from '../systems/ProblemSummaryRenderer.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import { EPISODE_IDS } from '../data/episodes.js';

import { getCurrentEpisodeContent } from '../data/episodeContent.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class ProblemSummaryScene extends Phaser.Scene {
  constructor() {
    super('ProblemSummaryScene');
  }

  create() {
    const { width } = this.scale;
    const exploredPlaces = this.registry.get(REGISTRY_KEYS.exploredPlaces) ?? [];
    const quizResult = this.registry.get(REGISTRY_KEYS.quizResult);

    const layout = ProblemSummaryViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawProblemGrid();
    this.drawLearningRecord(exploredPlaces, quizResult);
    this.drawNextMission();
    this.drawControls();
  }

  drawProblemGrid() {
    ProblemSummaryRenderer.renderProblemGrid(this, getCurrentEpisodeContent().problemItems);
  }

  drawLearningRecord(exploredPlaces, quizResult) {
    ProblemSummaryRenderer.renderLearningRecord(
      this,
      ProblemSummaryViewManager.formatLearningRecordText(
        explorationPlaces,
        exploredPlaces,
        quizResult,
        getCurrentEpisodeContent().coreCauseSummary,
      ),
    );
  }

  drawNextMission() {
    ProblemSummaryRenderer.renderNextMission(this, getCurrentEpisodeContent().nextMission);
  }

  drawControls() {
    const layout = ProblemSummaryViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, ProblemSummaryViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, ProblemSummaryViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { problemSummaryCompleted: true });
      this.scene.start(layout.next.target, { episodeId: EPISODE_IDS.PopulationRecovery });
    });
  }

}
