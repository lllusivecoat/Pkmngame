# Hoenn chibi portraits

Chibi portraits of the Hoenn Gym Leaders, Elite Four, Champion Steven, and protagonists Brendan and May. Wallace is included as the Sootopolis Gym Leader. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `roxanne` | Roxanne | Gym Leader |
| `brawly` | Brawly | Gym Leader |
| `wattson` | Wattson | Gym Leader |
| `flannery` | Flannery | Gym Leader |
| `norman` | Norman | Gym Leader |
| `winona` | Winona | Gym Leader |
| `tate` | Tate | Gym Leader |
| `liza` | Liza | Gym Leader |
| `wallace` | Wallace | Gym Leader |
| `sidney` | Sidney | Elite Four |
| `phoebe` | Phoebe | Elite Four |
| `glacia` | Glacia | Elite Four |
| `drake` | Drake | Elite Four |
| `steven` | Steven | Champion |
| `brendan` | Brendan | Protagonist |
| `may` | May | Protagonist |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
