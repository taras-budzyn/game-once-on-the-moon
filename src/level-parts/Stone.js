export default class Stone {
  constructor(level, x, y) {
    this.level = level;
    this.image = level.matter.add.image(x, y, "block").setScale(0.5);
    this.unsubscribeStoneCollide = this.level.matterCollision.addOnCollideStart({
      objectA: this.image,
      callback: this.onStoneCollide,
      context: this
    });
    this.destroyed = false;
    this.level.events.once("shutdown", this.destroy, this);
    this.level.events.once("destroy", this.destroy, this);
  }
  
  onStoneCollide({ gameObjectB }) {
    // Check if this is player object
    if (gameObjectB && gameObjectB.type === "Sprite" && gameObjectB.texture.key === "player") {
      this.level.player.freeze();
      const cam = this.level.cameras.main;
      cam.fade(250, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => this.level.scene.restart());
    }
    this.unsubscribeStoneCollide();
    this.destroy();
  }

  destroy() {
    this.destroyed = true;
    this.image.destroy();
  }
  
  randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }
}
