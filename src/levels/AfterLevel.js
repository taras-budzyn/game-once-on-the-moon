export default class AfterLevel extends Phaser.Scene{
    constructor() {
        super('AfterLevel');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0,0);

        this.waitingForSettings = false;
        this.input.keyboard.on('keydown', this.handleKey, this);

        this.initUI();
        this.cameras.main.fadeIn(250);
    }
    handleKey(e) {
        switch(e.code) {
            case 'KeyM': {
                this.clickMenu();
                break;
            }
            case 'Enter': {
                this.clickStart();
                break;
            }
            default: {}
        }
    }
    initUI() {
        const level = MON.Storage.get('MON-level');
        if (level !== 'Level1') {
            var fontTitle = { font: '38px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
            var textTitle = this.add.text(MON.world.centerX, MON.world.centerY, MON.text['complete-level'], fontTitle);
            textTitle.setOrigin(0.5);
            this.buttonStart = new Button(MON.world.width-20, MON.world.height-20, 'button-start', this.clickStart, this);
            this.buttonStart.setOrigin(1, 1);
    
            this.buttonStart.x = MON.world.width+this.buttonStart.width+20;
            this.tweens.add({targets: this.buttonStart, x: MON.world.width-20, duration: 500, ease: 'Back'});
        } else {
            const level = MON.Storage.get('MON-level');
            var fontTitle = { font: '38px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
            var textTitle = this.add.text(MON.world.centerX, MON.world.centerY, MON.text['finish-complete-level'], fontTitle);
            textTitle.setOrigin(0.5);
            
            var buttonEnclave = new Button(MON.world.width-375, MON.world.height-40, 'spaceshipReady', this.clickEnclave, this, 'static');
            buttonEnclave.setOrigin(0, 1);
        }

        // var buttonMenu = new Button(20, MON.world.height-40, 'button-home', this.clickMenu, this, 'static');
        // buttonMenu.setOrigin(0, 1);
		// buttonMenu.x = -buttonMenu.width-20;
        // this.tweens.add({targets: buttonMenu, x: 20, duration: 500, ease: 'Back'});
        
        this.buttonMenu = new Button(20, 20, 'button-home', this.clickMenu, this);
        this.buttonMenu.setOrigin(0, 0);
        this.buttonMenu.y = -this.buttonMenu.height-20;
        this.tweens.add({targets: this.buttonMenu, y: 20, duration: 500, ease: 'Back'});

    }
    clickMenu() {
        MON.fadeOutScene('MainMenu', this);
    }
    clickStart() {
        const level = MON.Storage.get('MON-level');
        MON.fadeOutScene(level, this);
    }
    clickEnclave() {
        MON.Sfx.play('click');
    }
}