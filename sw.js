// Service Worker para Botonera PWA - Network First con Soporte Offline
const CACHE_NAME = 'botonera-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  './logo-impresionesvcp.png',
  './Curriculum.html',
  './impresiones.html',
  './presupuesta.html',
  './finanzas.html',
  './MarcaAgua.html',
  './ia.html'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// Estrategia Network-First: Busca siempre la versión más reciente en la red; si no hay internet o falla, usa caché
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Evitar interceptar llamadas a APIs externas de IA o scripts CDN dinámicos
  if (url.origin !== self.location.origin) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return null;
        });
      })
  );
});
