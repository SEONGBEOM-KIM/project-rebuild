import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { explorationPlaces } from '../data/explorationPlaces.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';
import ExplorationViewManager from '../systems/ExplorationViewManager.js';

export default class ExplorationScene extends Phaser.Scene {
  constructor() {
    super('ExplorationScene');
  }

  create() {
    const { width, height } = this.scale;
    this.exploredPlaces = new Set(this.registry.get('exploredPlaces') ?? []);
    this.placeObjects = new Map();

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f2f3f);
    ProgressStepper.render(this, 'exploration');
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
    this.add.text(80, 52, CURRENT_EPISODE.shortTitle, {
      fontSize: '54px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.add.text(82, 118, `장소를 클릭해 ${CURRENT_EPISODE.regionName}의 문제가 어디에서 드러나는지 확인하세요.`, {
      fontSize: '26px',
      color: '#bfdbfe',
    });
  }

  drawMapBackdrop() {
    this.add.rectangle(825, 560, 1120, 760, 0x14532d, 0.95).setStrokeStyle(5, 0x86efac);
    this.add.ellipse(680, 520, 520, 280, 0x166534, 0.9);
    this.add.ellipse(1030, 680, 620, 260, 0x166534, 0.9);
    this.add.rectangle(930, 545, 1040, 44, 0x64748b, 1).setAngle(-14);
    this.add.rectangle(1010, 430, 760, 34, 0x64748b, 1).setAngle(28);
    this.add.rectangle(1040, 260, 80, 760, 0x2563eb, 0.82).setAngle(36);

    this.add.text(410, 875, '※ 임시 지도 데이터: 실제 아트가 아니라 EP1 탐색 흐름 검증용 도형입니다.', {
      fontSize: '21px',
      color: '#d1fae5',
    });
  }

  drawPlaces() {
    for (const place of explorationPlaces) {
      const container = this.add.container(place.position.x, place.position.y);
      const marker = this.add.circle(0, 0, 56, place.color, 0.96)
        .setStrokeStyle(5, 0xffffff)
        .setInteractive({ useHandCursor: true });
      const icon = this.add.text(0, -7, place.icon, { fontSize: '38px' }).setOrigin(0.5);
      const labelBg = this.add.rectangle(0, 72, 170, 38, 0x0f172a, 0.9).setStrokeStyle(2, place.color);
      const label = this.add.text(0, 72, place.name, {
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const check = this.add.text(43, -45, '✓', {
        fontSize: '30px',
        color: '#bbf7d0',
        fontStyle: 'bold',
      }).setOrigin(0.5).setVisible(this.exploredPlaces.has(place.id));

      container.add([marker, icon, labelBg, label, check]);
      marker.on('pointerdown', () => this.selectPlace(place));
      icon.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectPlace(place));
      this.placeObjects.set(place.id, { marker, check });
    }
  }

  drawInfoPanel() {
    this.add.rectangle(1570, 520, 560, 780, 0xffffff, 0.96).setStrokeStyle(5, 0x93c5fd);
    this.panelTitle = this.add.text(1320, 185, '', {
      fontSize: '38px',
      color: '#172554',
      fontStyle: 'bold',
      wordWrap: { width: 500 },
    });
    this.panelBody = this.add.text(1320, 265, '', {
      fontSize: '26px',
      color: '#1e293b',
      lineSpacing: 13,
      wordWrap: { width: 500 },
    });
    this.progressText = this.add.text(1320, 780, '', {
      fontSize: '24px',
      color: '#172554',
      lineSpacing: 8,
      wordWrap: { width: 500 },
    });
  }

  drawControls() {
    const backButton = this.createButton(1230, 955, '스토리 다시 보기', '#93c5fd', '#0f172a');
    backButton.on('pointerdown', () => this.scene.start('StoryScene'));

    this.nextButton = this.createButton(1600, 955, '자료 확인', '#94a3b8', '#0f172a');
    this.nextButton.on('pointerdown', () => {
      if (this.exploredPlaces.size < CURRENT_EPISODE.requiredExploredCount) {
        this.showNeedMoreMessage();
        return;
      }
      this.registry.set('exploredPlaces', [...this.exploredPlaces]);
      this.scene.start('DataBriefingScene');
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
    return this.add.text(x, y, label, {
      fontSize: '32px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
