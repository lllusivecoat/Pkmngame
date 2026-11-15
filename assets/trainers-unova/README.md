# Unova chibi portraits

Chibi portraits of the Unova Gym Leaders, Elite Four, Champions Iris and Alder, and protagonists Nate and Rosa. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

Greenwood’s Storm Watcher already uses the id `iris` on the atlas, so this Champion is looked up as `unova-iris`.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `cheren` | Cheren | Gym Leader |
| `roxie` | Roxie | Gym Leader |
| `burgh` | Burgh | Gym Leader |
| `elesa` | Elesa | Gym Leader |
| `clay` | Clay | Gym Leader |
| `skyla` | Skyla | Gym Leader |
| `drayden` | Drayden | Gym Leader |
| `marlon` | Marlon | Gym Leader |
| `shauntal` | Shauntal | Elite Four |
| `grimsley` | Grimsley | Elite Four |
| `caitlin` | Caitlin | Elite Four |
| `marshal` | Marshal | Elite Four |
| `iris` | Iris | Champion |
| `nate` | Nate | Protagonist |
| `rosa` | Rosa | Protagonist |
| `cilan` | Cilan | Gym Leader |
| `chili` | Chili | Gym Leader |
| `cress` | Cress | Gym Leader |
| `lenora` | Lenora | Gym Leader |
| `brycen` | Brycen | Gym Leader |
| `alder` | Alder | Champion |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
