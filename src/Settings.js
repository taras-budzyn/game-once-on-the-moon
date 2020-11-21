class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.screenName = 'settings';
		this.input.keyboard.on('keydown', this.handleKey, this);

		this.buttonBack = new Button(20, 20, 'button-back', this.clickBack, this);
		this.buttonBack.setOrigin(0, 0);
		this.buttonBack.y = -this.buttonBack.height-20;
		this.tweens.add({targets: this.buttonBack, y: 20, duration: 500, ease: 'Back'});

		var fontTitle = { font: '46px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 7, align: 'center' };
		var fontSubtitle = { font: '38px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5, align: 'center' };
		var fontSmall = { font: '28px '+MON.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 4, align: 'center' };
		var titleSettings = this.add.text(MON.world.centerX, 60, MON.text['settings'], fontTitle);
		titleSettings.setOrigin(0.5, 0.5);
		var offsetLeft = 130;
		
		this.buttonSound = new Button(offsetLeft+40, 250, 'button-sound-on', this.clickSound, this);
		this.buttonSound.setOrigin(0.5, 0.5);
		this.textSound = this.add.text(offsetLeft+30+this.buttonSound.width, 250, MON.text['sound-on'], fontSubtitle);
		this.textSound.setOrigin(0, 0.5);
		this.buttonMusic = new Button(offsetLeft+40, 375, 'button-music-on', this.clickMusic, this);
		this.buttonMusic.setOrigin(0.5, 0.5);
		this.textMusic = this.add.text(offsetLeft+30+this.buttonMusic.width, 375, MON.text['music-on'], fontSubtitle);
		this.textMusic.setOrigin(0, 0.5);
		this.buttonCredits = new Button(offsetLeft+40, 500, 'button-credits', this.clickCredits, this);
		this.buttonCredits.setOrigin(0.5, 0.5);
		this.textCredits = this.add.text(offsetLeft+30+this.buttonCredits.width, 500, MON.text['credits'], fontSubtitle);
		this.textCredits.setOrigin(0, 0.5);		

		MON.Sfx.update('sound', this.buttonSound, this.textSound);
		MON.Sfx.update('music', this.buttonMusic, this.textMusic);

		this.buttonSound.setScale(0.5);
		this.tweens.add({targets: this.buttonSound, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
		this.textSound.setScale(0.5);
		this.tweens.add({targets: this.textSound, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
		this.buttonMusic.setScale(0.5);
		this.tweens.add({targets: this.buttonMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
		this.textMusic.setScale(0.5);
		this.tweens.add({targets: this.textMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
		this.buttonCredits.setScale(0.5);
		this.tweens.add({targets: this.buttonCredits, scaleX: 1, scaleY: 1, duration: 500, delay: 500, ease: 'Cubic.easeOut' });
		this.textCredits.setScale(0.5);
		this.tweens.add({targets: this.textCredits, scaleX: 1, scaleY: 1, duration: 500, delay: 500, ease: 'Cubic.easeOut' });

		if(this.sys.game.device.os.desktop) {
			this.helpText = this.add.text(MON.world.centerX, MON.world.height-250, MON.text['keyboard-info'], fontSmall);
			this.helpText.setOrigin(0.5,1);
			this.helpText.setScale(0.5);
			this.tweens.add({targets: this.helpText, scaleX: 1, scaleY: 1, duration: 500, delay: 750, ease: 'Cubic.easeOut' });
		}

		var offsetTopCredits = 300;
		var offsetTopCrew = 100;
		this.containerCredits = this.add.container(0, MON.world.height);
		var creditsBg = this.add.sprite(0, 0, 'background');
		creditsBg.setOrigin(0, 0);
		var creditsBack = new Button(20, 20, 'button-back', function(){this.clickBack('credits');}, this);
		creditsBack.setOrigin(0, 0);

		var titleCredits = this.add.text(MON.world.centerX, 60, MON.text['credits'], fontTitle);

		var titleCrew = this.add.text(MON.world.centerX, offsetTopCrew, MON.text['team'], fontSubtitle);
		titleCrew.setOrigin(0.5,0);
		var titleCrewTaras = this.add.text(MON.world.centerX, offsetTopCrew+80, 'Taras - '+MON.text['coding-design'], fontSubtitle);
		titleCrewTaras.setOrigin(0.5,0);
		var titleCrewOleksandr = this.add.text(MON.world.centerX, offsetTopCrew+140, 'Oleksandr - '+MON.text['coding'], fontSubtitle);
		titleCrewOleksandr.setOrigin(0.5,0);
		titleCredits.setOrigin(0.5);
		var titleCreditsText = this.add.text(MON.world.centerX, offsetTopCredits+70, MON.text['usedEPT'], fontSubtitle);
		titleCreditsText.setOrigin(0.5,0);
		var titleCreditsUrl = this.add.text(MON.world.centerX, offsetTopCredits+110, 'enclavegames.com', fontSubtitle);
		titleCreditsUrl.setOrigin(0.5,0);
		titleCreditsUrl.setInteractive({ useHandCursor: true });
		titleCreditsUrl.on('pointerdown', function() { this.clickEnclave(); }, this);

		this.containerCredits.add([creditsBg,creditsBack,titleCredits,titleCreditsText,titleCreditsUrl]);
		this.containerCredits.add([titleCrew,titleCrewTaras,titleCrewOleksandr]);

		this.containerKeyboard = this.add.container();
		this.containerKeyboard.y = MON.world.height;
		
		var offsetTopKeyboard = 20;
		var keyboardBg = this.add.sprite(0, 0, 'background');
		keyboardBg.setOrigin(0,0);
		var titleKeyboard = this.add.text(MON.world.centerX, offsetTopKeyboard+40, MON.text['key-title'], fontTitle);
		titleKeyboard.setOrigin(0.5);
		var titleKeySettingsTitle = this.add.text(MON.world.centerX, offsetTopKeyboard+90, MON.text['key-settings-title'], fontSubtitle);
		titleKeySettingsTitle.setOrigin(0.5,0);
		var titleKeySettings = this.add.text(MON.world.centerX, offsetTopKeyboard+140, MON.text['key-settings-onoff'], fontSmall);
		titleKeySettings.setOrigin(0.5,0);
		var titleKeyAudio = this.add.text(MON.world.centerX, offsetTopKeyboard+180, MON.text['key-audio'], fontSmall);
		titleKeyAudio.setOrigin(0.5,0);
		var titleKeyMusic = this.add.text(MON.world.centerX, offsetTopKeyboard+220, MON.text['key-music'], fontSmall);
		titleKeyMusic.setOrigin(0.5,0);
		var titleKeyCredits = this.add.text(MON.world.centerX, offsetTopKeyboard+260, MON.text['key-credits'], fontSmall);
		titleKeyCredits.setOrigin(0.5,0);
		var titleKeyKeyboard = this.add.text(MON.world.centerX, offsetTopKeyboard+300, MON.text['key-shortcuts'], fontSmall);
		titleKeyKeyboard.setOrigin(0.5,0);

		var titleKeyMenuTitle = this.add.text(MON.world.centerX, offsetTopKeyboard+350, MON.text['key-menu'], fontSubtitle);
		titleKeyMenuTitle.setOrigin(0.5,0);
		var titleKeySettings2 = this.add.text(MON.world.centerX, offsetTopKeyboard+400, MON.text['key-settings-onoff'], fontSmall);
		titleKeySettings2.setOrigin(0.5,0);
		var titleKeyStart = this.add.text(MON.world.centerX, offsetTopKeyboard+440, MON.text['key-start'], fontSmall);
		titleKeyStart.setOrigin(0.5,0);

		var titleKeyGameTitle = this.add.text(MON.world.centerX, offsetTopKeyboard+490, MON.text['key-gameplay'], fontSubtitle);
		titleKeyGameTitle.setOrigin(0.5,0);
		var titleKeyButton = this.add.text(MON.world.centerX, offsetTopKeyboard+540, MON.text['key-button'], fontSmall);
		titleKeyButton.setOrigin(0.5,0);
		var titleKeyPause = this.add.text(MON.world.centerX, offsetTopKeyboard+580, MON.text['key-pause'], fontSmall);
		titleKeyPause.setOrigin(0.5,0);

		var titleKeyPauseTitle = this.add.text(MON.world.centerX, offsetTopKeyboard+630, MON.text['key-pause-title'], fontSubtitle);
		titleKeyPauseTitle.setOrigin(0.5,0);
		var titleKeyBack = this.add.text(MON.world.centerX, offsetTopKeyboard+680, MON.text['key-back'], fontSmall);
		titleKeyBack.setOrigin(0.5,0);
		var titleKeyRestart = this.add.text(MON.world.centerX, offsetTopKeyboard+720, MON.text['key-return'], fontSmall);
		titleKeyRestart.setOrigin(0.5,0);

		var titleKeyOverTitle = this.add.text(MON.world.centerX, offsetTopKeyboard+770, MON.text['key-gameover'], fontSubtitle);
		titleKeyOverTitle.setOrigin(0.5,0);
		var titleKeyBack2 = this.add.text(MON.world.centerX, offsetTopKeyboard+820, MON.text['key-back'], fontSmall);
		titleKeyBack2.setOrigin(0.5,0);
		var titleKeyRestart2 = this.add.text(MON.world.centerX, offsetTopKeyboard+860, MON.text['key-try'], fontSmall);
		titleKeyRestart2.setOrigin(0.5,0);

		this.containerKeyboard.add([keyboardBg,titleKeyboard,titleKeySettingsTitle,titleKeySettings]);
		this.containerKeyboard.add([titleKeyAudio,titleKeyMusic,titleKeyCredits,titleKeyKeyboard]);
		this.containerKeyboard.add([titleKeyMenuTitle,titleKeySettings2,titleKeyStart,titleKeyGameTitle]);
		this.containerKeyboard.add([titleKeyButton,titleKeyPause,titleKeyPauseTitle,titleKeyBack]);
		this.containerKeyboard.add([titleKeyRestart,titleKeyOverTitle,titleKeyBack2,titleKeyRestart2]);

		this.cameras.main.fadeIn(250);
	}
    handleKey(e) {
        switch(e.code) {
			case 'KeyA': {
				this.clickSound();
				break;
			}
			case 'KeyM': {
				this.clickMusic();
				break;
			}
			case 'KeyC': {
				if(this.screenName == 'settings') {
					this.clickCredits();
				}
				else { // this.screenName == 'credits'
					this.clickBack('credits');
				}
				break;
			}
            case 'KeyS': {
                this.clickBack();
				break;
			}
            case 'KeyK': {
				if(this.screenName == 'settings') {
					this.clickKeyboard();
				}
				else { // this.screenName == 'keyboard'
					this.clickBack('keyboard');
				}
				break;
			}
			default: {}
        }
    }
	clickSound() {
		MON.Sfx.play('click');
		MON.Sfx.manage('sound', 'switch', this, this.buttonSound, this.textSound);
	}
	clickMusic() {
		MON.Sfx.play('click');
		MON.Sfx.manage('music', 'switch', this, this.buttonMusic, this.textMusic);
	}
	clickCredits() {
		MON.Sfx.play('click');
		this.tweens.add({targets: this.containerCredits, y: 0, duration: 750, ease: 'Cubic.easeOut' });

		this.buttonBack.input.enabled = false;
		this.buttonSound.input.enabled = false;
		this.buttonMusic.input.enabled = false;
		this.buttonCredits.input.enabled = false;
		this.screenName = 'credits';
	}
	clickKeyboard() {
		MON.Sfx.play('click');
		this.tweens.add({targets: this.containerKeyboard, y: 0, duration: 750, ease: 'Cubic.easeOut' });

		this.buttonBack.input.enabled = false;
		this.buttonSound.input.enabled = false;
		this.buttonMusic.input.enabled = false;
		this.buttonCredits.input.enabled = false;
		this.screenName = 'keyboard';
	}
	clickBack(name) {
		MON.Sfx.play('click');
		if(name) {
			this.buttonBack.input.enabled = true;
			this.buttonSound.input.enabled = true;
			this.buttonMusic.input.enabled = true;
			this.buttonCredits.input.enabled = true;
			if(name == 'credits') {
				this.tweens.add({targets: this.containerCredits, y: MON.world.height, duration: 750, ease: 'Cubic.easeIn' });
			}
			else if(name == 'keyboard') {
				this.tweens.add({targets: this.containerKeyboard, y: MON.world.height, duration: 750, ease: 'Cubic.easeIn' });
			}
			this.screenName = 'settings';
		}
		else {
			MON.fadeOutScene('MainMenu', this);
		}
	}
	clickEnclave() {
		MON.Sfx.play('click');
		window.top.location.href = 'https://enclavegames.com/';
	}
};