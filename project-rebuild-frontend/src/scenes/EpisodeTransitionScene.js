import Phaser from 'phaser';
import { getEpisodeTransition } from '../data/episodeTransitions.js';
import EpisodeActivityFlowManager from '../systems/EpisodeActivityFlowManager.js';
import WorldStateManager from '../systems/WorldStateManager.js';
import { REGISTRY_KEYS } from '../data/registryKeys.js';
import TimeStateManager from '../systems/TimeStateManager.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class EpisodeTransitionScene extends Phaser.Scene {
  constructor() {
    super('EpisodeTransitionScene');
  }

  init(data) {
    this.episodeId = data?.episodeId ?? null;
  }

  create() {
    const transition = getEpisodeTransition(this.episodeId);
    if (!transition) {
      this.scene.start('BootScene');
      return;
    }

    this.worldState = WorldStateManager.startEpisode(
      WorldStateManager.get(this.registry),
      transition.episodeId,
    );
    this.registry.set(REGISTRY_KEYS.worldState, this.worldState);
    this.timeState = TimeStateManager.advance(this.registry, {
      episodeId: transition.episodeId,
      reason: `${transition.title} 시작`,
    });

    const { width } = this.scale;
    const activityFlow = EpisodeActivityFlowManager.get(this.episodeId);
    const carryoverSummary = EpisodeActivityFlowManager.formatCarryoverSummary(
      this.worldState,
    );
    createScreenBackground(this, 0x0f172a);
    createLayoutText(this, { x: width / 2, y: 185, text: transition.title }, {
      style: { fontSize: '68px', color: '#fde68a', fontStyle: 'bold' },
      origin: 0.5,
    });
    createLayoutText(this, { x: width / 2, y: 260, text: transition.subtitle }, {
      style: { fontSize: '28px', color: '#dbeafe', align: 'center' },
      origin: 0.5,
    });
    createLayoutText(this, { x: width / 2, y: 320, text: activityFlow?.learningGoal ?? '' }, {
      style: { fontSize: '22px', color: '#bbf7d0', align: 'center', wordWrap: { width: 1360 } },
      origin: 0.5,
    });
    if (carryoverSummary) {
      createLayoutText(this, { x: width / 2, y: 360, text: carryoverSummary }, {
        style: { fontSize: '18px', color: '#bfdbfe', align: 'center', wordWrap: { width: 1360 } },
        origin: 0.5,
      });
    }

    createPanelBackground(this, { x: width / 2, y: 575, width: 1420, height: 360 }, {
      fillColor: 0x172554,
      fillAlpha: 0.98,
      strokeWidth: 4,
      strokeColor: 0x93c5fd,
    });
    createPanelTitle(this, { x: width / 2 - 620, y: 410, text: transition.speaker }, {
      fontSize: '30px', color: '#bbf7d0', fontStyle: 'bold',
    });
    createLayoutText(this, { x: width / 2 - 620, y: 465, text: transition.dialogue.join('\n\n'), wordWrapWidth: 1240 }, {
      style: { fontSize: '25px', color: '#ffffff', lineSpacing: 10 },
    });
    createLayoutText(this, { x: width / 2 - 620, y: 675, text: EpisodeActivityFlowManager.formatActivityRows(this.episodeId).join('\n'), wordWrapWidth: 1240 }, {
      style: { fontSize: '20px', color: '#cbd5e1', lineSpacing: 6 },
    });

    const nextButton = createTextButton(this, {
      x: width / 2,
      y: 900,
      label: transition.nextLabel,
      backgroundColor: '#bbf7d0',
      textColor: '#123524',
    }, { fontSize: '32px', padding: { x: 38, y: 20 } });
    nextButton.on('pointerdown', () => {
      this.scene.start(transition.nextScene, { episodeId: transition.episodeId });
    });
  }
}
