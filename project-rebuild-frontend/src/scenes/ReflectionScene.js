import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { EP1_REFLECTION_CHOICES } from '../data/episodeContent.js';
import LearningProgress from '../systems/LearningProgress.js';
import ReflectionViewManager from '../systems/ReflectionViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

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

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    EP1_REFLECTION_CHOICES.forEach((choice, index) => {
      const { x, y } = ReflectionViewManager.getChoiceCardPosition(index);
      this.createChoiceCard(choice, x, y);
    });

    this.feedbackText = this.add.text(
      layout.feedback.x,
      layout.feedback.y,
      ReflectionViewManager.formatInitialFeedback(),
      ReflectionViewManager.getFeedbackTextStyle('initial', layout.feedback.wordWrapWidth),
    ).setOrigin(0.5);

    this.drawControls();
    this.updateSelectionUi();
  }

  createChoiceCard(choice, x, y) {
    const layout = ReflectionViewManager.getChoiceCardLayout(x, y);
    const initialStyle = ReflectionViewManager.getChoiceCardStyle(choice.id, this.selectedChoice);
    const textStyles = ReflectionViewManager.getChoiceTextStyles();
    const background = this.add.rectangle(layout.background.x, layout.background.y, layout.background.width, layout.background.height, initialStyle.fillColor, initialStyle.fillAlpha)
      .setStrokeStyle(initialStyle.strokeWidth, initialStyle.strokeColor)
      .setInteractive({ useHandCursor: true });
    const icon = this.add.text(layout.icon.x, layout.icon.y, choice.icon, textStyles.icon).setOrigin(0.5);
    const title = this.add.text(layout.title.x, layout.title.y, choice.title, textStyles.title);
    const description = this.add.text(layout.description.x, layout.description.y, choice.description, {
      ...textStyles.description,
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
    const backButton = createTextButton(this, layout.back, ReflectionViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, ReflectionViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => {
      if (!this.selectedChoice) {
        this.feedbackText.setText(ReflectionViewManager.formatMissingChoiceFeedback());
        this.feedbackText.setColor(ReflectionViewManager.getFeedbackStyle('missing').color);
        return;
      }
      this.scene.start(layout.next.target);
    });
  }

}
