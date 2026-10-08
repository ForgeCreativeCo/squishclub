# Squish Trade Club: notes for Claude

A collect-and-trade game for two kids (ages 7 and 11) on Fire tablets, played in
the Amazon Kids web browser. The whole game is `index.html` (vanilla HTML/CSS/JS,
no build step) backed by Firebase Auth + Firestore. See README.md for features.

## Two versions, always kept in step

Every feature or fix goes into **both** versions in the same change:

1. **Production**: `index.html`, deployed by Netlify from `main` to
   https://squishtradeclub.netlify.app. This is what the kids play. It must stay
   a normal game: kids earn coins and toys. Never ship unlocked items, test
   tools, cheat buttons or Robo controls here.
2. **Sandbox**: a private claude.ai artifact for the parent to test with. The
   parent works from two claude.ai accounts, so there is one copy per account:
   - Account A: https://claude.ai/artifact/LMH3hdc6PtG4gNxW6HWhtN
   - Account B: https://claude.ai/artifact/KjCC4sLixwJwfaS97WR1HU
   Artifacts are owner-only, so a session can only read or update the copy its
   own account owns (the other reads as "not found"). Update that one, and tell
   the parent the other copy is behind. Ask which account if it is unclear.
   It is generated from `index.html` by `tools/sandbox/build.py`, which swaps
   Firebase for a pretend in-browser database and adds everything unlocked
   (99,999 coins, every toy), the 🧪 Test tools panel, and Robo the practice
   trade buddy (`tools/sandbox/sandbox.js`, `sandbox.css`).

After changing `index.html`:

```sh
python3 tools/sandbox/build.py          # -> tools/sandbox/dist/squish-club-sandbox.html
```

Then republish that file to this account's sandbox artifact **by its URL**
(Artifact tool, `url:` one of the two above; read it first if this session
hasn't). If a feature needs new test controls (a new reset, a way to
trigger a rare event), add them to the panel in `sandbox.js`. If a feature
changes trading, check Robo still plays it correctly. The build fails loudly if
the Firebase bootstrap or the catalog format it depends on changes.

## Shipping to production

- Pushing to `main` deploys to the kids' tablets within a minute. Ask the parent
  before pushing to `main`; do the work on the feature branch first.
- Bump `CACHE_VERSION` in `sw.js` with every `index.html` change, or tablets keep
  serving the old cached game.
- Kids need to close and reopen the game to pick up a new version. When a change
  affects trading, both tablets must be on the same version.
- `_redirects` keeps `tools/` and this file off the public site.

## Testing

There is no test suite. Changes are checked by driving the game in headless
Chromium (Playwright is preinstalled; Chromium is at `/opt/pw-browsers/chromium`)
with the Firebase modules intercepted and replaced by a fake. Trading is tested
with two pages sharing one fake store. Look at screenshots, not just logs.

## Things that are easy to break

- Toy art is SVG drawn in code (the TOY ART section). Every render must create
  fresh gradient ids (`toyId`), or copies in hidden tabs render blank.
- Trade accepts are tied to the exact deal (`dealKey`). Any change to either
  side voids an accept. Keep the swap inside the Firestore transaction.
- Scam items are separate from `ITEMS` and must never count toward the 28.
- Fire tablets may lack newer emoji; stick to Emoji 11 or older.
