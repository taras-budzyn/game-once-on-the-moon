export default class Oxygen {
    constructor(level, x, y) {
      this.level = level;
      this.image = level.matter.add.image(x, y, "oxygenBallon");
      this.unsubscribeOxygenCollide = this.level.matterCollision.addOnCollideStart({
        objectA: this.image,
        callback: this.onOxygenCollide,
        context: this
      });
      this.destroyed = false;
      this.level.events.once("shutdown", this.destroy, this);
      this.level.events.once("destroy", this.destroy, this);
    }
    
    onOxygenCollide({ gameObjectB }) {
      // Check if this is player object
      if (gameObjectB && gameObjectB.type === "Sprite" && gameObjectB.texture.key === "player") {
        this.level.ogyxenPercentage = 99;
        this.level.textOxygen.setText(MON.text['oxygen']+this.level.ogyxenPercentage+MON.text['percentage']);
        this.unsubscribeOxygenCollide();
        this.destroy();
      }
    }
  
    destroy() {
      this.destroyed = true;
      this.image.destroy();
    }
  }
  