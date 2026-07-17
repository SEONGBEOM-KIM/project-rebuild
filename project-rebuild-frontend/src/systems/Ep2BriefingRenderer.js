import Ep2BriefingViewManager from './Ep2BriefingViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';

export default class Ep2BriefingRenderer {
  static renderIntroPanel(scene, briefing) {
    const layout = Ep2BriefingViewManager.getIntroPanelLayout();
    const style = Ep2BriefingViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep2BriefingViewManager.formatIntroText(briefing),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
  }

  static renderStrategyCard(scene, strategy, index, selectedStrategyId = null, onSelect = null) {
    const layout = Ep2BriefingViewManager.getStrategyCardLayout(index);
    const style = Ep2BriefingViewManager.getCardStyle(strategy.id, selectedStrategyId, strategy.color);
    const background = createPanelBackground(scene, layout.panel, style).setInteractive({ useHandCursor: true });
    const icon = createLayoutText(scene, layout.icon, {
      text: strategy.icon,
      style: { fontSize: '48px' },
      origin: 0.5,
    });
    const title = createPanelTitle(scene, layout.title, style, {
      text: strategy.title,
      origin: 0.5,
    });
    const body = createLayoutText(scene, layout.body, {
      text: Ep2BriefingViewManager.formatStrategyBody(strategy),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
    const check = createLayoutText(scene, layout.check, {
      text: Ep2BriefingViewManager.formatStrategyCheck(strategy),
      style: {
        fontSize: '20px',
        color: '#334155',
        fontStyle: 'bold',
        wordWrap: { width: layout.check.wordWrapWidth },
      },
    });

    const selectionLabel = createLayoutText(scene, layout.selection, {
      text: Ep2BriefingViewManager.formatSelectionLabel(strategy.id, selectedStrategyId),
      style: Ep2BriefingViewManager.getSelectionLabelStyle(strategy.id === selectedStrategyId),
      origin: 0.5,
    });

    if (onSelect) {
      const select = () => onSelect(strategy);
      background.on('pointerdown', select);
      icon.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      title.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      body.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      check.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      selectionLabel.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    }

    return { background, icon, title, body, check, selectionLabel, strategy };
  }

  static renderSelectedStrategyPanel(scene, strategy) {
    const layout = Ep2BriefingViewManager.getSelectedStrategyPanelLayout();
    const style = Ep2BriefingViewManager.getSelectionPanelStyle();
    const background = createPanelBackground(scene, layout.panel, style);
    const title = createPanelTitle(scene, layout.title, style);
    const body = createLayoutText(scene, layout.body, {
      text: Ep2BriefingViewManager.formatSelectedStrategySummary(strategy),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
    return { background, title, body };
  }

  static renderControls(scene, centerX) {
    const layout = Ep2BriefingViewManager.getControlLayout(centerX);
    return {
      layout,
      endingButton: createTextButton(scene, layout.ending, Ep2BriefingViewManager.getButtonStyle()),
      startButton: createTextButton(scene, layout.start, Ep2BriefingViewManager.getButtonStyle()),
    };
  }
}
