import {kanto151Species} from './kanto151-data.js?v=20261120-walking1';
import {chibiAtlas,shinyChibiAtlas} from './chibi-sources.js?v=20261120-walking1';
// Explicit temporary art approved for the requested evolution-line expansion. Remove an ID when both painted palettes are bundled.
export const pendingChibiIds=new Set(["larvitar", "tyranitar", "shelgon",...Object.keys(kanto151Species).filter(id=>!chibiAtlas[id]||!shinyChibiAtlas[id])]);
export const artworkPending=c=>pendingChibiIds.has(typeof c==='string'?c:c.form||c.species);
