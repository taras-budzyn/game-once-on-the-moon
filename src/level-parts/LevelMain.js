import Player from "../level-parts/Player.js";
import Stone from "../level-parts/Stone.js";
import Oxygen from "../level-parts/Oxygen.js";

export default class LevelMain {
    constructor(level, nextLevelName) {
      this.level = level;
      this.nextLevelName = nextLevelName;
      this.level.ogyxenPercentage = 99;
      this.initLevel();
    }

    initLevel() {
        this.createLevel();
        this.initUI();
        this.initOxygenTimer();
        this.initDebug();
    }

    createLevel() {
        // Set colliding tiles before converting the layer to Matter bodies
        this.level.groundLayer.setCollisionByProperty({ collides: true });

        // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
        // haven't mapped our collision shapes in Tiled so each colliding tile will get a default
        // rectangle body (similar to AP).
        this.level.matter.world.convertTilemapLayer(this.level.groundLayer);
        // this.matter.world.convertTilemapLayer(lavaLayer);

        this.level.cameras.main.setBounds(0, 0, this.level.map.widthInPixels, this.level.map.heightInPixels);
        this.level.matter.world.setBounds(0, 0, this.level.map.widthInPixels, this.level.map.heightInPixels);

        // The spawn point is set using a point object inside of Tiled (within the "Spawn" object layer)
        const { x, y } = this.level.map.findObject("Spawn", obj => obj.name === "Spawn Point");
        this.level.player = new Player(this.level, x, y);

        // Smoothly follow the player
        this.level.cameras.main.startFollow(this.level.player.sprite, false, 0.5, 0.5);

        this.unsubscribePlayerCollide = this.level.matterCollision.addOnCollideStart({
            objectA: this.level.player.sprite,
            callback: this.onPlayerCollide,
            context: this
        });

        // Create a sensor at rectangle object created in Tiled (under the "Sensors" layer)
        const rect = this.level.map.findObject("Sensors", obj => obj.name === "Celebration");
        const celebrateSensor = this.level.matter.add.rectangle(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2,
            rect.width,
            rect.height,
            {
                isSensor: true, // It shouldn't physically interact with other bodies
                isStatic: true // It shouldn't move
            }
        );

        this.unsubscribeCelebrate = this.level.matterCollision.addOnCollideStart({
            objectA: this.level.player.sprite,
            objectB: celebrateSensor,
            callback: this.onPlayerWin,
            context: this
        });
        this.createStones(this.level.map);
        this.createOxygen(this.level.map);
    }
        
    initUI() {
        var fontText = { font: '24px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
        this.level.buttonPause = new Button(10, 10, 'button-home', this.stateMainMenu, this.level);
        this.level.buttonPause.setOrigin(0,0);
        this.level.buttonPause.setScrollFactor(0).setDepth(1000);

        // const help = this.level.add.text(90, 35, MON.text['level-1-name'], {
        // fontSize: "18px",
        // padding: { x: 10, y: 5 },
        // backgroundColor: "#ffffff",
        // fill: "#000000"
        // });
        // help.setScrollFactor(0).setDepth(1000);
        this.level.textOxygen = this.level.add.text(MON.world.width-160, 10, MON.text['oxygen']+this.level.ogyxenPercentage+MON.text['percentage'], fontText);
        this.level.textOxygen.setOrigin(0,1);
        this.level.tweens.add({targets: this.level.textOxygen, y: this.level.textOxygen.height+30, duration: 500, ease: 'Back'});	
        this.level.textOxygen.setScrollFactor(0).setDepth(1000);
        this.background = this.level.add.graphics();
        this.background.fillRect(0, 0, this.level.map.widthInPixels, this.level.map.heightInPixels).setDepth(-200);
        this.background.fillGradientStyle(0x261f25, 0x261f25, 0x0F070D, 0x0F070D);
    }

    initOxygenTimer() {
        this.level.ogyxenTimer = this.level.time.addEvent({
            delay: 200,
            callback: function(){
                this.level.ogyxenPercentage--;
                this.level.textOxygen.setText(MON.text['oxygen']+this.level.ogyxenPercentage+MON.text['percentage']);
                if(!this.level.ogyxenPercentage) {
                    this.level.ogyxenTimer.paused =! this.level.ogyxenTimer.paused;
                    this.level.player.freeze();
                const cam = this.level.cameras.main;
                cam.fade(250, 0, 0, 0);
                cam.once("camerafadeoutcomplete", () => this.level.scene.restart());
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    initDebug() {
        this.level.matter.world.createDebugGraphic();
        this.level.matter.world.drawDebug = false;
        this.level.input.keyboard.on("keydown_Q", event => {
            this.level.matter.world.drawDebug = !this.level.matter.world.drawDebug;
            this.level.matter.world.debugGraphic.clear();
        });
    }

    onPlayerCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
  
      const tile = gameObjectB;
  
      // Check the tile property set in Tiled (you could also just check the index if you aren't using
      // Tiled in your game)
      if (tile.properties.isLethal) {
        // Unsubscribe from collision events so that this logic is run only once
        this.unsubscribePlayerCollide();
  
        this.level.player.freeze();
        const cam = this.level.cameras.main;
        cam.fade(250, 0, 0, 0);
        cam.once("camerafadeoutcomplete", () => this.level.scene.restart());
      }
    }
  
    onPlayerWin() {
      // Celebrate only once
      this.unsubscribeCelebrate();
      this.level.ogyxenTimer.paused =! this.level.ogyxenTimer.paused;
          MON.Storage.set('MON-level', this.nextLevelName);
      MON.fadeOutLevel('AfterLevel', this.level);
    }
  
    stateMainMenu() {
          MON.Sfx.play('click');
          MON.fadeOutScene('MainMenu', this);
    }
  
    createStones(map) {
      map.getObjectLayer("MeteoriteSpawns").objects.forEach(point => {
        this.currentTimer = this.level.time.addEvent({
            delay: 1000,
            callback: function(){
                this.stone = new Stone(this.level, point.x, point.y);
            },
            callbackScope: this,
            loop: true
        });
      });
    }
  
    createOxygen(map) {
      map.getObjectLayer("OxygenSpawns").objects.forEach(point => {
        this.oxygen = new Oxygen(this.level, point.x, point.y);
      });
    }
  }
  