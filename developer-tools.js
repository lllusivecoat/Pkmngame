import {roster} from './data.js?v=20261111-palettes31';
import {battleForms} from './forms.js?v=20261111-palettes31';
import {syncLegacy} from './items.js?v=20261111-palettes31';
import {chibiAtlas,shinyChibiAtlas} from './chibi-sources.js?v=20261111-palettes31';
export const artworkEntries=[...roster.map(s=>({id:s.id,name:s.name,species:s.id,kind:'species'})),...Object.values(battleForms).map(f=>({id:f.id,name:f.name,species:f.base,form:f.id,kind:f.kind}))];
export function galleryEntries({search='',kind='all'}={}){const words=search.trim().toLowerCase().split(/\s+/).filter(Boolean);return artworkEntries.filter(e=>(kind==='all'||e.kind===kind)&&words.every(w=>e.name.toLowerCase().replace(/-/g,' ').includes(w)))}
export function chibiLabel(entry,variant='Normal'){return variant==='Normal'&&(chibiAtlas[entry.id]||roster.slice(0,18).some(p=>p.id===entry.id))||variant==='Shiny'&&(shinyChibiAtlas[entry.id]||roster.slice(0,18).some(p=>p.id===entry.id))?'Painted chibi':'Pixel chibi · official game sprite'}
export function resetItemsAndGold(s){s.coins=0;s.bag={};s.inventoryVersion=1;syncLegacy(s);for(const c of s.collection)c.heldItem=null;return 'Items and gold reset: 0 coins, empty bag, no held items. Pokémon and journey progress preserved.'}
