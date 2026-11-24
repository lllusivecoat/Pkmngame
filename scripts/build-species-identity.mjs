// Refresh after adding permanent species. Canonical data comes from the pinned simulator.
import {Dex} from '@pkmn/sim';import {expandedSpecies} from '../engine-data.js';import {writeFile} from 'node:fs/promises';
const all=new Map([...Object.keys(expandedSpecies).map(id=>Dex.species.get(id)),...Dex.species.all().filter(p=>p.num>=1&&p.num<=1025&&!p.forme&&p.name===p.baseSpecies)].map(p=>[p.id,p]));
const data=Object.fromEntries([...all].map(([id,p])=>[id,{gender:p.gender||'',female:p.genderRatio.F,legendary:[...p.tags,...Dex.species.get(p.baseSpecies).tags].some(t=>['Sub-Legendary','Restricted Legendary','Mythical'].includes(t))}]));
await writeFile('species-identity-data.js','// Canonical gender and legendary/mythical classification from pinned @pkmn/sim.\nexport const canonicalIdentity='+JSON.stringify(data)+';\n');
console.log('Recorded canonical identity for '+all.size+' species.');
