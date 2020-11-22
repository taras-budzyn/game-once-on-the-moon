export default class LevelMain {
    constructor(level) {
      this.level = level;
      this.level.ogyxenPercentage = 99;
      this.initLevel();
    }

    initLevel() {
        this.initUI();
        this.initOxygenTimer();
        this.initDebug();
    }
        
    initUI() {
        var fontText = { font: '24px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
        this.level.buttonPause = new Button(10, 10, 'button-home', this.level.stateMainMenu, this.level);
        this.level.buttonPause.setOrigin(0,0);
        this.level.buttonPause.setScrollFactor(0).setDepth(1000);

        const help = this.level.add.text(90, 35, MON.text['level-1-name'], {
        fontSize: "18px",
        padding: { x: 10, y: 5 },
        backgroundColor: "#ffffff",
        fill: "#000000"
        });
        help.setScrollFactor(0).setDepth(1000);
        this.level.textOxygen = this.level.add.text(MON.world.width-160, 10, MON.text['oxygen']+this.level.ogyxenPercentage+MON.text['percentage'], fontText);
        this.level.textOxygen.setOrigin(0,1);
        this.level.tweens.add({targets: this.level.textOxygen, y: this.level.textOxygen.height+30, duration: 500, ease: 'Back'});	
        this.level.textOxygen.setScrollFactor(0).setDepth(1000);
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
  }
  