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

    const layout = SideEffectViewManager.getScreenLayout(width);

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
      wordWrap: { width: layout.subtitle.wordWrapWidth },
    }).setOrigin(0.5);

    this.drawIssueArea(issues);
    this.drawConceptPanel(issues);
    this.drawControls();
  }

  drawIssueArea(issues) {
    const layout = SideEffectViewManager.getIssuePanelLayout();
    const panelStyle = SideEffectViewManager.getPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.issueFillColor, panelStyle.issueFillAlpha)
      .setStrokeStyle(panelStyle.issueStrokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
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
      const cardStyle = SideEffectViewManager.getIssueCardStyle();
      this.add.rectangle(card.background.x, card.background.y, card.background.width, card.background.height, cardStyle.fillColor, cardStyle.fillAlpha)
        .setStrokeStyle(cardStyle.strokeWidth, issue.color);
      this.add.circle(card.marker.x, card.marker.y, card.marker.radius, issue.color, cardStyle.markerAlpha)
        .setStrokeStyle(cardStyle.markerStrokeWidth, cardStyle.markerStrokeColor);
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
    const panelStyle = SideEffectViewManager.getPanelStyle();
    this.add.rectangle(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, panelStyle.hintFillColor, panelStyle.hintFillAlpha)
      .setStrokeStyle(panelStyle.hintStrokeWidth, layout.panel.strokeColor);
    this.add.text(layout.title.x, layout.title.y, layout.title.text, {
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
    const backButton = this.createButton(layout.back.x, layout.back.y, layout.back.label, layout.back.backgroundColor, layout.back.textColor);
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = this.createButton(layout.next.x, layout.next.y, layout.next.label, layout.next.backgroundColor, layout.next.textColor);
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
