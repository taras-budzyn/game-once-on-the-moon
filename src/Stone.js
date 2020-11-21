export default class Stone {
  constructor(scene, x, y) {
    this.scene = scene;
    this.image = scene.matter.add.image(x, y, "block").setScale(0.5);

    this.destroyed = false;
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);
  }

  destroy() {
    this.destroyed = true;
    this.image.destroy();
  }
}
