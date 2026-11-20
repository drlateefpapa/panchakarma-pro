const CACHE_NAME = 'panchakarma-pro-mobile-v3';
const PRECACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './cover.jpg', './img_02.jpg', './img_03.jpg', './img_04.jpg', './img_05.jpg', './img_06.jpg', './img_07.jpg', './img_08.jpg', './img_09.jpg', './img_10.jpg', './img_11.jpg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
      }
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
