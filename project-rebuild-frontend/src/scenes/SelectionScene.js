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

    this.add.rectangle(width / 2, height / 2, width, height, 0x172554);
    ProgressStepper.render(this, 'selection');
    this.add.text(width / 2, 86, '회복 방향 선택', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 150, '정책 밸런싱은 아직 적용하지 않고, 배치 미션의 의도만 정하는 UI 단계입니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
      align: 'center',
    }).setOrigin(0.5);

    policies.forEach((policy, index) => {
      this.createPolicyCard(policy, 430 + index * 530, 420);
    });

    this.detailText = this.add.text(width / 2, 750, '', {
      fontSize: '27px',
      color: '#e0f2fe',
      align: 'center',
      lineSpacing: 10,
      wordWrap: { width: 1180 },
    }).setOrigin(0.5, 0);

    const backButton = this.createButton(width / 2 - 180, 955, '탐색 다시 보기', 0x93c5fd, '#0f172a');
    backButton.on('pointerdown', () => this.scene.start('ExplorationScene'));

    const startButton = this.createButton(width / 2 + 180, 955, '배치 연습 시작', 0xbbf7d0, '#123524');
    startButton.on('pointerdown', () => {
      this.registry.set('selectedPolicy', this.selectedPolicy);
      LearningProgress.update(this.registry, { selectedPolicyId: this.selectedPolicy.id });
      this.scene.start('PlacementScene');
    });

    this.updateSelectionUi();
  }

  createPolicyCard(policy, x, y) {
    const container = this.add.container(x, y);
    const background = this.add.rectangle(0, 0, 450, 430, 0x0f172a, 0.96)
      .setStrokeStyle(4, 0x475569)
      .setInteractive({ useHandCursor: true });
    const colorBar = this.add.rectangle(0, -194, 450, 42, policy.color, 1);
    const title = this.add.text(0, -145, policy.name, {
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const tagline = this.add.text(0, -98, policy.tagline, {
      fontSize: '22px',
      color: '#fde68a',
      align: 'center',
      wordWrap: { width: 370 },
    }).setOrigin(0.5);
    const description = this.add.text(0, -10, policy.description, {
      fontSize: '22px',
      color: '#dbeafe',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 365 },
    }).setOrigin(0.5);
    const focus = this.add.text(0, 108, SelectionViewManager.formatFocusText(policy), {
      fontSize: '21px',
      color: '#bbf7d0',
      align: 'center',
    }).setOrigin(0.5);
    const recommended = this.add.text(0, 156, SelectionViewManager.formatRecommendedBuildings(policy), {
      fontSize: '20px',
      color: '#bfdbfe',
      align: 'center',
      wordWrap: { width: 370 },
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
