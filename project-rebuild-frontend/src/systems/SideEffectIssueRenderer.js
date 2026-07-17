import SideEffectViewManager from './SideEffectViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class SideEffectIssueRenderer {
  static renderIssueCard(scene, issue, index) {
    const card = SideEffectViewManager.getIssueCardLayout(index);
    const cardStyle = SideEffectViewManager.getIssueCardStyle();
    const textStyles = SideEffectViewManager.getTextStyles();

    const background = createPanelBackground(scene, card.background, cardStyle, { strokeColor: issue.color });
    const marker = scene.add.circle(card.marker.x, card.marker.y, card.marker.radius, issue.color, cardStyle.markerAlpha)
      .setStrokeStyle(cardStyle.markerStrokeWidth, cardStyle.markerStrokeColor);
    const priority = createLayoutText(scene, card.priority, {
      text: SideEffectViewManager.getIssuePriorityLabel(issue),
      style: textStyles.cardPriority,
    });
    const title = createLayoutText(scene, card.title, {
      text: issue.title,
      style: textStyles.cardTitle,
    });
    const message = createLayoutText(scene, card.message, {
      text: issue.message,
      style: textStyles.cardMessage,
    });

    return { background, marker, priority, title, message };
  }
}
