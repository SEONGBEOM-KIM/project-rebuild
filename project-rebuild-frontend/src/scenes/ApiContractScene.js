import Phaser from 'phaser';
import ProgressStepper from '../ui/ProgressStepper.js';

import { formatContractRequest, formatContractResponse } from '../data/apiContract.js';

export default class ApiContractScene extends Phaser.Scene {
  constructor() {
    super('ApiContractScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f172a);
    ProgressStepper.render(this, 'ending');

    this.add.text(width / 2, 78, 'API 계약 보기', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, 'Django REST Framework 연동 시 사용할 저장 endpoint와 요청/응답 구조 초안입니다.', {
      fontSize: '25px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.drawPanel(580, 525, 860, 660, '요청 Body 초안', formatContractRequest());
    this.drawPanel(1370, 525, 620, 660, '응답 예시', formatContractResponse());
    this.drawNotes();
    this.drawControls();
  }

  drawPanel(x, y, width, height, title, body) {
    this.add.rectangle(x, y, width, height, 0x111827, 0.98).setStrokeStyle(5, 0x60a5fa);
    this.add.text(x - width / 2 + 35, y - height / 2 + 32, title, {
      fontSize: '30px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.add.text(x - width / 2 + 35, y - height / 2 + 85, body, {
      fontSize: '17px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 3,
      wordWrap: { width: width - 70 },
    });
  }

  drawNotes() {
    this.add.rectangle(960, 855, 1480, 76, 0x1e293b, 0.98).setStrokeStyle(3, 0xfde68a);
    this.add.text(250, 834, '백엔드 구현 메모', {
      fontSize: '23px',
      color: '#fde68a',
      fontStyle: 'bold',
    });
    this.add.text(455, 834, '실제 연동 시 student/user, class_id, created_at은 서버에서 추가하는 편이 안전합니다. 프론트는 학습 결과 payload만 전송합니다.', {
      fontSize: '22px',
      color: '#ffffff',
      wordWrap: { width: 1200 },
    });
  }

  drawControls() {
    const payloadButton = this.createButton(650, 960, 'Payload 미리보기', '#bbf7d0', '#123524');
    payloadButton.on('pointerdown', () => this.scene.start('ApiPayloadScene'));

    const dataButton = this.createButton(970, 960, '학습 데이터로', '#c4b5fd', '#1e1b4b');
    dataButton.on('pointerdown', () => this.scene.start('LearningDataScene'));

    const endingButton = this.createButton(1280, 960, '마무리로', '#fde68a', '#0f172a');
    endingButton.on('pointerdown', () => this.scene.start('EndingScene'));
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '29px',
      color,
      backgroundColor,
      padding: { x: 28, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
