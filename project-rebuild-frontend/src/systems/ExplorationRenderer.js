import { CURRENT_EPISODE } from '../data/episodes.js';
import ExplorationViewManager from './ExplorationViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class ExplorationRenderer {
  static renderHeader(scene) {
    const layout = ExplorationViewManager.getScreenLayout();
    return {
      title: createLayoutText(scene, layout.title, { text: CURRENT_EPISODE.shortTitle }),
      subtitle: createLayoutText(scene, layout.subtitle, {
        text: ExplorationViewManager.formatSubtitle(CURRENT_EPISODE.regionName),
      }),
    };
  }

  static renderInfoPanel(scene) {
    const layout = ExplorationViewManager.getInfoPanelLayout();
    const textStyles = ExplorationViewManager.getTextStyles();
    const panel = createPanelBackground(scene, layout.panel, layout.panel);
    return {
      panel,
      panelTitle: createLayoutText(scene, layout.title, {
        style: textStyles.panelTitle,
      }),
      panelBody: createLayoutText(scene, layout.body, {
        style: textStyles.panelBody,
      }),
      progressText: createLayoutText(scene, layout.progress, {
        style: textStyles.progress,
      }),
    };
  }

  static renderControls(scene) {
    const layout = ExplorationViewManager.getControlLayout();
    return {
      layout,
      backButton: createTextButton(scene, layout.back, ExplorationViewManager.getButtonStyle()),
      nextButton: createTextButton(scene, layout.next, ExplorationViewManager.getButtonStyle()),
    };
  }
}
