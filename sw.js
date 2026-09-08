const CACHE_NAME = 'sanngames-v1';
const APP_SHELL = [
  './',
  './index.html',
  'avatars/avatar1.png','avatars/avatar2.png','avatars/avatar3.png','avatars/avatar4.png',
  'avatars/avatar5.png','avatars/avatar6.png','avatars/avatar7.png','avatars/avatar8.png',
  'borders/border1.png','borders/border2.png','borders/border3.png','borders/border4.png',
  'borders/border5.png','borders/border6.png','borders/border7.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
