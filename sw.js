// sw.js — v2: "network-first" strategiyası.
// Əvvəlki versiya köhnə səhifəni əbədi keşləyib göstərirdi.
// İndi: hər dəfə canlı internetdən yenisini çəkir, yalnız internet
// olmayanda (offline) köhnə keşdən göstərir.

const CACHE_NAME = 'kalkulyator-v2'; // versiya artırıldı — köhnə keş avtomatik silinəcək
const FILES_TO_CACHE = ['./index.html', './dashboard.html', './manifest.json'];

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
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request)) // yalnız internet yoxdursa köhnə keşdən göstər
  );
});
