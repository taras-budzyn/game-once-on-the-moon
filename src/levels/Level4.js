import LevelMain from "../level-parts/LevelMain.js";

export default class Level4 extends Phaser.Scene {
  constructor() {
      super('Level4');
  }
  preload() {
    this.load.tilemapTiledJSON("map-level4", "../../assets/tilemaps/level1.json");
    this.load.image(
    "terrain",
    "../../assets/tilesets/terrain.png"
    );
  }

  create() {
    this.map = this.make.tilemap({ key: "map-level4" });
    this.tileset = this.map.addTilesetImage("terrain");
    this.groundLayer = this.map.createDynamicLayer("Ground", this.tileset, 0, 0);

    this.levelMain = new LevelMain(this, 'Level1');
  }
}
