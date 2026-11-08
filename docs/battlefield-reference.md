# Battlefield layout references

Reviewed 8 November 2026. These are presentation references for an original responsive browser layout; no game screenshots, UI textures or arena models are embedded in the product.

- [Pokémon Champions — official gameplay gallery](https://champions.pokemon.com/en-us/gameplay/) and [official battle screenshot](https://champions.pokemon.com/_images/gameplay/battle-gallery/en/gallery-1.jpg): battle-focused presentation, peripheral status information and a grouped move menu displaying PP and effectiveness.
- [Pokémon Scarlet and Pokémon Violet — official press assets](https://press.pokemon.com/en/Pokemon-Scarlet-and-Pokemon-Violet): reference for the familiar near-left player / far-right opponent composition and separating commands from the centre of the action.
- [Pokémon Legends: Z-A — official gameplay](https://legends.pokemon.com/en-us/gameplay): reference for giving the surrounding environment room to read. Its real-time mechanics are not adopted; Greenwood remains turn-based.

## Adaptation in Greenwood

The opponent status panel sits in a dedicated band above-right. The player panel sits below-left, beside a compact two-column move menu on desktop. Mobile stacks the player panel and commands, retaining the same reading order. Both HP panels remain outside the battlefield so they cannot cover Pokémon sprites.

The scene uses a wide desktop aspect ratio, foreground/background diagonal staging, contact shadows and an open centre. The compact sprite caps requested by the player are retained: at most 150/125 pixels on desktop and 95/80 on mobile. The game's own bundled woodland background remains in use.

Move hints use the existing type chart and current defender types: super effective, effective, resisted, immune or status. They do not predict unimplemented ability effects. Catch tools, swaps, potions, fleeing, party management and the battle log remain functional.

The layout is a 2D interpretation. It does not add a 3D camera, real-time movement or new battle rules. The automated gameplay/UI checks pass; real-browser visual QA remains outstanding in this environment.
