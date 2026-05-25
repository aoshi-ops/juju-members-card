const CACHE = "juju-members-v0.2.36";
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
  "assets/brand/joujou_logo_white.png",
  "assets/brand/joujou_logo_black.png",
  "assets/backgrounds/member-card-back.jpg",
  "assets/backgrounds/app-bg.jpg",
  "assets/backgrounds/contact-bg.jpg",
  "assets/overlays/noise-static.jpg",
  "assets/card/avatar-frame.jpg",
  "assets/card/avatar-frame.png",
  "assets/card/card-back.jpg",
  "assets/card/card-front.jpg",
  "assets/card/relic-frame.jpg",
  "assets/card/relic-frame.png",
  "assets/card/sound-frame.jpg",
  "assets/card/sound-frame.png",
  "assets/fonts/HinaMincho-Regular.ttf",
  "assets/fonts/TaishoKatujiT5.ttf",
  "assets/fonts/IgyouMincho.ttf",
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
