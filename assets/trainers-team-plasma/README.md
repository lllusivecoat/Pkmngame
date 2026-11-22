# Team Plasma chibi portraits

Chibi portraits of Team Plasma from Unova (BW / B2W2): Ghetsis, N, Colress, the Seven Sages, the Shadow Triad, and male and female grunts. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game should load them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

This branch adds assets only. Register new unique ids in `portrait-manifest.js` (and bump the import cache-bust query in `app.js` if that file is touched). Collisions use a set prefix plus `sourceId` for the filename, as with `sinnoh-flint`, `unova-iris`, and `galar-milo`.

## Characters

| ID (filename) | Name | Role | Wiring note |
| --- | --- | --- | --- |
| `ghetsis` | Ghetsis | Boss |  |
| `n` | N | Figurehead / rival |  |
| `colress` | Colress | Admin |  |
| `zinzolin` | Zinzolin | Sage |  |
| `rood` | Rood | Sage |  |
| `giallo` | Giallo | Sage |  |
| `bronius` | Bronius | Sage |  |
| `ryoku` | Ryoku | Sage |  |
| `gorm` | Gorm | Sage |  |
| `shadow_triad` | Shadow Triad | Admins |  |
| `grunt_m` | Plasma Grunt | Grunt · male | Prefix the manifest id (e.g. `plasma-grunt_m`) and set sourceId to `grunt_m`. |
| `grunt_f` | Plasma Grunt | Grunt · female | Prefix the manifest id (e.g. `plasma-grunt_f`) and set sourceId to `grunt_f`. |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
