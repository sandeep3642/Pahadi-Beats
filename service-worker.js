const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/downloaded-songs', // Add any other routes you want to cache
  '/static/js/main.js',
  '/static/css/main.css',
  // Add other assets here
];

// Install event - cache the essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential assets');
        return cache.addAll(urlsToCache);
      })
  );
});


// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// Fetch event - serve cached assets or fetch from network if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Return cached response if available
        }
        return fetch(event.request).catch(() => {
          // If the fetch fails and it's a navigation request, serve the offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html'); // Add offline.html to your cache
          }
        });
      })
  );
});

