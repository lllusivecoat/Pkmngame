# Special character chibi portraits

Chibi portraits of Ash (classic Kanto anime outfit), Green (the female Pokémon Adventures / Let's Go character, not the Kanto rival Blue), and Nurse Joy (Let's Go / Sword & Shield-era Pokémon Center nurse). These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game should load them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

This branch adds assets only. Register new unique ids in `portrait-manifest.js` (and bump the import cache-bust query in `app.js` if that file is touched). Collisions use a set prefix plus `sourceId` for the filename, as with `sinnoh-flint`, `unova-iris`, and `galar-milo`.

## Characters

| ID (filename) | Name | Role | Wiring note |
| --- | --- | --- | --- |
| `ash` | Ash | Anime protagonist · classic Kanto outfit | New id. Not to be confused with the atlas id `ashby`. |
| `green` | Green | Female trainer · Let's Go / Adventures design | The Kanto rival already exists as `blue` in `assets/trainers-kanto/`. This is the female Green (brown hair, black dress), not Blue. |
| `nurse_joy` | Nurse Joy | Pokémon Center nurse | New id. Official Let's Go / SwSh-era games design. |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
