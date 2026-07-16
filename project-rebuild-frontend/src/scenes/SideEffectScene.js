import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import IssueDetector from '../systems/IssueDetector.js';
import SideEffectViewManager from '../systems/SideEffectViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

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

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawIssueArea(issues);
    this.drawConceptPanel(issues);
    this.drawControls();
  }

  drawIssueArea(issues) {
    const layout = SideEffectViewManager.getIssuePanelLayout();
    const panelStyle = SideEffectViewManager.getPanelStyle();
    const textStyles = SideEffectViewManager.getTextStyles();
    createPanelBackground(this, layout.panel, {
      fillColor: panelStyle.issueFillColor,
      fillAlpha: panelStyle.issueFillAlpha,
      strokeWidth: panelStyle.issueStrokeWidth,
    });
    createPanelTitle(this, layout.title, textStyles.issueTitle, { origin: 0.5 });

    if (!issues.length) {
      createLayoutText(this, layout.emptyBody, {
        text: SideEffectViewManager.formatEmptyIssueMessage(),
        style: textStyles.emptyBody,
      });
      return;
    }

    issues.slice(0, 4).forEach((issue, index) => {
      const card = SideEffectViewManager.getIssueCardLayout(index);
      const cardStyle = SideEffectViewManager.getIssueCardStyle();
      createPanelBackground(this, card.background, cardStyle, { strokeColor: issue.color });
      this.add.circle(card.marker.x, card.marker.y, card.marker.radius, issue.color, cardStyle.markerAlpha)
        .setStrokeStyle(cardStyle.markerStrokeWidth, cardStyle.markerStrokeColor);
      this.add.text(card.title.x, card.title.y, issue.title, textStyles.cardTitle);
      createLayoutText(this, card.message, {
        text: issue.message,
        style: textStyles.cardMessage,
      });
    });
  }

  drawConceptPanel(issues) {
    const layout = SideEffectViewManager.getHintPanelLayout();
    const panelStyle = SideEffectViewManager.getPanelStyle();
    const textStyles = SideEffectViewManager.getTextStyles();
    createPanelBackground(this, layout.panel, {
      fillColor: panelStyle.hintFillColor,
      fillAlpha: panelStyle.hintFillAlpha,
      strokeWidth: panelStyle.hintStrokeWidth,
    });
    createPanelTitle(this, layout.title, textStyles.hintTitle, { origin: 0.5 });

    const rows = SideEffectViewManager.formatHintRows(issues);

    createLayoutText(this, layout.body, {
      text: rows.join('\n'),
      style: textStyles.hintBody,
    });
  }

  drawControls() {
    const layout = SideEffectViewManager.getControlLayout();
    const backButton = createTextButton(this, layout.back, SideEffectViewManager.getButtonStyle());
    backButton.on('pointerdown', () => this.scene.start(layout.back.target));

    const nextButton = createTextButton(this, layout.next, SideEffectViewManager.getButtonStyle());
    nextButton.on('pointerdown', () => this.scene.start(layout.next.target));
  }

}
