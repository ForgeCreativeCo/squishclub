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

## Fire tablets & Amazon Kids

The live game is hosted on Netlify at **https://squishtradeclub.netlify.app** (project `squishtradeclub`). It deploys from this repo. (There is also an older GitHub Pages copy; Netlify is the one to use.)

There are two ways to get it onto a Fire tablet in a kid's profile.

### Option A: Amazon Kids web browser (no app needed)

1. In the Parent Dashboard (parents.amazon.com) or in the child's Amazon Kids settings on the tablet, turn on the web browser for that child.
2. Add `https://squishtradeclub.netlify.app` as an allowed website.

This works, including live trading. The browser bar stays visible, though, and the game can't go full screen.

### Option B: The Android app (`android/`)

`android/` is a small Android app that shows the live site full screen, with no browser bar, and blocks any link that leaves the game. Since it loads the hosted site, game updates arrive automatically. The app only needs rebuilding if something in `android/` changes. Nothing goes through the Amazon Appstore; you install it on your own tablets yourself.

#### One-time setup: the signing key

Android only installs an update over an existing app if both are signed with the **same key**. Before anyone installs the app, the key has to be stored as two GitHub repository secrets:

1. Go to **Settings → Secrets and variables → Actions → New repository secret**. On a phone, use a web browser in "desktop site" mode; the GitHub mobile app can't do this.
2. Add `ANDROID_KEYSTORE_PASSWORD` (the key's password).
3. Add `ANDROID_KEYSTORE_BASE64` (the key file, base64-encoded as a single line).

The key alias is `squish`, and the key password is the same as the keystore password.

**Keep a private copy of the key outside GitHub,** for example in a password manager. GitHub never shows a secret again after it's saved, and the key is deliberately *not* committed to this repo, because anyone holding it could sign a fake "update".

If the key is lost, or you're setting this up from scratch, make a new one (needs Java's `keytool`):

```sh
keytool -genkeypair -keystore squish-release.keystore -storetype PKCS12 \
  -alias squish -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Squish Trade Club, O=Forge Creative Co"
base64 -w0 squish-release.keystore   # macOS: base64 -i squish-release.keystore
```

Put the password you chose and the base64 output into the two secrets above. ⚠️ Changing the key means every tablet that already has the app must **uninstall it** before installing the new build. That wipes that tablet's game progress, so do this only if the key is truly gone.

If the secrets are missing, builds still succeed, but they use a throwaway debug key and print a warning. Don't install those builds on a kid's tablet.

#### Building

GitHub Actions (`.github/workflows/android.yml`) builds the APK automatically whenever `android/` changes on any branch. You can also run it by hand: **Actions → Android app → Run workflow**.

- **Builds from `main`** are published as a GitHub Release. The newest APK is always at:
  **https://github.com/ForgeCreativeCo/squishclub/releases/latest/download/SquishTradeClub.apk**
- **Builds from other branches** are attached to the workflow run as a downloadable artifact (`SquishTradeClub-apk`).

The version number goes up with every build, so a new APK installs over the old one without losing progress, as long as it's signed with the same key.

To build locally instead, you need the Android SDK and Java 17. Then run, from `android/`:

```sh
ANDROID_KEYSTORE_PATH=/path/to/squish-release.keystore \
ANDROID_KEYSTORE_PASSWORD=... VERSION_CODE=<higher than the installed one> \
./gradlew assembleRelease
# → app/build/outputs/apk/release/app-release.apk
```

#### Installing on a Fire tablet

1. Switch to the **parent** profile.
2. Open the APK link above in **Silk** and download it.
3. Open the download. When Fire OS asks, allow Silk to install unknown apps (**Settings → Security & Privacy → Apps from Unknown Sources**). You can turn this back off afterwards.
4. Install it, and open it once to check that it loads.
5. Add it to the child's profile: **Settings → Profiles & Family Library** (or **Amazon Kids**) **→ the child → Add Content → Apps → Squish Trade Club**.

To **update**, repeat steps 1–4 with the newest APK. It installs over the old one and keeps the kid's progress.

#### Good to know

- Each tablet/profile gets its own anonymous Firebase identity, so separate kids should use separate Amazon Kids profiles. Uninstalling the app or clearing its data starts that tablet's collection over.
- If the app shows a blank screen on an older tablet, its built-in Android WebView may be too old for the game. Check for Fire OS system updates.
- The app's code is all in `android/app/src/main/java/com/forgecreativeco/squishtradeclub/MainActivity.java`. The game URL is the `GAME_URL` constant at the top.
