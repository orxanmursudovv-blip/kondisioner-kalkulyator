// sw.js — sadə keş: sayt bir dəfə açılandan sonra internet olmadan da açılır.
// Data (kampaniyalar) hər zaman canlı internetlə API-dən gəlir, bu yalnız
// səhifənin özünü (HTML/CSS/JS) keşləyir.

const CACHE_NAME = 'kalkulyator-v1';
const FILES_TO_CACHE = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // API sorğularını keşləmə — həmişə canlı GitHub datası lazımdır
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
