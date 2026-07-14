import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import IssueDetector from '../systems/IssueDetector.js';
import SideEffectViewManager from '../systems/SideEffectViewManager.js';

export default class SideEffectScene extends Phaser.Scene {
  constructor() {
    super('SideEffectScene');
  }

  create() {
    const { width, height } = this.scale;
    const gameState = this.registry.get('gameState');
    const issues = IssueDetector.detect(gameState);

    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);
    ProgressStepper.render(this, 'result');

    this.add.text(width / 2, 82, '부작용 검토', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 148, '좋은 선택에도 비용과 부작용이 생길 수 있습니다. 다음 선택 전에 주의 신호를 확인합니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
      align: 'center',
      wordWrap: { width: 1450 },
    }).setOrigin(0.5);

    this.drawIssueArea(issues);
    this.drawConceptPanel(issues);
    this.drawControls();
  }

  drawIssueArea(issues) {
    const layout = SideEffectViewManager.getIssuePanelLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0xffffff, 0.96)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '감지된 주의 신호', {
      fontSize: '38px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    if (!issues.length) {
      this.add.text(layout.emptyBody.x, layout.emptyBody.y, SideEffectViewManager.formatEmptyIssueMessage(), {
        fontSize: '30px',
        color: '#1e293b',
        lineSpacing: 14,
        wordWrap: { width: layout.emptyBody.wordWrapWidth },
      });
      return;
    }

    issues.slice(0, 4).forEach((issue, index) => {
      const card = SideEffectViewManager.getIssueCardLayout(index);
      this.add.rectangle(card.background.x, card.background.y, card.background.width, card.background.height, 0xe0f2fe, 1).setStrokeStyle(3, issue.color);
      this.add.circle(card.marker.x, card.marker.y, card.marker.radius, issue.color, 1).setStrokeStyle(3, 0xffffff);
      this.add.text(card.title.x, card.title.y, issue.title, {
        fontSize: '27px',
        color: '#0f172a',
        fontStyle: 'bold',
      });
      this.add.text(card.message.x, card.message.y, issue.message, {
        fontSize: '22px',
        color: '#334155',
        wordWrap: { width: card.message.wordWrapWidth },
      });
    });
  }

  drawConceptPanel(issues) {
    const layout = SideEffectViewManager.getHintPanelLayout();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, 0x1e293b, 0.98)
      .setStrokeStyle(5, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, '다음 선택 힌트', {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = SideEffectViewManager.formatHintRows(issues);

    this.add.text(layout.body.x, layout.body.y, rows.join('\n'), {
      fontSize: '22px',
      color: '#dbeafe',
      lineSpacing: 10,
      wordWrap: { width: layout.body.wordWrapWidth },
    });
  }

  drawControls() {
    const layout = SideEffectViewManager.getControlLayout();
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, '#c4b5fd', '#1e1b4b');
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = this.createButton(layout.next.x, layout.next.y, layout.next.label, '#bbf7d0', '#123524');
    nextButton.on('pointerdown', () => this.scene.start(layout.next.target));
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
