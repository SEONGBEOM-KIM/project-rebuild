import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import TeacherReportManager from '../systems/TeacherReportManager.js';
import TeacherReportViewManager from '../systems/TeacherReportViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { copyTextToClipboard, downloadTextFile } from '../ui/BrowserFileActions.js';

export default class TeacherReportScene extends Phaser.Scene {
  constructor() {
    super('TeacherReportScene');
  }

  create() {
    const { width, height } = this.scale;
    const report = TeacherReportManager.build(this.registry);
    this.reportText = TeacherReportManager.buildReportText(report);

    const layout = TeacherReportViewManager.getScreenLayout(width);

    this.add.rectangle(width / 2, height / 2, width, height, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    this.add.text(layout.title.x, layout.title.y, layout.title.text, layout.title).setOrigin(0.5);

    this.add.text(layout.subtitle.x, layout.subtitle.y, layout.subtitle.text, layout.subtitle).setOrigin(0.5);

    const panels = TeacherReportViewManager.getPanelLayout();
    this.drawPanel(panels.progress, TeacherReportManager.formatProgressReport(report));
    this.drawPanel(panels.choice, TeacherReportManager.formatChoiceReport(report));
    this.drawPanel(panels.teaching, TeacherReportManager.formatTeachingPointReport(report));
    this.drawControls();
  }

  drawPanel(panel, body) {
    const panelStyle = TeacherReportViewManager.getPanelStyle();
    const textStyles = TeacherReportViewManager.getTextStyles();
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, panelStyle.fillColor, panelStyle.fillAlpha)
      .setStrokeStyle(panelStyle.strokeWidth, panelStyle.strokeColor);
    const titlePosition = TeacherReportViewManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, textStyles.panelTitle).setOrigin(0.5);
    const bodyPosition = TeacherReportViewManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, TeacherReportViewManager.getPanelBodyStyle(panel));
  }

  drawControls() {
    const layout = TeacherReportViewManager.getControlLayout();
    this.reportStatusText = this.add.text(
      layout.status.x,
      layout.status.y,
      TeacherReportManager.formatStatusText(),
      TeacherReportViewManager.getTextStyles().status,
    ).setOrigin(0.5);

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
