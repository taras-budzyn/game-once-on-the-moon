class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('loading-background', 'assets/images/loading-background.png');
        this.load.image('men-shot', 'assets/images/men-shot.png');
        WebFont.load({ custom: { families: ['Berlin'], urls: ['fonts/BRLNSDB.css'] } });
        // this.load.tilemapTiledJSON("map", "../../assets/tilemaps/level.json");
        // this.load.image(
        // "kenney-tileset-64px-extruded",
        // "../assets/tilesets/kenney-tileset-64px-extruded.png"
        // );

        this.load.image("wooden-plank", "../../assets/images/wooden-plank.png");
        this.load.image("block", "../../assets/images/block.png");

        // this.load.spritesheet(
        // "player",
        // "../../assets/spritesheets/0x72-industrial-player-32px-extruded.png",
        // {
        //     frameWidth: 32,
        //     frameHeight: 32,
        //     margin: 1,
        //     spacing: 2
        // }
        // );
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