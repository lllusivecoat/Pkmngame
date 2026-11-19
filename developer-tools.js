import {artworkPending} from './artwork-status.js?v=20261119-town1';
import {selectedArtwork} from './selected-artwork.js?v=20261119-town1';
import {roster} from './data.js?v=20261119-town1';
import {battleForms} from './forms.js?v=20261119-town1';
import {syncLegacy} from './items.js?v=20261119-town1';
import {chibiAtlas,shinyChibiAtlas} from './chibi-sources.js?v=20261119-town1';
export const artworkEntries=[...roster.map(s=>({id:s.id,name:s.name,number:s.number,species:s.id,kind:'species'})),...Object.values(battleForms).map(f=>({id:f.id,name:f.name,number:f.number,species:f.base,form:f.id,kind:f.kind}))];
export function galleryEntries({search='',kind='all'}={}){const words=search.trim().toLowerCase().replace(/-/g,' ').split(/\s+/).filter(Boolean),number=search.trim().match(/^#?0*(\d{1,5})$/);const entries=artworkEntries.filter(e=>(kind==='all'||kind==='kanto'&&e.kind==='species'&&e.number>=1&&e.number<=151||e.kind===kind)&&(number?e.number===Number(number[1]):words.every(w=>e.name.toLowerCase().replace(/-/g,' ').includes(w))));return kind==='kanto'?entries.sort((a,b)=>a.number-b.number):entries}
export function chibiLabel(entry,variant='Normal'){if(artworkPending(entry.form||entry.id))return variant==='Shiny'?'Shiny chibi art pending':'Chibi art pending';if(selectedArtwork[entry.form||entry.id])return 'Selected reference artwork';return variant==='Normal'&&(chibiAtlas[entry.id]||roster.slice(0,18).some(p=>p.id===entry.id))||variant==='Shiny'&&(shinyChibiAtlas[entry.id]||roster.slice(0,18).some(p=>p.id===entry.id))?'Painted chibi':'Pixel chibi · official game sprite'}
export function resetItemsAndGold(s){s.coins=0;s.bag={};s.inventoryVersion=1;syncLegacy(s);for(const c of s.collection)c.heldItem=null;return 'Items and gold reset: 0 coins, empty bag, no held items. Pokémon and journey progress preserved.'}
