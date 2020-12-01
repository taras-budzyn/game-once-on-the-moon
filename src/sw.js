var cacheName = 'MON-v3';
var appShellFiles = [
  './',
  './index.html',
  './favicon.ico',
  './fonts/BRLNSDB.css',
  './fonts/BRLNSDB.eot',
  './fonts/BRLNSDB.otf',
  './fonts/BRLNSDB.svg',
  './fonts/BRLNSDB.ttf',
  './fonts/BRLNSDB.woff',
  './sfx/audio-button.m4a',
  './sfx/audio-button.mp3',
  './sfx/audio-button.ogg',
  './sfx/music-in-the-wreckage.m4a',
  './sfx/music-in-the-wreckage.mp3',
  './sfx/music-in-the-wreckage.ogg',
  './assets/images/icons/icon-32.png',
  './assets/images/icons/icon-64.png',
  './assets/images/icons/icon-96.png',
  './assets/images/icons/icon-128.png',
  './assets/images/icons/icon-168.png',
  './assets/images/icons/icon-192.png',
  './assets/images/icons/icon-256.png',
  './assets/images/icons/icon-512.png',
  './js/phaser.3.18.1.min.js',
  './js/plugins/webfont.js',
  './js/start.js',
  './js/Boot.js',
  './js/Preloader.js',
  './js/MainMenu.js',
  './js/Settings.js',
  './js/Story.js',
  './js/levels/level1.js',
  './assets/images/background.png',
  './assets/images/button-achievements.png',
  './assets/images/button-back.png',
  './assets/images/button-continue.png',
  './assets/images/button-credits.png',
  './assets/images/button-home.png',
  './assets/images/button-mainmenu.png',
  './assets/images/button-music-off.png',
  './assets/images/button-music-on.png',
  './assets/images/button-pause.png',
  './assets/images/button-settings.png',
  './assets/images/button-sound-off.png',
  './assets/images/button-sound-on.png',
  './assets/images/button-start.png',
  './assets/images/button-tryagain.png',
  './assets/images/loading-background.png',
  './assets/images/overlay.png',
  './assets/images/particle.png',
  './assets/images/pattern.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});