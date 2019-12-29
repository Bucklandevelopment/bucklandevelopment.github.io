
'use strict';
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/Build/UnityLoader.js',
  '/Build/zpowa.data.unityweb',
  '/Build/zpowa.json',
  '/Build/zpowa.wasm.code.unityweb',
  '/Build/zpowa.wasm.framework.unityweb',
  '/UnityProgress.js',
  '/images/add.svg',
  '/images/favicon.ico',
  '/images/fullscreen.png',
  '/images/install.svg',
  '/images/progressEmpty.Dark.png',
  '/images/progressEmpty.Light.png',
  '/images/progressFull.Dark.png',
  '/images/progressFull.Light.png',
  '/images/progressLogo.Dark.png',
  '/images/progressLogo.Light.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-256x256.png',
  '/images/icons/icon-32x32.png',
  '/images/icons/icon-512x512.png',
  '/styles/style.css',
  '/scripts/install.js',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
);

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');

  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        //if (key !== CACHE_NAME) {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
);

  self.clients.claim();
});


self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  //sustituimos el request por las rutas reales que usamos ahora
  if (evt.request.url.includes('/', '/Build')){//|| evt.request.url.includes('/Build/')) {
    console.log('[Service Worker] Fetch (data)', evt.request.url);
    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return fetch(evt.request)
              .then((response) => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  cache.put(evt.request.url, response.clone());
                }
                return response;
              }).catch((err) => {
                // Network request failed, try to get it from the cache.
                console.log("Errores con el fetch: " + err);
                return cache.match(evt.request);
              });
        }));
    return;
  }
  evt.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request)
            .then((response) => {
              return response || fetch(evt.request);
            });
      })
  );

});
