import PlacementViewManager from './PlacementViewManager.js';

export default class PlacementWorldRenderer {
  constructor({ scene, geometry, mapRenderer, objectRegistry, placementSystem, mapLabels, viewManager = PlacementViewManager }) {
    this.scene = scene;
    this.geometry = geometry;
    this.mapRenderer = mapRenderer;
    this.objectRegistry = objectRegistry;
    this.placementSystem = placementSystem;
    this.mapLabels = mapLabels;
    this.viewManager = viewManager;
  }

  restorePlacedBuildings(placedBuildings) {
    for (const record of placedBuildings) {
      this.placementSystem.place(record.position.x, record.position.y, record.building);
      this.drawPlacedBuilding(record.building, record.position.x, record.position.y, { inherited: true });
      this.drawImpactMarkers(record.building, record.position.x, record.position.y, false);
    }
  }

  drawPlacedBuilding(building, tileX, tileY, { inherited = false } = {}) {
    const buildingVisual = inherited
      ? this.viewManager.getInheritedBuildingVisual(building, tileX, tileY)
      : this.viewManager.getPlacedBuildingVisual(building, tileX, tileY);
    const graphics = this.objectRegistry.registerWorldObject(this.scene.add.graphics().setDepth(buildingVisual.depth));
    this.mapRenderer.drawTiles(
      graphics,
      this.placementSystem.getFootprintTiles(tileX, tileY, building.footprint),
      buildingVisual,
    );

    const artVisual = this.viewManager.getBuildingArtVisual?.(building, tileX, tileY, { inherited });
    const footprintCenter = this.geometry.getFootprintCenter(tileX, tileY, building.footprint);
    const sprite = artVisual && this.scene.textures?.exists?.(artVisual.textureKey)
      ? this.objectRegistry.registerWorldObject(this.scene.add.sprite(
        footprintCenter.x,
        footprintCenter.y + artVisual.offsetY,
        artVisual.textureKey,
        artVisual.frame,
      ).setOrigin(0.5, artVisual.originY).setScale(artVisual.scale).setAlpha(artVisual.alpha).setDepth(artVisual.depth))
      : null;

    const labelPosition = footprintCenter;
    const labelLayout = this.viewManager.getBuildingLabelLayout(labelPosition, tileX, tileY);
    graphics.fillStyle(labelLayout.background.fillColor, labelLayout.background.fillAlpha);
    graphics.fillRoundedRect(
      labelLayout.background.x,
      labelLayout.background.y,
      labelLayout.background.width,
      labelLayout.background.height,
      labelLayout.background.radius,
    );
    const label = this.objectRegistry.registerWorldObject(this.scene.add.text(
      labelLayout.text.x,
      labelLayout.text.y,
      inherited ? `이전 ${building.name}` : building.name,
      this.viewManager.getTextStyles().buildingLabel,
    ).setOrigin(0.5).setDepth(labelLayout.text.depth));

    this.mapLabels.add(label);
    return { graphics, sprite, label };
  }

  drawImpactMarkers(building, tileX, tileY, animate = true) {
    const center = this.geometry.getFootprintCenter(tileX, tileY, building.footprint);
    const markerData = this.viewManager.getImpactMarkerData(building);
    const markerLayout = this.viewManager.getImpactMarkerLayout(center, tileX, tileY);
    const markerContainer = this.objectRegistry.registerWorldObject(this.scene.add.container(markerLayout.container.x, markerLayout.container.y)
      .setDepth(markerLayout.container.depth));

    const bubble = this.scene.add.circle(0, 0, markerLayout.bubble.radius, markerData.color, markerLayout.bubble.alpha)
      .setStrokeStyle(markerLayout.bubble.strokeWidth, markerLayout.bubble.strokeColor, markerLayout.bubble.strokeAlpha);
    const textStyles = this.viewManager.getTextStyles();
    const icon = this.scene.add.text(markerLayout.icon.x, markerLayout.icon.y, markerData.icon, textStyles.impactIcon).setOrigin(0.5);
    const labelBg = this.scene.add.rectangle(
      markerLayout.labelBackground.x,
      markerLayout.labelBackground.y,
      markerLayout.labelBackground.width,
      markerLayout.labelBackground.height,
      markerLayout.labelBackground.fillColor,
      markerLayout.labelBackground.fillAlpha,
    ).setStrokeStyle(markerLayout.labelBackground.strokeWidth, markerData.color, markerLayout.labelBackground.strokeAlpha);
    const label = this.scene.add.text(markerLayout.label.x, markerLayout.label.y, markerData.label, textStyles.impactLabel).setOrigin(0.5);

    markerContainer.add([bubble, icon, labelBg, label]);

    if (animate) {
      markerContainer.setScale(markerLayout.animation.initialScale);
      markerContainer.setAlpha(markerLayout.animation.initialAlpha);
      this.scene.tweens.add({
        targets: markerContainer,
        scale: 1,
        alpha: 1,
        y: markerLayout.animation.targetY,
        duration: markerLayout.animation.duration,
        ease: markerLayout.animation.ease,
      });
    }

    return { markerContainer, bubble, icon, labelBg, label };
  }
}
