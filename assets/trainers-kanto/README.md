# Kanto chibi portraits

Chibi portraits of the Gen 1 Kanto Gym Leaders, Elite Four, Champion Blue, and Red. They are individual 256×256 portraits used alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

The id `brock` is not registered from this folder. Brock keeps his existing atlas cell.

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
