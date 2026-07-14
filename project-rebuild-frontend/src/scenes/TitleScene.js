import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import TitleViewManager from '../systems/TitleViewManager.js';

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

    const hasSave = SaveManager.hasSave();
    const layout = TitleViewManager.getLayout(hasSave);

    const startButton = this.add.text(width / 2, layout.startButtonY, '시작하기', TitleViewManager.getPrimaryButtonStyle())
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => this.scene.start('AuthScene'));

    const importButton = this.add.text(width / 2, layout.importButtonY, 'JSON 가져오기', TitleViewManager.getSecondaryButtonStyle())
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    importButton.on('pointerdown', () => this.openImportPicker());

    this.importStatusText = this.add.text(width / 2, layout.importStatusY, '', {
      fontSize: '22px',
      color: '#fecaca',
      align: 'center',
    }).setOrigin(0.5);

    const storageButton = this.add.text(width / 2, layout.storageButtonY, '브라우저 저장 관리', TitleViewManager.getStorageButtonStyle())
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    storageButton.on('pointerdown', () => this.scene.start('StorageManagerScene'));


    if (hasSave) {
      const loadButton = this.add.text(width / 2, layout.loadButtonY, '저장 데이터 확인', TitleViewManager.getLoadButtonStyle())
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

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
        this.importStatusText.setText(TitleViewManager.formatImportError(error));
      }
    };
    input.click();
  }
}
