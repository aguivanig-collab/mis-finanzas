// Guarda el marco de la app (esta página, el manifiesto y los íconos) para
// que abra al instante. La app de adentro (script.google.com) no se toca:
// siempre se pide en vivo.
var CACHE = 'mis-finanzas-v1';
var MARCO = ['./', 'index.html', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(MARCO); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

// Primero la red (para recibir cambios); sin red, lo guardado.
self.addEventListener('fetch', function (e) {
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copia = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
