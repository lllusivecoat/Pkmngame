# Live trainer rosters (v0.74)

The game reads the existing [public Google Sheet](https://docs.google.com/spreadsheets/d/1RPZC7zcc6_5lOpPGd94Vdz_o6XV-hx-1b3AF2YET5QE/edit). The **Trainers** native table contains 257 identities (249 uploaded Gallery characters and eight defence profiles), each with eight reputation bands: **0, 250, 500, 750, 1250, 1750, 2250, 2750**. Its Guide tab explains every control. The Species tab is unchanged.

## Editing a trainer

- Keep Trainer IDs stable; names are editable. Kind is Both: every trainer can participate in defence and the Gallery. Legacy Defence/Gallery labels remain loadable but no longer restrict participation.
- Pokemon 1–12 and Level 1–12 describe the trainer's full roster. Fill consecutive slots using Species IDs; individual levels are 1–100. The original first 18 columns, including Enabled at R, remain in place; slots 7–12 follow them.
- **AE · Battle team size:** 1–6, capped at available roster members. A roster may contain more than six, but an actual battle never does. Blank retains the old exact-team mode, which permits at most six roster entries.
- **AF · Evolution stage:** 1 = base, 2 = up to middle, 3 = up to final; 0 = exact entered species. Use the desired final species to pin its branch (e.g. Vaporeon). A base/intermediate entry follows its first registered branch. Natural evolution level requirements are respected. NPCs can prepare special evolutions between visits: defaults require level 20 for the first special evolution, 35 for a second, and 10 for friendship. This does not change player evolution rules.
- **AG · Roster offset:** zero-based start slot. Selection takes the requested number of consecutive roster entries and wraps around. Edit the offset per band to choose who returns at each reputation level. Stable selection prevents free rerolling on page refresh.
- Reputation bounds are inclusive; blank Max means unlimited. Do not overlap ranges for the same ID. Disable rows instead of deleting an identity.

Defaults use team sizes **1, 2, 3, 4, 5, 6, 6, 6**, levels **8, 18, 28, 38, 48, 58, 68, 78**, and stage caps **1, 1, 2, 2, 3, 3, 3, 3**. Existing species choices were combined into consistent family rosters of up to ten members. For example, at 400 reputation a trainer selects two base forms; at 2000 it selects six higher-level members evolved as far as their levels allow. Eight defence identities unlock progressively at the eight rank thresholds.

AI is game-owned: Rookie below 500 reputation, Journeyman 500–1249, Ace 1250+. Natural moves must be level-legal; compatible TM/HM coverage unlocks at each Pokémon's level 25. Gym defence alone restricts player type/count and changes reputation. Gallery matches allow any active party Pokémon and award coins only.

## Updates and safety

Settings → Live trainer teams → Sync now checks changes; otherwise checks run every 60 seconds while the game is visible. Google may briefly cache CSV exports. Keep Anyone with the link → Viewer enabled. The free static game reads public configuration without credentials; it never uploads saves. Edit this live sheet for automatic updates; a downloaded Excel file is only a copy.

`trainer-feed.js` accepts both legacy 18-column teams and the new 33-column roster schema. It validates all rows atomically, rejects malformed/overlapping/incomplete data and keeps the last-good local cache or `trainer-teams-data.js` fallback. `trainer-roster.js` selects actual teams. Previously accepted challengers and active battles retain their saved teams/levels; sheet changes affect new matches only. No player UID, progress, saved reputation or artwork is regenerated.

`node scripts/export-trainer-sheet.mjs` exports the bundled roster backup as Excel-compatible CSV. Passing a public CSV path validates and exports it. A future backend can replace the read adapter while preserving battle snapshots and collection storage.

## Shared participation (v0.75)

All257 trainer identities are shared across both contexts. Leaders/Admins unlock at750 reputation, villain Bosses1250, Elite Four and special guests1750, Champions2250. These minimum role gates apply alongside sheet Min/Max/Enabled and cannot be bypassed by a stale cache. Rows below a role's gate are disabled in the sheet. Gallery building-level room restrictions still apply; the eight original challenger profiles can appear among regular visitors. Defence retains Gym type/count restrictions and reputation gain/loss; Gallery battles retain unrestricted party and zero reputation changes.
