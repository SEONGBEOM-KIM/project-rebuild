import Ep5PreviewViewManager from './Ep5PreviewViewManager.js';
import Ep5SolutionPlanManager from './Ep5SolutionPlanManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class Ep5PreviewRenderer {
  static renderIntroPanel(scene, preview, primaryRisk, selectedPlan = null) {
    const layout = Ep5PreviewViewManager.getIntroPanelLayout();
    const style = { fillColor: 0x172554, fillAlpha: 0.98, strokeWidth: 4, strokeColor: 0xfde68a, titleFontSize: '30px', titleColor: '#fde68a', titleFontStyle: 'bold' };
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    const body = createLayoutText(scene, layout.body, {
      text: [
        Ep5SolutionPlanManager.formatIntroText(preview, primaryRisk),
        Ep5SolutionPlanManager.formatMissionHandoff(primaryRisk, selectedPlan),
      ].join('\n\n'),
      style: { fontSize: '18px', color: '#e0f2fe', lineSpacing: 4, wordWrap: { width: layout.body.wordWrapWidth } },
    });
    return { body, layout };
  }

  static renderPlanCard(scene, plan, index, selectedPlanId, risks, onSelect) {
    const layout = Ep5PreviewViewManager.getPlanCardLayout(index);
    const selected = plan.id === selectedPlanId;
    const recommended = Ep5SolutionPlanManager.isRecommended(plan, risks);
    const style = Ep5PreviewViewManager.getCardStyle(plan, selected, recommended);
    const background = createPanelBackground(scene, layout.panel, style).setInteractive({ useHandCursor: true });
    const icon = createLayoutText(scene, layout.icon, { text: plan.icon, style: { fontSize: '48px' }, origin: 0.5 });
    const status = createLayoutText(scene, layout.status, { text: Ep5SolutionPlanManager.formatSelectionStatus(plan, selectedPlanId, risks), style: { fontSize: '17px', color: selected ? '#b45309' : recommended ? '#166534' : '#64748b', fontStyle: 'bold', align: 'center', wordWrap: { width: layout.status.wordWrapWidth } }, origin: 0.5 });
    const title = createPanelTitle(scene, layout.title, { titleFontSize: '28px', titleColor: '#172554', titleFontStyle: 'bold' }, { text: plan.title, origin: 0.5 });
    const body = createLayoutText(scene, layout.body, { text: Ep5SolutionPlanManager.formatPlanBody(plan), style: { fontSize: '18px', color: '#334155', lineSpacing: 3, wordWrap: { width: layout.body.wordWrapWidth } } });
    const select = () => onSelect(plan);
    [background, icon, status, title, body].forEach((object) => object.setInteractive({ useHandCursor: true }).on('pointerdown', select));
    return { background, icon, status, title, body, plan };
  }

  static renderControls(scene, centerX) {
    const layout = Ep5PreviewViewManager.getControlLayout(centerX);
    return { layout, backButton: createTextButton(scene, layout.back, { fontSize: '28px', padding: { x: 30, y: 16 } }), nextButton: createTextButton(scene, layout.next, { fontSize: '28px', padding: { x: 30, y: 16 } }) };
  }
}
