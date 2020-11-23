import LevelMain from "../level-parts/LevelMain.js";

export default class Level1 extends Phaser.Scene {
  constructor() {
      super('Level1');
  }
  preload() {
    this.load.tilemapTiledJSON("map-level1", "../../assets/tilemaps/level1.json");
    this.load.image(
    "terrain",
    "../../assets/tilesets/terrain.png"
    );
  }

  create() {
    this.map = this.make.tilemap({ key: "map-level1" });
    this.tileset = this.map.addTilesetImage("terrain");
    this.groundLayer2 = this.map.createDynamicLayer("Tile Layer 2", this.tileset, 0, 0);
    this.groundLayer = this.map.createDynamicLayer("Ground", this.tileset, 0, 0);
    this.levelMain = new LevelMain(this, 'Level2');
  }
}
