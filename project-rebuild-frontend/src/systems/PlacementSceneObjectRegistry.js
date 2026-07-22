import { createLayoutText } from '../ui/LayoutText.js';

export default class PlacementSceneObjectRegistry {
  constructor(scene, { fixedRectangleStrokeWidth }) {
    this.scene = scene;
    this.fixedRectangleStrokeWidth = fixedRectangleStrokeWidth;
    this.uiObjects = [];
    this.worldObjects = [];
    this.uiCamera = null;
  }

  registerWorldObject(object) {
    this.worldObjects.push(object);

    if (this.uiCamera) {
      this.uiCamera.ignore(object);
    }

    return object;
  }

  registerUiObject(object) {
    if (!object) {
      return null;
    }

    this.uiObjects.push(object);

    if (this.scene.cameras?.main) {
      this.scene.cameras.main.ignore(object);
    }

    return object;
  }

  ignoreUiObjectsOnMainCamera() {
    this.scene.cameras.main.ignore(this.uiObjects);
  }

  createUiCamera(name) {
    this.uiCamera = this.scene.cameras.add(0, 0, this.scene.scale.width, this.scene.scale.height, false, name);
    this.uiCamera.setScroll(0, 0);
    this.uiCamera.setZoom(1);
    this.uiCamera.ignore(this.worldObjects);
    return this.uiCamera;
  }

  createFixedRectangleFromLayout(layout, options = {}) {
    return this.createFixedRectangle(
      options.x ?? layout.x,
      options.y ?? layout.y,
      options.width ?? layout.width,
      options.height ?? layout.height,
      options.fillColor ?? layout.fillColor,
      options.alpha ?? options.fillAlpha ?? layout.alpha ?? layout.fillAlpha ?? 1,
      options.strokeColor ?? layout.strokeColor ?? null,
    );
  }

  createFixedRectangle(x, y, width, height, color, alpha = 1, strokeColor = null) {
    const rectangle = this.scene.add.rectangle(x, y, width, height, color, alpha).setScrollFactor(0).setDepth(100);
    if (strokeColor !== null) {
      rectangle.setStrokeStyle(this.fixedRectangleStrokeWidth, strokeColor);
    }
    return this.registerUiObject(rectangle);
  }

  createFixedTextFromLayout(layout, style, options = {}) {
    return this.createFixedText(
      options.x ?? layout.x,
      options.y ?? layout.y,
      options.text ?? layout.text ?? '',
      style,
    );
  }

  createFixedText(x, y, text, style) {
    const textObject = this.scene.add.text(x, y, text, style).setScrollFactor(0).setDepth(101);
    return this.registerUiObject(textObject);
  }

  createFixedLayoutText(layout, options = {}) {
    const textObject = createLayoutText(this.scene, layout, options).setScrollFactor(0).setDepth(101);
    return this.registerUiObject(textObject);
  }
}
