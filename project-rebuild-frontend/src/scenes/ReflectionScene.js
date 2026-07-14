import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_REFLECTION_CHOICES } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';

export default class ReflectionScene extends Phaser.Scene {
  constructor() {
    super('ReflectionScene');
  }

  create() {
    const { width, height } = this.scale;
    this.selectedChoice = this.registry.get('reflectionChoice');
    this.choiceObjects = new Map();

    this.add.rectangle(width / 2, height / 2, width, height, 0x172554);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 82, '생각 정리', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 150, '이번 선택을 돌아보고, 다음 개발에서 가장 먼저 보완할 부분을 고르세요.', {
      fontSize: '27px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    EP1_REFLECTION_CHOICES.forEach((choice, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      this.createChoiceCard(choice, 610 + col * 700, 385 + row * 250);
    });

    this.feedbackText = this.add.text(width / 2, 790, '하나를 선택하면 학습 기록에 저장됩니다.', {
      fontSize: '28px',
      color: '#e0f2fe',
      align: 'center',
      wordWrap: { width: 1150 },
    }).setOrigin(0.5);

    this.drawControls();
    this.updateSelectionUi();
  }

  createChoiceCard(choice, x, y) {
    const background = this.add.rectangle(x, y, 620, 190, 0x0f172a, 0.96)
      .setStrokeStyle(4, 0x475569)
      .setInteractive({ useHandCursor: true });
    const icon = this.add.text(x - 250, y - 35, choice.icon, { fontSize: '44px' }).setOrigin(0.5);
    const title = this.add.text(x - 200, y - 62, choice.title, {
      fontSize: '31px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    const description = this.add.text(x - 200, y - 12, choice.description, {
      fontSize: '23px',
      color: '#dbeafe',
      lineSpacing: 8,
      wordWrap: { width: 470 },
    });

    const select = () => this.selectChoice(choice);
    background.on('pointerdown', select);
    icon.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    title.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    description.setInteractive({ useHandCursor: true }).on('pointerdown', select);

    this.choiceObjects.set(choice.id, { background, choice });
  }

  selectChoice(choice) {
    this.selectedChoice = choice;
    this.registry.set('reflectionChoice', choice);
    LearningProgress.update(this.registry, { reflectionChoice: choice });
    this.feedbackText.setText(`선택됨: ${choice.title}\n${choice.description}`);
    this.feedbackText.setColor('#bbf7d0');
    this.updateSelectionUi();
  }

  updateSelectionUi() {
    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const selected = this.selectedChoice?.id === choiceId;
      objects.background.setStrokeStyle(selected ? 7 : 4, selected ? 0xfde68a : 0x475569);
      objects.background.setFillStyle(selected ? 0x1e293b : 0x0f172a, 0.96);
    }
  }

  drawControls() {
    const backButton = this.createButton(760, 940, '부작용 다시 보기', '#c4b5fd', '#1e1b4b');
    backButton.on('pointerdown', () => this.scene.start('SideEffectScene'));

    const nextButton = this.createButton(1160, 940, '학습 마무리', '#bbf7d0', '#123524');
    nextButton.on('pointerdown', () => {
      if (!this.selectedChoice) {
        this.feedbackText.setText('학습 기록에 남길 보완 방향을 하나 선택하세요.');
        this.feedbackText.setColor('#fecaca');
        return;
      }
      this.scene.start('EndingScene');
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
