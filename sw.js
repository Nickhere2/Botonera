// Service Worker para Botonera PWA - Network First con Soporte Offline y Auto-Refresh
const CACHE_NAME = 'botonera-app-v2.4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './favicon.ico',
  './rear-window.ico',
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch((err) => {
      console.warn('Cache prefetch warning:', err);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data && event.data.action === 'clearCache') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
  }
});

// Estrategia Network-First: Siempre intenta obtener la versión en vivo de la red
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // No interceptar llamadas a APIs externas de IA o CDNs externos
  if (url.origin !== self.location.origin) {
    return;
  }

  // Para navegación principal (HTML), ir siempre a la red para ver cambios inmediatos
  if (e.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Para el resto de recursos (iconos, sub-páginas)
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
          return null;
        });
      })
  );
});
