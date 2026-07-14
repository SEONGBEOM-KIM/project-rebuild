import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x10253f);
    this.add.text(width / 2, 280, '프로젝트 리빌드', {
      fontSize: '92px',
      color: '#f7fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(width / 2, 380, '균형 있게 성장하는 지역을 위하여', {
      fontSize: '36px',
      color: '#b9d7ff',
    }).setOrigin(0.5);

    const startButton = this.add.text(width / 2, 620, '시작하기', {
      fontSize: '44px',
      color: '#10253f',
      backgroundColor: '#a7f3d0',
      padding: { x: 44, y: 22 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => this.scene.start('AuthScene'));

    const importButton = this.add.text(width / 2, SaveManager.hasSave() ? 835 : 745, 'JSON 가져오기', {
      fontSize: '30px',
      color: '#0f172a',
      backgroundColor: '#bfdbfe',
      padding: { x: 32, y: 15 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    importButton.on('pointerdown', () => this.openImportPicker());

    this.importStatusText = this.add.text(width / 2, SaveManager.hasSave() ? 910 : 820, '', {
      fontSize: '22px',
      color: '#fecaca',
      align: 'center',
    }).setOrigin(0.5);

    const storageButton = this.add.text(width / 2, SaveManager.hasSave() ? 910 : 820, '브라우저 저장 관리', {
      fontSize: '24px',
      color: '#dbeafe',
      backgroundColor: '#334155',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    storageButton.on('pointerdown', () => this.scene.start('StorageManagerScene'));

    this.importStatusText.setY(SaveManager.hasSave() ? 975 : 885);

    if (SaveManager.hasSave()) {
      const loadButton = this.add.text(width / 2, 745, '저장 데이터 확인', {
        fontSize: '32px',
        color: '#dbeafe',
        backgroundColor: '#1e293b',
        padding: { x: 34, y: 16 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      loadButton.on('pointerdown', () => this.scene.start('SavedDataScene'));
    }
  }

  openImportPicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      try {
        const text = await file.text();
        SaveManager.importJsonText(text);
        this.scene.start('SavedDataScene');
      } catch (error) {
        this.importStatusText.setText(error.message || 'JSON 가져오기에 실패했습니다.');
      }
    };
    input.click();
  }
}
