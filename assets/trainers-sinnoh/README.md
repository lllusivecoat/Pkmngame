# Sinnoh chibi portraits

Chibi portraits of the Sinnoh Gym Leaders, Elite Four, Champion Cynthia, and protagonists Lucas and Dawn. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

Ashlands’ Gym Leader already uses the id `flint` on the atlas, so this Elite Four member is looked up as `sinnoh-flint`.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `roark` | Roark | Gym Leader |
| `gardenia` | Gardenia | Gym Leader |
| `maylene` | Maylene | Gym Leader |
| `crasher-wake` | Crasher Wake | Gym Leader |
| `fantina` | Fantina | Gym Leader |
| `byron` | Byron | Gym Leader |
| `candice` | Candice | Gym Leader |
| `volkner` | Volkner | Gym Leader |
| `aaron` | Aaron | Elite Four |
| `bertha` | Bertha | Elite Four |
| `flint` | Flint | Elite Four |
| `lucian` | Lucian | Elite Four |
| `cynthia` | Cynthia | Champion |
| `lucas` | Lucas | Protagonist |
| `dawn` | Dawn | Protagonist |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
