import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_REFLECTION_CHOICES } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';
import ReflectionViewManager from '../systems/ReflectionViewManager.js';

export default class ReflectionScene extends Phaser.Scene {
  constructor() {
    super('ReflectionScene');
  }

  create() {
    const { width, height } = this.scale;
    this.selectedChoice = this.registry.get('reflectionChoice');
    this.choiceObjects = new Map();

    const layout = ReflectionViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: '27px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    EP1_REFLECTION_CHOICES.forEach((choice, index) => {
      const { x, y } = ReflectionViewManager.getChoiceCardPosition(index);
      this.createChoiceCard(choice, x, y);
    });

    this.feedbackText = this.add.text(layout.feedback.x, layout.feedback.y, ReflectionViewManager.formatInitialFeedback(), {
      fontSize: '28px',
      color: '#e0f2fe',
      align: 'center',
      wordWrap: { width: layout.feedback.wordWrapWidth },
    }).setOrigin(0.5);

    this.drawControls();
    this.updateSelectionUi();
  }

  createChoiceCard(choice, x, y) {
    const layout = ReflectionViewManager.getChoiceCardLayout(x, y);
    const initialStyle = ReflectionViewManager.getChoiceCardStyle(choice.id, this.selectedChoice);
    const background = this.add.rectangle(layout.background.x, layout.background.y, layout.background.width, layout.background.height, initialStyle.fillColor, initialStyle.fillAlpha)
      .setStrokeStyle(initialStyle.strokeWidth, initialStyle.strokeColor)
      .setInteractive({ useHandCursor: true });
    const icon = this.add.text(layout.icon.x, layout.icon.y, choice.icon, { fontSize: '44px' }).setOrigin(0.5);
    const title = this.add.text(layout.title.x, layout.title.y, choice.title, {
      fontSize: '31px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    const description = this.add.text(layout.description.x, layout.description.y, choice.description, {
      fontSize: '23px',
      color: '#dbeafe',
      lineSpacing: 8,
      wordWrap: { width: layout.description.wordWrapWidth },
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
    this.feedbackText.setText(ReflectionViewManager.formatSelectedFeedback(choice));
    this.feedbackText.setColor(ReflectionViewManager.getFeedbackStyle('selected').color);
    this.updateSelectionUi();
  }

  updateSelectionUi() {
    for (const [choiceId, objects] of this.choiceObjects.entries()) {
      const style = ReflectionViewManager.getChoiceCardStyle(choiceId, this.selectedChoice);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
    }
  }

  drawControls() {
    const layout = ReflectionViewManager.getControlLayout();
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, layout.back.backgroundColor, layout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = this.createButton(layout.next.x, layout.next.y, layout.next.label, layout.next.backgroundColor, layout.next.textColor);
    nextButton.on('pointerdown', () => {
      if (!this.selectedChoice) {
        this.feedbackText.setText(ReflectionViewManager.formatMissingChoiceFeedback());
        this.feedbackText.setColor(ReflectionViewManager.getFeedbackStyle('missing').color);
        return;
      }
      this.scene.start(layout.next.target);
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
