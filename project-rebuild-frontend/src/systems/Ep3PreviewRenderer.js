import Ep3PreviewViewManager from './Ep3PreviewViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class Ep3PreviewRenderer {
  static renderIntroPanel(scene, preview) {
    const layout = Ep3PreviewViewManager.getIntroPanelLayout();
    const style = Ep3PreviewViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep3PreviewViewManager.formatIntroText(preview),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
  }

  static renderFocusCard(scene, focusArea, index) {
    const layout = Ep3PreviewViewManager.getFocusCardLayout(index);
    const style = Ep3PreviewViewManager.getCardStyle();
    const background = createPanelBackground(scene, layout.panel, style);
    const icon = createLayoutText(scene, layout.icon, {
      text: focusArea.icon,
      style: { fontSize: '50px' },
      origin: 0.5,
    });
    const title = createPanelTitle(scene, layout.title, style, {
      text: focusArea.title,
      origin: 0.5,
    });
    const body = createLayoutText(scene, layout.body, {
      text: Ep3PreviewViewManager.formatFocusBody(focusArea),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
    return { background, icon, title, body };
  }

  static renderTransitionNote(scene, preview) {
    const layout = Ep3PreviewViewManager.getTransitionNoteLayout();
    const style = Ep3PreviewViewManager.getNoteStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep3PreviewViewManager.formatTransitionNote(preview),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
  }

  static renderControls(scene, centerX) {
    const layout = Ep3PreviewViewManager.getControlLayout(centerX);
    return {
      layout,
      endingButton: createTextButton(scene, layout.ending, Ep3PreviewViewManager.getButtonStyle()),
      restartButton: createTextButton(scene, layout.restart, Ep3PreviewViewManager.getButtonStyle()),
    };
  }
}
