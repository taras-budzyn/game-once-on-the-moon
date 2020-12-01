import LevelMain from "../level-parts/LevelMain.js";

export default class Level2 extends Phaser.Scene {
  constructor() {
      super('Level2');
  }
  preload() {
    this.load.tilemapTiledJSON("map-level2", "assets/tilemaps/level2.json");
    this.load.image(
    "terrain",
    "assets/tilesets/terrain.png"
    );
  }

  create() {
    this.map = this.make.tilemap({ key: "map-level2" });
    this.tileset = this.map.addTilesetImage("terrain");
    this.groundLayer = this.map.createDynamicLayer("Ground", this.tileset, 0, 0);

    this.levelMain = new LevelMain(this, 'Level3');
  }
}
