# Team Rocket chibi portraits

Chibi portraits of Team Rocket from Kanto/Johto (HGSS executives): Giovanni, the four executives, and male and female grunts. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game should load them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

This branch adds assets only. Register new unique ids in `portrait-manifest.js` (and bump the import cache-bust query in `app.js` if that file is touched). Collisions use a set prefix plus `sourceId` for the filename, as with `sinnoh-flint`, `unova-iris`, and `galar-milo`.

## Characters

| ID (filename) | Name | Role | Wiring note |
| --- | --- | --- | --- |
| `giovanni` | Giovanni | Boss | Reused from the existing Kanto Gym Leader portrait in `assets/trainers-kanto/`. Do not register a second manifest id `giovanni`. Optional alias: `rocket-giovanni` with sourceId `giovanni`, or keep using `giovanni`. |
| `archer` | Archer | Admin |  |
| `ariana` | Ariana | Admin |  |
| `proton` | Proton | Admin |  |
| `petrel` | Petrel | Admin |  |
| `grunt_m` | Rocket Grunt | Grunt · male | Prefix the manifest id (e.g. `rocket-grunt_m`) and set sourceId to `grunt_m`. |
| `grunt_f` | Rocket Grunt | Grunt · female | Prefix the manifest id (e.g. `rocket-grunt_f`) and set sourceId to `grunt_f`. |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
