import Player from "../Player.js";
import Stone from "../Stone.js"
import createRotatingPlatform from "../vendor/create-rotating-platform.js";

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
    const map = this.make.tilemap({ key: "map-level1" });
    const tileset = map.addTilesetImage("terrain");
    const groundLayer2 = map.createDynamicLayer("Tile Layer 2", tileset, 0, 0);
    const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
    
    // Set colliding tiles before converting the layer to Matter bodies
    groundLayer.setCollisionByProperty({ collides: true });

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped our collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(groundLayer);
    // this.matter.world.convertTilemapLayer(lavaLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // The spawn point is set using a point object inside of Tiled (within the "Spawn" object layer)
    const { x, y } = map.findObject("Spawn", obj => obj.name === "Spawn Point");
    this.player = new Player(this, x, y);

    // Smoothly follow the player
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this
    });

    // Create a sensor at rectangle object created in Tiled (under the "Sensors" layer)
    const rect = map.findObject("Sensors", obj => obj.name === "Celebration");
    const celebrateSensor = this.matter.add.rectangle(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
      rect.width,
      rect.height,
      {
        isSensor: true, // It shouldn't physically interact with other bodies
        isStatic: true // It shouldn't move
      }
    );

    this.unsubscribeCelebrate = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: celebrateSensor,
      callback: this.onPlayerWin,
      context: this
    });
    this.matter.world.createDebugGraphic();
    this.matter.world.drawDebug = false;
    this.input.keyboard.on("keydown_Q", event => {
      this.matter.world.drawDebug = !this.matter.world.drawDebug;
      this.matter.world.debugGraphic.clear();
    });
    this.createStones();
    this.initUI();
  }

  onPlayerCollide({ gameObjectB }) {
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    const tile = gameObjectB;

    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    if (tile.properties.isLethal) {
      // Unsubscribe from collision events so that this logic is run only once
      this.unsubscribePlayerCollide();

      this.player.freeze();
      const cam = this.cameras.main;
      cam.fade(250, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => this.scene.restart());
    }
  }

  onPlayerWin() {
    // Celebrate only once
    this.unsubscribeCelebrate();
		MON.Storage.set('MON-level','Level2');
    MON.fadeOutLevel('AfterLevel', this);
  }

  initUI() {
		this.buttonPause = new Button(10, 10, 'button-home', this.stateMainMenu, this);
		this.buttonPause.setOrigin(0,0);
    this.buttonPause.setScrollFactor(0).setDepth(1000);

    const help = this.add.text(90, 35, MON.text['level-1-name'], {
      fontSize: "18px",
      padding: { x: 10, y: 5 },
      backgroundColor: "#ffffff",
      fill: "#000000"
    });
    help.setScrollFactor(0).setDepth(1000);
  }

	stateMainMenu() {
		MON.Sfx.play('click');
		MON.fadeOutScene('MainMenu', this);
  }

  createStones() {
    this.currentTimer = this.time.addEvent({
        delay: 1000,
        callback: function(){
            const x = 320;
            const y = 840;
            this.stone = new Stone(this, x, y);
        },
        callbackScope: this,
        loop: true
    });
  }
}
