var MON = {};

MON.Sfx = {
	manage: function(type, mode, game, button, label) {
		switch(mode) {
			case 'init': {
        MON.Storage.initUnset('MON-'+type, true);
        MON.Sfx.status = MON.Sfx.status || [];
        MON.Sfx.status[type] = MON.Storage.get('MON-'+type);
        if(type == 'sound') {
          MON.Sfx.sounds = [];
          MON.Sfx.sounds['click'] = game.sound.add('sound-click');
        }
        else { // music
          if(!MON.Sfx.music || !MON.Sfx.music.isPlaying) {
            MON.Sfx.music = game.sound.add('music-theme');
            MON.Sfx.music.volume = 0.5;
          }
        }
				break;
			}
			case 'on': {
				MON.Sfx.status[type] = true;
				break;
			}
			case 'off': {
				MON.Sfx.status[type] = false;
				break;
			}
			case 'switch': {
				MON.Sfx.status[type] =! MON.Sfx.status[type];
				break;
			}
			default: {}
    }
    MON.Sfx.update(type, button, label);

    if(type == 'music' && MON.Sfx.music) {
      if(MON.Sfx.status['music']) {
        if(!MON.Sfx.music.isPlaying) {
          MON.Sfx.music.play({loop:true});
        }
      }
      else {
        MON.Sfx.music.stop();
      }
    }

    MON.Storage.set('MON-'+type, MON.Sfx.status[type]);
	},
	play: function(audio) {
    if(audio == 'music') {
      if(MON.Sfx.status['music'] && MON.Sfx.music && !MON.Sfx.music.isPlaying) {
        MON.Sfx.music.play({loop:true});
      }
    }
    else { // sound
      if(MON.Sfx.status['sound'] && MON.Sfx.sounds && MON.Sfx.sounds[audio]) {
        MON.Sfx.sounds[audio].play();
      }
    }
  },
  update: function(type, button, label) {
    if(button) {
      if(MON.Sfx.status[type]) {
        button.setTexture('button-'+type+'-on');
      }
      else {
        button.setTexture('button-'+type+'-off');
      }
    }
    if(label) {
      if(MON.Sfx.status[type]) {
        label.setText(MON.Lang.text[MON.Lang.current][type+'-on']);
      }
      else {
        label.setText(MON.Lang.text[MON.Lang.current][type+'-off']);
      }
    }
  }
};
MON.fadeOutIn = function(passedCallback, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
    delay: 250,
    callback: function() {
      context.cameras.main.fadeIn(250);
      passedCallback(context);
    },
    callbackScope: context
  });  
}
MON.fadeOutScene = function(sceneName, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
      delay: 250,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};
MON.fadeOutLevel = function(sceneName, context) {
  context.cameras.main.fadeOut(2000);
  context.time.addEvent({
      delay: 1500,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};

class Button extends Phaser.GameObjects.Image {
  constructor(x, y, texture, callback, scene, noframes) {
    super(scene, x, y, texture, 0);
    this.setInteractive({ useHandCursor: true });
    
    this.on('pointerup', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerdown', function() {
      if(!noframes) {
        this.setFrame(2);
      }
      callback.call(scene);
    }, this);

    this.on('pointerover', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerout', function() {
      if(!noframes) {
        this.setFrame(0);
      }
    }, this);

    scene.add.existing(this);
  }
};

MON.Storage = {
	availability: function() {
		if(!(!(typeof(window.localStorage) === 'undefined'))) {
			console.log('localStorage not available');
			return null;
		}
	},
	get: function(key) {
		this.availability();
		try {
			return JSON.parse(localStorage.getItem(key));
		}
		catch(e) {
			return window.localStorage.getItem(key);
		}
	},
	set: function(key, value) {
		this.availability();
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		}
		catch(e) {
			if(e == QUOTA_EXCEEDED_ERR) {
				console.log('localStorage quota exceeded');
			}
		}
	},
	initUnset: function(key, value) {
		if(this.get(key) === null) {
			this.set(key, value);
		}
	},
	getFloat: function(key) {
		return parseFloat(this.get(key));
	},
	setHighscore: function(key, value) {
		if(value > this.getFloat(key)) {
			this.set(key, value);
		}
	},
	remove: function(key) {
		this.availability();
		window.localStorage.removeItem(key);
	},
	clear: function() {
		this.availability();
		window.localStorage.clear();
	}
};

MON.Lang = {
  current: 'en',
  options: ['en'],
  parseQueryString: function(query) {
    var vars = query.split('&');
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  updateLanguage: function(lang) {
    var query = window.location.search.substring(1);
    var qs = MON.Lang.parseQueryString(query);
    if(qs && qs['lang']) {
      console.log('LANG: '+qs['lang']);
      MON.Lang.current = qs['lang'];
    } else {
      if(lang) {
        MON.Lang.current = lang;
      }
      else {
        MON.Lang.current = navigator.language;
      }
    }
    if(MON.Lang.options.indexOf(MON.Lang.current) == -1) {
      MON.Lang.current = 'en';
    }
  },
  text: {
    'en': {
      'FONT': 'Berlin',
      'settings': 'SETTINGS',
      'sound-on': 'Sound: ON',
      'sound-off': 'Sound: OFF',
      'music-on': 'Music: ON',
      'music-off': 'Music: OFF',
      'keyboard-info': 'Press K for keyboard shortcuts',
      'credits': 'CREDITS',
      'madeby': 'MON made by',
      'usedEPT': 'Used EPT',
      'team': 'THE TEAM',
      'coding': 'coding',
      'design': 'design',
      'testing': 'testing',
      'coding-design': 'coding, design',
      'musicby': 'Music by',
      'key-title': 'KEYBOARD SHORTCUTS',
      'key-settings-title': 'Settings',
      'key-settings-onoff': 'S - show/hide settings',
      'key-audio': 'A - turn sound on/off',
      'key-music': 'M - turn music on/off',
      'key-credits': 'C - show/hide credits',
      'key-shortcuts': 'K - show/hide keyboard shortcuts',
      'key-menu': 'Main menu',
      'key-start': 'Enter - start game',
      'key-continue': 'Enter - continue',
      'key-gameplay': 'Gameplay',
      'key-button': 'Enter - activate CLICK ME button',
      'key-pause': 'P - turn pause screen on/off',
      'key-pause-title': 'Pause screen',
      'key-back': 'B - back to main menu',
      'key-return': 'P - return to the game',
      'key-gameover': 'Game over screen',
      'key-try': 'T - try again',
      'gameplay-paused': 'PAUSED',
      'gameplay-gameover': 'GAME OVER',
      'screen-story-howto': 'Arrows/WASD \nto move the player.',
      'game-name': 'Once on the MOON',
      'complete-level': 'Level is completed!',
      'level-1-name': 'Level 1',
      'level-2-name': 'Level 2'
    }
  }
};
