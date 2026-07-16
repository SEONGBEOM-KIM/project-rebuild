import ExplorationViewManager from './ExplorationViewManager.js';
import { createLayoutText } from '../ui/LayoutText.js';
import { createPanelBackground } from '../ui/PanelRenderer.js';

export default class ExplorationMapRenderer {
  static renderBackdrop(scene) {
    const layout = ExplorationViewManager.getMapLayout();
    createPanelBackground(scene, layout.backdrop, layout.backdrop);
    layout.hills.forEach((hill) => {
      scene.add.ellipse(hill.x, hill.y, hill.width, hill.height, hill.fillColor, hill.fillAlpha);
    });
    layout.roads.forEach((road) => {
      createPanelBackground(scene, road, road).setAngle(road.angle);
    });
    createPanelBackground(scene, layout.river, layout.river).setAngle(layout.river.angle);

    createLayoutText(scene, layout.note, { style: ExplorationViewManager.getTextStyles().mapNote });
  }

  static renderPlaceMarker(scene, place, { explored, onSelect }) {
    const layout = ExplorationViewManager.getPlaceMarkerLayout();
    const textStyles = ExplorationViewManager.getTextStyles();
    const container = scene.add.container(place.position.x, place.position.y);
    const marker = scene.add.circle(layout.marker.x, layout.marker.y, layout.marker.radius, place.color, layout.marker.fillAlpha)
      .setStrokeStyle(layout.marker.strokeWidth, layout.marker.strokeColor)
      .setInteractive({ useHandCursor: true });
    const icon = createLayoutText(scene, layout.icon, {
      text: place.icon,
      style: textStyles.markerIcon,
      origin: 0.5,
    });
    const labelBg = createPanelBackground(scene, layout.labelBackground, layout.labelBackground, {
      strokeColor: place.color,
    });
    const label = createLayoutText(scene, layout.label, {
      text: place.name,
      style: textStyles.markerLabel,
      origin: 0.5,
    });
    const check = createLayoutText(scene, layout.check, {
      style: textStyles.markerCheck,
      origin: 0.5,
    }).setVisible(explored);

    container.add([marker, icon, labelBg, label, check]);
    marker.on('pointerdown', () => onSelect(place));
    icon.setInteractive({ useHandCursor: true }).on('pointerdown', () => onSelect(place));

    return { marker, check, container };
  }
}
