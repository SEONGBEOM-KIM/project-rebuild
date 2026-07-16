import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { policies } from '../data/policies.js';
import LearningProgress from '../systems/LearningProgress.js';
import SelectionViewManager from '../systems/SelectionViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class SelectionScene extends Phaser.Scene {
  constructor() {
    super('SelectionScene');
  }

  create() {
    const { width, height } = this.scale;
    this.selectedPolicy = this.registry.get('selectedPolicy') ?? policies[0];
    this.cardObjects = new Map();

    const layout = SelectionViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);
    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    policies.forEach((policy, index) => {
      const position = SelectionViewManager.getPolicyCardPosition(index);
      this.createPolicyCard(policy, position.x, position.y);
    });

    this.detailText = this.add.text(layout.detail.x, layout.detail.y, '', {
      ...SelectionViewManager.getTextStyles().detail,
      wordWrap: { width: layout.detail.wordWrapWidth },
    }).setOrigin(0.5, 0);

    const controls = SelectionViewManager.getControlLayout(width / 2);
    const backButton = createTextButton(this, controls.back, SelectionViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(controls.back.target));

    const startButton = createTextButton(this, controls.start, SelectionViewManager.getButtonStyle());
    startButton.on('pointerdown', () => {
      this.registry.set('selectedPolicy', this.selectedPolicy);
      LearningProgress.update(this.registry, { selectedPolicyId: this.selectedPolicy.id });
      this.scene.start(controls.start.target);
    });

    this.updateSelectionUi();
  }

  createPolicyCard(policy, x, y) {
    const layout = SelectionViewManager.getPolicyCardLayout();
    const initialStyle = SelectionViewManager.getCardStyle(policy.id, this.selectedPolicy);
    const textStyles = SelectionViewManager.getTextStyles();
    const container = this.add.container(x, y);
    const background = this.add.rectangle(layout.background.x, layout.background.y, layout.background.width, layout.background.height, initialStyle.fillColor, initialStyle.fillAlpha)
      .setStrokeStyle(initialStyle.strokeWidth, initialStyle.strokeColor)
      .setInteractive({ useHandCursor: true });
    const colorBar = this.add.rectangle(layout.colorBar.x, layout.colorBar.y, layout.colorBar.width, layout.colorBar.height, policy.color, 1);
    const title = this.add.text(layout.title.x, layout.title.y, policy.name, textStyles.title).setOrigin(0.5);
    const tagline = this.add.text(layout.tagline.x, layout.tagline.y, policy.tagline, {
      ...textStyles.tagline,
      wordWrap: { width: layout.tagline.wordWrapWidth },
    }).setOrigin(0.5);
    const description = this.add.text(layout.description.x, layout.description.y, policy.description, {
      ...textStyles.description,
      wordWrap: { width: layout.description.wordWrapWidth },
    }).setOrigin(0.5);
    const focus = this.add.text(layout.focus.x, layout.focus.y, SelectionViewManager.formatFocusText(policy), textStyles.focus).setOrigin(0.5);
    const recommended = this.add.text(layout.recommended.x, layout.recommended.y, SelectionViewManager.formatRecommendedBuildings(policy), {
      ...textStyles.recommended,
      wordWrap: { width: layout.recommended.wordWrapWidth },
    }).setOrigin(0.5);

    container.add([background, colorBar, title, tagline, description, focus, recommended]);
    background.on('pointerdown', () => {
      this.selectedPolicy = policy;
      this.registry.set('selectedPolicy', policy);
      this.updateSelectionUi();
    });
    this.cardObjects.set(policy.id, { background, title });
  }


  updateSelectionUi() {
    for (const [policyId, objects] of this.cardObjects.entries()) {
      const style = SelectionViewManager.getCardStyle(policyId, this.selectedPolicy);
      objects.background.setStrokeStyle(style.strokeWidth, style.strokeColor);
      objects.background.setFillStyle(style.fillColor, style.fillAlpha);
    }

    if (this.detailText) {
      this.detailText.setText(SelectionViewManager.formatDetailText(this.selectedPolicy));
    }
  }
}
