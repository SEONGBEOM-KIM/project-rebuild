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

  static renderStrategyCard(scene, strategy, index) {
    const layout = Ep2BriefingViewManager.getStrategyCardLayout(index);
    const style = Ep2BriefingViewManager.getCardStyle();
    createPanelBackground(scene, layout.panel, { ...style, strokeColor: strategy.color });
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

    return { icon, title, body, check };
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
