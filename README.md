# Greenwood — Pokémon browser RPG

A playable frontend fan prototype with exploration, battles, catching, individual Pokémon, party management, a living Pokédex, a clue-based Dratini hunt, AI arena and mock market.

This is an independent repository. Its releases do not deploy or change Wayfarer’s Lantern.

## Play

Intended GitHub Pages address after publishing is enabled: https://lllusivecoat.github.io/Pkmngame/

For local use, run `npm start`, then visit http://localhost:4173. No dependency installation is needed. Run `npm test` to execute the 62 automated checks.

The static website is at the repository root: index.html, app.js, core.js, battle.js, data.js, artwork.js, visuals.js, style.css, polish.css and assets/. Tests are in tests/.

## Saves

Progress is saved in the browser under `greenwood.save.v2`. Settings provides JSON export/import and a confirmed reset. Earlier Greenwood versions used the same save key on this GitHub Pages origin, so existing progress remains available in the same browser/profile. Wayfarer’s Lantern uses separate save data and is not modified.

## Artwork and scope

Generated forest backgrounds are bundled locally. Full-body Pokémon sprites load from the public PokeAPI sprite repository; an offline symbol fallback is retained. This is a fan prototype, not an official product. Guild networking and multiplayer trading/PvP remain previews. All four connected zones are playable.

33 automated checks cover progression, capture, combat, party, market, save migrations, navigation bindings and map/hunt consistency. A real-browser visual check remains outstanding.

## v0.5 — modern animated Pokémon

Default artwork uses the newest available full-body animated assets for each species from PokeAPI's Champions, Legends: Z-A, Scarlet/Violet and Sword/Shield sets. `modern-sources.js` records verified front/back and Shiny availability. Caterpie uses Sword/Shield because no newer asset exists in these sets. Pokémon HOME stills and official artwork are fallbacks.

Battle feedback includes initiative-ordered attack lunges, target recoil and brief flashes, plus a thrown capture orb. Controls are locked during the short feedback interval, and final blows animate before the result screen. Old saves keep their progression and upgrade their artwork choice. Settings provides Modern animated / HOME still artwork and a motion toggle. Device reduced-motion preferences force still assets and disable movement effects.

Assets load from https://github.com/PokeAPI/sprites and are lazy-loaded/reused by the browser cache. No paid service was added. These are available game-render animations rather than custom 3D models recreated by this project. 33 automated checks pass; real-browser visual QA remains outstanding in this environment.

## v0.6 — Daylight and Moonlight

The top bar, starter dialog, battle header and Settings offer Daylight, Moonlight and Follow device. Follow device is the default and updates when the operating-system preference changes. Preference is stored independently under `greenwood.theme.v1`; resetting/importing gameplay does not change appearance. Theme switching changes root CSS tokens without re-rendering the game, remounting sprites, changing battle turns, or modifying weather/time/hunt conditions.

Daylight uses pale sage/ivory backgrounds, neutral white surfaces, charcoal text and forest-green actions. Moonlight uses navy-charcoal backgrounds, slate panels, ivory text and mint actions. Pokémon and world artwork retain their colours. Gold is reserved for rare discoveries; elemental labels use palette-specific legible colours. Smaller text and controls were enlarged, with a roomier mobile dashboard party layout. `theme.js` owns preference/device handling; `theme.css` owns presentation tokens and component styles. A small early script applies the initial mode before styles load.

33 automated checks pass, including normal-text contrast for both palette token sets, saved preference/reload, device changes, blocked storage, first-paint selection, controls across main screens, and switching during an active encounter without altering gameplay. Tested body, secondary, action and status text token pairs meet 4.5:1; focus colour pairs meet 3:1. These automated checks do not constitute full rendered-page accessibility certification. Visual browser QA remains outstanding because the managed browser entrypoint is unavailable. No paid service or Wayfarer’s Lantern files were changed.

## v0.7 — Pokémon-themed controls

Primary actions now use bold red capsule buttons with a Poké Ball detail and raised press states. Secondary controls have trainer-device edges; navigation uses lightweight inline SVG icons; battle buttons include type glyphs and subtle type colour; region tabs have elemental rails; and movement controls use a tactile gamepad presentation. Disabled/focus/selected states remain explicit, with reduced-motion support and responsive labels.

The catching tools are displayed as Poké Ball, Great Ball and Ultra Ball, with matching illustrations. Their inventory keys, prices, quantities and capture bonuses remain unchanged, so existing saves keep the same stock and odds. `button-art.js` owns the decorative icons and `buttons.css` owns the component styling. No paid assets or dependencies were added. The existing 33 automated checks pass, including the red action-text palette and updated UI bindings; real-browser visual QA remains outstanding.

### Trainer presentation (v0.8)
The original chibi explorer uses a local transparent four-direction sprite atlas at `assets/trainer-atlas.webp`. `trainer.css` selects idle/walking frames; `visuals.js` renders it with an SVG fallback. Legal moves save the facing direction, while old saves default to facing forward. Movement respects both the in-game motion toggle and device reduced-motion preference. No remote trainer image service is required.

The connected region system is now implemented in v0.9 (below), retaining separate map definitions and rendering only the active area.

Normal-colour front-facing still fallbacks now use local chibi artwork in `assets/chibi/`. Animated sources remain first choice; rear views retain their existing sources. Each SVG contains its own static atlas image, so it works without remote image dependencies.

### Matching Shiny chibi art
All 18 species have individually recoloured stills in `assets/chibi/shiny/`, using the same chibi silhouettes as their normal counterparts. `palettes.json` records material choices and Shiny reference URLs. The optional offline Pillow tool `scripts/build-shiny-art.py` rebuilds the art from the existing atlas; it checks unchanged alpha for every pixel. Production remains dependency-free. Body, wool, gas, shell, markings, flame and other materials are treated separately, preserving shading rather than applying one universal hue rotation.

These are stylised palette adaptations checked against canonical Shiny references, not exact pixel copies of official artwork. Animated sprites remain animated; reduced-motion and still-art modes use the matching chibi Shiny assets. Existing saves and collection variants need no migration.

## v0.9 — Connected exploration and local gyms

Greenwood, Thunder Ridge, Ashlands and Frostfall each have a separate 10×10 map (up from 8×8), camp, two discoverable landmarks, distinct encounter pool/level range, terrain palette and local gym.

Walk to the eastern/northeastern route gate at (9, 1) to discover and unlock the next zone. Use the gate action to cross. Reverse gates at (0, 8) allow return journeys. Unlocking depends on physically finding the gate, not trainer level or a menu shortcut. The trail guide gives coordinates; discovered routes and locations persist. Only the active map is rendered.

Gyms at (7, 7) have three-opponent AI teams: Rowan (Grass, Canopy Badge), Lyra (Electric, Tempest Badge), Flint (Fire, Cinder Badge) and Sera (Water, Glacier Badge). Reach the gym to challenge the leader. Captures are disabled, party health is restored at the start, first victories grant a badge and 400 coins/100 XP bonus, and rematches cannot duplicate the bonus. Gym wins do not alter arena rank. Gyms are optional side challenges; traversal unlocks new zones.

`world.js` owns map definitions, exits, arrival tiles, gym rosters, landmarks, travel validation and discovery. `core.js` uses the active map for movement, encounters, hunting and save migration. `battle.js` owns gym challenges and rewards. `visuals.js` caches zone SVG terrain; `world.css` handles responsive map markers and the route journal. The save adds region, unlocked zones, discovered locations, visited tiles and badges under the existing key; older collections and progression are retained. Dratini clues remain in Greenwood. Camps restore energy in every zone.

41 automated checks cover reachable routes/landmarks/gyms, bidirectional travel through all zones, anti-teleport validation, full gym victories and one-time rewards, capture prevention, old saves, current-zone collisions and encounters, map rendering and UI interaction from walking to a gate through a gym challenge. Real-browser visual QA remains outstanding in this environment.

## v0.10 — Six partners and an overworld companion

Party capacity is six (`PARTY_LIMIT` in core.js), including automatic catch placement, manual adds/removals, save imports, battle HP/energy and swaps. Profile showcases still hold three. Existing party order and saves are preserved. Party controls wrap on desktop and mobile.

The first party member follows on the previous walkable map tile; travel and camp defeat safely reset its position. It uses the matching normal/Shiny chibi artwork, an offline elemental fallback, a movement hop and reduced-motion support. Creature details provide “Make lead & follower” for party members; promoting a member also makes it the starting battler. No new creatures are added to old saves automatically.

Motion-off, device reduced-motion and still-art battle modes now use chibi art for the player's side as well as the opponent. Both sides share the available front-facing chibi pose; animated mode retains its rear-view animation.

45 automated checks pass, including six-party save/order/battle state, follower terrain and travel handling, lead promotion, Shiny follower art, and the motion-off battle UI regression. Real-browser visual QA remains outstanding.

## v0.11 — Official stats and species moves

All 18 species now use their official six base stats and complete dual types. Individual battle stats use the Generation IX level formula with fixed IVs of 31, EVs of 0 and official nature modifiers. Historical Curious temperaments remain neutral; variants, size, traits and mastery do not increase stats. Level increases now change actual HP, Attack, Defence, Special Attack, Special Defence and Speed.

`combat-data.json` and `type-chart.json` are offline PokeAPI snapshots; `combat-sources.json` records provenance and assumptions. `scripts/build-combat-data.py` (Python standard library) generates the dependency-free `combat-data.js` bundle. Runtime does not call an API. Scarlet/Violet level-up learnsets are used for 16 species. Pidgey and Caterpie are unavailable in those games and use their Brilliant Diamond/Shining Pearl learnsets.

The reference catalog contains 168 moves. 144 are selectable where species and level allow; 24 with complex pending mechanics are explicitly marked unavailable in the full learnset view. Equipped moves are individual save fields; Details lets you choose up to four unique learned moves. New level-up moves become selectable rather than replacing a favourite move silently. Some early Pokémon naturally know fewer than four moves.

`rules.js` owns stat/nature calculations, legal move selection, full 18-type effectiveness, damage, STAB, critical hits, random damage rolls and stage modifiers. Physical attacks use Attack/Defence; special attacks use Special Attack/Special Defence. Damage modifiers are rounded in order. `battle.js` tracks PP per Pokémon across trainer-team rounds, priorities, Speed ties, accuracy/evasion, stat stages, major statuses, confusion, residual damage, draining/recoil, multi-hit attacks, protecting/enduring, binding, Leech Seed, Disable/Spite, Rain Dance and supported field effects. AI selects from its own legal moves. PP replaces the old shared four-move/energy/Brace system; exploration Energy remains separate. No usable PP triggers Struggle and recoil. Party health and PP refresh at the beginning of each encounter/challenge. Potions restore 20 HP.

Wild encounters keep each zone's level ranges; gym teams use their configured levels, which now affect their actual stats. Arena opponents scale to average party level (capped for the prototype). Six-member parties, followers, discovery-based region unlocks and badges remain intact. Older saves receive legal moves at their existing level while preserving individual IDs, Shiny variants, levels, collection and party order.

This is the agreed core-stat/move upgrade, not full cartridge parity. Ability effects, held items, EV training/IV variation, evolution, TM/egg learning and the 24 deferred move effects are future work. Deferred effects are never replaced silently by a generic attack. Capture probability and progression rewards remain prototype rules. Overworld weather influences encounters; combat weather is set separately by supported moves.

61 automated checks pass. New checks validate reference species data, known stat/damage examples, physical/special defence, modifier rounding, dual-type immunities, critical hits, nature, legal moves, level-up availability, PP/misses/Struggle, priority/paralysis, stages/status immunities, draining/seeding, Protect, side-condition persistence, old-save migration and the move-editor/battle UI. Existing exploration-to-capture, gyms, six-party, followers, themes and artwork checks also pass. Real-browser visual QA remains outstanding.

Battle health panels now occupy a dedicated two-column row outside the battlefield scene. HP, levels, status and PP remain visible without covering either sprite, including on mobile. Pokémon abilities remain descriptive only; their effects are not active yet.

Battle presentation uses a teal player panel and a warm coral opponent panel, with mirrored corner shapes, edge accents and HP bars. The battlefield reserves smaller, separate sprite areas and more space between opponents, with responsive size caps. These are visual changes only.

### Battlefield presentation references
The battle screen now places the opponent HUD above-right and the player HUD below-left, with a grouped move command menu and type-effectiveness hints. The wide scene keeps compact sprites, contact shadows and an open centre; mobile stacks the command area. Health panels stay outside the sprite scene. References and adaptation notes are documented in [docs/battlefield-reference.md](docs/battlefield-reference.md). This is a 2D visual refinement; battle rules and saves are unchanged.

### Stylised biome battle backgrounds
The detailed landscape has been replaced in battles by an original cel-shaded environment atlas (`assets/battle-biomes.webp`, approximately 55 KB). Each zone displays one quadrant: Greenwood woodland, Thunder Ridge rocks, Ashlands terracotta, or Frostfall snow. Broad shapes, quiet ground colours and integrated contact patches suit both chibi stills and animated game models. Sprite sizes remain compact. Background selection follows the active zone and is independent of interface appearance; no remote background service is needed. The homepage artwork is unchanged.

Asset refresh / dialog fix: the HTML now versions the app entry, theme/combat CSS and biome atlas URL so browsers request the updated battle presentation. Detail and field-note dialogs use a dedicated sticky toolbar with a 44px close target above decorative artwork; closing also stops event propagation. No save reset is required. The 62 automated checks include both close paths.
