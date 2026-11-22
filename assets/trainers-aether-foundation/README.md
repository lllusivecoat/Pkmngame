# Aether Foundation chibi portraits

Chibi portraits of the Aether Foundation from Alola (SM/USUM): Lusamine, Faba, and male and female employees (the grunt equivalents). These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game should load them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

This branch adds assets only. Register new unique ids in `portrait-manifest.js` (and bump the import cache-bust query in `app.js` if that file is touched). Collisions use a set prefix plus `sourceId` for the filename, as with `sinnoh-flint`, `unova-iris`, and `galar-milo`.

## Characters

| ID (filename) | Name | Role | Wiring note |
| --- | --- | --- | --- |
| `lusamine` | Lusamine | Boss |  |
| `faba` | Faba | Admin |  |
| `employee_m` | Aether Employee | Staff · male |  |
| `employee_f` | Aether Employee | Staff · female |  |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
