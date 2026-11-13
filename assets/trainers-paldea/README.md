# Paldea chibi portraits

Chibi portraits of the Paldea Gym Leaders, Elite Four, rivals Nemona, Arven, and Penny, Champion Geeta, and protagonists Florian and Juliana. Larry is both a Gym Leader and an Elite Four member. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. They are not wired into the game. They are intended to be added as portraits alongside `assets/trainers-classic.webp`.

That atlas is already a full 4×4 grid of 256×256 cells (1024×1024). `trainer-portraits.js` crops one cell per portrait. Because the grid has no empty cells, either extend the atlas or load these as individual images.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `katy` | Katy | Gym Leader |
| `brassius` | Brassius | Gym Leader |
| `iono` | Iono | Gym Leader |
| `kofu` | Kofu | Gym Leader |
| `larry` | Larry | Gym Leader, Elite Four |
| `ryme` | Ryme | Gym Leader |
| `tulip` | Tulip | Gym Leader |
| `grusha` | Grusha | Gym Leader |
| `rika` | Rika | Elite Four |
| `poppy` | Poppy | Elite Four |
| `hassel` | Hassel | Elite Four |
| `geeta` | Geeta | Champion |
| `nemona` | Nemona | Rival |
| `florian` | Florian | Protagonist |
| `juliana` | Juliana | Protagonist |
| `arven` | Arven | Rival |
| `penny` | Penny | Rival |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
