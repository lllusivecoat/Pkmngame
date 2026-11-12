import {Dex} from '@pkmn/sim';
import {writeFile} from 'node:fs/promises';
import {expandedSpecies} from '../engine-data.js';
import {battleForms} from '../forms.js';
const sizes=Object.fromEntries([...Object.values(expandedSpecies),...Object.values(battleForms)].map(p=>{const canonical=Dex.species.get(p.id);if(!canonical.exists)throw Error('Missing size: '+p.id);return [p.id,{height:canonical.heightm,weight:canonical.weightkg}]}));
await writeFile('pokemon-size-data.js','// Canonical species dimensions from the pinned simulator; presentation only.\nexport const pokemonSizes='+JSON.stringify(sizes)+';\n');
console.log('Recorded canonical dimensions for '+Object.keys(sizes).length+' species/forms.');
