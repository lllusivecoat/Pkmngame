# Alola chibi portraits

Chibi portraits of the Alola kahunas, trial captains, Elite Four, Champions Kukui and Hau, and protagonists Elio and Selene. Olivia is a kahuna and an Elite Four member. Acerola is a trial captain and an Elite Four member. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

## Characters

| ID | Name | Role |
| --- | --- | --- |
| `hala` | Hala | Kahuna |
| `olivia` | Olivia | Kahuna, Elite Four |
| `nanu` | Nanu | Kahuna |
| `hapu` | Hapu | Kahuna |
| `ilima` | Ilima | Trial Captain |
| `lana` | Lana | Trial Captain |
| `kiawe` | Kiawe | Trial Captain |
| `mallow` | Mallow | Trial Captain |
| `sophocles` | Sophocles | Trial Captain |
| `acerola` | Acerola | Trial Captain, Elite Four |
| `mina` | Mina | Trial Captain |
| `molayne` | Molayne | Elite Four |
| `kahili` | Kahili | Elite Four |
| `kukui` | Kukui | Champion |
| `hau` | Hau | Champion |
| `elio` | Elio | Protagonist |
| `selene` | Selene | Protagonist |

## Formats and sizes

Each ID has:

- `{id}.png` — 256×256 RGBA PNG, transparent. Same cell size `trainer-portraits.js` renders.
- `{id}.webp` — 256×256 WebP with alpha, the same portrait as the PNG.
- `{id}_1024.png` — 1024×1024 RGBA PNG source.
