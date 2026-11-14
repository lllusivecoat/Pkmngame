# Galar chibi portraits

Chibi portraits of the Galar Gym Leaders, rivals Hop and Marnie, Champion Leon, and protagonists Victor and Gloria. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. They are not wired into the game. They are intended to be added as portraits alongside `assets/trainers-classic.webp`.

That atlas is already a full 4×4 grid of 256×256 cells (1024×1024). `trainer-portraits.js` crops one cell per portrait. Because the grid has no empty cells, either extend the atlas or load these as individual images.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `milo` | Milo | Gym Leader |
| `nessa` | Nessa | Gym Leader |
| `kabu` | Kabu | Gym Leader |
| `bea` | Bea | Gym Leader |
| `allister` | Allister | Gym Leader |
| `opal` | Opal | Gym Leader |
| `gordie` | Gordie | Gym Leader |
| `melony` | Melony | Gym Leader |
| `piers` | Piers | Gym Leader |
| `raihan` | Raihan | Gym Leader |
| `leon` | Leon | Champion |
| `victor` | Victor | Protagonist |
| `gloria` | Gloria | Protagonist |
| `hop` | Hop | Rival |
| `marnie` | Marnie | Rival |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
