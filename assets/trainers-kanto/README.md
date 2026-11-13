# Kanto chibi portraits

Chibi portraits of the Gen 1 Kanto Gym Leaders, Elite Four, Champion Blue, and Red. These files are not wired into the game. They are intended to be added as portraits alongside `assets/trainers-classic.webp`.

That atlas is already a full 4×4 grid of 256×256 cells (1024×1024). `trainer-portraits.js` crops one cell per portrait. Because the grid has no empty cells, either extend the atlas or load these as individual images.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `brock` | Brock | Gym Leader |
| `misty` | Misty | Gym Leader |
| `lt-surge` | Lt. Surge | Gym Leader |
| `erika` | Erika | Gym Leader |
| `koga` | Koga | Gym Leader |
| `sabrina` | Sabrina | Gym Leader |
| `blaine` | Blaine | Gym Leader |
| `giovanni` | Giovanni | Gym Leader |
| `lorelei` | Lorelei | Elite Four |
| `bruno` | Bruno | Elite Four |
| `agatha` | Agatha | Elite Four |
| `lance` | Lance | Elite Four |
| `blue` | Blue | Champion |
| `red` | Red | Champion |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.

`brock.png` and `brock.webp` are copies of the existing in-game Brock portrait, included so the set is complete. There is no `brock_1024.png`.
