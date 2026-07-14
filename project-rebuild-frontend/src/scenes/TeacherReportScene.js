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

    this.drawPanel(400, 450, 580, 560, '학습 진행', TeacherReportManager.formatProgressReport(report));
    this.drawPanel(1010, 450, 580, 560, '선택과 결과', TeacherReportManager.formatChoiceReport(report));
    this.drawPanel(1620, 450, 420, 560, '지도 포인트', TeacherReportManager.formatTeachingPointReport(report));
    this.drawControls();
  }

  drawPanel(x, y, width, height, title, body) {
    this.add.rectangle(x, y, width, height, 0xffffff, 0.96).setStrokeStyle(4, 0x60a5fa);
    this.add.text(x, y - height / 2 + 44, title, {
      fontSize: '34px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(x - width / 2 + 38, y - height / 2 + 100, body, {
      fontSize: '23px',
      color: '#1e293b',
      lineSpacing: 10,
      wordWrap: { width: width - 76 },
    });
  }

  drawControls() {
    this.reportStatusText = this.add.text(960, 855, '리포트를 복사하거나 텍스트 파일로 저장할 수 있습니다.', {
      fontSize: '24px',
      color: '#bfdbfe',
      align: 'center',
    }).setOrigin(0.5);

    const copyButton = this.createButton(520, 940, '리포트 복사', '#93c5fd', '#0f172a');
    copyButton.on('pointerdown', () => this.copyReportToClipboard());

    const downloadButton = this.createButton(820, 940, 'TXT 다운로드', '#a7f3d0', '#064e3b');
    downloadButton.on('pointerdown', () => this.downloadReport());

    const endingButton = this.createButton(1140, 940, '마무리로 돌아가기', '#c4b5fd', '#1e1b4b');
    endingButton.on('pointerdown', () => this.scene.start('EndingScene'));

    const dataButton = this.createButton(1490, 940, '학습 데이터 보기', '#bbf7d0', '#123524');
    dataButton.on('pointerdown', () => this.scene.start('LearningDataScene'));
  }

  async copyReportToClipboard() {
    try {
      await navigator.clipboard.writeText(this.reportText);
      this.reportStatusText.setText('교사용 리포트를 클립보드에 복사했습니다.');
      this.reportStatusText.setColor('#bbf7d0');
    } catch (_error) {
      this.reportStatusText.setText('클립보드 복사에 실패했습니다. 브라우저 권한을 확인하세요.');
      this.reportStatusText.setColor('#fecaca');
    }
  }

  downloadReport() {
    const blob = new Blob([this.reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-rebuild-ep1-teacher-report.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.reportStatusText.setText('교사용 리포트 다운로드를 시작했습니다.');
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
