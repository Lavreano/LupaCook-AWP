// Instalamos el service worker
self.addEventListener('install', (e) => {
  // Evitamos el periodo de espera del navegador
  self.skipWaiting();

  // Lógica de pre-caching
  e.waitUntil(
      caches.open('mi-cache').then((cache) => {
          return cache.addAll([
              '/',
              'index.html',
              'aprender.html',
              'css/style.css',
              'img/banner.jpg',
              'img/banner-aprender.jpg',
              'img/banner-favoritos.jpg',
              'img/icon-512x512.png',
              'img/logo.png', 
              'js/app.js',
              'js/main.js',
          ]);
      })
  );

  console.log('Service Worker Instalado');
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker Activado');
});

// Capturamos las peticiones de la interfaz
self.addEventListener('fetch', (e) => {
  console.log(e);
  // Nos fijamos si lo que está pidiendo en la interfaz está en el caché. Si está, lo devolvemos, si no, se lo pedimos al servidor.

  // Construimos una respuesta
  e.respondWith(
      caches.match(e.request)
      .then(response => {
          if (response) {
              return response;
          }
          return fetch(e.request);
      })
  );

});


