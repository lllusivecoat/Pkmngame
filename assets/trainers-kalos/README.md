# Kalos chibi portraits

Chibi portraits of the Kalos Gym Leaders, Elite Four, Champion Diantha, and protagonists Calem and Serena. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `viola` | Viola | Gym Leader |
| `grant` | Grant | Gym Leader |
| `korrina` | Korrina | Gym Leader |
| `ramos` | Ramos | Gym Leader |
| `clemont` | Clemont | Gym Leader |
| `valerie` | Valerie | Gym Leader |
| `olympia` | Olympia | Gym Leader |
| `wulfric` | Wulfric | Gym Leader |
| `malva` | Malva | Elite Four |
| `siebold` | Siebold | Elite Four |
| `wikstrom` | Wikstrom | Elite Four |
| `drasna` | Drasna | Elite Four |
| `diantha` | Diantha | Champion |
| `calem` | Calem | Protagonist |
| `serena` | Serena | Protagonist |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
