import ProgressStepper from '../ui/ProgressStepper.js';
import { mapData } from '../data/mapData.js';
import PlacementSystem from './PlacementSystem.js';
import PlacementViewManager from './PlacementViewManager.js';
import PlacementMapGeometry from './PlacementMapGeometry.js';
import PlacementMapRenderer from './PlacementMapRenderer.js';
import PlacementSceneObjectRegistry from './PlacementSceneObjectRegistry.js';
import PlacementWorldRenderer from './PlacementWorldRenderer.js';

export default class PlacementSceneBootstrap {
  constructor({
    scene,
    sourceMapData = mapData,
    viewManager = PlacementViewManager,
    progressStepper = ProgressStepper,
    cameraControllerClass = null,
  }) {
    this.scene = scene;
    this.sourceMapData = sourceMapData;
    this.viewManager = viewManager;
    this.progressStepper = progressStepper;
    this.cameraControllerClass = cameraControllerClass;
  }

  static cloneMapData(source) {
    return {
      ...source,
      tiles: source.tiles.map((row) => row.map((tile) => ({ ...tile, occupied: false }))),
    };
  }

  createCoreSystems() {
    const placementSystem = new PlacementSystem(PlacementSceneBootstrap.cloneMapData(this.sourceMapData));
    const mapGeometry = new PlacementMapGeometry({
      origin: this.viewManager.getScreenLayout().mapOrigin,
      tileWidth: this.sourceMapData.tileWidth,
      tileHeight: this.sourceMapData.tileHeight,
      mapWidth: this.sourceMapData.width,
      mapHeight: this.sourceMapData.height,
    });
    const mapRenderer = new PlacementMapRenderer({ geometry: mapGeometry });
    const objectRegistry = new PlacementSceneObjectRegistry(this.scene, {
      fixedRectangleStrokeWidth: this.viewManager.getFixedUiStyle().rectangleStrokeWidth,
    });

    return { placementSystem, mapGeometry, mapRenderer, objectRegistry };
  }

  drawBackground(objectRegistry) {
    const { width, height } = this.scene.scale;
    const layout = this.viewManager.getScreenLayout();
    objectRegistry.registerWorldObject(this.scene.add.rectangle(width / 2, height / 2, width, height, layout.background.color).setScrollFactor(0).setDepth(-10));
    objectRegistry.registerUiObject(this.progressStepper.render(this.scene, layout.progressStep));
    objectRegistry.registerUiObject(this.scene.add.text(layout.topHint.x, layout.topHint.y, layout.topHint.text, layout.topHint).setScrollFactor(0).setDepth(100));
  }

  createWorldObjects({ objectRegistry, mapGeometry, mapRenderer, placementSystem }) {
    const mapGraphics = objectRegistry.registerWorldObject(this.scene.add.graphics().setDepth(1));
    const previewGraphics = objectRegistry.registerWorldObject(this.scene.add.graphics().setDepth(6));
    const mapLabels = objectRegistry.registerWorldObject(this.scene.add.container(0, 0).setDepth(8));
    const worldRenderer = new PlacementWorldRenderer({
      scene: this.scene,
      geometry: mapGeometry,
      mapRenderer,
      objectRegistry,
      placementSystem,
      mapLabels,
    });

    return { mapGraphics, previewGraphics, mapLabels, worldRenderer };
  }

  drawInitialWorld({ mapRenderer, mapGraphics, placementSystem, worldRenderer, placedBuildings }) {
    mapRenderer.drawMap(mapGraphics, placementSystem.mapData);
    worldRenderer.restorePlacedBuildings(placedBuildings);
  }

  setupCamera(objectRegistry) {
    if (!this.cameraControllerClass) {
      throw new Error('PlacementSceneBootstrap requires a cameraControllerClass before setupCamera.');
    }

    const cameraConfig = this.viewManager.getCameraConfig();

    new this.cameraControllerClass(this.scene, {
      ...cameraConfig,
      ignoreDrag: (pointer) => this.viewManager.isPointerOnUi(pointer),
    }).enable();

    objectRegistry.ignoreUiObjectsOnMainCamera();
    return objectRegistry.createUiCamera('PlacementUiCamera');
  }
}
