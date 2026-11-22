# Team Flare chibi portraits

Chibi portraits of Team Flare from Kalos (XY): Lysandre, the five scientists, and male and female grunts. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game should load them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

This branch adds assets only. Register new unique ids in `portrait-manifest.js` (and bump the import cache-bust query in `app.js` if that file is touched). Collisions use a set prefix plus `sourceId` for the filename, as with `sinnoh-flint`, `unova-iris`, and `galar-milo`.

## Characters

| ID (filename) | Name | Role | Wiring note |
| --- | --- | --- | --- |
| `lysandre` | Lysandre | Boss |  |
| `xerosic` | Xerosic | Admin |  |
| `aliana` | Aliana | Admin |  |
| `celosia` | Celosia | Admin |  |
| `bryony` | Bryony | Admin |  |
| `mable` | Mable | Admin |  |
| `grunt_m` | Flare Grunt | Grunt · male | Prefix the manifest id (e.g. `flare-grunt_m`) and set sourceId to `grunt_m`. |
| `grunt_f` | Flare Grunt | Grunt · female | Prefix the manifest id (e.g. `flare-grunt_f`) and set sourceId to `grunt_f`. |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
