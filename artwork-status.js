import {temporaryArtwork} from './temporary-artwork.js?v=20261123-rk1';
import {unovakalos721Species} from './unovakalos721-data.js?v=20261123-rk1';
import {hoennsinnoh493Species} from './hoennsinnoh493-data.js?v=20261123-rk1';
import {johto251Species} from './johto251-data.js?v=20261123-rk1';
import {kanto151Species} from './kanto151-data.js?v=20261123-rk1';
import {chibiAtlas,shinyChibiAtlas} from './chibi-sources.js?v=20261123-rk1';
// Explicit temporary art approved for the requested evolution-line expansion. Remove an ID when both painted palettes are bundled.
export const pendingChibiIds=new Set(["larvitar", "tyranitar", "shelgon",...Object.keys(unovakalos721Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id]),...Object.keys(hoennsinnoh493Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id]),...Object.keys(johto251Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id]),...Object.keys(kanto151Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id])]);
export const artworkPending=c=>pendingChibiIds.has(typeof c==='string'?c:c.form||c.species);

// Keep pendingChibiIds unchanged until BOTH actual painted palettes are registered.
export function temporaryArt(c){const id=typeof c==='string'?c:c.form||c.species,entry=temporaryArtwork[id];if(!artworkPending(id)||!entry)return null;const cell=entry[typeof c!=='string'&&c.variant==='Shiny'?'shiny':'normal'];return cell?{...cell,label:cell.label||entry.label||'Temporary Pokémon image',provider:cell.provider||entry.provider||'Pokémon HOME via PokeAPI'}:null}
export const artworkState=c=>temporaryArt(c)?'temporary':artworkPending(c)?'pending':'painted';
export const artworkNotice=c=>temporaryArt(c)?temporaryArt(c).label+(temporaryArt(c).paletteEdit?' · canonical Shiny palette edit':'')+' · temporary · chibi art pending':artworkPending(c)?'Chibi art pending':'';

export const artworkFamily=c=>temporaryArt(c)?.family||'';
