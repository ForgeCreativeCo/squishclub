# Squish Trade Club

A collect-and-trade game built for kids on tablets: play mini-games to earn Squish Coins, open mystery packs of squishies & fidgets, and trade with a buddy at a shared live trading table.

## How it works

- **Solo progression** — each player earns coins from 8 mini-games (Squish Match, Pop Rush, Squishy Catch, Stretch Zone, Sort Rush, Pattern Pop, and the educational Pop-It Math and Word Builder) and spends them on Mystery Packs across 5 rarity tiers.
- **Pop-It Math** — an educational game: pop the bubble with the right answer, 10 questions a round, no timer. It has 12 levels, from "adding to 10" through times tables, division and missing numbers to fractions and percents of numbers. Each kid picks a starting point the first time; after that, their level (saved as `skills.math` on their player doc) goes up after a round of 9–10 correct and down after 5 or fewer. Wrong answers show the correct equation. Beginner levels show bubbles to count.
- **Word Builder** — an educational spelling game: tap letter bubbles in order to spell the word, 8 words a round. It has 6 levels: short words (*cat*), blends (*frog*), long vowels (*snake*), tricky everyday words (*friend*, *because*), grade 3–4 words (*beautiful*) and grade 5–6 words (*necessary*, *rhythm*). Levels 1–3 show a picture; 4–6 give a fill-in-the-blank sentence. A 🔊 button reads the word aloud where the browser supports speech. Wrong letters wiggle and don't count, and after two misses the right letter glows. Leveling works like Pop-It Math (saved as `skills.words`): 7–8 perfect words moves you up, 4 or fewer moves you down.
- **Collection** — 28 items modeled on real current squishy & fidget toy trends (NeeDoh, Taba squishies, mochi animals, Pop-Its, Infinity Cubes, Speks magnets, and more).
- **Trading board** — two players join a 4-digit code table on separate devices and trade on a board styled after a real fidget-trading mat: dark navy with a pixel-mosaic print and a white center line, each player's items on their own half, and each player's three button tiles (✕ Decline, ＋ Add More, ✓ Accept) along their own edge. The buddy's row is shown upside down, facing them, and lights up when they press it. It follows the playground steps: (1) **Ante**, where the table's starter puts down the first item; (2) **Counter-offer**, where the buddy, who can't place anything until the ante is down, answers with what they think matches; (3) **Evaluate**, with a balance scale showing each side's value (Common ⭐1, Uncommon ⭐2, Rare ⭐4, Epic ⭐7, Legendary ⭐10); and (4) **Decide**: ➕ **Add More** tells the other kid their offer is too low (their side glows until they add value), ✔️ **Accept** swaps only once both have pressed it, and ❌ **Decline** ends the trade with everyone keeping their items. Each accept is tied to the exact deal on the board, so changing anything afterward cancels it, and the swap itself runs as one all-or-nothing database transaction.

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
- **The browser bar stays visible**, and "Add to Home Screen" doesn't work inside a Kids profile. A full-screen Android app version was prototyped on the `android-app` branch (see closed PR #1) in case that's ever wanted.

## Tech

Vanilla HTML/CSS/JS, no build step, no bundler. Firebase JS SDK (Auth + Firestore) loaded as ES modules straight from Google's CDN. Fonts via Google Fonts (Baloo 2 + Nunito).
