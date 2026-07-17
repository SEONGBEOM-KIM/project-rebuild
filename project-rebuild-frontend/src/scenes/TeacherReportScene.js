import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import TeacherReportManager from '../systems/TeacherReportManager.js';
import TeacherReportViewManager from '../systems/TeacherReportViewManager.js';
import TeacherReportRenderer from '../systems/TeacherReportRenderer.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';

export default class TeacherReportScene extends Phaser.Scene {
  constructor() {
    super('TeacherReportScene');
  }

  create() {
    const { width } = this.scale;
    const report = TeacherReportManager.build(this.registry);
    this.reportText = TeacherReportManager.buildReportText(report);

    const layout = TeacherReportViewManager.getScreenLayout(width);

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    TeacherReportRenderer.renderSummaryStrip(this, width / 2, TeacherReportManager.formatClassSummaryReport(report));

    const panels = TeacherReportViewManager.getPanelLayout();
    TeacherReportRenderer.renderPanel(this, panels.progress, TeacherReportManager.formatProgressReport(report));
    TeacherReportRenderer.renderPanel(this, panels.choice, TeacherReportManager.formatChoiceReport(report));
    TeacherReportRenderer.renderPanel(this, panels.teaching, TeacherReportManager.formatTeachingPointReport(report));
    this.drawControls();
  }


  drawControls() {
    const layout = TeacherReportViewManager.getControlLayout();
    this.reportStatusText = createLayoutText(this, layout.status, {
      text: TeacherReportManager.formatStatusText(),
      style: TeacherReportViewManager.getTextStyles().status,
      origin: 0.5,
    });

    const copyButton = createTextButton(this, layout.copy, TeacherReportViewManager.getButtonStyle());
    copyButton.on('pointerdown', () => this.copyReportToClipboard());

    const downloadButton = createTextButton(this, layout.download, TeacherReportViewManager.getButtonStyle());
    downloadButton.on('pointerdown', () => this.downloadReport());

    const endingButton = createTextButton(this, layout.ending, TeacherReportViewManager.getButtonStyle());
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));

    const dataButton = createTextButton(this, layout.data, TeacherReportViewManager.getButtonStyle());
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));
  }

  async copyReportToClipboard() {
    try {
      await copyTextToClipboard(this.reportText);
      this.reportStatusText.setText(TeacherReportManager.formatCopySuccess());
      this.reportStatusText.setColor(TeacherReportViewManager.getStatusColor('success'));
    } catch (_error) {
      this.reportStatusText.setText(TeacherReportManager.formatCopyFailure());
      this.reportStatusText.setColor(TeacherReportViewManager.getStatusColor('failure'));
    }
  }

  downloadReport() {
    const downloadConfig = TeacherReportManager.getDownloadConfig();
    downloadTextFile({
      content: this.reportText,
      fileName: TeacherReportManager.formatDownloadFileName(),
      mimeType: downloadConfig.mimeType,
    });
    this.reportStatusText.setText(TeacherReportManager.formatDownloadSuccess());
    this.reportStatusText.setColor(TeacherReportViewManager.getStatusColor('success'));
  }

}
