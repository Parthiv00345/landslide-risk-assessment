const CACHE_NAME = 'v1';
const CACHE_ASSETS = [
    'index.html',
    'styles.css',
    'script.js',
    'icon-192x192.png',
    'icon-512x512.png',
    // Add other assets you want to cache
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_ASSETS);
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});