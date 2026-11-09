# Items and ability mechanics (v0.12)

## Sources and licensing

Combat uses the MIT-licensed Pokémon Showdown engine distributed as `@pkmn/sim` **0.10.15**, bundled with esbuild **0.25.12**. Its data and mechanics are included locally; no simulator API or multiplayer server is required. The original copyright and license notices are copied to `vendor/LICENSE-*.txt` and distributed with the site. Upstream: https://github.com/pkmn/ps and https://github.com/smogon/pokemon-showdown.

The checked-in catalogue snapshots were assembled from that pinned Dex and the English PokeAPI CSV data at https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv (items, categories, names, descriptions, machines and species growth/capture metadata). The 229 TM records use Scarlet/Violet compatibility. Species level-up sources use Scarlet/Violet when available, with earlier official sources for species absent from that game; `combat-sources.json` retains the original 18-species source records. New evolutions use the pinned simulator learnset data. Battle-engine IDs are normalized; save aliases preserve the original move and inventory IDs.

Pokemon names and game imagery remain their owners' property; the MIT engine license does not grant ownership of those assets. This is an independent fan prototype.

## What works

The catalogue has 992 item records and 317 official abilities (excluding simulator-only custom abilities). Battle abilities and held items execute through the simulator in applicable contexts, rather than a generic stat multiplier. Examples tested include contact effects, entry effects, weather/speed, immunity and absorption, low-HP boosts, Choice locks, Assault Vest, Focus Sash, automatic berries and Leftovers.

The Bag implements medicine, revival, status/PP recovery, PP Ups, vitamins/feathers, EV-reducing berries, mints, Hyper Training, experience candy, Ability Capsule/Patch, compatible TMs and evolution items. Invalid or no-effect uses do not spend an item. Equipment transfers return the previous item to the bag. Battle medicine and X items take a turn. Capture balls use species catch rates, HP/status and context bonuses. Master Ball guarantees an ordinary wild capture; trainer catches are prohibited.

Base combat uses Generation 9 custom-game rules, allowing older available moves/items without a competitive legality gate. Supported gimmicks are offered only when the engine requests them. Rarity and Shiny appearance do not increase stats. Individual EV/IV training and natures do affect stats.

## Explicit prototype boundaries

- Mode-only items (Hisui throws, Let's Go candy, Wonder Launcher, event-only balls and unavailable forms) are explained and blocked instead of selling a fake effect.
- Fishing, underwater and special-species bonuses require their actual context; ordinary exploration does not pretend to be underwater or fishing.
- Available species comprise 53 members of the current roster's evolution families. A held item for another species can be collected, but has no special effect on an incompatible holder.
- Trade evolutions use a local Linking Cord; actual player trading is not implemented. Friendship/level evolution is confirmed from the detail panel. Time uses the prototype world's period.
- Battle damage, statuses, ability triggers, temporary item interactions and initiative use the engine. Capture, exploration, trainer rewards, inventory, persistent conditions and field evolution remain game-level adapters. Outside-battle ability mechanics for future professions/breeding are not implemented.
- The full ability registry is integrated; 92 automated checks and browser smoke tests do not exhaustively test every pair of 317 abilities and hundreds of items. The engine snapshot is versioned so later fixes can be tested and migrated.

## Save and deployment

`greenwood.save.v2` remains the save key. Migration initializes inventory once from legacy stock, validates legal abilities and keeps creature IDs, levels, variants and party order. New individual fields include equipment, EVs/IVs, persistent HP/status/PP, known TMs, friendship and XP-growth metadata. Settings can export/import or reset with confirmation.

`npm ci` installs pinned build dependencies. `npm test` first builds the browser engine and runs the checks. `npm run build` writes `.site` for static hosting; development dependencies are never deployed. GitHub Pages is the existing free hosting path and only the Pkmngame repository is changed.
