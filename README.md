# Greenwood — Pokémon browser RPG

A playable frontend fan prototype with exploration, battles, catching, individual Pokémon, party management, a living Pokédex, a clue-based Dratini hunt, AI arena and mock market.

This is an independent repository. Its releases do not deploy or change Wayfarer’s Lantern.

## Play

Intended GitHub Pages address after publishing is enabled: https://lllusivecoat.github.io/Pkmngame/

For local use, run `npm start`, then visit http://localhost:4173. No dependency installation is needed. Run `npm test` to execute the 22 automated checks.

The static website is at the repository root: index.html, app.js, core.js, battle.js, data.js, artwork.js, visuals.js, style.css, polish.css and assets/. Tests are in tests/.

## Saves

Progress is saved in the browser under `greenwood.save.v2`. Settings provides JSON export/import and a confirmed reset. Earlier Greenwood versions used the same save key on this GitHub Pages origin, so existing progress remains available in the same browser/profile. Wayfarer’s Lantern uses separate save data and is not modified.

## Artwork and scope

Generated forest backgrounds are bundled locally. Full-body Pokémon sprites load from the public PokeAPI sprite repository; an offline symbol fallback is retained. This is a fan prototype, not an official product. Guild networking, multiplayer trading/PvP and other regions remain previews.

22 automated checks cover progression, capture, combat, party, market, save migrations, navigation bindings and map/hunt consistency. A real-browser visual check remains outstanding.
