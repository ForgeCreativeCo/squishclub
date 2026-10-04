# Squish Trade Club

A collect-and-trade game built for kids on tablets: play mini-games to earn Squish Coins, open mystery packs of squishies & fidgets, and trade with a buddy at a shared live trading table.

## How it works

- **Solo progression** — each player earns coins from 6 mini-games (Squish Match, Pop Rush, Squishy Catch, Stretch Zone, Sort Rush, Pattern Pop) and spends them on Mystery Packs across 5 rarity tiers.
- **Collection** — 28 items modeled on real current squishy & fidget toy trends (NeeDoh, Taba squishies, mochi animals, Pop-Its, Infinity Cubes, Speks magnets, and more).
- **Trading table** — two players join a 4-digit code table on separate devices, build an offer, both ready up, both confirm — then the swap executes live.

## Running it

This is a single self-contained `index.html` built as a [Claude Artifact](https://claude.ai), using the `db` runtime capability for shared, synced player data and the live trading table. It's not meant to run as a static file outside that environment — it relies on `window.claude.use("db")` for persistence and multiplayer sync.

## Tech

Vanilla HTML/CSS/JS, no build step, no external JS dependencies. Fonts via Google Fonts (Baloo 2 + Nunito).
