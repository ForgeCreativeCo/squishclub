# Squish Trade Club

A collect-and-trade game built for kids on tablets: play mini-games to earn Squish Coins, open mystery packs of squishies & fidgets, and trade with a buddy at a shared live trading table.

## How it works

- **Solo progression** — each player earns coins from 6 mini-games (Squish Match, Pop Rush, Squishy Catch, Stretch Zone, Sort Rush, Pattern Pop) and spends them on Mystery Packs across 5 rarity tiers.
- **Collection** — 28 items modeled on real current squishy & fidget toy trends (NeeDoh, Taba squishies, mochi animals, Pop-Its, Infinity Cubes, Speks magnets, and more).
- **Trading table** — two players join a 4-digit code table on separate devices, build an offer, both ready up, both confirm — then the swap executes live.

## Running it

This is a standalone, installable [PWA](https://web.dev/progressive-web-apps/) — a static site with no build step and no server to run. Host `index.html`, `manifest.json`, `sw.js` and `icons/` anywhere that serves static files over HTTPS (e.g. GitHub Pages), and open it in a browser on each tablet. From there, "Add to Home Screen" (or the browser's install prompt) installs it like a real app.

Data and live trading sync run on [Firebase](https://firebase.google.com): each tablet signs in anonymously (no accounts, no passwords — just a per-device identity) and reads/writes [Firestore](https://firebase.google.com/docs/firestore) directly from the browser. See `firestore.rules` for the security rules this project uses — paste them into the Firebase Console's Firestore → Rules tab.

The service worker (`sw.js`) caches the app shell for offline/installable use, but never caches Firebase/Firestore network traffic, so saves and trades always go live.

## Tech

Vanilla HTML/CSS/JS, no build step, no bundler. Firebase JS SDK (Auth + Firestore) loaded as ES modules straight from Google's CDN. Fonts via Google Fonts (Baloo 2 + Nunito).
