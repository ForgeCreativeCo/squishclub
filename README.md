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
  - Sounds: real recorded squishes, a spinner whir that winds down with the spin, and synthesized pops and clicks. A 🔊 mute toggle covers every sound, and each tablet remembers it. Tablets that support vibration get a light buzz.

**The toys.** 28 collectibles modeled on real squishy and fidget trends: 10 Common, 8 Uncommon, 6 Rare, 2 Epic, 2 Legendary. Every toy is original art drawn as SVG in code, with glossy squishies with faces and pop-its built bubble by bubble. There are no image files to download. Six extra joke items come from scam packs (see Packs).

### 🎮 Games

Fifteen mini-games earn Squish Coins. Each round ends with a results screen, and the coins are added when the kid taps **Claim & Play Again** or **Done**. Leaving a game early with **Exit** earns nothing.

| Game | What you do |
|---|---|
| Squish Match | Flip cards and find all 8 pairs |
| Pop Rush | Tap the glowing bubble before it moves |
| Squishy Catch | Catch falling squishies in your backpack, dodge bombs |
| Stretch Zone | Time your tap inside the glowing zone |
| Squish Sorter 🗂️ | Toys ride a conveyor belt. Drag each into the right bin before it falls off |
| Puzzles 🧩 | Build a jigsaw of toy art, alone or with a buddy on another tablet |
| Squishy Bowling 🎳 | Flick a squishy down the lane and knock down the pins |
| Squish Slingshot 🎯 | Pull back a squishy and fling it at towers to pop the grumpy gloops |
| Squishy Racers 🏎 | Kart-race around a track with power-ups and projectiles, alone or with a buddy |
| Squishy Crane 🏗️ | Steer a claw over a pile of toys and grab one. Rarer toys are slipperier but pay more |
| Squishy Stacker 🗼 | Drop squishies onto a wobbly tower. Round toys wobble more |
| Spot the Fake 🔍 | Find the knockoff dupe hiding among the real toys |
| Pattern Pop | Watch the pattern, then repeat it |
| **Pop-It Math** 📚 | Pop the bubble with the right answer |
| **Word Builder** 📚 | Pop letters in order to spell the word |

All the games use the same toy art as the rest of the game: real toys on the match cards, falling into your own backpack in Squishy Catch, and in Squish Sorter and Spot the Fake, plus glossy pop-it bubbles in Pop Rush and Pattern Pop.

**Spot the Fake** shows a shelf of the same toy, and one of them is a knockoff. Each fake has one tell: a wrong color shade, a missing detail (an eye shine, a blush, a bubble), a misspelled name tag, or a squashed shape. There are 8 rounds: 4 toys in rounds 1–3 and 6 toys after that, and the tells get smaller each round. There's no timer. A wrong tap marks that toy ✓ Real; after two wrong taps the fake is shown. Every round ends by naming the tell, so kids learn what to look for on real toys. The 🔍 Magnifier button opens a tapped toy big before the kid decides. Scoring: 10 coins for a first-try find, 5 for a second try, 2 for a third, plus 10 for a perfect game (up to 90). Before a round starts, the game draws the fake and the real toy to a small hidden canvas and checks how many pixels differ, so a fake is never invisible and never too obvious for its round; toys that can't show a tell clearly get a different one.

**Squish Sorter** replaced Sort Rush. Toys ride a belt that speeds up, and kids drag each one into a bin (or tap a bin to send the toy at the front). Three rules of 8 toys each, announced before each starts: **sort by type** (squishy / fidget / trash), **sort by rarity** (Common / Uncommon / Rare+ / trash; toys get a rarity-colored border), and a **treasure hunt** (Rare+ toys go in Treasure, the rest by type). Joke scam items are the traps and belong in the 🗑️ trash. A toy that falls off the end counts as a miss. Each correct sort pays 2 🪙, plus a combo bonus (+1 at a streak of 3, +2 at 6, +3 from 9), capped at 90. A wrong bin explains why ("Pop-It is a Fidget").

**Squishy Stacker.** A toy swings across the top; tap to drop it onto the tower. Line it up over the toy below: a "Perfect!" lands within a few pixels and calms the tower, while a sloppy drop kicks it. The tower sways on a simple damped spring (no physics engine), with a Wobble bar that goes green, yellow and red. Flat toys (Pop-It, cubes) are steady and round, soft ones (Fuzz Ball, Mochi Panda) are wobbly, and each toy is tagged Steady, Squishy or Wobbly as it swings. Too much wobble means TIMBER! and the tower tumbles. A drop that misses the tower slides off and costs one of three hearts. The round has 14 toys. Coins are 5 per toy stacked, +2 per perfect, +10 for finishing the tower, capped at 90, and a tumbled tower still pays for its height. Per-toy width and wobble live in `STACK_TRAITS`, and the feel is tuned in `STACK_TUNE`.

**Squishy Bowling.** A squishy rolls down a lane at a rack of 10 cute pins. Kids slide the ball sideways along the foul line with a finger, then flick it up the lane; the flick's direction and speed set the aim and power (there's also a "Roll it straight" button). The ball is a random squishy each throw, tagged Heavy (smashes through), Medium or Light (bounces off). It's simple 2D circle physics, with no physics engine. Pins that get hit hard enough fall and are swept away, and pins in the gutter are out. There are 5 frames of up to 2 balls, and a strike or spare ends the frame. Coins are 1 per pin, +6 per strike and +3 per spare, capped at 90. The lane and pin sizes, ball weights and flick speeds are in `BWL` and the knock thresholds are in the physics step.

**Squish Slingshot.** Pull a squishy back on a wooden slingshot (a dotted line previews the first part of the flight) and let go to fling it at a tower of blocks with grumpy green **gloops** hiding in it. There are 3 levels and 4 shots per level. Each shot is a random squishy, tagged Heavy, Medium or Light like in Bowling, so heavy ones shove blocks harder. A gloop pops when a squishy hits it, when a falling block lands on it, or when it falls from a height, so knocking out the planks under a gloop works too. Blocks are wood, pink jelly (light) and stone (heavy). The physics is deliberately loose and floppy: simple boxes with gravity (no physics engine) that tumble and wobble when hit, then spring back upright. A hit gives blocks an extra kick, and nearby gloops get flung up and away, so a hit near a gloop usually pops it. Towers stay steady until they're hit. Coins are 5 per gloop, +10 for clearing a level and +4 for each shot left over, +10 if all 3 levels are cleared, capped at 90 with an 8-coin minimum. Levels are the `SLG_LEVELS` data (kind, left, height, width, height) and the feel is tuned in `SLG`.

**Squishy Racers.** Top-down kart racing for four: pick any squishy you own as your driver (Heavy toys are faster with wide turns, Light ones are nimble with a lower top speed, Medium is balanced), pick one of three tracks (Meadow Loop, Wiggle Wave, Candy Twist) and race 4 laps. The kart drives itself forward; hold ◀ ▶ (or touch the left/right half of the track) to steer. Driving through a rainbow **?** box gives a power-up, and trailing karts get stronger ones: **Turbo**, **Shield**, **Bubble Pop** (straight shot), **Triple Pop**, **Homing Jelly**, **Boing Ball** (bounces off the track edges), **Goo Puddle** (dropped behind you, slows whoever drives through) and **Mochi Meteor** (drops on whoever is in the lead). A hit spins a kart out for about a second (Goo just slows it); a Shield soaks up one hit. 1st place pays 40 coins, 2nd 25, 3rd 12 and 4th 5.
- **Alone:** you and three computer racers. They follow the track, use their own items, and speed up a little when far behind or ease off when far ahead.
- **With a buddy (two tablets, 4-digit code):** the host picks the track and starts the race, and the other kid joins with the code. Each tablet drives its own kart and sends its position about 4 times a second, so the other tablet draws it and shows its shots; the computer racers are two more karts simulated on each tablet. A hit on your kart is decided on your tablet, and your place is the order you cross the line as seen on your tablet. If the buddy's tablet goes quiet for a few seconds, their kart is driven by the computer.
- A table is a document in the existing `trades` collection with the id `race-<code>` and each kart's position goes in `race-<code>-A` / `race-<code>-B` (one writer per document), so no Firestore rules change was needed. Both tablets must be on the same game version. Tracks, speeds, item odds and rewards are in `RACE`, `RACE_TRACKS` and `RACE_ITEMS`.
- The sandbox's Test tools have a **Racing with Robo** group (Robo joins your table, or hosts one); Robo's kart is driven by the computer.

**Squishy Crane.** A claw machine with a pyramid of 12 toys (mostly common, with a rare, an epic and sometimes a legendary mixed in). Kids steer the claw by holding ◀ ▶ or dragging a finger across the machine, and the toy under the claw glows with its name and rarity. **GRAB!** lowers the claw onto the highest toy within reach. How well the claw is lined up sets the grip: a centred claw almost always holds, an off-centre one may drop the toy back onto the pile partway to the chute. Each rarity slips a bit more (`CRN.slip`) and pays more (`CRN.pay`: 4, 7, 12, 18, 25 coins). There are 6 tries, a toy that reaches the chute pays its coins, and the round is capped at 90 coins with a 5-coin minimum. Claw speeds, toy size and the grip odds are in `CRN`.

**Puzzles.** A jigsaw cut from a scene of the game's own toy art, with real tabbed piece shapes. Kids drag pieces onto the board, where they snap into place (👁 Peek shows the whole picture for a moment, 🔀 Spread out re-lays the table). Three sizes: Easy (6 pieces), Medium (12) and Hard (20).
- **Play alone.** Coins are 15 / 35 / 60 by size, plus up to +20 for finishing under a par time, and every finished puzzle wins a **sticker**.
- **Play with a buddy (two tablets, 4-digit code, like trading).** The host picks a mode and size, the buddy joins with the code, and the host starts it. **🤝 Build together:** both kids see one board and each holds half the pieces (the pieces they place show up live on the other tablet). Coins are 1.2× and the sticker is one tier higher. **🏁 Race:** both build their own copy of the same puzzle and see each other's progress. The winner gets +15 coins and a higher-tier sticker, and the other kid gets half the coins and a normal sticker.
- **Stickers** are a separate collection of 18 (6 Common, 6 Uncommon, 6 Rare) kept in the player's `stickers` map. They live in the Collection Book's **Stickers 🧩** filter, don't count toward the 28 toys, and can't be traded. Easy puzzles give Common stickers, Medium Uncommon and Hard Rare.
- Both tablets draw the same picture and the same piece shapes from one `seed` number. A two-player table is a document in the existing `trades` collection with the id `puzzle-<code>` (so no Firestore rules change was needed), and both tablets must be on the same game version.

#### Planned mini-games

Other ideas parked for later: **Squeeze Meter** (hold to squish, release in the green zone), **Bubble Pop Rescue** (tap floating squishies before they escape), **Mystery Capsule** (crank a capsule machine and solve a mini lock to reveal the prize), and a **Daily Challenge** (one rotating goal per day for a bonus capsule). A **co-op mini-game at the trading table**, where both kids work together and split the prize, could make the shared table feel like more than a swap screen.

Like every game, each one uses the shared toy art, pays out coins on the results screen, and gets matching sandbox support (see [Updating the game](#updating-the-game)).

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

Every pack rattles and wobbles, then its wrapper crinkles open and the toy appears with a sparkle. Epic and Legendary pulls get a longer shimmer, a shine and confetti.

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
| `stickers` | `{ stickerId: count }`, won by finishing puzzles |
| `packsOpened`, `lastPackScam` | Used for the scam-pack rules |

**`trades/{code}`**, one per trading table:

| Field | What it holds |
|---|---|
| `code`, `status` | 4-digit code; `open`, `completed`, `declined`, `cancelled` or `failed` |
| `sideA`, `sideB` | Each side's `playerId`, `name`, `avatar`, `items`, `accepted`, `bpColor`, `keychain` |
| `addMoreTo`, `addMoreValue` | Pending "Add More" request |
| `declinedBy`, `createdAt`, `completedAt` | Bookkeeping |

`firestore.rules` holds the security rules (paste them into Firebase Console → Firestore → Rules). Any signed-in device can read and write both collections, because a trade must update both kids' inventories in one transaction. That's fine for a private family app; the file explains the next step if it ever gets a wider audience.

## Music

Two looping tracks play quietly under the sound effects:

| Track | Plays |
|---|---|
| `sounds/music-home.mp3` (calm kid music, 51 s loop) | Around the app: Backpack, Packs, Trade, fidget mode |
| `sounds/music-games.mp3` (upbeat cartoon tune, 14.5 s loop) | During mini-games, crossfading in when a game starts and back out when the kid leaves |

The 🎵 button in the top bar turns music on or off, separately from sound effects, and each tablet remembers the choice. Music starts on the first tap (tablets don't allow sound before that) and pauses while the game is in the background. It streams instead of being cached offline, so music is skipped when the tablet is offline.

Source recordings: "cartoon-music-version-3" (bombinsound) and "free-background-kid-music" (oceanframemusic), per the original filenames. Both were leveled to match, and the cartoon tune's trailing silence was trimmed so it loops cleanly. Check each one's license before publishing the game anywhere public.

## Sound effects

Recorded clips live in `sounds/`, trimmed from longer recordings and leveled. Each kind has a synthesized fallback that plays until the clip has loaded. All sounds share the 🔊 mute toggle.

| Clip | Plays when |
|---|---|
| `unzip.mp3` | A backpack opens (Backpack tab and the trade drawer) |
| `spin.mp3` | A spinner is flicked in fidget mode; it gets quieter and lower as the spin slows, and fades out when it stops |
| `squish1.mp3`, `squish2.mp3` | Squishing a squishy in fidget mode, and a scored squish in Stretch Zone (picked at random) |
| `slap1.mp3`–`slap3.mp3` | A toy lands on the trading mat, or drops into the backpack in Squishy Catch (picked at random) |
| `pack-rattle.mp3` | A mystery pack wobbles before it opens |
| `pack-open.mp3` | The pack's wrapper crinkles open |
| `reveal.mp3` | The toy appears (Common, Uncommon, Rare) |
| `reveal-big.mp3` | The toy appears with a longer shimmer (Epic, Legendary). Scam packs get a sad "womp" instead. |

Source recordings: "unzip-mid", "fidget-spinner1", "wet-slaps", "wet-squishy-sound", "paper-sound" and "rattling-box" from the freesound_community collection, and "magic-spell-03" (universfield) (per the original filenames, as distributed on Pixabay). Check each one's license before publishing the game anywhere public.

## Project files

| File | Purpose |
|---|---|
| `index.html` | The whole game: HTML, CSS and JavaScript, including the toy art |
| `sw.js` | Service worker that caches the game for fast, offline-capable loading (never caches Firebase traffic) |
| `manifest.json`, `icons/` | Installable-app (PWA) metadata and icons |
| `sounds/` | Recorded sound effects (unzip, spinner whir, squishes, slaps) and the two music loops |
| `scripts_gen_icons.py` | Regenerates the app icons |
| `firestore.rules` | Firestore security rules |
| `_redirects` | Netlify rules that keep `tools/` and `CLAUDE.md` off the public site |
| `tools/sandbox/` | Builder for the sandbox testing copy |
| `CLAUDE.md` | Working notes for Claude sessions on this repo |

**Tech:** vanilla HTML/CSS/JS with no build step or bundler. Firebase JS SDK (Auth + Firestore) loads as ES modules from Google's CDN. Fonts come from Google Fonts (Baloo 2 + Nunito). Toy art is SVG generated in code. Sounds play through Web Audio: recorded clips from `sounds/` plus synthesized pops, dings and chimes.

## Updating the game

- **Netlify deploys `main` automatically** to https://squishtradeclub.netlify.app within about a minute of a push. (There's also an older GitHub Pages copy of the repo; the Netlify address is the one to use.)
- **Bump `CACHE_VERSION` in `sw.js` with every `index.html` change.** Otherwise tablets keep serving the old cached game.
- **Kids pick up updates after closing and reopening the game.**
- **Keep the sandbox in step.** Every change to the game also goes into the sandbox (below).

## Sandbox (testing copy)

A private copy of the game for the parent to test with, at https://claude.ai/artifact/LMH3hdc6PtG4gNxW6HWhtN or https://claude.ai/artifact/KjCC4sLixwJwfaS97WR1HU (owner-only; one copy for each of the parent's two claude.ai accounts). It's the same game, but:

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
