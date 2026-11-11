# Greenwood — Pokémon browser RPG

A playable frontend fan prototype with exploration, battles, catching, individual Pokémon, party management, a living Pokédex, a clue-based Dratini hunt, AI arena and mock market.

This is an independent repository. Its releases do not deploy or change Wayfarer’s Lantern.

## Play

Play online: https://lllusivecoat.github.io/Pkmngame/

For local use (Node 22+), run `npm ci`, `npm run build`, then `npm start` and visit http://localhost:4173. Run `npm test` for the 105 automated checks. The pinned MIT battle engine is bundled locally at build time; playing does not call a battle server. GitHub Actions builds and deploys only the staged static site, with no paid hosting or backend.

The static website is at the repository root: index.html, app.js, core.js, battle.js, data.js, artwork.js, visuals.js, style.css, polish.css and assets/. Tests are in tests/.

## Saves

Progress is saved in the browser under `greenwood.save.v2`. Settings provides JSON export/import and a confirmed reset. Earlier Greenwood versions used the same save key on this GitHub Pages origin, so existing progress remains available in the same browser/profile. Wayfarer’s Lantern uses separate save data and is not modified.

## Artwork and scope

Generated forest backgrounds are bundled locally. Full-body Pokémon sprites load from the public PokeAPI sprite repository; an offline symbol fallback is retained. This is a fan prototype, not an official product. Guild networking and multiplayer trading/PvP remain previews. All four connected zones are playable.

Current verification: 92 automated checks cover gameplay, saves, UI, item mechanics and simulator integration. Chromium checks also cover desktop/mobile navigation, the bag, held items, battle controls and modal closing. Historical release notes below describe verification at the time of those releases.

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

## v0.12 — Items, abilities and evolution

The Bag and Market now expose 992 item records: 39 balls, 108 medicine, 36 battle items, 457 held items, 40 evolution items, 83 berries and 229 Scarlet/Violet TMs. Buy, heal, revive, restore PP, train EVs, use mints or Ability Capsule/Patch, equip held items and teach compatible moves. All 317 official ability records have searchable explanations. Live combat uses the Pokémon Showdown simulator through the MIT `@pkmn/sim` package, handling ability interactions, held items, move effects, immunities and battle conditions.

The roster includes 53 species across the original species' evolution families. Evolution preserves the individual, variant, moves and legal ability slot. Level/friendship evolutions appear in Pokémon details; stones and a prototype Linking Cord work through the Bag. Party HP, status, PP, friendship, EVs, learned TMs and equipment persist. Pokémon Centers restore the party.

This is a Generation 9 battle prototype with selected legacy mechanics supported by the engine. Historical mode-specific items remain visible with explicit restrictions (for example Hisui throwing tools and Wonder Launcher supplies). Species-specific items need their compatible species; field/fishing/underwater conditions only apply when that context exists. A searchable catalogue is not a claim that every retired game mode is implemented. See [mechanics and source notes](docs/items-abilities.md).

### Structure and future server migration

- `items-data.js`, `ability-data.js`, `moves-data.js`, `species-data.js`: checked-in, versioned data snapshots.
- `items.js`, `progression.js`, `capture.js`: inventory, growth, evolution and capture rules.
- `sim-adapter.js`, `battle.js`: serialized battle engine and game-level rewards/actions.
- `core.js`, `world.js`: save migration, exploration, encounter tables and region unlocks.
- `inventory-ui.js`, `app.js`: UI and interaction bindings.
- `scripts/build-engine.mjs`, `scripts/stage-site.mjs`: reproducible bundle and static release output.

A future backend can retain the data modules and action contracts, move battle simulation/encounter RNG/rewards to a trusted server, and replace localStorage reads/writes with authenticated repository calls. Real player trades, guilds, multiplayer PvP, server events, professions, breeding, raids, world bosses and new regions remain future systems. Export your save in Settings before moving browsers or devices.

## v0.13 — Trainers and Pokémon Centers

Each of the four regions now has two optional trainers with distinct local chibi SVG sprites, dialogue and two-Pokémon teams. Reach their tile and choose Challenge; first victories add a one-time bonus and persist, and rematches do not affect Arena rating. Gym Leaders also appear with a local trainer portrait. `world.js` defines trainer positions, teams and dialogue; `scripts/build-world-art.py` regenerates the original local trainer and building art.

Each map has a red-roof Pokémon Center at (2, 3), replacing the old camp. Arriving heals party HP, status and PP for free; a Heal my party button is available there too. Defeats return the player to the local Center. Equipment and consumable stock are preserved by healing.

Travel energy, energy recovery, energy controls and campfire artwork have been removed. Walking is unlimited. Existing saves drop the retired energy fields and migrate discovered camp locations to Centers without resetting progress. 92 automated checks cover the current release, including trainer rewards/rematches, map reachability, healing and save migration.

## v0.14 — Your trainer, your style

Open **Profile → Customise trainer** or **Settings → Customise trainer**. Six male/female presets offer Explorer, Ranger and Academy Traveller outfits. Choose from six skin tones, six hair colours, six outfit colours, three hairstyles and cap/beanie/no-headwear options. A live preview shows all four directions; custom avatars also animate their limbs when walking, respecting motion and reduced-motion preferences.

Change the trainer name (up to 20 characters), preview freely, then Save. Cancel, the close button, backdrop or Escape discard unsaved changes. Appearance is cosmetic and free. Profile, map, sidebar, guild preview and rankings use the saved identity. Simulator victory checks use the player's actual battle identity, including when a player shares an NPC's name.

`trainer-customization.js` contains the original layered SVG art, palette IDs, presets and validation. `trainer-editor.js` renders the editor; `trainer.css` handles layout and walking. These avatars require no downloaded assets or paid service. Saves retain the existing key and progression, adding a validated `trainer` appearance object; old saves get a default look. Export/import includes appearance and name. 92 automated checks and Chromium desktop/mobile flows cover this release.

## v0.14.1 — Classic detailed trainer design

The original male explorer atlas is restored, alongside a matching detailed female atlas generated from that design. Both retain the cap, orange scarf, vest, backpack and boots in four facing directions and idle/walking frames. The same editor supports trainer name, gender, six skin tones, six hair colours and six outfit colours. Six quick presets combine male/female with Woodland, Coastal and Twilight palettes. Individual hairstyle/headwear controls from the geometric avatar renderer are replaced by the fixed classic explorer silhouette. Existing names, colour choices and progress are retained.

`trainer-customization.js` clips each atlas cell and applies local material colour masks, preserving the source shading and leaving the default male sprite unaltered. `assets/trainer-atlas.webp` remains the original male art; `assets/trainer-female-atlas.webp` is the matching female art. No external avatar service or paid hosting is required.

## v0.15 — The league, evolution families and battle forms

The original detailed explorer art is now the common trainer style. Eight route trainers, all four local Gym Leaders, the Arena opponent and future default NPC portraits use `trainer-portraits.js` and the matching local atlas. Home has a five-leader gallery: Rowan is Greenwood’s original female Grass leader, and Brock visits Thunder Ridge at (6, 8). Brock has a playable Geodude/Onix/Golem challenge and a separate, persistent Boulder Badge. He does not replace Lyra or award her badge.

The permanent roster now contains **64 species**, including Pichu, Onix/Steelix and the Alolan/Hisuian branches of the existing families. Added roots appear in regional encounter pools; their available level, stone, friendship and trade evolutions use the existing individual-preserving evolution system. Steelix requires a held Metal Coat and Linking Cord. Alolan Raichu can be encountered as a regional visitor; its separate Alolan evolution location is not a full playable region.

The **19 temporary battle forms** comprise 11 Mega forms and eight Gigantamax forms. Mega Evolution uses the species’ own held stone. For Gigantamax, use Max Soup on a compatible individual, remove a held Mega Stone, and choose **Settings → Battle format → Gigantamax (Generation 8)**. Dynamax Candy increases Dynamax level, up to 10; battle HP scales with that level. Gigantamax lasts three turns. Pikachu/Eevee with the Gigantamax factor must have it removed with Max Soup before ordinary evolution. Transformations do not replace the saved species or create a new collection individual.

Open **Pokédex → Evolution & battle-form library** to compare normal and chibi artwork, or select an evolution line. The original painted chibi sprites are retained; two new local atlases cover evolved/regional species. Onix and 17 special forms use clearly labelled official pixel chibi sprites; painted Gigantamax Lapras and Mega Steelix are included. Normal form artwork uses the correct PokeAPI form number. The image service rejected the separate painted Mega/Gigantamax sheet, so the game uses correct canonical pixel sprites rather than mislabelling base art. New Shiny forms use canonical Shiny game artwork.

`additional-species.js` stores the expansion snapshot and form registry, sourced from the pinned simulator and PokeAPI species/evolution/stat CSV. `forms.js` separates battle forms from permanent species. `chibi-sources.js` and `chibi-art.js` map local atlas cells; `assets/form-icons/` contains the canonical pixel sprites from PokeAPI/sprites. All current forms have normal and chibi routes.

100 automated checks cover the current release, including every Mega/Gigantamax activation, reversion, regional evolution requirements and Brock’s rewards. GitHub Actions additionally runs Chromium gameplay checks before deployment, including desktop/mobile, the leader gallery, actual form artwork, and Brock’s badge/save flow. Its pinned Playwright driver is installed only for CI; build dependencies and screenshots are excluded from the static site. Public GitHub Pages/Actions remain the free hosting path. Release-tagged module imports prevent cached modules from mixing releases.

## v0.16 — Developer artwork gallery and resource reset

**Settings → Developer tools → Pokémon artwork gallery** lists every one of the 83 current entries (64 species/evolutions and 19 temporary forms), independently of collection unlocks or the artwork visibility setting. Search by name, filter species/Mega/Gigantamax, choose Normal/Shiny, and page through side-by-side normal and chibi artwork. Painted/pixel sources are identified. Normal and expanded Shiny artwork requires internet access; local painted chibi atlases and form icons remain available offline.

**Reset all items & gold** asks for confirmation, then sets coins to zero, empties the bag, removes every held item and synchronizes the legacy ball/potion counters. It preserves Pokémon, individual training, party order, mastery, appearance, badges, quests, purchased creatures and exploration. Inventory migration does not refill a cleared bag. The separate **Reset entire save** retains its own confirmation.

103 automated checks plus the CI Chromium flow cover gallery coverage/filtering and the reset’s cancel/confirm/save-reload behavior. `developer-tools.js` owns the pure resource reset and gallery catalogue. No backend or paid hosting was added.

## v0.16.1 — Complete, locally hosted gallery

The developer gallery now opens with **all 83 entries** visible and cleared filters, with optional 12/24-entry pagination, navigation at both ends, and a Show all artwork button. The Pokédex also links directly to the complete gallery. Search accepts name/form words in either order.

Normal and Shiny full-body artwork for all 83 entries, plus 65 Shiny pixel-chibi sources, are now bundled under `assets/artwork/`. The 18 existing painted Shiny sprites and generated chibi atlases are retained. All artwork therefore loads from the same host as the game rather than depending on the external image host. Static WebP encoding reduces the new assets from about 22.5 MB of source PNGs to 3.7 MB, preserving transparency. Missing images are labelled explicitly instead of silently disappearing.

104 automated checks include file/format coverage for every entry and variant. The Chromium gate blocks the external image host, loads every gallery image in Normal and Shiny modes, checks the full normal/chibi counts, tests mobile layout and visits the final entry. This fixes gallery visibility/loading; it does not introduce the replacement final-evolution drawings that were rejected by the image service. Source notes: [artwork assets](docs/artwork-assets.md).

## v0.16.2 — Painted Mega Venusaur and Mega Blastoise

The two successful generated transparent sprites now replace the pixel chibi previews for normal-colour Mega Venusaur and Mega Blastoise. Both are integrated into the developer gallery, form library and chibi-mode battles. The standard artwork remains available beside them. Shiny variants retain their correct canonical pixel art; no ordinary-colour sprite is relabelled as Shiny.

The painted renderer supports one-cell standalone assets as well as the existing 6×4 atlases. Source PNGs were encoded as transparent 512×512 WebP files under `assets/chibi-painted/`. Labels are derived from the actual registered artwork. 105 automated checks plus the Chromium gallery checks verify the new source mappings and previews. The other blocked Mega generations and the backgrounded Charizard uploads have not been replaced.

## v0.17 — Installable Greenwood app

Open https://lllusivecoat.github.io/Pkmngame/ in your usual browser, then choose **Settings → Install Greenwood**. On Android use Chrome’s Install app menu; on iPhone/iPad use Safari → Share → Add to Home Screen. Desktop Chrome/Edge also provide an install icon. This is a free progressive web app, not an App Store download, and launches independently of ChatGPT.

Wait until Settings says “Offline game files are ready” before disconnecting. The service worker caches the complete static game and artwork. Existing saves stay in `greenwood.save.v2`. Saves are specific to the browser/device: export your save before switching and import it if the installed app starts fresh. There is no automatic cloud sync. Updates wait for **Update & restart**, which is guarded during battles; only this game’s scoped caches are managed. Wayfarer’s Lantern is untouched.

`pwa.js` manages install/update UI, `manifest.webmanifest` defines the app, and `sw.js` provides scoped offline caching. `scripts/build-precache.mjs` generates a content-hashed asset list during staging; no paid service or backend is required.

New successful painted Mega Raichu X and Mega Steelix sprites are integrated in the gallery, form library and chibi battles. Shiny art remains unchanged. Other sequential image attempts were blocked and retain their previous form-specific art. 113 automated checks cover the release; CI additionally verifies real Chromium gameplay and offline launch, movement, artwork and saved progress before deployment.

## Mega Charizard artwork correction

Both normal-colour Mega Charizard X/Y now use the supplied painted chibi artwork in the gallery, form library and chibi battles. X has a successfully generated transparent background. Y retains the supplied white background because the image service blocked its background-removal request. Shiny form sprites remain their correct separate canonical art. Both WebP files are bundled for offline play; the release tag is `20261109-char8`.

## Additional painted Mega sprites

Sequential retries produced transparent painted Mega Pidgeot and Mega Gengar. Both are registered for the developer gallery, form library and chibi battles, bundled for offline play. Their separate Shiny art is preserved. Mega Ampharos, Mega Raichu Y and Mega Dragonite requests were blocked; their existing form-specific art remains. Release tag: `20261109-mega9`.

Mega Gengar anatomy correction: replaced the initial legged drawing with the corrected legless painted sprite, `assets/chibi-painted/mega-gengar-corrected.webp`. Release tag `20261109-gengar10` refreshes installed/offline artwork too.

Painted Gigantamax Venusaur, Charizard, Blastoise, Butterfree and Eevee now use standalone transparent assets in the gallery, form library and chibi battles. Butterfree’s surrounding glow was removed using standard image editing. Shiny artwork and transformation rules are unchanged. Dragonite’s rejected anatomy edit was not integrated; Raichu Y, Gigantamax Pikachu and Gengar requests were blocked. Release tag: `20261110-gmax17`.

## v0.18 — Visible companion mastery

Open **Creatures → choose a Pokémon → Companion mastery**. Existing bond points and ranks are retained: Mastery I starts at 0 points; II/III/IV/V unlock at 3/6/9/12. A successful capture gives the active partner one point. Each defeated opponent credits the active partner once when the battle settles; that partner must still be healthy. Bench XP, walking and fleeing without a victory do not earn mastery. A three-opponent Arena match can therefore award three points.

Cards and details show progress, battle/capture results report gains and rank unlocks, and the Profile shows bond totals. Rewards are visible cosmetic unlocks: I bond badge, II selectable ribbon, III gold/silver portrait frame, IV gold/teal aura, V companion title. Pick rewards in the detail panel; None disables an effect. Aura and frames appear around artwork; ribbons and titles appear on collection/showcase cards. Effects are static and respect reduced-motion preferences. No battle stats, canonical moves, abilities or mastery earning rates were changed.

`mastery.js` defines thresholds, reward choices, validation and the detail panel. Cosmetic selections live on each individual as `bondStyle`; existing `mastery` remains the point counter. Both survive the current migration, evolution, party changes, export/import and local reload. Rendering validates choices against rank and an allowlist, including imported data. A backend can later store these fields on the individual creature record and award points authoritatively at battle settlement.

118 automated checks include real capture and Arena rewards, lock validation, max-rank progress and evolution/save persistence without stat effects. The CI Chromium gate checks mobile cosmetics, rank locks and save reload before Pages deployment.

## v0.19 — Living Pokédex research

Open **Pokédex → species → Species research**. Each species has five goals: identify it, own a specimen, observe three different wild individuals, observe two weather/time combinations, and defeat the species in a wild/trainer/Gym/Arena battle. Every task awards **75 coins and 25 trainer XP once**, claimed from that entry; completed goals and ready rewards are visible on the journal cards and overview. Battle/capture results and field encounters report research updates.

The first encounter reveals name, types and a silhouette. Ownership reveals description and habitat. Field observations in two combinations reveal activity and preferred weather; battle study reveals the species ability and evolution notes. Traits come from owned individuals; variants are recorded when encountered. Earlier saves keep habits learned after two catches and ability knowledge after three. Their historical sightings are credited toward the observer task without inventing weather observations or battle records. No save reset is required.

`journal.js` owns validated research data, goal evaluation, reward claims and the panel. `core.record` records discoveries and bounded wild-individual IDs/conditions, while battle settlement records species study once per defeated opponent. Re-recording a capture cannot create another wild sighting. Market purchases, starters and evolutions grant ownership knowledge without field sightings. Store species research on a future server-owned player/species record and issue rewards atomically from the same rules.

Save data remains `greenwood.save.v2`; research fields live under `dex[species].research` and include at most three sighting IDs, two conditions, battle-study flag, legacy sighting credit and claimed goal IDs. Migration preserves and validates these fields. The item/gold reset keeps claimed research rewards, preventing repeat claims.

124 automated checks cover captures, actual battle study, distinct observation conditions, duplicate prevention, legacy migration and persistent one-time rewards. Chromium additionally checks the mobile research panel, claim and reload persistence before publishing.

## v0.20 — Regional hunting trails

**Explore → Hunting journal** now tracks Dratini (Greenwood), Eevee (Thunder Ridge), Vulpix (Ashlands) or Lapras (Frostfall). Switch targets freely or pause tracking; all clues remain saved. The regional map marks three clue sites per trail. Walk onto them to uncover habitat, weather and activity hints and earn 30 trainer XP per new clue. A clue on a landmark is discovered on the same visit. Centers and special sites do not trigger encounters.

Each eligible movement step rolls the active hunt before the normal terrain table. Its dedicated probability is 0.2% in the correct region, 1% after learning and reaching the target habitat, 3% with the learned matching weather, and 8% with all three clues and matching time. Outside the target region it is zero. Ordinary terrain encounters are separate: species such as Eevee can also appear naturally, so the panel explicitly labels the dedicated hunt roll. Pausing removes only this dedicated roll. The existing Dratini probability and clues are retained.

Catch a wild tracked target in its region to complete that trail; all clues are helpful but not required. Claim **300 coins + 100 trainer XP** once per trail from Explore. Purchases, starters and evolutions do not complete hunts. Tracking can remain active after completion for further collection hunting.

`hunting.js` stores the trail catalogue, clue coordinates/text, knowledge gates, normalization and panel. `core.step` discovers clues and rolls encounters; wild captures mark completion. New state is `hunts.target`, bounded `hunts.notes`, `hunts.caught` and `hunts.claimed`. Old Dratini knowledge remains in `clues` as its canonical source. Migration keeps saves compatible; no reset is needed. A future backend can store notes/completions per player and award hunt claims transactionally. No multiplayer service or paid hosting is added.

131 automated checks verify reachability, conditions, actual target encounters and captures, one-time clue XP/rewards, pausing and legacy migration. CI Chromium tests regional clue markers, movement, tracking controls, mobile layout, completion claims and reload persistence before publication.

## v0.21 — Functional rotating world events

Home and Explore show an event panel with its exact effect, live countdown and next event. The local prototype rotates weather, time and events together every three minutes, retaining the original timestamp anchor across refresh/offline periods. Rotation announcements appear when it is safe to redraw the screen; a battle or detail dialog is not interrupted. Explore’s existing tester controls can set conditions manually and restart the interval.

- **Stormfront:** Electric/Water species gain 50% more selection weight after a normal terrain encounter triggers.
- **Moonlit gathering:** Murkrow temporarily joins every regional table, including Thunder Ridge and Ashlands where it is ordinarily absent. Gastly and Murkrow receive double selection weight. Owned visitors remain yours after the event.
- **Regional swarm:** Caterpie in Greenwood, Mareep in Thunder Ridge, Geodude in Ashlands or Psyduck in Frostfall receives triple weight.
- **Wayfarer survey:** Valid movement earns 5 trainer XP instead of 3. Dedicated hunting rolls are multiplied by 1.25, with the fully learned matching hunt increasing from 8% to 10%. Wrong-region hunt rolls remain zero.

These are encounter selection weights, not guarantees or battle-stat bonuses. Existing weather, time and terrain modifiers still apply. No extra creature variants or authentication/backend services were added.

`world-events.js` centralizes definitions, regional swarms, visitors, multipliers and countdown calculation; `data.js` re-exports the event catalogue. `core.encounterPool`, movement and `hunting.js` consume the actual effect functions. The save remains version 3 under `greenwood.save.v2`, using the existing `event` and `worldAt` fields. A server can later replace that local schedule with an authoritative event and expiry timestamp.

138 automated checks cover exact weight ratios, visitor expiry, each regional swarm, actual movement XP, hunt bonuses, rotation drift and save continuity. CI Chromium checks the countdown, manual conditions, survey XP/hunt boost, mobile layout and reload before deployment.

## v0.22 — Local Arena ladder and milestone rewards

**Arena → Find AI ladder match** starts a three-opponent battle with a restored party. A full victory earns **+24 local rating and 200 bonus coins**; a defeat loses **16 rating**, floored at zero, and returns your party safely to its regional Center. Existing round coins, experience, research and mastery remain in place. Leaving a match has no penalty and is not recorded as a completed match in this prototype.

**Unrated practice** uses the same battle engine but awards no ladder rating/win or full-match bonus. Normal round rewards still apply. All opponents are local AI; the comparison rankings are clearly labelled fictional. Four opponent teams rotate with completed victories, and their levels follow the party average, capped at 35. The current Season of Storms is a persistent demo season with no automatic reset or real-player matchmaking.

Rank labels and progress are derived from saved rating, from Bronze through Silver/Gold to Platinum/Diamond. The starting 1,284 remains Silver III; Silver II begins at 1,350. The Profile uses the same rank calculation. Peak rating, win streak, ladder losses and the last 20 completed matches are saved. A completed match ID cannot settle again while present in the recent ledger. Gym and route-trainer battles never change ladder stats.

**Arena → Rewards** grants actual coins and Bag items once per milestone: first victory, three victories, five victories, Silver contender and Gold contender. Rank milestones use peak rating and require at least one ladder victory. Claimed IDs survive losses, evolution, save reload and the item/gold reset, preventing repeat claims. Existing rating and win counts migrate without a reset; no fictional losses or history are added.

`arena.js` provides rank thresholds, AI team plans, normalization, settlement, reward eligibility and UI. `battle.js` settles only completed pure Arena matches; `core.claimArenaReward` adds the awarded coins/items. State lives under `arena` alongside the original `rating` and `arenaWins`. A future backend should own matchmaking, rating/season records and atomic battle/reward settlement. This remains free static hosting.

146 automated checks include actual ladder wins/losses, promotion, rating floor, unrated rewards, Gym/trainer guards, reward Bag contents, duplicate settlement and legacy migration. Chromium additionally completes a ladder match, verifies promotion/history, claims a reward, checks persisted state, views rankings, withdraws from practice and tests mobile layout before publishing.

## v0.23 — Playable Wayfarers expeditions

**Guild** now contains three linked local expeditions: The Ruined Observatory, Stormwatch Spire and The Frozen Sanctuary. Earn expedition points through play: **+1 per valid movement step, +5 per defeated opponent and +8 per wild capture**. Points are separate from coins and Bag items. Blocked movement, starters, purchases and evolutions award none. Capture deduplication and the existing defeated-opponent reward ledger prevent repeated credit for the same action.

Contribute 10, 25 or all available points. Only the amount still needed is spent; surplus remains banked (up to 9,999 points). Starting expedition progress is explicitly simulated: 68/100, 80/160 and 100/240. Your own contribution is shown separately. Claiming a completed expedition’s reward unlocks the next expedition. Each reward is issued once, with actual coins, trainer XP and Bag items: Observatory 500 coins/100 XP/5 Ultra Balls; Spire 800 coins/150 XP/1 Ability Capsule; Sanctuary 1,500 coins/200 XP/1 Bottle Cap. Completed expeditions remain viewable and future earned points remain saved.

Guild level starts at 12 and increases per 100 lifetime contributed points; it grants no battle-stat multiplier. The Profile shows expedition completion and contribution totals. The player plus seven fictional members are clearly labelled; no real guild networking or other-player activity is connected.

`guild.js` owns campaign definitions, validation, point earning, contribution, reward eligibility and the view. Saved `guild` data includes banked points, expedition progress, claimed rewards, active expedition and weekly contributions. Lifetime contribution is derived from actual progress beyond the simulated seeds. Weekly contribution resets at Monday 00:00 **Singapore time**; expedition progress, banked points and claimed rewards do not reset. Legacy saves begin the new playable campaign without changing Pokémon, rating, party or exploration. The item/gold reset does not reset expedition points/progress or claimed rewards.

A future backend can replace the fictional roster, own weekly timestamps and validate point earning/contributions/claims atomically. Static hosting remains free. 154 automated checks cover actual earning, contribution bounds, full campaign completion, reward persistence and weekly boundaries. The Chromium gate checks mobile contribution, surplus, campaign unlocks, Bag/coin rewards, reload, duplicate-claim prevention and Profile visibility before deployment.

## v0.24 — Adventure quest board

Open **Home → Quest board**, the quest panel on Explore, or **Profile → Open quest board**. Fourteen permanent one-time quests connect exploration, collection, research, hunting, region discovery, Gym badges, mastery, Arena victories and Guild expeditions. Existing achievements count retrospectively; no progress reset is needed. Follow-up quests unlock after their prerequisite rewards are claimed, but progress toward them is counted beforehand.

Each card shows progress, prerequisites, coin/trainer-XP/Bag-item rewards and a direct shortcut to the relevant system. Filter All, In progress, Ready or Claimed. Pin one eligible quest to keep it visible on Home and Explore; the pin survives reload and clears when claimed. With no explicit pin, the panel recommends a ready reward or the next available goal. Newly ready quests are announced when progression is saved. These are not daily quests and never expire.

The original three-species **A curious beginning** quest retains its 150-coin/100-XP reward. Its legacy `claimedQuest` flag and the new claim ledger are synchronized, so neither the old API nor the board can award it twice. Starters, purchases and evolutions count toward species-ownership goals; research goals require claimed research rewards, Arena goals require ladder wins, and Guild goals use actual player contributions beyond the simulated starting progress.

`quests.js` defines the catalogue, metric adapters, prerequisites, claim/pin validation and panels. State is stored under `quests.claimed` and `quests.pinned` within the existing version-3 save. `core.claimAdventureQuest` applies validated rewards through the current Bag and trainer-XP systems. Claimed quests remain claimed after the item/gold reset; export/import and migration preserve them. A future backend should validate the same metric rules and award rewards atomically per player/quest.

162 automated checks cover catalogue validity, prerequisite gates, legacy synchronization, actual rewards, pin clearing/reload, metric sources, invalid imports and reset persistence. CI Chromium checks the complete board, Home pin, reward payout, follow-up unlock, filters, legacy flag, duplicate prevention and mobile layout before publishing.


## v0.25 — regional areas and habitat Pokémon
Each of the four regions now has five connected 10×10 areas (20 maps total). Its original settlement retains the single regional specialised Gym and Pokémon Center, existing trainers and region-to-region gates. Arrow gates at (9,8) and (0,1) connect the five areas in a bidirectional loop. Walking to a gate discovers the next area; entering requires using the gate on foot. No remote teleporting. Only the active map is rendered.

Greenwood: Village, Fernwood Canopy, Willow Brook, Observatory Woods, Moonlit Shore. Thunder Ridge: Ridgeway Outpost, Sparkgrass Meadow, Echo Crags, Stormbridge Pass, Thunderhead Summit. Ashlands: Emberfall Settlement, Cinder Caldera, Ember Springs, Obsidian Quarry, Ashen Ruins. Frostfall: Snowbell Village, Frostpine Forest, Mirrorfrost Lake, Aurora Glade, Glacier Sanctuary.

`world.js` holds the areas, maps, connections and habitat encounter tables. Added Ralts/Kirlia/Gardevoir/Gallade, Shinx/Luxio/Luxray, Numel/Camerupt and Snover/Abomasnow: 75 permanent species plus the existing 19 temporary forms. Four new base species are encountered in their corresponding new habitats. Canonical snapshots live in `habitat-species.js`, built from PokeAPI metadata and the pinned simulator. Gallade correctly requires a male Kirlia and Dawn Stone. Normal and Shiny standard/pixel sprites are bundled locally and shown in the expanded 94-entry developer gallery. New art without painted equivalents is explicitly labelled as official pixel art.

Save key stays `greenwood.save.v2`: `area` defaults to `hub` for legacy saves, `discoveredAreas` saves trail discoveries, and visited tiles use `Region/area` keys outside the settlement. Existing region names, individuals, party order, badges, clues, coordinates and visit records remain intact. Hunts and their original clue coordinates remain in the settlement map; the guide states this. Defeat in an outer area returns the party to that region’s settlement Center. Enemy sprites sit seven percentage points higher while HUD positions remain unchanged.

Validation includes all-area walking, reachability, no remote travel, loops, reloads, legacy saves, habitat encounter pools, Center/Gym access, clue scope, canonical evolution requirements and actual new-species combat.

## v0.26 — painted habitat chibis and a richer world

All eleven Pokémon added in v0.25 now have matching painted full-body chibis in Normal and canonical Shiny colours, stored in `assets/habitat-chibi-normal.webp` and `assets/habitat-chibi-shiny.webp`. Both atlases have real alpha transparency, four columns and three rows, with the final cell blank. `chibi-sources.js` registers both variants; `chibi-art.js` renders them throughout the collection, gallery, followers and motion-off battles. `AGENTS.md` now requires painted Normal/Shiny chibis for every future species or form. `chibi-policy.js` freezes the older legacy exceptions; tests reject uncovered new additions.

Every area has its own authored layout, ground/path treatment, scenery and identity in `area-designs.js`. The four shared habitat templates are gone. `world-scenery.js` draws lightweight vector cottages, a watermill, observatory, docks/boats, mushrooms/logs, windmill, caves, watchtower, lightning spire, volcanic vents, forge, quarry equipment, snowmen, ice crystals and a glacier shrine. The generic ruin is no longer repeated on every map. Four local Gym buildings in `assets/gyms/` have Grass/Electric/Fire/Water designs and sit over the original Gym entrance tile; existing leader challenges and badges remain compatible.

Each area has two additional reachable points of interest: a place with a short regional story and a supply satchel. Stand on their marked tile, then use **Explore landmark** (25 coins +20 trainer XP) or **Open satchel** (3 real Poké Balls +20 trainer XP). Rewards are once per site, tracked by `claimedWorldSites`; reloads and item/gold reset cannot farm them. Legacy saves receive an empty claim list. Scenery does not block walking or cover clue/gate/trainer entrances. Discovering a location retains its existing exploration XP. Enemy sprites now stand at 44% battlefield height from the bottom on desktop and mobile, nine percentage points above v0.25; the separate HP/status panels retain their positions.

Validation covers future chibi coverage, local assets, all 20 layouts, reachable points of interest, building placement, actual item rewards, duplicate/reload protection, save migration and deterministic scenery. Chromium checks exercise both painted variants, the physical Gym building, the satchel through movement/UI, five visually distinct maps, mobile/desktop rendering, and computed opponent positioning in a real battle.


## v0.27 — paired Shiny palettes for every painted chibi
All 91 painted chibi entries now have matching Normal and Shiny artwork: the original 18 starter-area species, 11 habitat additions, and 62 older evolutions, regional forms, Mega and Gigantamax entries. The three remaining legacy pixel entries retain their correct canonical Shiny pixel sprites. Shiny is selected automatically from the individual’s variant in collections, followers, developer gallery, motion-off battles and temporary forms. It does not change stats.

At the user’s request, the 62 older painted Shiny versions use direct material-specific palette changes in `scripts/build-paired-shiny.py`, preserving original poses, outlines, image dimensions and alpha. No newly generated redesigns are used for those entries. Canonical palettes are checked against the bundled official Shiny references; regular, regional, Mega and Gigantamax forms each have their own rules. Different materials use separate masks instead of a global hue shift (for example: Mega Charizard X keeps blue flames, gains teal skin and red wing membranes; Mega Gengar becomes white and pale pink; Mega Dragonite becomes blue rather than using base Dragonite’s green palette).

Older evolution sheets have paired `assets/evolution-chibi-1-shiny.webp` and `assets/evolution-chibi-2-shiny.webp` atlases. Individual drawings use `assets/chibi-painted/shiny/`. `chibi-sources.js` connects each Normal/Shiny pair; `artwork.js` prefers a matching painted Shiny standalone before pixel fallbacks. `docs/shiny-palette-report.json` records edited-pixel coverage. Tests require a Shiny partner for every painted Normal entry, verify source separation and local files, and exercise Normal/Shiny SVG atlas loading in the browser. Future Pokémon must ship with paired painted art.
