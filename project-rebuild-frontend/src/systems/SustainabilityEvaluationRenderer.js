import SustainabilityEvaluationManager from './SustainabilityEvaluationManager.js';
import SustainabilityEvaluationViewManager from './SustainabilityEvaluationViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class SustainabilityEvaluationRenderer {
  static renderTakeaway(scene, centerX, evaluation) {
    const layout = SustainabilityEvaluationViewManager.getTakeawayLayout(centerX);
    const style = { fillColor: 0x172554, fillAlpha: 0.98, strokeWidth: 4, strokeColor: 0xfde68a, titleFontSize: '30px', titleColor: '#fde68a', titleFontStyle: 'bold' };
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: SustainabilityEvaluationManager.formatFinalTakeaway(evaluation),
      style: { fontSize: '20px', color: '#e0f2fe', lineSpacing: 6, wordWrap: { width: layout.body.wordWrapWidth } },
    });
  }

  static renderDimensionCard(scene, dimension, index) {
    const layout = SustainabilityEvaluationViewManager.getDimensionLayout(index);
    const style = SustainabilityEvaluationViewManager.getDimensionStyle(dimension);
    createPanelBackground(scene, layout.panel, style);
    createLayoutText(scene, layout.icon, { text: dimension.icon, style: { fontSize: '45px' }, origin: index === 3 ? 0.5 : 0.5 });
    createPanelTitle(scene, layout.title, { titleFontSize: '28px', titleColor: '#172554', titleFontStyle: 'bold' }, { text: dimension.title, origin: index === 3 ? 0 : 0.5 });
    return createLayoutText(scene, layout.body, {
      text: SustainabilityEvaluationManager.formatDimensionBody(dimension),
      style: { fontSize: index === 3 ? '18px' : '19px', color: '#334155', lineSpacing: 4, wordWrap: { width: layout.body.wordWrapWidth } },
    });
  }

  static renderControls(scene, centerX) {
    const controls = SustainabilityEvaluationViewManager.getControls(centerX);
    return Object.fromEntries(Object.entries(controls).map(([key, control]) => [
      key,
      { control, button: createTextButton(scene, control, { fontSize: '28px', padding: { x: 32, y: 18 } }) },
    ]));
  }
}
