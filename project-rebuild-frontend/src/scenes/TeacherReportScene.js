import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import TeacherReportManager from '../systems/TeacherReportManager.js';

export default class TeacherReportScene extends Phaser.Scene {
  constructor() {
    super('TeacherReportScene');
  }

  create() {
    const { width, height } = this.scale;
    const report = TeacherReportManager.build(this.registry);
    this.reportText = TeacherReportManager.buildReportText(report);

    this.add.rectangle(width / 2, height / 2, width, height, 0x0b1727);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 78, '교사용 요약', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, '수업 중 학생 활동을 빠르게 확인하기 위한 임시 리포트 화면입니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    const panels = TeacherReportManager.getPanelLayout();
    this.drawPanel(panels.progress, TeacherReportManager.formatProgressReport(report));
    this.drawPanel(panels.choice, TeacherReportManager.formatChoiceReport(report));
    this.drawPanel(panels.teaching, TeacherReportManager.formatTeachingPointReport(report));
    this.drawControls();
  }

  drawPanel(panel, body) {
    this.add.rectangle(panel.x, panel.y, panel.width, panel.height, 0xffffff, 0.96).setStrokeStyle(4, 0x60a5fa);
    const titlePosition = TeacherReportManager.getPanelTitlePosition(panel);
    this.add.text(titlePosition.x, titlePosition.y, panel.title, {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const bodyPosition = TeacherReportManager.getPanelBodyPosition(panel);
    this.add.text(bodyPosition.x, bodyPosition.y, body, TeacherReportManager.getPanelBodyStyle(panel));
  }

  drawControls() {
    const layout = TeacherReportManager.getControlLayout();
    this.reportStatusText = this.add.text(layout.status.x, layout.status.y, TeacherReportManager.formatStatusText(), {
      fontSize: '24px',
      color: '#bfdbfe',
      align: 'center',
    }).setOrigin(0.5);

    const copyButton = this.createButton(layout.copy.x, layout.copy.y, layout.copy.label, '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyReportToClipboard());

    const downloadButton = this.createButton(layout.download.x, layout.download.y, layout.download.label, '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadReport());

    const endingButton = this.createButton(layout.ending.x, layout.ending.y, layout.ending.label, '#c4b5fd', '#1e1b4b');
    endingButton.on('pointerdown', () => this.scene.start(layout.ending.target));

    const dataButton = this.createButton(layout.data.x, layout.data.y, layout.data.label, '#bbf7d0', '#123524');
    dataButton.on('pointerdown', () => this.scene.start(layout.data.target));
  }

  async copyReportToClipboard() {
    try {
      await navigator.clipboard.writeText(this.reportText);
      this.reportStatusText.setText(TeacherReportManager.formatCopySuccess());
      this.reportStatusText.setColor('#bbf7d0');
    } catch (_error) {
      this.reportStatusText.setText(TeacherReportManager.formatCopyFailure());
      this.reportStatusText.setColor('#fecaca');
    }
  }

  downloadReport() {
    const blob = new Blob([this.reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = TeacherReportManager.formatDownloadFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.reportStatusText.setText(TeacherReportManager.formatDownloadSuccess());
    this.reportStatusText.setColor('#bbf7d0');
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '29px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
