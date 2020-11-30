var enablePWA = false;
if(enablePWA) {
	// SERVICE WORKER
	if('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./js/sw.js');
	};
	// NOTIFICATIONS TEMPLATE
	Notification.requestPermission().then(function(result) {
		if(result === 'granted') {
			exampleNotification();
		}
	});
	function exampleNotification() {
		var notifTitle = 'Once on the MOON';
		var notifBody = 'Created by Taras team.';
		var notifImg = 'assets/images/icons/icon-512.png';
		var options = {
			body: notifBody,
			icon: notifImg
		}
		var notif = new Notification(notifTitle, options);
		setTimeout(exampleNotification, 30000);
	}
}

import AfterLevel from "./levels/AfterLevel.js";
import Level1 from "./levels/Level1.js";
import Level2 from "./levels/Level2.js";
import Level3 from "./levels/Level3.js";
import Level4 from "./levels/Level4.js";

const gameConfig = {
	type: Phaser.AUTO,
	parent: "game-container",
	scale: {
		//mode: Phaser.Scale.FIT,
		//autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 800,
		height: 600
	},
	backgroundColor: '#0f070d',
	scene: [Boot, Preloader, MainMenu, Settings, Story, Level1, Level2, Level3, Level4, AfterLevel],
	pixelArt: true,
	physics: { default: "matter" },
	plugins: {
	  scene: [
		{
		  plugin: PhaserMatterCollisionPlugin, // The plugin class
		  key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
		  mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
		}
	  ]
	}
}
const game = new Phaser.Game(gameConfig);
window.focus();