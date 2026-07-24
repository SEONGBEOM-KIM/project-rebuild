import DataBriefingViewManager from './DataBriefingViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class DataBriefingRenderer {
  static renderDataCard(scene, card, x, y, { viewed = false, onSelect = null } = {}) {
    const layout = DataBriefingViewManager.getDataCardLayout(x, y);
    const textStyles = DataBriefingViewManager.getDataCardTextStyles();

    const panel = createPanelBackground(scene, layout.panel, {
      ...layout.panel,
      ...DataBriefingViewManager.getCardState(viewed),
    });
    if (onSelect) {
      panel.setInteractive({ useHandCursor: true }).on('pointerdown', () => onSelect(card));
    }
    createPanelTitle(scene, layout.title, textStyles.title, { text: card.title, origin: 0.5 });
    createLayoutText(scene, layout.subtitle, {
      text: card.subtitle,
      style: textStyles.subtitle,
      origin: 0.5,
    });
    const status = DataBriefingViewManager.getCardStatus(viewed);
    const statusText = createLayoutText(scene, layout.status, {
      text: status.label,
      style: { ...textStyles.status, color: status.color },
      origin: [1, 0.5],
    });

    DataBriefingRenderer.renderBars(scene, card.bars, layout, x, y, textStyles);
    DataBriefingRenderer.renderTakeaway(scene, card.takeaway, layout, textStyles);
    return { panel, statusText };
  }

  static renderBars(scene, bars, layout, x, y, textStyles) {
    bars.forEach((bar, index) => {
      const barLayout = DataBriefingViewManager.getBarLayout(bar, x, y, index);
      createLayoutText(scene, { x: layout.barLabel.x, y: barLayout.y }, {
        text: bar.label,
        style: textStyles.barLabel,
        origin: [0, 0.5],
      });
      createPanelBackground(scene, {
        x: barLayout.x,
        y: barLayout.y,
        width: barLayout.backgroundWidth,
        height: barLayout.height,
      }, { fillColor: layout.barBackgroundColor }).setOrigin(0, 0.5);
      createPanelBackground(scene, {
        x: barLayout.x,
        y: barLayout.y,
        width: barLayout.width,
        height: barLayout.height,
      }, { fillColor: bar.color }).setOrigin(0, 0.5);
      createLayoutText(scene, { x: layout.barValue.x, y: barLayout.y }, {
        text: DataBriefingViewManager.formatBarValue(bar),
        style: textStyles.barValue,
        origin: [1, 0.5],
      });
    });
  }

  static renderTakeaway(scene, takeaway, layout, textStyles) {
    createPanelBackground(scene, layout.takeawayPanel, layout.takeawayPanel);
    createPanelTitle(scene, layout.takeawayTitle, textStyles.takeawayTitle);
    createLayoutText(scene, layout.takeawayBody, {
      text: takeaway,
      style: textStyles.takeawayBody,
    });
  }

  static renderConceptBox(scene, bodyText) {
    const layout = DataBriefingViewManager.getConceptBoxLayout();
    const textStyles = DataBriefingViewManager.getConceptBoxTextStyles();
    createPanelBackground(scene, layout.panel, layout.panel);
    createPanelTitle(scene, layout.title, textStyles.title);
    createLayoutText(scene, layout.body, {
      text: bodyText,
      style: textStyles.body,
    });
  }
}
