import { REGISTRY_KEYS } from '../data/registryKeys.js';
import StateHudManager from '../systems/StateHudManager.js';
import { DEFAULT_STATE_KEYS } from '../data/stateLabels.js';
import { getEpisode } from '../data/episodes.js';
import { getPlacementConfig } from '../data/episodePlacementConfigs.js';
import TimeStateManager from '../systems/TimeStateManager.js';
import { UI_THEME } from './UiTheme.js';

const EXCLUDED_SCENES = new Set([
  'BootScene',
  'TitleScene',
  'AuthScene',
  'PlacementScene',
]);

const HUD_STYLE = Object.freeze({
  ...UI_THEME.hud,
  labelFontSize: '12px',
  valueFontSize: '16px',
});

export default class GlobalStateHudRenderer {
  static shouldRender(scene) {
    const sceneKey = scene?.scene?.key;
    if (!scene || EXCLUDED_SCENES.has(sceneKey) || !scene.registry?.get) return false;
    return Boolean(scene.registry.get(REGISTRY_KEYS.gameState));
  }

  static getLayout(width, stateKeyCount = DEFAULT_STATE_KEYS.length) {
    const gap = 6;
    const margin = 20;
    const panelHeight = 48;
    const panelWidth = Math.min(900, Math.max(560, Math.floor(width * 0.6)));
    const cardWidth = (panelWidth - gap * (stateKeyCount + 1)) / stateKeyCount;
    const episodeBadgeWidth = Math.min(400, Math.max(260, width - panelWidth - margin * 3));

    return {
      panel: {
        x: margin + panelWidth / 2,
        y: 24,
        width: panelWidth,
        height: panelHeight,
      },
      itemStartX: margin + gap + cardWidth / 2,
      itemY: 24,
      itemWidth: cardWidth,
      itemHeight: 40,
      itemGap: gap,
      episodeBadge: {
        x: width - margin - episodeBadgeWidth / 2,
        y: 30,
        width: episodeBadgeWidth,
        height: panelHeight,
      },
    };
  }

  static renderIfAvailable(scene) {
    if (!this.shouldRender(scene)) return null;

    const state = scene.registry.get(REGISTRY_KEYS.gameState);
    const items = StateHudManager.buildItems(state, { stateKeys: DEFAULT_STATE_KEYS });
    const layout = this.getLayout(scene.scale.width, items.length);
    const panel = this.createRectangle(scene, layout.panel, HUD_STYLE.panelColor, HUD_STYLE.panelAlpha);
    panel.setStrokeStyle?.(1, HUD_STYLE.panelStrokeColor);

    const renderedItems = items.map((item, index) => this.renderItem(scene, item, layout, index));
    const episode = this.getEpisodeContext(scene);
    const timeState = TimeStateManager.get(scene.registry);
    const episodeBadge = episode ? this.renderEpisodeBadge(scene, episode, timeState, layout.episodeBadge) : null;
    return { panel, items: renderedItems, episodeBadge, episode, timeState, layout };
  }

  static getEpisodeContext(scene) {
    const worldState = scene.registry.get(REGISTRY_KEYS.worldState);
    const placementConfigId = scene.registry.get(REGISTRY_KEYS.placementConfigId);
    const sceneEpisodeIds = {
      StoryScene: 'ep1',
      ExplorationScene: 'ep1',
      DataBriefingScene: 'ep1',
      CauseQuizScene: 'ep1',
      ProblemSummaryScene: 'ep1',
      SelectionScene: 'ep2',
      Ep2BriefingScene: 'ep2',
      Ep3PreviewScene: 'ep3',
      Ep4BriefingScene: 'ep4',
      Ep4InvestigationScene: 'ep4',
      Ep4ConclusionScene: 'ep4',
      Ep5PreviewScene: 'ep5',
      SustainabilityEvaluationScene: 'ep6',
    };
    const episodeId = sceneEpisodeIds[scene.scene?.key]
      ?? worldState?.activeEpisodeId
      ?? getPlacementConfig(placementConfigId)?.episodeId;
    return episodeId ? getEpisode(episodeId) : null;
  }

  static renderEpisodeBadge(scene, episode, timeState, layout) {
    const badge = this.createRectangle(scene, layout, 0x172554, 0.96);
    badge.setStrokeStyle?.(1, 0x60a5fa);
    const text = scene.add.text(layout.x, layout.y - 7, episode.shortTitle, {
      color: HUD_STYLE.episodeColor,
      fontSize: '16px',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: layout.width - 20 },
    });
    text.setOrigin?.(0.5);
    text.setScrollFactor?.(0);
    text.setDepth?.(1000);
    const time = scene.add.text(layout.x, layout.y + 12, TimeStateManager.formatCompact(timeState), {
      color: HUD_STYLE.textColor,
      fontSize: '11px',
      align: 'center',
    });
    time.setOrigin?.(0.5);
    time.setScrollFactor?.(0);
    time.setDepth?.(1000);
    return { badge, text, time, episode, timeState };
  }

  static renderItem(scene, item, layout, index) {
    const x = layout.itemStartX + index * (layout.itemWidth + layout.itemGap);
    const card = this.createRectangle(
      scene,
      { x, y: layout.itemY, width: layout.itemWidth, height: layout.itemHeight },
      HUD_STYLE.cardColor,
      1,
    );
    card.setStrokeStyle?.(1, HUD_STYLE.cardStrokeColor);

    const label = scene.add.text(x, layout.itemY - 10, `${item.icon} ${item.label}`, {
      color: HUD_STYLE.textColor,
      fontSize: HUD_STYLE.labelFontSize,
      align: 'center',
    });
    const value = scene.add.text(x, layout.itemY + 11, this.formatValue(item.value), {
      color: HUD_STYLE.valueColor,
      fontSize: HUD_STYLE.valueFontSize,
      fontStyle: 'bold',
      align: 'center',
    });

    [card, label, value].forEach((object) => {
      object.setOrigin?.(0.5);
      object.setScrollFactor?.(0);
      object.setDepth?.(1000);
    });

    return { card, label, value, item };
  }

  static createRectangle(scene, layout, color, alpha) {
    const rectangle = scene.add.rectangle(layout.x, layout.y, layout.width, layout.height, color, alpha);
    rectangle.setScrollFactor?.(0);
    rectangle.setDepth?.(999);
    return rectangle;
  }

  static formatValue(value) {
    return Number.isFinite(value) ? value.toLocaleString('ko-KR') : '-';
  }
}
