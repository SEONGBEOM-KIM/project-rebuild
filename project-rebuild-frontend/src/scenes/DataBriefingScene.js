import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import LearningProgress from '../systems/LearningProgress.js';

import { EP1_CORE_CONCEPT, EP1_DATA_CARDS } from '../data/episodeContent.js';

export default class DataBriefingScene extends Phaser.Scene {
  constructor() {
    super('DataBriefingScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x172554);
    ProgressStepper.render(this, 'data');

    this.add.text(width / 2, 70, 'EP1. 자료 확인', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 138, `탐색에서 본 ${CURRENT_EPISODE.regionName} 문제를 숫자 자료로 다시 확인합니다.`, {
      fontSize: '28px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    EP1_DATA_CARDS.forEach((card, index) => {
      this.drawDataCard(card, 390 + index * 570, 500);
    });

    this.drawConceptBox();
    this.drawControls();
  }

  drawDataCard(card, x, y) {
    this.add.rectangle(x, y, 500, 560, 0xffffff, 0.97).setStrokeStyle(5, 0x93c5fd);
    this.add.text(x, y - 230, card.title, {
      fontSize: '33px',
      color: '#172554',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 440 },
    }).setOrigin(0.5);
    this.add.text(x, y - 185, card.subtitle, {
      fontSize: '22px',
      color: '#475569',
    }).setOrigin(0.5);

    card.bars.forEach((bar, index) => {
      const barY = y - 80 + index * 110;
      const width = Math.max(24, Math.round((bar.value / bar.max) * 330));
      this.add.text(x - 205, barY, bar.label, {
        fontSize: '23px',
        color: '#1e293b',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);
      this.add.rectangle(x - 20, barY, 340, 38, 0xe2e8f0).setOrigin(0, 0.5);
      this.add.rectangle(x - 20, barY, width, 38, bar.color).setOrigin(0, 0.5);
      this.add.text(x + 335, barY, `${bar.value.toLocaleString()}${bar.suffix ?? '명'}`, {
        fontSize: '23px',
        color: '#0f172a',
      }).setOrigin(1, 0.5);
    });

    this.add.rectangle(x, y + 170, 430, 150, 0xe0f2fe, 1).setStrokeStyle(3, 0x60a5fa);
    this.add.text(x - 190, y + 112, '읽어야 할 점', {
      fontSize: '23px',
      color: '#172554',
      fontStyle: 'bold',
    });
    this.add.text(x - 190, y + 150, card.takeaway, {
      fontSize: '21px',
      color: '#334155',
      lineSpacing: 7,
      wordWrap: { width: 380 },
    });
  }

  drawConceptBox() {
    this.add.rectangle(960, 840, 1280, 110, 0x0f172a, 0.88).setStrokeStyle(3, 0xfde68a);
    this.add.text(350, 810, '핵심 개념', {
      fontSize: '27px',
      color: '#fde68a',
      fontStyle: 'bold',
    });
    this.add.text(350, 848, EP1_CORE_CONCEPT, {
      fontSize: '25px',
      color: '#ffffff',
      wordWrap: { width: 1220 },
    });
  }

  drawControls() {
    const backButton = this.createButton(760, 980, '탐색 다시 보기', '#93c5fd', '#0f172a');
    backButton.on('pointerdown', () => this.scene.start('ExplorationScene'));

    const nextButton = this.createButton(1160, 980, '원인 질문 풀기', '#bbf7d0', '#123524');
    nextButton.on('pointerdown', () => {
      LearningProgress.update(this.registry, { dataViewed: true });
      this.scene.start('CauseQuizScene');
    });
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
