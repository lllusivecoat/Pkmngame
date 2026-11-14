# Galar chibi portraits

Chibi portraits of the Galar Gym Leaders, rivals Hop and Marnie, Champion Leon, and protagonists Victor and Gloria. These files are 256×256 transparent portraits with matching `{id}_1024.png` hi-res sources. The game loads them alongside `assets/trainers-classic.webp`.

`trainer-portraits.js` loads each portrait by id from this folder when it is shown: WebP first, then PNG. The classic 4×4 atlas stays as it is.

Greenwood’s Trail Scout already uses the id `milo` on the atlas, so this Gym Leader is looked up as `galar-milo`.

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
