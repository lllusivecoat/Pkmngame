import {unovakalos721Species} from './unovakalos721-data.js?v=20261123-mapfix1';
import {hoennsinnoh493Species} from './hoennsinnoh493-data.js?v=20261123-mapfix1';
import {johto251Species} from './johto251-data.js?v=20261123-mapfix1';
import {kanto151Species} from './kanto151-data.js?v=20261123-mapfix1';
import {chibiAtlas,shinyChibiAtlas} from './chibi-sources.js?v=20261123-mapfix1';
// Explicit temporary art approved for the requested evolution-line expansion. Remove an ID when both painted palettes are bundled.
export const pendingChibiIds=new Set(["larvitar", "tyranitar", "shelgon",...Object.keys(unovakalos721Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id]),...Object.keys(hoennsinnoh493Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id]),...Object.keys(johto251Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id]),...Object.keys(kanto151Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id])]);
export const artworkPending=c=>pendingChibiIds.has(typeof c==='string'?c:c.form||c.species);
