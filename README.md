# Greenwood — Pokémon browser RPG

A playable frontend fan prototype with exploration, battles, catching, individual Pokémon, party management, a living Pokédex, a clue-based Dratini hunt, AI arena and mock market.

This is an independent repository. Its releases do not deploy or change Wayfarer’s Lantern.

## Play

Intended GitHub Pages address after publishing is enabled: https://lllusivecoat.github.io/Pkmngame/

For local use, run `npm start`, then visit http://localhost:4173. No dependency installation is needed. Run `npm test` to execute the 33 automated checks.

The static website is at the repository root: index.html, app.js, core.js, battle.js, data.js, artwork.js, visuals.js, style.css, polish.css and assets/. Tests are in tests/.

## Saves

Progress is saved in the browser under `greenwood.save.v2`. Settings provides JSON export/import and a confirmed reset. Earlier Greenwood versions used the same save key on this GitHub Pages origin, so existing progress remains available in the same browser/profile. Wayfarer’s Lantern uses separate save data and is not modified.

## Artwork and scope

Generated forest backgrounds are bundled locally. Full-body Pokémon sprites load from the public PokeAPI sprite repository; an offline symbol fallback is retained. This is a fan prototype, not an official product. Guild networking, multiplayer trading/PvP and other regions remain previews.

33 automated checks cover progression, capture, combat, party, market, save migrations, navigation bindings and map/hunt consistency. A real-browser visual check remains outstanding.

## v0.5 — modern animated Pokémon

Default artwork uses the newest available full-body animated assets for each species from PokeAPI's Champions, Legends: Z-A, Scarlet/Violet and Sword/Shield sets. `modern-sources.js` records verified front/back and Shiny availability. Caterpie uses Sword/Shield because no newer asset exists in these sets. Pokémon HOME stills and official artwork are fallbacks.

Battle feedback includes initiative-ordered attack lunges, target recoil and brief flashes, plus a thrown capture orb. Controls are locked during the short feedback interval, and final blows animate before the result screen. Old saves keep their progression and upgrade their artwork choice. Settings provides Modern animated / HOME still artwork and a motion toggle. Device reduced-motion preferences force still assets and disable movement effects.

Assets load from https://github.com/PokeAPI/sprites and are lazy-loaded/reused by the browser cache. No paid service was added. These are available game-render animations rather than custom 3D models recreated by this project. 33 automated checks pass; real-browser visual QA remains outstanding in this environment.

## v0.6 — Daylight and Moonlight

The top bar, starter dialog, battle header and Settings offer Daylight, Moonlight and Follow device. Follow device is the default and updates when the operating-system preference changes. Preference is stored independently under `greenwood.theme.v1`; resetting/importing gameplay does not change appearance. Theme switching changes root CSS tokens without re-rendering the game, remounting sprites, changing battle turns, or modifying weather/time/hunt conditions.

Daylight uses pale sage/ivory backgrounds, neutral white surfaces, charcoal text and forest-green actions. Moonlight uses navy-charcoal backgrounds, slate panels, ivory text and mint actions. Pokémon and world artwork retain their colours. Gold is reserved for rare discoveries; elemental labels use palette-specific legible colours. Smaller text and controls were enlarged, with a roomier mobile dashboard party layout. `theme.js` owns preference/device handling; `theme.css` owns presentation tokens and component styles. A small early script applies the initial mode before styles load.

33 automated checks pass, including normal-text contrast for both palette token sets, saved preference/reload, device changes, blocked storage, first-paint selection, controls across main screens, and switching during an active encounter without altering gameplay. Tested body, secondary, action and status text token pairs meet 4.5:1; focus colour pairs meet 3:1. These automated checks do not constitute full rendered-page accessibility certification. Visual browser QA remains outstanding because the managed browser entrypoint is unavailable. No paid service or Wayfarer’s Lantern files were changed.
