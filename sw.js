const CACHE = "juju-members-v0.2.27";
const ASSETS = [
  "./",
  "index.html",
  "404.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "icon.svg",
  "assets/relics/byoudon-mamori.jpg",
  "assets/relics/sange-box.jpg",
  "assets/relics/ganenbutsu.jpg",
  "assets/relics/black-phone.jpg",
  "assets/relics/mother-puppet.jpg",
  "assets/relics/horseshoe.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
