import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';
import IssueDetector from '../systems/IssueDetector.js';
import SideEffectViewManager from '../systems/SideEffectViewManager.js';

export default class SideEffectScene extends Phaser.Scene {
  constructor() {
    super('SideEffectScene');
  }

  create() {
    const { width, height } = this.scale;
    const gameState = this.registry.get('gameState');
    const issues = IssueDetector.detect(gameState);

    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);
    ProgressStepper.render(this, 'result');

    this.add.text(width / 2, 82, '부작용 검토', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 148, '좋은 선택에도 비용과 부작용이 생길 수 있습니다. 다음 선택 전에 주의 신호를 확인합니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
      align: 'center',
      wordWrap: { width: 1450 },
    }).setOrigin(0.5);

    this.drawIssueArea(issues);
    this.drawConceptPanel(issues);
    this.drawControls();
  }

  drawIssueArea(issues) {
    this.add.rectangle(665, 545, 980, 650, 0xffffff, 0.96).setStrokeStyle(5, 0xfde68a);
    this.add.text(665, 260, '감지된 주의 신호', {
      fontSize: '38px',
      color: '#172554',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    if (!issues.length) {
      this.add.text(230, 385, [
        '현재 큰 부작용 신호는 없습니다.',
        '',
        '다만 실제 정책 판단에서는 시간이 지나며 새로운 문제가 생길 수 있습니다.',
        '다음 단계에서는 더 많은 시설과 정책 조합을 비교할 수 있게 확장합니다.',
      ].join('\n'), {
        fontSize: '30px',
        color: '#1e293b',
        lineSpacing: 14,
        wordWrap: { width: 860 },
      });
      return;
    }

    issues.slice(0, 4).forEach((issue, index) => {
      const y = 335 + index * 135;
      this.add.rectangle(665, y + 48, 860, 112, 0xe0f2fe, 1).setStrokeStyle(3, issue.color);
      this.add.circle(270, y + 48, 22, issue.color, 1).setStrokeStyle(3, 0xffffff);
      this.add.text(310, y + 8, issue.title, {
        fontSize: '27px',
        color: '#0f172a',
        fontStyle: 'bold',
      });
      this.add.text(310, y + 45, issue.message, {
        fontSize: '22px',
        color: '#334155',
        wordWrap: { width: 760 },
      });
    });
  }

  drawConceptPanel(issues) {
    this.add.rectangle(1480, 545, 560, 650, 0x1e293b, 0.98).setStrokeStyle(5, 0x93c5fd);
    this.add.text(1480, 260, '다음 선택 힌트', {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = SideEffectViewManager.formatHintRows(issues);

    this.add.text(1230, 330, rows.join('\n'), {
      fontSize: '22px',
      color: '#dbeafe',
      lineSpacing: 10,
      wordWrap: { width: 500 },
    });
  }

  drawControls() {
    const backButton = this.createButton(760, 955, '결과 다시 보기', '#c4b5fd', '#1e1b4b');
    backButton.on('pointerdown', () => this.scene.start('ResultScene'));

    const nextButton = this.createButton(1160, 955, '생각 정리', '#bbf7d0', '#123524');
    nextButton.on('pointerdown', () => this.scene.start('ReflectionScene'));
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '32px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
