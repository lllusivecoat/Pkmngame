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
