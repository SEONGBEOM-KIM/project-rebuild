import Ep4InvestigationViewManager from './Ep4InvestigationViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class Ep4InvestigationRenderer {
  static renderRiskCard(scene, risk, index, selected, reviewed, onSelect) {
    const layout = Ep4InvestigationViewManager.getRiskCardLayout(index);
    const style = Ep4InvestigationViewManager.getCardStyle(risk, selected, reviewed);
    const textStyle = Ep4InvestigationViewManager.getCardTextStyle();
    const background = createPanelBackground(scene, layout.panel, style).setInteractive({ useHandCursor: true });
    const icon = createLayoutText(scene, layout.icon, { text: risk.id === 'traffic' ? '🚚' : risk.id === 'environment' ? '🌿' : '⚖️', style: { fontSize: '48px' }, origin: 0.5 });
    const status = createLayoutText(scene, layout.status, { text: Ep4InvestigationViewManager.formatCardStatus(risk, reviewed), style: { ...textStyle.status, wordWrap: { width: layout.status.wordWrapWidth } }, origin: 0.5 });
    const title = createLayoutText(scene, layout.title, { text: risk.title, style: { ...textStyle.title, wordWrap: { width: layout.title.wordWrapWidth } }, origin: 0.5 });
    const body = createLayoutText(scene, layout.body, { text: Ep4InvestigationViewManager.formatCardBody(risk), style: { ...textStyle.body, wordWrap: { width: layout.body.wordWrapWidth } } });
    const select = () => onSelect(risk);
    [background, icon, status, title, body].forEach((object) => object.setInteractive({ useHandCursor: true }).on('pointerdown', select));
    return { background, icon, status, title, body, risk };
  }

  static renderDetailPanel(scene) {
    const layout = Ep4InvestigationViewManager.getDetailPanelLayout();
    const style = Ep4InvestigationViewManager.getDetailStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, { text: Ep4InvestigationViewManager.formatDetail(), style: { fontSize: '21px', color: '#e0f2fe', lineSpacing: 5, wordWrap: { width: layout.body.wordWrapWidth } } });
  }

  static renderControls(scene, centerX) {
    const layout = Ep4InvestigationViewManager.getControlLayout(centerX);
    return {
      layout,
      backButton: createTextButton(scene, layout.back, { fontSize: '28px', padding: { x: 30, y: 16 } }),
      nextButton: createTextButton(scene, layout.next, { fontSize: '28px', padding: { x: 30, y: 16 } }),
    };
  }
}
