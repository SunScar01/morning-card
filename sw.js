// Service worker: a script the browser runs in the background.
// Ours does one job: save the app's files on the phone so it opens offline.

// Bump this number whenever you change any file, so phones fetch the new version.
const CACHE = 'morning-card-v2';

// Relative paths on purpose: GitHub Pages hosts the app under /your-repo-name/, not at the root.
const APP_FILES = [
  './',
  'index.html',
  'checkin.html',
  'style.css',
  'cards.js',
  'app.js',
  'roasts.js',
  'checkin.js',
  'pwa.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

// 1. Install: download everything once and store it.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

// 2. Activate: delete caches from older versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// 3. Fetch: answer from the cache right away, and refresh the cache from the network
//    in the background ("stale while revalidate"). Google Fonts get cached this way too.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: true });
      const fromNetwork = fetch(event.request)
        .then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || fromNetwork;
    })
  );
});