import SelectionViewManager from './SelectionViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class SelectionPolicyCardRenderer {
  static render(scene, policy, selectedPolicy, position, { onSelect }) {
    const layout = SelectionViewManager.getPolicyCardLayout();
    const initialStyle = SelectionViewManager.getCardStyle(policy.id, selectedPolicy);
    const textStyles = SelectionViewManager.getTextStyles();
    const container = scene.add.container(position.x, position.y);
    const background = createPanelBackground(scene, layout.background, initialStyle)
      .setInteractive({ useHandCursor: true });
    const colorBar = createPanelBackground(scene, layout.colorBar, { fillColor: policy.color, fillAlpha: 1 });
    const title = createPanelTitle(scene, layout.title, textStyles.title, {
      text: policy.name,
      origin: 0.5,
    });
    const tagline = createLayoutText(scene, layout.tagline, {
      text: policy.tagline,
      style: textStyles.tagline,
      origin: 0.5,
    });
    const description = createLayoutText(scene, layout.description, {
      text: policy.description,
      style: textStyles.description,
      origin: 0.5,
    });
    const focus = createLayoutText(scene, layout.focus, {
      text: SelectionViewManager.formatFocusText(policy),
      style: textStyles.focus,
      origin: 0.5,
    });
    const recommended = createLayoutText(scene, layout.recommended, {
      text: SelectionViewManager.formatRecommendedBuildings(policy),
      style: textStyles.recommended,
      origin: 0.5,
    });

    container.add([background, colorBar, title, tagline, description, focus, recommended]);
    background.on('pointerdown', () => onSelect(policy));

    return { background, title, container };
  }
}
