# Squish Trade Club

A collect-and-trade game made for two kids (ages 7 and 11) playing on Fire tablets. Kids play mini-games to earn Squish Coins, open mystery packs of squishies and fidgets, keep their toys in a backpack, play with them as fidgets, and trade with each other live on a fidget-trading mat.

- **Play it:** https://squishtradeclub.netlify.app
- **Test it:** a private sandbox copy with everything unlocked and a computer trade buddy (see [Sandbox](#sandbox-testing-copy))

## Playing on Fire tablets (Amazon Kids)

The game runs in the Amazon Kids web browser, including live trading between two tablets:

1. Open the Parent Dashboard (parents.amazon.com), or the child's Amazon Kids settings on the tablet.
2. Turn on the web browser for that child.
3. Add `https://squishtradeclub.netlify.app` as an allowed website.
4. Repeat for each child's profile.

Good to know:

- **One Amazon Kids profile per kid.** Each profile gets its own identity, coins, toys and learning levels. Two kids sharing a profile share everything.
- **Progress is tied to the browser's saved data.** Clearing the kids browser's data, or resetting the profile or tablet, starts that profile over.
- **After an update, close and reopen the game** so the tablet loads the new version. For trading, both tablets should be on the same version.
- **The browser bar stays visible**, and "Add to Home Screen" doesn't work inside a Kids profile. A full-screen Android app version was prototyped on the `android-app` branch (closed PR #1) in case that's ever wanted.

## What's in the game

The game has four tabs along the bottom: **Backpack, Games, Packs, Trade**.

### 🎒 Backpack

- **Your toys live in a backpack.** Tap it to unzip it. Toys are sorted into pockets: the main pocket for squishies, the side pocket for fidgets, and a secret zipper for scam items. Counts show how many of each you have.
- **Make it yours.** The first time, each kid picks a backpack color (Bubblegum, Sky, Grape, Mint, Galaxy or Rainbow). 🔑 **Keychain** hangs a favorite toy from the zipper; it swings when tapped, and the trade buddy can see it.
- **📖 Collection Book.** All 28 toys with collection stats. Toys you don't own yet show as silhouettes, so kids can see what they're hunting for. Filters: Squishies, Fidgets, Owned, Scams 💩.
- **Fidget mode.** Tap any toy you own to play with it. Nothing is earned; it's just for fun.
  - **Pop-its** (Pop-It, Simple Dimple): pop every bubble; when they're all popped, it flips over to the other side.
  - **Squishies:** press and hold to squish, let go and it slowly rises.
  - **Spinners** (Golden Fidget Spinner, Fidget Ring, Marble Mesh): flick to spin with momentum.
  - **Other fidgets:** tap for a reaction (the Infinity Cube flips, the Fidget Dodecagon clicks, the Speks jiggle, the Vortex swirls).
  - Sounds are generated in code (no audio files), with a 🔊 mute toggle each tablet remembers. Tablets that support vibration get a light buzz.

**The toys.** 28 collectibles modeled on real squishy and fidget trends: 10 Common, 8 Uncommon, 6 Rare, 2 Epic, 2 Legendary. Every toy is original art drawn as SVG in code, with glossy squishies with faces and pop-its built bubble by bubble. There are no image files to download. Six extra joke items come from scam packs (see Packs).

### 🎮 Games

Eight mini-games earn Squish Coins. Each round ends with a results screen, and the coins are added when the kid taps **Claim & Play Again** or **Done**. Leaving a game early with **Exit** earns nothing.

| Game | What you do |
|---|---|
| Squish Match | Flip cards and find all 8 pairs |
| Pop Rush | Tap the glowing bubble before it moves |
| Squishy Catch | Catch falling squishies, dodge bombs |
| Stretch Zone | Time your tap inside the glowing zone |
| Sort Rush | Squishy or fidget? Sort it before time runs out |
| Pattern Pop | Watch the pattern, then repeat it |
| **Pop-It Math** 📚 | Pop the bubble with the right answer |
| **Word Builder** 📚 | Pop letters in order to spell the word |

The two learning games adapt to each kid. The first time, a kid picks a starting point (🌱 / 🌟 / 🚀). After every round, a strong score moves them up a level and a rough one moves them down. Each kid's level is saved separately.

- **Pop-It Math:** 10 questions a round, no timer. Twelve levels:
  1. Adding to 10
  2. Taking away within 10
  3. Adding to 20
  4. Add & subtract to 20
  5. Two-digit add & subtract
  6. Add & subtract with carrying
  7. Times tables: 2, 5 & 10
  8. Times tables to 10 × 10
  9. Division facts
  10. Missing numbers
  11. Big number math
  12. Fractions & percents of numbers

  Beginner levels show bubbles to count. A wrong answer shows the right one with the full equation. 9–10 correct moves up; 5 or fewer moves down. Harder levels pay more, plus a +10 bonus for a perfect round.
- **Word Builder:** 8 words a round. Six levels: short words (*cat*), blends (*frog*), long vowels (*snake*), tricky everyday words (*friend*, *because*), grade 3–4 words (*beautiful*), and grade 5–6 words (*necessary*, *rhythm*). Levels 1–3 show a picture and read the word aloud; levels 4–6 give a fill-in-the-blank sentence. A 🔊 button reads the word wherever the browser supports speech. Wrong letters wiggle and don't count; after two misses, the right letter glows. Higher levels mix in extra letters that aren't in the word. 7–8 perfect words moves up; 4 or fewer moves down.

### 🎁 Packs

| Pack | Cost | Odds |
|---|---|---|
| Starter Pack | 40 🪙 | Common 65%, Uncommon 30%, Rare 5% |
| Rare Pack | 120 🪙 | Common 30%, Uncommon 40%, Rare 25%, Epic 5% |
| Legendary Pack | 300 🪙 | Uncommon 20%, Rare 45%, Epic 25%, Legendary 10% |

Every pack wobbles before it opens. Epic and Legendary pulls get a shine and confetti.

**Scam packs.** About 1 pack in 12 (shown on every pack as "💩 Scam 8%") is a scam. A SCAMMED stamp slams down over a joke item: Scam Poo, Empty Box, Lost Sock, Not-So-Squishy Brick, Banana Peel or IOU Note. A kid's first pack is never a scam, and scams never come twice in a row. Joke items have their own "Scam" rarity, live in the backpack's secret zipper and the Collection Book's Scams filter, don't count toward the 28, and are worth ⭐0 when trading.

### 🤝 Trade

Two kids trade on separate tablets. One taps **Create Trading Table** and reads out the 4-digit code; the other joins with it.

**The mat** is modeled on a real fidget-trading mat: dark navy with a pixel-mosaic print and a white center line. Each kid's items sit on their own half, and each kid's three button tiles run along their own edge: ✕ Decline, ＋ Add More, ✓ Accept. The buddy's tiles are upside down (facing them) and light up when they press them. The buddy's backpack and keychain show next to their name.

**The steps** follow the playground format, with a banner and step tracker guiding each kid:

1. **Ante:** the kid who created the table puts down the first item. The buddy's items stay locked until then.
2. **Counter-offer:** the buddy puts down what they think matches.
3. **Evaluate:** a balance scale on the center line adds up each side (Common ⭐1, Uncommon ⭐2, Rare ⭐4, Epic ⭐7, Legendary ⭐10, Scam ⭐0) and says whether it looks fair.
4. **Decide:**
   - **＋ Add More** tells the other kid their offer is too low. Their side glows until they add value.
   - **✓ Accept** swaps only after both kids have pressed it.
   - **✕ Decline** ends the trade; everyone keeps their items.

**Your backpack during a trade** sits under the mat. Open it, tap a toy, then choose **Put on mat** or **Play**. Playing opens fidget mode with a live strip showing what's happening in the trade. Tapping the buddy's toys on the mat lets you try them out ("just looking 👀").

**Reactions.** When the buddy presses ＋ or ✓, a big speech bubble pops up ("😆 ADD MORE!" / "😄 I ACCEPT!"). Toys bounce onto the mat, each step has a sound (shared with fidget mode's mute toggle), and a finished trade gets confetti and a "You got / You gave" summary.

**Fair-play safeguards.** An accept is tied to the exact items on the mat when it was pressed; changing anything on either side cancels it automatically. The swap runs as one all-or-nothing database transaction that rechecks both kids still own the items, so toys can't be lost or duplicated.

## How data is saved

Each tablet signs in to [Firebase](https://firebase.google.com) anonymously (no accounts or passwords, just a per-device identity) and reads and writes [Firestore](https://firebase.google.com/docs/firestore) directly from the browser.

**`players/{id}`**, one per kid/tablet:

| Field | What it holds |
|---|---|
| `name`, `avatar`, `createdAt` | Set when the kid first starts |
| `coins` | Squish Coins |
| `inventory` | `{ itemId: count }`, including scam items |
| `skills.math`, `skills.words` | Pop-It Math and Word Builder levels |
| `backpack.color`, `backpack.keychain` | Backpack color and keychain toy |
| `packsOpened`, `lastPackScam` | Used for the scam-pack rules |

**`trades/{code}`**, one per trading table:

| Field | What it holds |
|---|---|
| `code`, `status` | 4-digit code; `open`, `completed`, `declined`, `cancelled` or `failed` |
| `sideA`, `sideB` | Each side's `playerId`, `name`, `avatar`, `items`, `accepted`, `bpColor`, `keychain` |
| `addMoreTo`, `addMoreValue` | Pending "Add More" request |
| `declinedBy`, `createdAt`, `completedAt` | Bookkeeping |

`firestore.rules` holds the security rules (paste them into Firebase Console → Firestore → Rules). Any signed-in device can read and write both collections, because a trade must update both kids' inventories in one transaction. That's fine for a private family app; the file explains the next step if it ever gets a wider audience.

## Project files

| File | Purpose |
|---|---|
| `index.html` | The whole game: HTML, CSS and JavaScript, including the toy art |
| `sw.js` | Service worker that caches the game for fast, offline-capable loading (never caches Firebase traffic) |
| `manifest.json`, `icons/` | Installable-app (PWA) metadata and icons |
| `scripts_gen_icons.py` | Regenerates the app icons |
| `firestore.rules` | Firestore security rules |
| `_redirects` | Netlify rules that keep `tools/` and `CLAUDE.md` off the public site |
| `tools/sandbox/` | Builder for the sandbox testing copy |
| `CLAUDE.md` | Working notes for Claude sessions on this repo |

**Tech:** vanilla HTML/CSS/JS with no build step or bundler. Firebase JS SDK (Auth + Firestore) loads as ES modules from Google's CDN. Fonts come from Google Fonts (Baloo 2 + Nunito). Toy art is SVG generated in code; sounds are generated with Web Audio.

## Updating the game

- **Netlify deploys `main` automatically** to https://squishtradeclub.netlify.app within about a minute of a push. (There's also an older GitHub Pages copy of the repo; the Netlify address is the one to use.)
- **Bump `CACHE_VERSION` in `sw.js` with every `index.html` change.** Otherwise tablets keep serving the old cached game.
- **Kids pick up updates after closing and reopening the game.**
- **Keep the sandbox in step.** Every change to the game also goes into the sandbox (below).

## Sandbox (testing copy)

A private copy of the game for the parent to test with, at https://claude.ai/artifact/LMH3hdc6PtG4gNxW6HWhtN (owner-only). It's the same game, but:

- It saves everything in that browser only and **never touches the kids' real Firebase data**.
- It starts with 99,999 coins and every toy unlocked.
- A **🧪 Test tools** panel can add coins, refill or empty the backpack, make the next pack a scam, replay first-time screens (learning levels, backpack color), and reset everything.
- **Robo 🤖**, a computer trade buddy, makes it possible to practice a full trade alone. Robo antes or counters with something close in value (sometimes cheekily low), answers ＋ Add More by adding an item, presses ＋ when your offer is too low, accepts deals worth at least 80% of his side, and declines repeated lowballs. To go first: Trade → Create Trading Table → 🧪 → Invite Robo. To let Robo go first: 🧪 → Robo hosts a table, then join with the code (it's filled in for you).

The sandbox is generated from `index.html`, so it always matches the live game:

```sh
python3 tools/sandbox/build.py   # writes tools/sandbox/dist/squish-club-sandbox.html
```

Then republish that file to the sandbox artifact. The live game never gets the unlocks, test tools or Robo. See `CLAUDE.md` for the full workflow.

## Testing

There's no automated test suite. Changes are checked by playing the game in headless Chromium with Firebase swapped for a fake database. Trading is tested with two simulated tablets sharing one fake database, plus screenshots and recorded videos.

## Notes

- Some toy names use real brand names (NeeDoh, Taba, Speks). That's fine for a private family game, but they should be renamed if the game is ever published.
- The game avoids emoji newer than Emoji 11, since older Fire tablets may not draw them.
