import StateHudManager from '../systems/StateHudManager.js';

export const STATE_HUD_RENDERER_OBJECT_REGISTRY_METHODS = [
  'createFixedRectangleFromLayout',
  'createFixedTextFromLayout',
];

export default class StateHudRenderer {
  static render(objectRegistry, layout, textStyles, state, { previousState = null, stateKeys = undefined } = {}) {
    objectRegistry.createFixedRectangleFromLayout(layout.panel);
    const items = StateHudManager.buildItems(state, { previousState, stateKeys });
    const itemObjects = items.map((item, index) => StateHudRenderer.renderItem(
      objectRegistry,
      StateHudRenderer.getItemLayout(layout, index),
      textStyles,
      item,
    ));

    return { items, itemObjects };
  }

  static formatItemValue(item) {
    if (item.delta === 0) {
      return `${item.value}`;
    }
    return `${item.value} (${item.deltaText})`;
  }

  static update(hud, state, { previousState = null, stateKeys = undefined } = {}) {
    if (!hud) {
      return null;
    }

    const items = StateHudManager.buildItems(state, { previousState, stateKeys });
    hud.items = items;
    hud.itemObjects.forEach((object, index) => {
      const item = items[index];
      if (!item) {
        return;
      }
      object.item = item;
      object.background.setStrokeStyle?.(3, StateHudRenderer.getToneStrokeColor(item.tone));
      object.icon.setText?.(item.icon);
      object.label.setText?.(item.label);
      object.value.setText?.(StateHudRenderer.formatItemValue(item));
    });
    return hud;
  }

  static getItemLayout(layout, index) {
    const x = layout.itemStartX + index * layout.itemGapX;
    return {
      background: { x, y: layout.itemY, width: layout.itemWidth, height: layout.itemHeight, fillColor: 0x1e293b, fillAlpha: 0.95, strokeColor: 0x334155 },
      icon: { x: x - layout.itemWidth / 2 + 22, y: layout.itemY - 18, text: '' },
      label: { x: x - layout.itemWidth / 2 + 58, y: layout.itemY - 24, text: '' },
      value: { x: x - layout.itemWidth / 2 + 58, y: layout.itemY + 4, text: '' },
    };
  }

  static renderItem(objectRegistry, layout, textStyles, item) {
    const background = objectRegistry.createFixedRectangleFromLayout(layout.background, {
      strokeColor: StateHudRenderer.getToneStrokeColor(item.tone),
    });
    const icon = objectRegistry.createFixedTextFromLayout(layout.icon, textStyles.hudIcon, { text: item.icon });
    const label = objectRegistry.createFixedTextFromLayout(layout.label, textStyles.hudLabel, { text: item.label });
    const value = objectRegistry.createFixedTextFromLayout(layout.value, textStyles.hudValue, { text: StateHudRenderer.formatItemValue(item) });

    return { item, background, icon, label, value };
  }

  static getToneStrokeColor(tone) {
    if (tone === 'positive') {
      return 0x22c55e;
    }
    if (tone === 'negative') {
      return 0xf87171;
    }
    return 0x475569;
  }
}
