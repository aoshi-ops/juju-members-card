const CACHE = "juju-members-v0.2.80";
const ASSETS = [
  "./",
  "index.html",
  "404.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "manifest-admin.json",
  "admin/login/index.html",
  "icon.svg",
  "assets/icons/app-icon-180.png",
  "assets/icons/app-icon-192.png",
  "assets/icons/app-icon-512.png",
  "assets/brand/joujou_logo_white.png",
  "assets/backgrounds/app-bg.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "reload" })
        .then((response) => {
          caches.open(CACHE).then((cache) => cache.put("index.html", response.clone()));
          return response;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }
  if (
    requestUrl.pathname.endsWith("/app.js") ||
    requestUrl.pathname.endsWith("/styles.css") ||
    requestUrl.pathname.endsWith("/sw.js") ||
    requestUrl.pathname.endsWith(".html")
  ) {
    event.respondWith(fetch(event.request, { cache: "reload" }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
        return response;
      })
    )
  );
});
