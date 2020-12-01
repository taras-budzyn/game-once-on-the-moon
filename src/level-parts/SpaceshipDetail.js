export default class SpaceshipDetail {
    constructor(level, x, y, levelIndex) {
      this.level = level;
      this.image = level.matter.add.image(x + 45, y + 45, "spaceshipDetail" + levelIndex);
      this.unsubscribeSpaceshipDetailCollide = this.level.matterCollision.addOnCollideStart({
        objectA: this.image,
        callback: this.onSpaceshipDetailCollide,
        context: this
      });
      this.destroyed = false;
      this.level.events.once("shutdown", this.destroy, this);
      this.level.events.once("destroy", this.destroy, this);
    }
    
    onSpaceshipDetailCollide({ gameObjectB }) {
      // Check if this is player object
      if (gameObjectB && gameObjectB.type === "Sprite" && gameObjectB.texture.key === "player") {
        this.unsubscribeSpaceshipDetailCollide();
        this.destroy();
      }
    }
  
    destroy() {
      this.destroyed = true;
      this.image.destroy();
    }
  }
  