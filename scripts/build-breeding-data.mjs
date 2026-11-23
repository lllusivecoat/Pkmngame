import {Dex} from '@pkmn/sim';
import {readFile,writeFile} from 'node:fs/promises';
import {expandedSpecies} from '../engine-data.js';
const directory=process.env.BREEDING_META_CACHE||'/tmp/breeding-meta',out={};
for(const s of Object.values(expandedSpecies)){
 const d=Dex.species.get(s.id),meta=JSON.parse(await readFile(`${directory}/${d.num}.json`)),learnset=Dex.species.getLearnsetData(s.id).learnset||{};
 // Retain Gen8 nursery lists for existing species; new Gen9 species use their canonical Gen9 Egg Moves.
 const maxGen=d.gen>=9?9:8;const available=[...new Set(Object.values(learnset).flat().filter(v=>/^[1-9]E/.test(v)&&Number(v[0])<=maxGen).map(v=>Number(v[0])))],gen=Math.max(0,...available);
 out[s.id]={groups:d.eggGroups,cycles:meta.hatch_counter,eggMoves:Object.entries(learnset).filter(([,sources])=>sources.some(v=>v.startsWith(gen+'E'))).map(([m])=>m)};
}
await writeFile('breeding-data.js','// Canonical Egg Groups, hatch cycles and Gen8 Egg Moves; Gen9 lists for Gen9 species.\nexport const breedingSpecies='+JSON.stringify(out)+';\n');
console.log('Recorded nursery metadata for '+Object.keys(out).length+' species.');
