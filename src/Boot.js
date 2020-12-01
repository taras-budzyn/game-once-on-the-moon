class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('loading-background', 'assets/images/loading-background.png');
        this.load.image('men-shot', 'assets/images/men-shot.png');
        WebFont.load({ custom: { families: ['Berlin'], urls: ['fonts/BRLNSDB.css'] } });

        this.load.image("wooden-plank", "../../assets/images/wooden-plank.png");
        this.load.image("meteorite", "../../assets/images/meteorite.png");
        this.load.image("oxygenBallon", "../../assets/images/oxygenBallon.png");
        this.load.image("spaceshipDetail1", "../../assets/images/spaceship-detail-1.png");
        this.load.image("spaceshipDetail2", "../../assets/images/spaceship-detail-2.png");
        this.load.image("spaceshipDetail3", "../../assets/images/spaceship-detail-3.png");
        this.load.image("spaceshipDetail4", "../../assets/images/spaceship-detail-4.png");
        this.load.image("spaceshipGrey", "../../assets/images/spaceship_grey.png");
        this.load.image("spaceshipReady", "../../assets/images/spaceship-ready.png");

        this.load.spritesheet(
            "player",
            "../../assets/spritesheets/character_big.png",
            {
                frameWidth: 30,
                frameHeight: 60,
                margin: 0,
                spacing: 0
            }
        );
    }
    create() {
        MON.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        MON.Lang.updateLanguage('en');
        MON.text = MON.Lang.text[MON.Lang.current];
        this.scene.start('Preloader');
    }
}