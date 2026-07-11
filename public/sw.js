// Nudgley Service Worker — offline shell cache
// NOTE [PUSH]: To add background push notifications, extend this file with
// a 'push' event listener and register VAPID keys from the server.
// That requires [AUTH] + [JOBS] backend infrastructure.

const CACHE = 'nudgley-v1';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap'
];

// Install — cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activate — remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch — network first, fall back to cache for navigation
self.addEventListener('fetch', e => {
  // Skip non-GET and Anthropic API calls — never cache those
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('anthropic.com') || e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for shell assets
        if (res.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes('fonts.googleapis'))) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
  );
});

// NOTE [PUSH]: Push handler goes here when server infrastructure is ready:
// self.addEventListener('push', e => { ... });
// self.addEventListener('notificationclick', e => { ... });
