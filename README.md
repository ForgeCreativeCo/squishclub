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

## Fire tablet / Android app

`android/` is a small Android app that shows the live site (https://squishtradeclub.netlify.app) full-screen, with no browser bar, and blocks links that leave the game. Since it loads the hosted site, game updates arrive automatically. The app only needs rebuilding if something in `android/` changes.

**Building:** GitHub Actions builds the APK whenever `android/` changes (or run the "Android app" workflow by hand under the Actions tab). Builds from `main` are published as a GitHub Release, so the newest one is always at:

https://github.com/ForgeCreativeCo/squishclub/releases/latest/download/SquishTradeClub.apk

Builds from other branches are attached to the workflow run as an artifact.

**Signing:** set the `ANDROID_KEYSTORE_BASE64` and `ANDROID_KEYSTORE_PASSWORD` repository secrets (key alias `squish`) *before* installing on any tablet. Android only accepts an update signed with the same key as the installed app. Without the secrets, the build uses a throwaway debug key, and updating means uninstalling first, which wipes that tablet's game progress.

**Installing on a Fire tablet:**
1. In the parent profile, open the APK link above in Silk and download it.
2. When asked, allow Silk to install unknown apps (Settings → Security & Privacy → Apps from Unknown Sources). You can turn this off again afterwards.
3. Open the download and install it.
4. Add it to a child's profile: Settings → Profiles & Family Library (or Amazon Kids) → the child → Add Content → Apps → Squish Trade Club.
