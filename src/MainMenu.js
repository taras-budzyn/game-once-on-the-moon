class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgFilesLoaded = false;
    }
    create() {
        MON.Storage.initUnset('MON-level','Level1');
        this.add.sprite(0, 0, 'background').setOrigin(0,0);

        this.waitingForSettings = false;

		var fontTitle = { font: '62px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		var textTitle = this.add.text(MON.world.centerX, MON.world.centerY-50, MON.text['game-name'], fontTitle);
        textTitle.setOrigin(0.5);

        this.input.keyboard.on('keydown', this.handleKey, this);


        this.buttonSettings = new Button(20, 20, 'button-settings', this.clickSettings, this);
        this.buttonSettings.setOrigin(0, 0);

        var buttonEnclave = new Button(20, MON.world.height-40, 'men-shot', this.clickEnclave, this, 'static');
        buttonEnclave.setOrigin(0, 1);

        this.buttonStart = new Button(MON.world.width-20, MON.world.height-20, 'button-start', this.clickStart, this);
        this.buttonStart.setOrigin(1, 1);

		this.buttonStart.x = MON.world.width+this.buttonStart.width+20;
        this.tweens.add({targets: this.buttonStart, x: MON.world.width-20, duration: 500, ease: 'Back'});

		buttonEnclave.x = -buttonEnclave.width-20;
        this.tweens.add({targets: buttonEnclave, x: 20, duration: 500, ease: 'Back'});

        this.buttonSettings.y = -this.buttonSettings.height-20;
        this.tweens.add({targets: this.buttonSettings, y: 20, duration: 500, ease: 'Back'});

        this.cameras.main.fadeIn(250);

        if(!this.bgFilesLoaded) {
            this.time.addEvent({
                delay: 500,
                callback: function() {
                    this.startPreloadInTheBackground();
                },
                callbackScope: this
            }, this);
        }
    }
    handleKey(e) {
        switch(e.code) {
            case 'KeyS': {
                this.clickSettings();
                break;
            }
            case 'Enter': {
                this.clickStart();
                break;
            }
            default: {}
        }
    }
    clickEnclave() {
        MON.Sfx.play('click');
    }
    clickSettings() {
        if(this.bgFilesLoaded) {
            MON.Sfx.play('click');
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            MON.fadeOutScene('Settings', this);
        }
        else {
            var animationFrames = this.anims.generateFrameNumbers('loader');
            animationFrames.pop();
            this.waitingForSettings = true;
            this.buttonSettings.setAlpha(0.1);
            var loadAnimation = this.anims.create({
                key: 'loading',
                frames: animationFrames,
                frameRate: 12,
                repeat: -1
            });
            this.loadImage = this.add.sprite(30, 30, 'loader').setOrigin(0,0).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    clickStart() {
        if(this.bgFilesLoaded) {
            MON.Sfx.play('click');
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            const level = MON.Storage.get('MON-level');
            MON.fadeOutScene(level === 'Level1' ? 'Story' : level, this);
        }
        else {
            var animationFrames = this.anims.generateFrameNumbers('loader');
            animationFrames.pop();
            this.waitingForStart = true;
            this.buttonStart.setAlpha(0.1);
            var loadAnimation = this.anims.create({
                key: 'loading',
                frames: animationFrames,
                frameRate: 12,
                repeat: -1
            });
            this.loadImage = this.add.sprite(MON.world.width-85, MON.world.height-85, 'loader').setOrigin(1,1).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    startPreloadInTheBackground() {
        console.log('[MON] Starting background loading...');
        this.load.image('need-this', 'assets/images/need-this.png');
        this.load.once('filecomplete', this.addFiles, this);
        this.load.start();
    }
    addFiles() {
        var resources = {
            'image': [
                ['need-this', 'assets/images/need-this.png'],
                ['overlay', 'assets/images/overlay.png'],
                ['particle', 'assets/images/particle.png']
            ],
            'spritesheet': [
                ['button-continue', 'assets/images/button-continue.png', {frameWidth:180,frameHeight:180}],
                ['button-mainmenu', 'assets/images/button-mainmenu.png', {frameWidth:180,frameHeight:180}],
                ['button-home', 'assets/images/button-home.png', {frameWidth:70,frameHeight:70}],
                ['button-restart', 'assets/images/button-tryagain.png', {frameWidth:180,frameHeight:180}],
                ['button-achievements', 'assets/images/button-achievements.png', {frameWidth:110,frameHeight:110}],
                ['button-pause', 'assets/images/button-pause.png', {frameWidth:80,frameHeight:80}],
                ['button-credits', 'assets/images/button-credits.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-on', 'assets/images/button-sound-on.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-off', 'assets/images/button-sound-off.png', {frameWidth:80,frameHeight:80}],
                ['button-music-on', 'assets/images/button-music-on.png', {frameWidth:80,frameHeight:80}],
                ['button-music-off', 'assets/images/button-music-off.png', {frameWidth:80,frameHeight:80}],
                ['button-back', 'assets/images/button-back.png', {frameWidth:70,frameHeight:70}]
            ],
            'audio': [
                ['sound-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
                ['music-theme', ['sfx/music-in-the-wreckage.m4a','sfx/music-in-the-wreckage.mp3','sfx/music-in-the-wreckage.ogg']]
            ]
        };            
        for(var method in resources) {
            resources[method].forEach(function(args) {
                var loader = this.load[method];
                loader && loader.apply(this.load, args);
            }, this);
        };
        this.load.on('complete', function(){
            console.log('[MON] All files loaded in the background.');
            this.bgFilesLoaded = true;
            MON.Sfx.manage('music', 'init', this);
            MON.Sfx.manage('sound', 'init', this);
            if(this.waitingForSettings) {
                this.clickSettings();
            }
            if(this.waitingForStart) {
                this.clickStart();
            }            
        }, this);
    }
}