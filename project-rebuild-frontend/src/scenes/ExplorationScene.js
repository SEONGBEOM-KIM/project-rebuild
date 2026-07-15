import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import ExplorationViewManager from '../systems/ExplorationViewManager.js';
import { createTextButton } from '../ui/TextButton.js';

export default class ExplorationScene extends Phaser.Scene {
  constructor() {
    super('ExplorationScene');
  }

  create() {
    const { width, height } = this.scale;
    this.exploredPlaces = new Set(this.registry.get('exploredPlaces') ?? []);
    this.placeObjects = new Map();

    const layout = ExplorationViewManager.getScreenLayout();

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    this.drawMapBackdrop();
    this.drawHeader();
    this.drawPlaces();
    this.drawInfoPanel();
    this.drawControls();
    this.updateProgress();

    const firstUnvisited = explorationPlaces.find((place) => !this.exploredPlaces.has(place.id)) ?? explorationPlaces[0];
    this.selectPlace(firstUnvisited);
  }

  drawHeader() {
    const layout = ExplorationViewManager.getScreenLayout();
    this.add.text(layout.title.x, layout.title.y, CURRENT_EPISODE.shortTitle, layout.title);
    this.add.text(layout.subtitle.x, layout.subtitle.y, ExplorationViewManager.formatSubtitle(CURRENT_EPISODE.regionName), layout.subtitle);
  }

  drawMapBackdrop() {
    const layout = ExplorationViewManager.getMapLayout();
    this.add.rectangle(layout.backdrop.x, layout.backdrop.y, layout.backdrop.width, layout.backdrop.height, layout.backdrop.fillColor, layout.backdrop.fillAlpha)
      .setStrokeStyle(layout.backdrop.strokeWidth, layout.backdrop.strokeColor);
    layout.hills.forEach((hill) => {
      this.add.ellipse(hill.x, hill.y, hill.width, hill.height, hill.fillColor, hill.fillAlpha);
    });
    layout.roads.forEach((road) => {
      this.add.rectangle(road.x, road.y, road.width, road.height, road.fillColor, road.fillAlpha).setAngle(road.angle);
    });
    this.add.rectangle(layout.river.x, layout.river.y, layout.river.width, layout.river.height, layout.river.fillColor, layout.river.fillAlpha).setAngle(layout.river.angle);

    this.add.text(layout.note.x, layout.note.y, layout.note.text, ExplorationViewManager.getTextStyles().mapNote);
  }

  drawPlaces() {
    for (const place of explorationPlaces) {
      const layout = ExplorationViewManager.getPlaceMarkerLayout();
      const textStyles = ExplorationViewManager.getTextStyles();
      const container = this.add.container(place.position.x, place.position.y);
      const marker = this.add.circle(layout.marker.x, layout.marker.y, layout.marker.radius, place.color, layout.marker.fillAlpha)
        .setStrokeStyle(layout.marker.strokeWidth, layout.marker.strokeColor)
        .setInteractive({ useHandCursor: true });
      const icon = this.add.text(layout.icon.x, layout.icon.y, place.icon, textStyles.markerIcon).setOrigin(0.5);
      const labelBg = this.add.rectangle(layout.labelBackground.x, layout.labelBackground.y, layout.labelBackground.width, layout.labelBackground.height, layout.labelBackground.fillColor, layout.labelBackground.fillAlpha)
        .setStrokeStyle(layout.labelBackground.strokeWidth, place.color);
      const label = this.add.text(layout.label.x, layout.label.y, place.name, textStyles.markerLabel).setOrigin(0.5);
      const check = this.add.text(layout.check.x, layout.check.y, layout.check.text, textStyles.markerCheck).setOrigin(0.5).setVisible(this.exploredPlaces.has(place.id));

      container.add([marker, icon, labelBg, label, check]);
      marker.on('pointerdown', () => this.selectPlace(place));
      icon.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectPlace(place));
      this.placeObjects.set(place.id, { marker, check });
    }
  }

  drawInfoPanel() {
    const layout = ExplorationViewManager.getInfoPanelLayout();
    const textStyles = ExplorationViewManager.getTextStyles();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, layout.panel.fillColor, layout.panel.fillAlpha)
      .setStrokeStyle(layout.panel.strokeWidth, layout.panel.strokeColor);
    this.panelTitle = this.add.text(layout.title.x, layout.title.y, '', {
      ...textStyles.panelTitle,
      wordWrap: { width: layout.title.wordWrapWidth },
    });
    this.panelBody = this.add.text(layout.body.x, layout.body.y, '', {
      ...textStyles.panelBody,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
    this.progressText = this.add.text(layout.progress.x, layout.progress.y, '', {
      ...textStyles.progress,
      wordWrap: { width: layout.progress.wordWrapWidth },
    });
  }

  drawControls() {
    const layout = ExplorationViewManager.getControlLayout();
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, layout.back.backgroundColor, layout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    this.nextButton = this.createButton(layout.next.x, layout.next.y, layout.next.label, layout.next.backgroundColor, layout.next.textColor);
    this.nextButton.on('pointerdown', () => {
      if (this.exploredPlaces.size < CURRENT_EPISODE.requiredExploredCount) {
        this.showNeedMoreMessage();
        return;
      }
      this.registry.set('exploredPlaces', [...this.exploredPlaces]);
      this.scene.start(layout.next.target);
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

  createButton(x, y, label, backgroundColor, color) {
    return createTextButton(this, {
      x,
      y,
      label,
      backgroundColor,
      textColor: color,
    }, ExplorationViewManager.getButtonStyle());
  }
}
