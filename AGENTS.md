# Greenwood project instructions

- This is the Pkmngame repository. Never change or deploy Wayfarer's Lantern as part of a Greenwood change.
- Trainers and Gym Leaders must use the detailed painted chibi explorer art family. Render NPCs through `trainer-portraits.js`; it supplies matching male/female fallbacks for future NPCs. Add a unique matching portrait for named leaders. Do not replace these with simple geometric avatar art.
- Keep existing save IDs, collection individuals, Shiny variants, party order and saved trainer appearance when migrating.
- Mega and Gigantamax are temporary battle transformations, never permanent species replacements. Use the pinned simulator, matching stones, Max Soup and the explicit Generation 8 ruleset for Gigantamax.
- Supply correct form-specific artwork. Do not silently reuse a base-species picture as a Mega/Gigantamax form. Use clearly labelled canonical pixel sprites if a painted chibi is unavailable.
- Run `npm test` and stage with `npm run stage`. Build dependencies and scratch files must not be deployed. Hosting remains the free static GitHub Pages workflow.

- Every painted chibi must use a matching canonical Shiny palette when the individual is Shiny; never substitute its Normal palette or a different art style. Every newly added Pokémon or battle form must ship with matching painted, full-body chibi art for BOTH Normal and canonical Shiny palettes. Include it in the gallery, collection, follower and motion-off battle render paths. Use the existing painted style; do not call pixel sprites finished chibi artwork. `tests/world-polish.test.mjs` enforces coverage for entries beyond the explicitly frozen legacy roster. Preserve true alpha transparency, never a baked-in checkerboard.
- Areas within a region must have distinct authored geography, individual colour treatment and contextual scenery/landmarks; do not rotate a shared map template for multiple areas. Keep all gates, Gym/Center entrances, hunt clues and saved positions safely reachable.

- Shiny variants must be direct material-specific colour edits of the approved Normal chibi, preserving its exact pose, silhouette and alpha. Do not regenerate or redesign a Shiny sprite. Keep white teeth, eyes and prismatic crystals separate from metal recolouring.

- The supplied Mega Raichu Y, Gigantamax Gengar and Gigantamax Pikachu images are references for painted chibi generation. Mega Raichu Y now has paired painted art. Gigantamax Pikachu now also has paired painted art. Gigantamax Gengar now also has paired painted art. All current species/forms must render their matching painted pair in chibi views. Shiny variants must recolour the matching Normal drawing.

- Kanto Leaders uses two extra Greenwood exhibition maps, separate from each region’s five-area loop. Keep the courtyard entrance, hall exit and all 14 trainers reachable. Jump to map must include every destination, preserve saves and grant no free battle rewards or healing. Trainer wins use stable `kanto-*` IDs.
- Kanto portraits are supplied in `assets/trainers-kanto/`. Use individual WebP images with PNG error fallbacks via `trainer-portraits.js`, keeping Brock and all original atlas indices intact. Canonical asset IDs and existing `kanto-*` aliases are supported. Keep saved trainer IDs stable; Lt. Surge remains `kanto-surge` with portrait `lt-surge`.

- Pokémon presentation dimensions live in `pokemon-size-data.js` and `pokemon-sizing.js`. Refresh the former with `node scripts/build-pokemon-sizes.mjs` for new species/forms. Keep relative size bounded for mobile, matching between Normal/Shiny and separate from combat stats. Map trainer/leader name labels must not show exclamation marks.

- Alakazam is directly catchable as a rare Observatory Woods encounter, with canonical stats/moves and paired painted artwork. Kadabra is also catchable there, with paired art and Linking Cord evolution into Alakazam. Abra and the other pending draft species remain unregistered until their artwork is available. Preserve Alakazam captures and the stable `alakazam` ID.
