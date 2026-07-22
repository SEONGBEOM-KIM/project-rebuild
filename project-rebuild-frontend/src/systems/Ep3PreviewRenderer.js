import Ep3PreviewViewManager from './Ep3PreviewViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground, createPanelTitle } from '../ui/PanelRenderer.js';
import { createTextButton } from '../ui/TextButton.js';

export default class Ep3PreviewRenderer {
  static renderIntroPanel(scene, preview) {
    const layout = Ep3PreviewViewManager.getIntroPanelLayout();
    const style = Ep3PreviewViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep3PreviewViewManager.formatIntroText(preview),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
  }

  static renderWorldProgress(scene, worldState) {
    const layout = Ep3PreviewViewManager.getWorldProgressLayout();
    const style = Ep3PreviewViewManager.getPanelStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    return createLayoutText(scene, layout.body, {
      text: Ep3PreviewViewManager.formatWorldProgress(worldState),
      style: {
        fontSize: '18px',
        color: style.bodyColor,
        lineSpacing: 3,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
  }

  static renderFocusCard(scene, focusArea, index, selectedStrategyId = null, onSelect = null) {
    const layout = Ep3PreviewViewManager.getFocusCardLayout(index);
    const style = Ep3PreviewViewManager.getCardStyle(focusArea.id, selectedStrategyId, focusArea.color);
    const background = createPanelBackground(scene, layout.panel, style).setInteractive({ useHandCursor: true });
    const icon = createLayoutText(scene, layout.icon, {
      text: focusArea.icon,
      style: { fontSize: '50px' },
      origin: 0.5,
    });
    const title = createPanelTitle(scene, layout.title, style, {
      text: focusArea.title,
      origin: 0.5,
    });
    const body = createLayoutText(scene, layout.body, {
      text: Ep3PreviewViewManager.formatFocusBody(focusArea),
      style: {
        fontSize: style.bodyFontSize,
        color: style.bodyColor,
        lineSpacing: style.bodyLineSpacing,
        wordWrap: { width: layout.body.wordWrapWidth },
      },
    });
    const selectionLabel = createLayoutText(scene, layout.selection, {
      text: Ep3PreviewViewManager.formatSelectionLabel(focusArea.id, selectedStrategyId),
      style: Ep3PreviewViewManager.getSelectionLabelStyle(focusArea.id === selectedStrategyId),
      origin: 0.5,
    });

    if (onSelect) {
      const select = () => onSelect(focusArea);
      background.on('pointerdown', select);
      icon.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      title.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      body.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      selectionLabel.setInteractive({ useHandCursor: true }).on('pointerdown', select);
    }

    return { background, icon, title, body, selectionLabel, strategy: focusArea };
  }

  static renderTransitionNote(scene, preview, policies = [], buildings = []) {
    const layout = Ep3PreviewViewManager.getTransitionNoteLayout();
    const style = Ep3PreviewViewManager.getNoteStyle();
    createPanelBackground(scene, layout.panel, style);
    createPanelTitle(scene, layout.title, style);
    const textStyle = {
      fontSize: style.bodyFontSize,
      color: style.bodyColor,
      lineSpacing: style.bodyLineSpacing,
    };
    const policyBody = createLayoutText(scene, layout.policyBody, {
      text: Ep3PreviewViewManager.formatPolicyPreviewRows(policies),
      style: { ...textStyle, wordWrap: { width: layout.policyBody.wordWrapWidth } },
    });
    const buildingBody = createLayoutText(scene, layout.buildingBody, {
      text: Ep3PreviewViewManager.formatBuildingPreviewRows(buildings),
      style: { ...textStyle, wordWrap: { width: layout.buildingBody.wordWrapWidth } },
    });
    return { policyBody, buildingBody };
  }

  static renderControls(scene, centerX) {
    const layout = Ep3PreviewViewManager.getControlLayout(centerX);
    return {
      layout,
      endingButton: createTextButton(scene, layout.ending, Ep3PreviewViewManager.getButtonStyle()),
      startButton: createTextButton(scene, layout.start, Ep3PreviewViewManager.getButtonStyle()),
      restartButton: createTextButton(scene, layout.restart, Ep3PreviewViewManager.getButtonStyle()),
    };
  }
}
