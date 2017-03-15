/*
    service worker that needs to be placed in the root directory of project    

*/
// Use a cacheName for cache versioning
var cacheName = 'samsung-shop-pwa';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', e => {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then( cache => {
            return cache.addAll([
                './',
                './src/css/styles.css',
                './src/js/cart.js',
                './src/js/pg.js',
                './src/js/script.js',
                './src/js/webpay.js',
                './cart.html',
                './checkout.html',
                './index.html',
                './order-confirm.html',
                './src/img/logo.png',
                './src/img/samsunggalaxys7.jpg',
                './src/img/gears3frontier.jpg',
                './src/img/gears3classic.jpg',
                './src/img/gear360camera.jpg',
                './src/img/gearvr2.jpg',
                './src/img/gearvr.jpg',
                './src/img/wirelesscharger.jpg',
                './src/img/gears2.jpg',
                './src/img/s3wirelesscharger.jpg',
                './src/img/bluetoothheadphones.jpg',
                './src/img/oledtv.jp'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a URL…
self.addEventListener('fetch', event => {
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then( response => {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});