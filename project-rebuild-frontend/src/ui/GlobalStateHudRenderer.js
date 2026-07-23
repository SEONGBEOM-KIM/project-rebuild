import { REGISTRY_KEYS } from '../data/registryKeys.js';
import StateHudManager from '../systems/StateHudManager.js';
import { DEFAULT_STATE_KEYS } from '../data/stateLabels.js';

const EXCLUDED_SCENES = new Set([
  'BootScene',
  'TitleScene',
  'AuthScene',
  'PlacementScene',
]);

const HUD_STYLE = Object.freeze({
  panelColor: 0x0f172a,
  panelAlpha: 0.94,
  panelStrokeColor: 0x334155,
  cardColor: 0x1e293b,
  cardStrokeColor: 0x475569,
  textColor: '#e2e8f0',
  valueColor: '#f8fafc',
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
    const panelHeight = 56;
    const panelWidth = Math.min(900, Math.max(560, width - margin * 2));
    const cardWidth = (panelWidth - gap * (stateKeyCount + 1)) / stateKeyCount;

    return {
      panel: {
        x: margin + panelWidth / 2,
        y: 30,
        width: panelWidth,
        height: panelHeight,
      },
      itemStartX: margin + gap + cardWidth / 2,
      itemY: 30,
      itemWidth: cardWidth,
      itemHeight: 44,
      itemGap: gap,
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
    return { panel, items: renderedItems, layout };
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
