import TitleViewManager from './TitleViewManager.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';

export default class TitleRenderer {
  static renderScreen(scene, width, hasSave) {
    const screenText = TitleViewManager.getScreenText();
    createScreenBackground(scene, screenText.backgroundColor);
    createLayoutText(scene, screenText.title, { x: width / 2, origin: 0.5 });
    createLayoutText(scene, screenText.subtitle, { x: width / 2, origin: 0.5 });

    const layout = TitleViewManager.getLayout(hasSave);
    const controls = TitleRenderer.renderControls(scene, width, layout, hasSave);
    return { layout, ...controls };
  }

  static renderControls(scene, width, layout, hasSave) {
    const startButtonConfig = TitleViewManager.getStartButton();
    const importButtonConfig = TitleViewManager.getImportButton();
    const storageButtonConfig = TitleViewManager.getStorageButton();
    const loadButtonConfig = TitleViewManager.getLoadButton();

    return {
      startButton: TitleRenderer.renderTitleButton(scene, width / 2, layout.startButtonY, startButtonConfig, TitleViewManager.getPrimaryButtonStyle()),
      importButton: TitleRenderer.renderTitleButton(scene, width / 2, layout.importButtonY, importButtonConfig, TitleViewManager.getSecondaryButtonStyle()),
      storageButton: TitleRenderer.renderTitleButton(scene, width / 2, layout.storageButtonY, storageButtonConfig, TitleViewManager.getStorageButtonStyle()),
      loadButton: hasSave
        ? TitleRenderer.renderTitleButton(scene, width / 2, layout.loadButtonY, loadButtonConfig, TitleViewManager.getLoadButtonStyle())
        : null,
      importStatusText: TitleRenderer.renderImportStatus(scene, width / 2, layout.importStatusY),
      startButtonConfig,
      importButtonConfig,
      storageButtonConfig,
      loadButtonConfig,
    };
  }

  static renderTitleButton(scene, x, y, config, style) {
    return createTextButton(scene, {
      x,
      y,
      label: config.label,
      backgroundColor: style.backgroundColor,
      textColor: style.color,
    }, style);
  }

  static renderImportStatus(scene, x, y) {
    return createLayoutText(scene, { x, y }, {
      style: TitleViewManager.getImportStatusStyle(),
      origin: 0.5,
    });
  }
}
