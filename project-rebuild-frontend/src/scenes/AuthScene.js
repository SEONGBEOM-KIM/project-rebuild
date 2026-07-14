import Phaser from 'phaser';

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super('AuthScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b1727);
    this.add.text(width / 2, 170, '학습자 입장', {
      fontSize: '68px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 245, '현재 버전은 로그인/회원가입 UI만 제공합니다.', {
      fontSize: '28px',
      color: '#93c5fd',
    }).setOrigin(0.5);

    this.createPanel(width / 2 - 260, height / 2 + 40, '로그인');
    this.createPanel(width / 2 + 260, height / 2 + 40, '회원가입');

    const proceed = this.add.text(width / 2, 850, '인증 없이 계속하기', {
      fontSize: '36px',
      color: '#10253f',
      backgroundColor: '#fde68a',
      padding: { x: 36, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    proceed.on('pointerdown', () => this.scene.start('StoryScene'));
  }

  createPanel(x, y, title) {
    this.add.rectangle(x, y, 420, 430, 0x172554).setStrokeStyle(4, 0x60a5fa);
    this.add.text(x, y - 160, title, { fontSize: '38px', color: '#ffffff' }).setOrigin(0.5);
    this.add.rectangle(x, y - 60, 310, 54, 0xf8fafc);
    this.add.text(x - 140, y - 60, '이름', { fontSize: '24px', color: '#64748b' }).setOrigin(0, 0.5);
    this.add.rectangle(x, y + 30, 310, 54, 0xf8fafc);
    this.add.text(x - 140, y + 30, '비밀번호', { fontSize: '24px', color: '#64748b' }).setOrigin(0, 0.5);
    this.add.rectangle(x, y + 130, 210, 58, 0x38bdf8);
    this.add.text(x, y + 130, 'UI 샘플', { fontSize: '26px', color: '#0f172a' }).setOrigin(0.5);
  }
}
