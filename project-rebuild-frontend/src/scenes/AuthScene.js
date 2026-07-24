import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import AuthViewManager from '../systems/AuthViewManager.js';
import { AUTH_MODES } from '../systems/AuthViewManager.js';
import AuthRenderer from '../systems/AuthRenderer.js';

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super('AuthScene');
  }

  create(data = {}) {
    const { width } = this.scale;
    const layout = AuthViewManager.getLayout();
    const mode = data.authMode ?? AUTH_MODES.entry;
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, { x: width / 2, origin: 0.5 });
    createLayoutText(this, layout.subtitle, { x: width / 2, origin: 0.5 });
    createLayoutText(this, AuthViewManager.getFooter(width), { origin: 0.5 });

    AuthRenderer.renderAuthScreen(this, width, this.scale.height, mode, {
      onModeChange: (nextMode) => this.scene.restart({ authMode: nextMode }),
      onSubmit: () => this.scene.start(layout.targetScene),
    });
  }
}
