import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import ProgressStepper from '../ui/ProgressStepper.js';
import TeacherReportManager from '../systems/TeacherReportManager.js';
import TeacherReportViewManager from '../systems/TeacherReportViewManager.js';
import { createTextButton } from '../ui/TextButton.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
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

    createScreenBackground(this, layout.background.color);
    ProgressStepper.render(this, layout.progressStep);

    createLayoutText(this, layout.title, { origin: 0.5 });

    createLayoutText(this, layout.subtitle, { origin: 0.5 });

    this.drawSummaryStrip(width / 2, TeacherReportManager.formatClassSummaryReport(report));

    const panels = TeacherReportViewManager.getPanelLayout();
    this.drawPanel(panels.progress, TeacherReportManager.formatProgressReport(report));
    this.drawPanel(panels.choice, TeacherReportManager.formatChoiceReport(report));
    this.drawPanel(panels.teaching, TeacherReportManager.formatTeachingPointReport(report));
    this.drawControls();
  }

  drawSummaryStrip(centerX, body) {
    const layout = TeacherReportViewManager.getSummaryLayout(centerX);
    const summaryStyle = TeacherReportViewManager.getSummaryStyle();
    const textStyles = TeacherReportViewManager.getTextStyles();
    createPanelBackground(this, layout.panel, summaryStyle);
    createPanelTitle(this, layout.title, textStyles.summaryTitle);
    createLayoutText(this, layout.body, {
      text: body,
      style: textStyles.summaryBody,
    });
  }

  drawPanel(panel, body) {
    const panelStyle = TeacherReportViewManager.getPanelStyle();
    const textStyles = TeacherReportViewManager.getTextStyles();
    createPanelBackground(this, panel, panelStyle);
    const titlePosition = TeacherReportViewManager.getPanelTitlePosition(panel);
    createPanelTitle(this, titlePosition, textStyles.panelTitle, { text: panel.title, origin: 0.5 });
    const bodyPosition = TeacherReportViewManager.getPanelBodyPosition(panel);
    createLayoutText(this, bodyPosition, {
      text: body,
      style: TeacherReportViewManager.getPanelBodyStyle(panel),
    });
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
