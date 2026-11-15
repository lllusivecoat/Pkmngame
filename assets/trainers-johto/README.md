# Johto chibi portraits

Chibi portraits of the Johto Gym Leaders and Elite Four members Will and Karen. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `falkner` | Falkner | Gym Leader |
| `bugsy` | Bugsy | Gym Leader |
| `whitney` | Whitney | Gym Leader |
| `morty` | Morty | Gym Leader |
| `chuck` | Chuck | Gym Leader |
| `jasmine` | Jasmine | Gym Leader |
| `pryce` | Pryce | Gym Leader |
| `clair` | Clair | Gym Leader |
| `will` | Will | Elite Four |
| `karen` | Karen | Elite Four |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
