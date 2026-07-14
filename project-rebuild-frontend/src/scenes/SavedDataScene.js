import Phaser from 'phaser';
import SaveManager from '../systems/SaveManager.js';
import LearningDataRestoreManager from '../systems/LearningDataRestoreManager.js';
import SavedDataViewManager from '../systems/SavedDataViewManager.js';

export default class SavedDataScene extends Phaser.Scene {
  constructor() {
    super('SavedDataScene');
  }

  create() {
    const { width, height } = this.scale;
    const saved = SaveManager.load();

    this.add.rectangle(width / 2, height / 2, width, height, 0x10253f);
    this.add.text(width / 2, 90, '저장 데이터 확인', {
      fontSize: '60px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 155, '브라우저 localStorage에 임시 저장된 학습 기록입니다.', {
      fontSize: '26px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.add.rectangle(width / 2, 535, 1320, 660, 0x111827, 0.98).setStrokeStyle(5, 0x60a5fa);

    const body = SavedDataViewManager.formatBody(saved);

    this.add.text(340, 245, body, {
      fontSize: '21px',
      color: '#dbeafe',
      fontFamily: 'monospace',
      lineSpacing: 5,
      wordWrap: { width: 1240 },
    });

    this.importStatusText = this.add.text(width / 2, 865, '', {
      fontSize: '23px',
      color: '#fecaca',
      align: 'center',
    }).setOrigin(0.5);

    const backButton = this.createButton(width / 2 - 600, 940, '제목으로', '#c4b5fd', '#1e1b4b');
    backButton.on('pointerdown', () => this.scene.start('TitleScene'));

    const importButton = this.createButton(width / 2 - 200, 940, 'JSON 가져오기', '#bfdbfe', '#0f172a');
    importButton.on('pointerdown', () => this.openImportPicker());

    const continueButton = this.createButton(width / 2 + 175, 940, '이어보기', SavedDataViewManager.getContinueButtonColor(saved), '#123524');
    continueButton.on('pointerdown', () => {
      if (!SavedDataViewManager.canContinue(saved)) {
        return;
      }
      this.restoreSavedData(saved.data);
      this.scene.start('EndingScene');
    });

    const clearButton = this.createButton(width / 2 + 560, 940, '저장 삭제', '#fecaca', '#7f1d1d');
    clearButton.on('pointerdown', () => {
      SaveManager.clear();
      this.scene.restart();
    });
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
        this.scene.restart();
      } catch (error) {
        this.importStatusText.setText(SavedDataViewManager.getImportErrorMessage(error));
      }
    };
    input.click();
  }

  restoreSavedData(data) {
    LearningDataRestoreManager.restore(this.registry, data);
  }

  createButton(x, y, label, backgroundColor, color) {
    return this.add.text(x, y, label, {
      fontSize: '28px',
      color,
      backgroundColor,
      padding: { x: 34, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }
}
