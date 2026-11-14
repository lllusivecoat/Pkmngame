# Johto chibi portraits

Chibi portraits of the Johto Gym Leaders and Elite Four members Will and Karen. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. They are not wired into the game. They are intended to be added as portraits alongside `assets/trainers-classic.webp`.

That atlas is already a full 4×4 grid of 256×256 cells (1024×1024). `trainer-portraits.js` crops one cell per portrait. Because the grid has no empty cells, either extend the atlas or load these as individual images.

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
