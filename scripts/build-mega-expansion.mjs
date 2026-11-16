// Build canonical Mega snapshots; only forms with both painted palettes may go live.
import{Dex}from'@pkmn/sim';import{readFile,writeFile}from'node:fs/promises';import{existsSync}from'node:fs';
const refs=JSON.parse(await readFile('docs/mega-reference-index.json','utf8')),all={};
for(const row of refs){const id=row.identifier.replaceAll('-',''),d=Dex.species.get(id);if(!d.exists)throw Error('Unknown Mega '+id);all[id]={id,name:d.name,base:Dex.species.get(d.baseSpecies).id,kind:'mega',number:Number(row.id),types:d.types,baseStats:{hp:d.baseStats.hp,attack:d.baseStats.atk,defence:d.baseStats.def,specialAttack:d.baseStats.spa,specialDefence:d.baseStats.spd,speed:d.baseStats.spe},ability:d.abilities['0'],stone:Dex.items.get(d.requiredItem).id,gen:d.gen};}
await writeFile('docs/mega-expansion-plan.json',JSON.stringify(all,null,2)+'\n');
const active=JSON.parse(await readFile('docs/active-megas.json','utf8'));
for(const id of active){if(!all[id])throw Error('Unknown active Mega '+id);for(const folder of['','shiny/'])if(!existsSync('assets/chibi-painted/'+folder+id+'.webp'))throw Error('Missing paired painted art '+id);}
await writeFile('mega-expansion.js','// Canonical temporary Mega transformations with paired painted artwork.\nexport const megaExpansionForms='+JSON.stringify(Object.fromEntries(active.map(id=>[id,all[id]])))+';\n');
console.log('Prepared '+Object.keys(all).length+' related Megas; activated '+active.length+'.');
