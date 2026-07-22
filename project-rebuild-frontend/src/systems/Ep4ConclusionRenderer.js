import Ep4ConclusionViewManager from './Ep4ConclusionViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class Ep4ConclusionRenderer {
  static renderMainPanel(scene, risks) {
    const layout = Ep4ConclusionViewManager.getMainPanelLayout();
    const style = Ep4ConclusionViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, { text: Ep4ConclusionViewManager.formatMainBody(risks), style: { fontSize: '23px', color: '#1e293b', lineSpacing: 7, wordWrap: { width: layout.body.wordWrapWidth } } });
  }

  static renderNextPanel(scene) {
    const layout = Ep4ConclusionViewManager.getNextPanelLayout();
    const style = Ep4ConclusionViewManager.getPanelStyle('next');
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, { text: Ep4ConclusionViewManager.formatNextBody(), style: { fontSize: '21px', color: '#dbeafe', lineSpacing: 5, wordWrap: { width: layout.body.wordWrapWidth } } });
  }

  static renderControls(scene, centerX) {
    const layout = Ep4ConclusionViewManager.getControlLayout(centerX);
    return {
      layout,
      backButton: createTextButton(scene, layout.back, { fontSize: '28px', padding: { x: 30, y: 16 } }),
      nextButton: createTextButton(scene, layout.next, { fontSize: '28px', padding: { x: 30, y: 16 } }),
    };
  }
}
