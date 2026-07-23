import Phaser from 'phaser';
import { createScreenBackground } from '../ui/ScreenBackground.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { CURRENT_EPISODE } from '../data/episodes.js';
import StoryViewManager from '../systems/StoryViewManager.js';
import StoryRenderer from '../systems/StoryRenderer.js';
import { getCurrentEpisodeContent } from '../data/episodeContent.js';
import SCENE_KEYS from '../data/sceneKeys.js';

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const { width } = this.scale;
    const layout = StoryViewManager.getLayout();
    this.storyBeats = getCurrentEpisodeContent().storyBeats;
    this.dialogueIndex = 0;
    createScreenBackground(this, layout.backgroundColor);
    createLayoutText(this, layout.title, {
      x: width / 2,
      text: CURRENT_EPISODE.title,
      origin: 0.5,
    });

    if (this.storyBeats?.length) {
      this.renderDialogue();
      this.input.keyboard?.on('keydown-ENTER', () => this.advanceDialogue());
      return;
    }

    createLayoutText(this, layout.intro, { x: width / 2, text: CURRENT_EPISODE.intro, origin: 0.5 });
    const button = StoryViewManager.getStartButton(width);
    StoryRenderer.renderStartButton(this, button, () => this.scene.start(button.targetScene));
    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start(button.targetScene));
  }

  renderDialogue() {
    const width = this.scale.width;
    this.dialogueObjects?.forEach((object) => object?.destroy());
    const dialogue = this.storyBeats[this.dialogueIndex];
    const layout = StoryViewManager.getDialogueLayout(width, this.dialogueIndex, this.storyBeats.length);
    this.dialogueObjects = Object.values(StoryRenderer.renderDialogue(
      this,
      dialogue,
      layout,
      { isFinal: this.dialogueIndex === this.storyBeats.length - 1, onNext: () => this.advanceDialogue() },
    ));
  }

  advanceDialogue() {
    if (this.dialogueIndex >= this.storyBeats.length - 1) {
      this.scene.start(SCENE_KEYS.Exploration);
      return;
    }
    this.dialogueIndex += 1;
    this.renderDialogue();
  }
}
