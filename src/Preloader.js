class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		var loadingBg = this.add.sprite(MON.world.centerX, MON.world.centerY+100, 'loading-background');
		loadingBg.setOrigin(0.5, 0.5);

		var progress = this.add.graphics();
		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffde00, 1);
			progress.fillRect(loadingBg.x-(loadingBg.width*0.5)+20, loadingBg.y-(loadingBg.height*0.5)+10, 540 * value, 25);
		});

		var resources = {
			'image': [
			],
			'spritesheet': [
				['button-start', 'assets/images/button-start.png', {frameWidth:180,frameHeight:180}],
				['button-settings', 'assets/images/button-settings.png', {frameWidth:80,frameHeight:80}],
				['loader', 'assets/images/loader.png', {frameWidth:45,frameHeight:45}]
			]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		};
    }
    create() {
		MON.fadeOutScene('MainMenu', this);
	}
}