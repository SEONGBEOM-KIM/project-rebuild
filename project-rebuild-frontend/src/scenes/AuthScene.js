import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createTextButton } from '../ui/TextButton.js';
import AuthViewManager from '../systems/AuthViewManager.js';
import AuthRenderer from '../systems/AuthRenderer.js';

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super('AuthScene');
  }

  create() {
    const { width, height } = this.scale;
    const layout = AuthViewManager.getLayout();
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { x: width / 2, origin: 0.5 });
    createLayoutText(this, layout.subtitle, { x: width / 2, origin: 0.5 });

    AuthViewManager.getPanelPositions(width, height).forEach((panel) => {
      AuthRenderer.renderAuthPanel(this, panel.x, panel.y, panel.title);
    });

    const proceedButton = AuthViewManager.getProceedButton(width);
    const proceed = createTextButton(this, {
      ...proceedButton,
      label: proceedButton.text,
    }, {
      fontSize: proceedButton.fontSize,
      padding: proceedButton.padding,
    });

    proceed.on('pointerdown', () => this.scene.start(proceedButton.targetScene));
  }


}
