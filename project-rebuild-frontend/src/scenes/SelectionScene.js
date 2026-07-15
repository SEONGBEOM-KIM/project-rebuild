import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import { policies } from '../data/policies.js';
import LearningProgress from '../systems/LearningProgress.js';
import SelectionViewManager from '../systems/SelectionViewManager.js';

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
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, {
      fontSize: '26px',
      color: '#bfdbfe',
      align: 'center',
    }).setOrigin(0.5);

    policies.forEach((policy, index) => {
      const position = SelectionViewManager.getPolicyCardPosition(index);
      this.createPolicyCard(policy, position.x, position.y);
    });

    this.detailText = this.add.text(layout.detail.x, layout.detail.y, '', {
      fontSize: '27px',
      color: '#e0f2fe',
      align: 'center',
      lineSpacing: 10,
      wordWrap: { width: layout.detail.wordWrapWidth },
    }).setOrigin(0.5, 0);

    const controls = SelectionViewManager.getControlLayout(width / 2);
    const backButton = this.createButton(controls.back.x, controls.back.y, controls.back.label, controls.back.backgroundColor, controls.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(controls.back.target));

    const startButton = this.createButton(controls.start.x, controls.start.y, controls.start.label, controls.start.backgroundColor, controls.start.textColor);
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
    const container = this.add.container(x, y);
    const background = this.add.rectangle(layout.background.x, layout.background.y, layout.background.width, layout.background.height, initialStyle.fillColor, initialStyle.fillAlpha)
      .setStrokeStyle(initialStyle.strokeWidth, initialStyle.strokeColor)
      .setInteractive({ useHandCursor: true });
    const colorBar = this.add.rectangle(layout.colorBar.x, layout.colorBar.y, layout.colorBar.width, layout.colorBar.height, policy.color, 1);
    const title = this.add.text(layout.title.x, layout.title.y, policy.name, {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const tagline = this.add.text(layout.tagline.x, layout.tagline.y, policy.tagline, {
      fontSize: '22px',
      color: '#fde68a',
      align: 'center',
      wordWrap: { width: layout.tagline.wordWrapWidth },
    }).setOrigin(0.5);
    const description = this.add.text(layout.description.x, layout.description.y, policy.description, {
      fontSize: '22px',
      color: '#dbeafe',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: layout.description.wordWrapWidth },
    }).setOrigin(0.5);
    const focus = this.add.text(layout.focus.x, layout.focus.y, SelectionViewManager.formatFocusText(policy), {
      fontSize: '21px',
      color: '#bbf7d0',
      align: 'center',
    }).setOrigin(0.5);
    const recommended = this.add.text(layout.recommended.x, layout.recommended.y, SelectionViewManager.formatRecommendedBuildings(policy), {
      fontSize: '20px',
      color: '#bfdbfe',
      align: 'center',
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

  createButton(x, y, label, backgroundColor, textColor) {
    const button = this.add.text(x, y, label, {
      fontSize: '32px',
      color: textColor,
      backgroundColor: `#${backgroundColor.toString(16).padStart(6, '0')}`,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    return button;
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
