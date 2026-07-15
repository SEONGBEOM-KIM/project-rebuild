import Phaser from 'phaser';

export default class CameraController {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.minZoom = options.minZoom ?? 0.75;
    this.maxZoom = options.maxZoom ?? 2.5;
    this.bounds = options.bounds ?? { x: 0, y: 0, width: 1920, height: 1080 };
    this.ignoreDrag = options.ignoreDrag ?? (() => false);
  }

  enable() {
    const camera = this.scene.cameras.main;
    camera.setBounds(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    camera.setZoom(1);

    this.scene.input.on('wheel', (pointer, _objects, _deltaX, deltaY) => {
      if (this.ignoreDrag(pointer)) {
        return;
      }

      const nextZoom = Phaser.Math.Clamp(camera.zoom - deltaY * 0.001, this.minZoom, this.maxZoom);
      camera.setZoom(nextZoom);
    });

    this.scene.input.on('pointermove', (pointer) => {
      if (!pointer.isDown || !pointer.leftButtonDown() || this.ignoreDrag(pointer)) {
        return;
      }

      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
    });
  }
}
