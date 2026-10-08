// Squish Trade Club — service worker
// Caches the app shell so it opens offline / installs as a PWA.
// Firebase (auth + firestore) calls are never intercepted here — they
// always go to the network so saves and trades stay live and correct.

const CACHE_VERSION = "v34";
const SHELL_CACHE = "squish-shell-" + CACHE_VERSION;
const FONT_CACHE = "squish-fonts-" + CACHE_VERSION;

const SHELL_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./sounds/unzip.mp3",
  "./sounds/spin.mp3",
  "./sounds/squish1.mp3",
  "./sounds/squish2.mp3",
  "./sounds/slap1.mp3",
  "./sounds/slap2.mp3",
  "./sounds/slap3.mp3",
  "./sounds/pack-rattle.mp3",
  "./sounds/pack-open.mp3",
  "./sounds/reveal.mp3",
  "./sounds/reveal-big.mp3",
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js",
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js",
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("SW precache failed", err))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== SHELL_CACHE && n !== FONT_CACHE)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

function isFirebaseRequest(url) {
  return (
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("firebaseio.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com") ||
    url.hostname.includes("securetoken.googleapis.com") ||
    url.hostname.includes("firebaseinstallations.googleapis.com") ||
    url.hostname.includes("googleapis.com") && url.pathname.includes("google.firestore")
  );
}

function isFontRequest(url) {
  return url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never intercept writes/streams

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Always let Firebase traffic go straight to the network.
  if (isFirebaseRequest(url)) return;

  // Background music streams with range requests; let the network handle it
  // rather than caching partial responses.
  if (url.pathname.includes("/sounds/music-")) return;

  // Fonts: stale-while-revalidate so they still render offline after first load.
  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // App shell: cache-first, falling back to network, so it opens offline.
  if (url.origin === self.location.origin || SHELL_URLS.includes(req.url)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200 && req.url.startsWith("http")) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
  }
});
