import TitleViewManager from './TitleViewManager.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
import { TITLE_VISUAL_ASSETS } from '../data/visualAssets.js';

export default class TitleRenderer {
  static renderScreen(scene, width, saved, continueButtonState = null) {
    const hasSave = Boolean(saved);
    const screenText = TitleViewManager.getScreenText();
    createScreenBackground(scene, screenText.backgroundColor);
    TitleRenderer.renderBackdrop(scene, width, scene.scale.height);
    createLayoutText(scene, screenText.eyebrow);
    createLayoutText(scene, screenText.title);
    createLayoutText(scene, screenText.subtitle);
    createLayoutText(scene, { x: width / 2, ...screenText.startPrompt }, { origin: 0.5 });
    const startSurface = scene.add.rectangle(width / 2, scene.scale.height / 2, width, scene.scale.height, 0x000000, 0)
      .setInteractive();

    const layout = TitleViewManager.getLayout(hasSave);
    const controls = TitleRenderer.renderControls(scene, width, layout, hasSave, continueButtonState);
    return { layout, startSurface, ...controls };
  }

  static renderControls(scene, width, layout, hasSave, continueButtonState = null) {
    const startButtonConfig = TitleViewManager.getStartButton();
    const importButtonConfig = TitleViewManager.getImportButton();
    const storageButtonConfig = TitleViewManager.getStorageButton();
    const loadButtonConfig = {
      ...TitleViewManager.getLoadButton(),
      label: continueButtonState?.label ?? TitleViewManager.getLoadButton().label,
      targetScene: continueButtonState?.targetScene ?? TitleViewManager.getLoadButton().targetScene,
    };

    return {
      startButton: TitleRenderer.renderTitleButton(scene, hasSave ? width / 2 - 170 : width / 2, layout.startButtonY, startButtonConfig, TitleViewManager.getPrimaryButtonStyle()),
      importButton: TitleRenderer.renderTitleButton(scene, width / 2 - 125, layout.importButtonY, importButtonConfig, TitleViewManager.getSecondaryButtonStyle()),
      storageButton: TitleRenderer.renderTitleButton(scene, width / 2 + 125, layout.storageButtonY, storageButtonConfig, TitleViewManager.getStorageButtonStyle()),
      loadButton: hasSave
        ? TitleRenderer.renderTitleButton(scene, width / 2 + 170, layout.loadButtonY, loadButtonConfig, TitleViewManager.getLoadButtonStyle())
        : null,
      importHintText: TitleRenderer.renderImportHint(scene, width / 2, layout.importHint),
      importStatusText: TitleRenderer.renderImportStatus(scene, width / 2, layout.importStatusY),
      startButtonConfig,
      importButtonConfig,
      storageButtonConfig,
      loadButtonConfig,
    };
  }

  static renderBackdrop(scene, width, height) {
    const background = scene.add.image(width / 2, height / 2, TITLE_VISUAL_ASSETS.background.textureKey);
    background.setDisplaySize?.(width, height);
    background.setDepth?.(-10);
    const titleShade = scene.add.rectangle(width / 2, height * 0.82, width, height * 0.36, 0x07111f, 0.26);
    titleShade.setDepth?.(-9);
    return { background, titleShade };
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

  static renderImportHint(scene, x, hint) {
    return createLayoutText(scene, { x, y: hint.y, text: hint.text }, {
      style: {
        fontSize: hint.fontSize,
        color: hint.color,
        align: 'center',
      },
      origin: 0.5,
    });
  }

  static renderImportStatus(scene, x, y) {
    return createLayoutText(scene, { x, y }, {
      style: TitleViewManager.getImportStatusStyle(),
      origin: 0.5,
    });
  }
}
