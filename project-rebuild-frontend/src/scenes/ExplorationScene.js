import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import ExplorationViewManager from '../systems/ExplorationViewManager.js';
import ExplorationMapRenderer from '../systems/ExplorationMapRenderer.js';
import ExplorationRenderer from '../systems/ExplorationRenderer.js';

export default class ExplorationScene extends Phaser.Scene {
  constructor() {
    super('ExplorationScene');
  }

  create() {
    this.exploredPlaces = new Set(this.registry.get('exploredPlaces') ?? []);
    this.placeObjects = new Map();

    const layout = ExplorationViewManager.getScreenLayout();

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    this.drawMapBackdrop();
    ExplorationRenderer.renderHeader(this);
    this.drawPlaces();
    this.drawInfoPanel();
    this.drawControls();
    this.updateProgress();

    const firstUnvisited = explorationPlaces.find((place) => !this.exploredPlaces.has(place.id)) ?? explorationPlaces[0];
    this.selectPlace(firstUnvisited);
  }

  drawMapBackdrop() {
    ExplorationMapRenderer.renderBackdrop(this);
  }

  drawPlaces() {
    for (const place of explorationPlaces) {
      const markerObjects = ExplorationMapRenderer.renderPlaceMarker(this, place, {
        explored: this.exploredPlaces.has(place.id),
        onSelect: (selectedPlace) => this.selectPlace(selectedPlace),
      });
      this.placeObjects.set(place.id, markerObjects);
    }
  }

  drawInfoPanel() {
    const infoPanel = ExplorationRenderer.renderInfoPanel(this);
    this.panelTitle = infoPanel.panelTitle;
    this.panelBody = infoPanel.panelBody;
    this.progressText = infoPanel.progressText;
  }

  drawControls() {
    const controls = ExplorationRenderer.renderControls(this);
    controls.backButton.on('pointerdown', () => this.scene.start(controls.layout.back.target));

    this.nextButton = controls.nextButton;
    this.nextButton.on('pointerdown', () => {
      if (this.exploredPlaces.size < CURRENT_EPISODE.requiredExploredCount) {
        this.showNeedMoreMessage();
        return;
      }
      this.registry.set('exploredPlaces', [...this.exploredPlaces]);
      this.scene.start(controls.layout.next.target);
    });
  }

  selectPlace(place) {
    this.exploredPlaces.add(place.id);
    this.registry.set('exploredPlaces', [...this.exploredPlaces]);
    LearningProgress.addExploredPlace(this.registry, place.id);

    for (const [placeId, objects] of this.placeObjects.entries()) {
      const markerStyle = ExplorationViewManager.getMarkerStyle(placeId, place.id);
      objects.marker.setStrokeStyle(markerStyle.strokeWidth, markerStyle.strokeColor);
      objects.check.setVisible(this.exploredPlaces.has(placeId));
    }

    this.panelTitle.setText(ExplorationViewManager.formatPanelTitle(place));
    this.panelBody.setText(ExplorationViewManager.formatPanelBody(place));
    this.updateProgress();
  }

  updateProgress() {
    if (!this.progressText) {
      return;
    }
    this.progressText.setText(ExplorationViewManager.formatProgressText(
      this.exploredPlaces.size,
      explorationPlaces.length,
      CURRENT_EPISODE.requiredExploredCount,
    ));

    if (this.nextButton) {
      const nextButtonState = ExplorationViewManager.getNextButtonState(
        this.exploredPlaces.size,
        CURRENT_EPISODE.requiredExploredCount,
      );
      this.nextButton.setText(nextButtonState.label);
      this.nextButton.setStyle({ backgroundColor: nextButtonState.backgroundColor });
    }
  }

  showNeedMoreMessage() {
    this.progressText.setText(ExplorationViewManager.formatNeedMoreText(
      this.exploredPlaces.size,
      explorationPlaces.length,
      CURRENT_EPISODE.requiredExploredCount,
    ));
  }

}
