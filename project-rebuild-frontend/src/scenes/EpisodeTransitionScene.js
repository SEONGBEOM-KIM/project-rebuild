import Phaser from 'phaser';
import { getEpisodeTransition } from '../data/episodeTransitions.js';
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

    const { width } = this.scale;
    createScreenBackground(this, 0x0f172a);
    createLayoutText(this, { x: width / 2, y: 185, text: transition.title }, {
      style: { fontSize: '68px', color: '#fde68a', fontStyle: 'bold' },
      origin: 0.5,
    });
    createLayoutText(this, { x: width / 2, y: 260, text: transition.subtitle }, {
      style: { fontSize: '28px', color: '#dbeafe', align: 'center' },
      origin: 0.5,
    });

    createPanelBackground(this, { x: width / 2, y: 535, width: 1420, height: 430 }, {
      fillColor: 0x172554,
      fillAlpha: 0.98,
      strokeWidth: 4,
      strokeColor: 0x93c5fd,
    });
    createPanelTitle(this, { x: width / 2 - 620, y: 345, text: transition.speaker }, {
      fontSize: '30px', color: '#bbf7d0', fontStyle: 'bold',
    });
    createLayoutText(this, { x: width / 2 - 620, y: 410, text: transition.dialogue.join('\n\n'), wordWrapWidth: 1240 }, {
      style: { fontSize: '29px', color: '#ffffff', lineSpacing: 12 },
    });

    const nextButton = createTextButton(this, {
      x: width / 2,
      y: 870,
      label: transition.nextLabel,
      backgroundColor: '#bbf7d0',
      textColor: '#123524',
    }, { fontSize: '32px', padding: { x: 38, y: 20 } });
    nextButton.on('pointerdown', () => this.scene.start(transition.nextScene));
  }
}
