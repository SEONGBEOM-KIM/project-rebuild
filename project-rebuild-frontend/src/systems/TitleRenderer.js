import TitleViewManager from './TitleViewManager.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
import { TITLE_VISUAL_ASSETS } from '../data/visualAssets.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class TitleRenderer {
  static renderScreen(scene, width, saved, continueButtonState = null) {
    const hasSave = Boolean(saved);
    const screenText = TitleViewManager.getScreenText();
    createScreenBackground(scene, screenText.backgroundColor);
    TitleRenderer.renderBackdrop(scene, width, scene.scale.height);
    TitleRenderer.renderTitleTreatment(scene, width);
    createLayoutText(scene, { x: width / 2, ...screenText.eyebrow }, { origin: 0.5 });
    createLayoutText(scene, { x: width / 2, ...screenText.title }, { origin: 0.5, style: { shadow: { offsetX: 4, offsetY: 5, color: '#061526', blur: 0, stroke: true, fill: true } } });
    createLayoutText(scene, { x: width / 2, ...screenText.subtitle }, { origin: 0.5 });
    createLayoutText(scene, { x: width / 2, ...screenText.startPrompt }, { origin: 0.5 });
    const startSurface = scene.add.rectangle(width / 2, scene.scale.height / 2, width, scene.scale.height, 0x000000, 0)
      .setInteractive();

    const layout = TitleViewManager.getLayout(hasSave);
    const controls = TitleRenderer.renderControls(scene, width, layout, hasSave, continueButtonState);
    return { layout, startSurface, ...controls };
  }

  static renderTitleTreatment(scene, width) {
    const banner = TitleViewManager.getTitleBanner();
    const panel = createPanelBackground(scene, { x: width / 2, ...banner }, {
      fillColor: 0x071a31,
      fillAlpha: 0.48,
      strokeWidth: 3,
      strokeColor: 0xf5d38a,
    });
    const innerLine = scene.add.rectangle(width / 2, banner.y + banner.height / 2 - 22, banner.width - 80, 2, 0xf5d38a, 0.8);
    innerLine.setDepth?.(0);
    return { panel, innerLine };
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
