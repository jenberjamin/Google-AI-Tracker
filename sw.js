const CACHE_NAME = 'lifehub-protocol-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  '.Google-Gemini.png'
];

// 1. Install Service Worker & Cache Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching Protocol Shell');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate & Clean Up Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch Strategy: Stale-While-Revalidate (Serve Cache, Try Network)
self.addEventListener('fetch', (event) => {
  // We ignore Firestore/Google requests here to let the SDK handle them
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );

});
