# Greenwood project instructions

- This is the Pkmngame repository. Never change or deploy Wayfarer's Lantern as part of a Greenwood change.
- Trainers and Gym Leaders must use the detailed painted chibi explorer art family. Render NPCs through `trainer-portraits.js`; it supplies matching male/female fallbacks for future NPCs. Add a unique matching portrait for named leaders. Do not replace these with simple geometric avatar art.
- Keep existing save IDs, collection individuals, Shiny variants, party order and saved trainer appearance when migrating.
- Mega and Gigantamax are temporary battle transformations, never permanent species replacements. Use the pinned simulator, matching stones, Max Soup and the explicit Generation 8 ruleset for Gigantamax.
- Supply correct form-specific artwork. Do not silently reuse a base-species picture as a Mega/Gigantamax form. Use clearly labelled canonical pixel sprites if a painted chibi is unavailable.
- Run `npm test` and stage with `npm run stage`. Build dependencies and scratch files must not be deployed. Hosting remains the free static GitHub Pages workflow.
