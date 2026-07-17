import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';

import { formatContractRequest, formatContractResponse } from '../data/apiContract.js';
import ApiContractViewManager from '../systems/ApiContractViewManager.js';
import ApiContractRenderer from '../systems/ApiContractRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';

export default class ApiContractScene extends Phaser.Scene {
  constructor() {
    super('ApiContractScene');
  }

  create() {
    const { width } = this.scale;
    const screenLayout = ApiContractViewManager.getScreenLayout(width);
    createScreenBackground(this, screenLayout.backgroundColor);
    ProgressStepper.render(this, screenLayout.progressStep);

    createLayoutText(this, screenLayout.title, { origin: 0.5 });
    createLayoutText(this, screenLayout.subtitle, { origin: 0.5 });

    const panels = ApiContractViewManager.getPanelLayout();
    ApiContractRenderer.renderPanel(this, panels.request, formatContractRequest());
    ApiContractRenderer.renderPanel(this, panels.response, formatContractResponse());
    ApiContractRenderer.renderNotes(this);
    this.drawControls();
  }


  drawControls() {
    const layout = ApiContractViewManager.getControlLayout();
    const payloadButton = createTextButton(this, layout.payload, ApiContractViewManager.getButtonStyle());
    payloadButton.on('pointerdown', () => this.scene.start(layout.payload.target));

    const dataButton = createTextButton(this, layout.data, ApiContractViewManager.getButtonStyle());
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));

    const endingButton = createTextButton(this, layout.ending, ApiContractViewManager.getButtonStyle());
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));
  }

}
