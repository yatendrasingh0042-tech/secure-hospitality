const CACHE_NAME = "secure-hospitality-v1";

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Conservative Caching Strategy
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip caching sensitive or dynamic API routes
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next/data") ||
    url.pathname.includes("health-records")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache successful static responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === location.origin)
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If HTML navigation fails offline, return /offline page
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/offline");
          }
        });
    })
  );
});
