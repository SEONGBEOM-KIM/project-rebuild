import TitleViewManager from './TitleViewManager.js';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { TITLE_VISUAL_ASSETS } from '../data/visualAssets.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class TitleRenderer {
  static renderScreen(scene, width) {
    const screenText = TitleViewManager.getScreenText();
    createScreenBackground(scene, screenText.backgroundColor);
    TitleRenderer.renderBackdrop(scene, width, scene.scale.height);
    TitleRenderer.renderTitleTreatment(scene, width);
    createLayoutText(scene, { x: width / 2, ...screenText.title }, { origin: 0.5, style: { shadow: { offsetX: 4, offsetY: 5, color: '#061526', blur: 0, stroke: true, fill: true } } });
    createLayoutText(scene, { x: width / 2, ...screenText.subtitle }, { origin: 0.5 });
    const startPrompt = createLayoutText(scene, { x: width / 2, ...screenText.startPrompt }, { origin: 0.5 });
    scene.tweens?.add({
      targets: startPrompt,
      alpha: { from: 0.35, to: 1 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    const startSurface = scene.add.rectangle(width / 2, scene.scale.height / 2, width, scene.scale.height, 0x000000, 0)
      .setInteractive();

    return { startSurface, startTargetScene: TitleViewManager.getStartButton().targetScene };
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

  static renderBackdrop(scene, width, height) {
    const background = scene.add.image(width / 2, height / 2, TITLE_VISUAL_ASSETS.background.textureKey);
    background.setDisplaySize?.(width, height);
    background.setDepth?.(-10);
    const titleShade = scene.add.rectangle(width / 2, height * 0.82, width, height * 0.36, 0x07111f, 0.26);
    titleShade.setDepth?.(-9);
    return { background, titleShade };
  }

}
