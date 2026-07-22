import Ep4BriefingViewManager from './Ep4BriefingViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class Ep4BriefingRenderer {
  static renderIntroPanel(scene, briefing) {
    const layout = Ep4BriefingViewManager.getIntroPanelLayout();
    const style = Ep4BriefingViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep4BriefingViewManager.formatIntroText(briefing),
      style: { fontSize: style.bodyFontSize, color: style.bodyColor, lineSpacing: style.bodyLineSpacing, wordWrap: { width: layout.body.wordWrapWidth } },
    });
  }

  static renderRiskCard(scene, risk, index) {
    const layout = Ep4BriefingViewManager.getRiskCardLayout(index);
    const style = Ep4BriefingViewManager.getRiskCardStyle(risk);
    const background = createPanelBackground(scene, layout.panel, style);
    const icon = createLayoutText(scene, layout.icon, { text: risk.id === 'traffic' ? '🚚' : risk.id === 'environment' ? '🌿' : '⚖️', style: { fontSize: '48px' }, origin: 0.5 });
    const priority = createLayoutText(scene, layout.priority, { text: Ep4BriefingViewManager.formatRiskPriority(risk), style: { fontSize: '17px', color: risk.primary ? '#b45309' : '#64748b', fontStyle: 'bold', align: 'center', wordWrap: { width: layout.priority.wordWrapWidth } }, origin: 0.5 });
    const title = createPanelTitle(scene, layout.title, style, { text: risk.title, origin: 0.5 });
    const body = createLayoutText(scene, layout.body, { text: Ep4BriefingViewManager.formatRiskBody(risk), style: { fontSize: style.bodyFontSize, color: style.bodyColor, lineSpacing: style.bodyLineSpacing, wordWrap: { width: layout.body.wordWrapWidth } } });
    return { background, icon, priority, title, body };
  }

  static renderLearningPanel(scene, briefing) {
    const layout = Ep4BriefingViewManager.getLearningPanelLayout();
    const style = Ep4BriefingViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep4BriefingViewManager.formatLearningBody(briefing),
      style: { fontSize: '19px', color: style.bodyColor, lineSpacing: 4, wordWrap: { width: layout.body.wordWrapWidth } },
    });
  }

  static renderControls(scene, centerX) {
    const layout = Ep4BriefingViewManager.getControlLayout(centerX);
    return {
      layout,
      backButton: createTextButton(scene, layout.back, { fontSize: '28px', padding: { x: 30, y: 16 } }),
      nextButton: createTextButton(scene, layout.next, { fontSize: '28px', padding: { x: 30, y: 16 } }),
    };
  }
}
