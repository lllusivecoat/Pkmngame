Sinnoh / Unova temporary artwork

Gen 4: 94 temporary pairs and 13 existing painted pairs. Gen 5: 153 temporary pairs and 3 existing painted pairs. Added 162 RK9 +85 RK1 pairs in the existing folder/gallery. Normal and Shiny share exact geometry, alpha and protected outlines. Four RK9 form mismatches use the matching outlined Final source; audit records explain each. Generator: scripts/build-sinnoh-unova-replacements.py. Audit: docs/sinnoh-unova-temporary-artwork.json. Earlier-generation artwork and save records are unchanged.

Hoenn temporary artwork

Gen 3 preserves 17 painted pairs and fills 118 pending pairs (75 RK9, 43 RK1). Registry total: 306 temporary species across Gen 1–3. Shiny variants are palette edits of the same drawings, using canonical colour references, never HOME render fallbacks. Source audit: docs/hoenn-temporary-artwork.json. Generator: scripts/build-hoenn-replacements.py.

Johto temporary artwork

85 pending Johto species use locally embedded RK9/RK1 drawings with matching code-edited Shiny palettes. Existing 15 approved painted pairs remain untouched. The shared registry now contains 188 temporary species. Source audit: docs/johto-temporary-artwork.json. Generator: scripts/build-johto-replacements.py; shared colour mapping: scripts/rk_palette.py. HOME model images are colour references only and are never displayed.

## Current RK9 / RK1 replacement set (v0.59.0)

64 Normal drawings retain their RK9 source/credit.39 gaps use the current `https://assets.pokeos.com/pokemon/home/{number}.png` outlined Final sprites, rather than `home/render/{number}.png` or a PokeAPI HOME model. The user calls this outlined set RK1; it is not an attribution to an artist named RK1. Both families share the same gallery category and folder.

Every Shiny replacement now edits the exact Normal drawing’s palette. Canonical paired Normal/Shiny render references are colour references only; none are displayed as replacement artwork. Palette mapping uses corresponding reference colours, protected dark ink and explicit material corrections where stylised fills overlap. Normal/Shiny alpha is checked byte-for-byte; the browser also checks protected ink and changed colours for all103 pairs. Audit URLs/IDs remain in `kanto-temporary-artwork.json`. Earlier documentation below is historical.

## Labelled Kanto replacements (v0.58.0)

Source archive: https://www.pokeos.com/archive/assets/home ; public index: https://api.pokeos.com/api/poke/game/assets?versionGroupCode=home . RK9 credited as the original sprite artist.64 usable Normal images are bundled from the archive’s `home/rk9/broadcast` set.38 missing species plus Muk (non-transparent RK9 background) use39 Normal HOME images. The archive lists no Shiny RK9 images, so all103 Shiny replacements use canonical HOME images from PokeAPI/sprites commit `c0542f7c51215d9672439012838c99f520596cbd`.

Only transparent margins were trimmed, images resized and WebP encoded at quality92 inside self-contained SVG wrappers. Designs, colours and poses were not redrawn or recoloured. All206 source URLs, hashes and provenance are in `kanto-temporary-artwork.json`. These are temporary replacements, not painted chibi artwork; original approved paintings remain untouched. Both palettes work offline and carry source-specific gallery labels. The older documentation below records historical releases.

# Bundled gallery artwork

The gallery has 94 entries: 75 permanent species/evolutions and 19 temporary battle forms. It defaults to showing all entries and resets filters when reopened. Normal and Shiny variants each have two previews: standard artwork and the available painted/pixel chibi source.

The files in `assets/artwork/normal/` and `assets/artwork/shiny/` were obtained from `PokeAPI/sprites` at `sprites/pokemon/other/home/{number}.png` and `sprites/pokemon/other/home/shiny/{number}.png` on 2026-11-09. They were encoded as static WebP at quality 90 for delivery, preserving transparency. No character designs, colours, proportions or poses were edited. IDs are the actual PokeAPI species/form artwork IDs from the registry.

`assets/artwork/shiny-chibi/` preserves the canonical PNG game sprites from `PokeAPI/sprites`, `sprites/pokemon/shiny/{number}.png`. The original 18 painted Shiny images remain in `assets/chibi/shiny/`; other painted chibi figures use the existing local atlases. A pixel sprite is labelled as pixel artwork, not a new painted redraw.

`local-artwork.js` lists the 94 standard, 94 Shiny standard and 76 additional Shiny chibi files. The renderer prefers these bundled paths, keeping external source URLs only as fallback paths. Developer previews override the artwork visibility setting without changing it. The complete gallery does not record discoveries or modify the collection.

Tests validate every bundled standard image as a non-animated WebP and check local chibi coverage for both variants. The browser test disables the external image host and verifies actual loaded images and all 94 normal/chibi previews for each variant. Lazy images are forced to load in that test; normal browsing retains lazy loading for efficiency.

These are Pokémon fan-game assets sourced through the public PokeAPI sprite project, not original intellectual property or an official product. This gallery update does not replace the evolved-species drawings: attempted new matching sheets were rejected by the image service and were not published.

Eleven habitat species were added on 2026-11-11 with 44 lossless WebP assets: standard Normal/Shiny and official pixel Normal/Shiny. `pixel-chibi` stores their unaltered canonical game sprites.

### Painted habitat chibis (v0.26)

`assets/habitat-chibi-normal.webp` and `assets/habitat-chibi-shiny.webp` are matching generated painted 2D chibi sheets, 1448×1086, laid out as four columns by three rows. Order: Ralts, Kirlia, Gardevoir, Gallade; Shinx, Luxio, Luxray, Numel; Camerupt, Snover, Abomasnow, blank. Both use real alpha transparency. Shiny body and eye colours were checked against the bundled canonical Shiny reference artwork. They are encoded as WebP for delivery without altering the generated design. Existing canonical pixel files remain as fallback resources. New species/form artwork must satisfy the frozen-legacy coverage check in `tests/world-polish.test.mjs` for both variants.

### Complete paired painted Shiny coverage (v0.27)
The 62 older painted entries now use paired palette edits of their existing drawings, generated by `scripts/build-paired-shiny.py` using canonical, species-specific material masks. Existing poses, silhouettes and alpha are preserved, with alpha verified after WebP decoding. These are not image-service redraws. Two paired evolution atlases and 17 standalone files under `assets/chibi-painted/shiny/` provide coverage for all 91 painted entries together with the original 18 and the recent 11 habitat Pokémon. Three unpainted legacy forms keep canonical pixel Shiny sprites. `docs/shiny-palette-report.json` records coverage and the build script makes the process reproducible.
