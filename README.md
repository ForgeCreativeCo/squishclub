# Squish Trade Club

A collect-and-trade game built for kids on tablets: play mini-games to earn Squish Coins, open mystery packs of squishies & fidgets, and trade with a buddy at a shared live trading table.

## How it works

- **Solo progression** — each player earns coins from 7 mini-games (Squish Match, Pop Rush, Squishy Catch, Stretch Zone, Sort Rush, Pattern Pop, and the educational Pop-It Math) and spends them on Mystery Packs across 5 rarity tiers.
- **Pop-It Math** — an educational game: pop the bubble with the right answer, 10 questions a round, no timer. It has 12 levels, from "adding to 10" through times tables, division and missing numbers to fractions and percents of numbers. Each kid picks a starting point the first time; after that, their level (saved as `skills.math` on their player doc) goes up after a round of 9–10 correct and down after 5 or fewer. Wrong answers show the correct equation. Beginner levels show bubbles to count.
- **Collection** — 28 items modeled on real current squishy & fidget toy trends (NeeDoh, Taba squishies, mochi animals, Pop-Its, Infinity Cubes, Speks magnets, and more).
- **Trading table** — two players join a 4-digit code table on separate devices, build an offer, both ready up, both confirm — then the swap executes live.

## Running it

This is a standalone, installable [PWA](https://web.dev/progressive-web-apps/) — a static site with no build step and no server to run. Host `index.html`, `manifest.json`, `sw.js` and `icons/` anywhere that serves static files over HTTPS (e.g. GitHub Pages), and open it in a browser on each tablet. From there, "Add to Home Screen" (or the browser's install prompt) installs it like a real app.

Data and live trading sync run on [Firebase](https://firebase.google.com): each tablet signs in anonymously (no accounts, no passwords — just a per-device identity) and reads/writes [Firestore](https://firebase.google.com/docs/firestore) directly from the browser. See `firestore.rules` for the security rules this project uses — paste them into the Firebase Console's Firestore → Rules tab.

The service worker (`sw.js`) caches the app shell for offline/installable use, but never caches Firebase/Firestore network traffic, so saves and trades always go live.

## Playing on Fire tablets (Amazon Kids)

The live game is hosted on Netlify at **https://squishtradeclub.netlify.app** (Netlify project `squishtradeclub`, deployed from this repo). There's also an older GitHub Pages copy; use the Netlify address.

It runs in the Amazon Kids web browser, including live trading between two tablets:

1. Open the Parent Dashboard (parents.amazon.com), or the child's Amazon Kids settings on the tablet.
2. Turn on the web browser for that child.
3. Add `https://squishtradeclub.netlify.app` as an allowed website.
4. Repeat for each child's profile.

Good to know:

- **One Amazon Kids profile per kid.** Each profile gets its own anonymous identity, coins and collection. Two kids sharing a profile share a collection.
- **Progress lives in the browser's saved data.** Clearing the kids browser's data, or resetting the profile or tablet, starts that profile over with a new collection.
- **Game updates are automatic.** Pushing to this repo redeploys the Netlify site, and the tablets pick up the change the next time the game loads.
- **The browser bar stays visible**, and "Add to Home Screen" doesn't work inside a Kids profile. A full-screen Android app version was prototyped on the `ccr-080785d8-knjuoc` branch (see closed PR #1) in case that's ever wanted.

## Tech

Vanilla HTML/CSS/JS, no build step, no bundler. Firebase JS SDK (Auth + Firestore) loaded as ES modules straight from Google's CDN. Fonts via Google Fonts (Baloo 2 + Nunito).
