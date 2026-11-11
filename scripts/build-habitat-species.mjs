// Canonical snapshots: PokeAPI api-data metadata and the pinned simulator's learnsets.
// Input is downloaded only during development; gameplay uses the generated static module.
import {Dex} from '@pkmn/sim';import{readFile,writeFile}from'node:fs/promises';
const input=JSON.parse(await readFile('/tmp/new-species.json','utf8')),result={},statKeys={hp:'hp',attack:'attack',defense:'defence','special-attack':'specialAttack','special-defense':'specialDefence',speed:'speed'};
const roots={ralts:['ralts','kirlia','gardevoir','gallade'],shinx:['shinx','luxio','luxray'],numel:['numel','camerupt'],snover:['snover','abomasnow']};
const field={ralts:{habitat:'Forest',activity:'Dusk',weather:'Fog',description:'A sensitive woodland companion that senses the feelings of nearby people.'},shinx:{habitat:'Grass',activity:'Dusk',weather:'Storm',description:'Sparks flicker through the meadow when this curious young hunter stretches.'},numel:{habitat:'Rocky clearing',activity:'Day',weather:'Clear',description:'A steady wanderer that carries the heat of the volcanic trails within it.'},snover:{habitat:'Forest',activity:'Morning',weather:'Fog',description:'It blends into the frosty pines, quietly watching travellers pass.'}};
for(const [id,{pokemon:p,species:meta}]of Object.entries(input)){
 const d=Dex.species.get(id),origin=Object.keys(roots).find(k=>roots[k].includes(id));
 const version=['scarlet-violet','sword-shield','ultra-sun-ultra-moon'].find(v=>p.moves.some(m=>m.version_group_details.some(g=>g.version_group.name===v&&g.move_learn_method.name==='level-up')));
 const learnset=p.moves.flatMap(m=>{const entries=m.version_group_details.filter(g=>g.version_group.name===version&&g.move_learn_method.name==='level-up');return entries.map(e=>({id:Dex.moves.get(m.move.name).id,number:Dex.moves.get(m.move.name).num,level:e.level_learned_at}))}).filter(m=>m.number>0).sort((a,b)=>a.level-b.level||a.number-b.number);
 const tmMoves=p.moves.filter(m=>m.version_group_details.some(g=>g.version_group.name===version&&g.move_learn_method.name==='machine')).map(m=>Dex.moves.get(m.move.name).id).sort();
 result[id]={id,name:d.name,number:d.num,origin,catchRate:meta.capture_rate,growth:meta.growth_rate.name,friendship:meta.base_happiness,baseExperience:p.base_experience,evYield:Object.fromEntries(p.stats.filter(v=>v.effort).map(v=>[statKeys[v.stat.name],v.effort])),types:d.types,baseStats:Object.fromEntries(p.stats.map(v=>[statKeys[v.stat.name],v.base_stat])),abilities:d.abilities,weight:d.weightkg,genderRatio:d.genderRatio,gender:d.gender,prevo:d.prevo,evos:d.evos.map(v=>Dex.species.get(v).id),learnset,tmMoves,version,...field[origin]};
 for(const key of ['evoType','evoItem','evoLevel','evoCondition'])if(d[key])result[id][key]=d[key];
 if(id==='gallade')result[id].evoGender='M';
}
await writeFile('habitat-species.js','// Canonical stats, abilities, moves and evolution requirements. See scripts/build-habitat-species.mjs.\nexport const habitatSpecies='+JSON.stringify(result)+';\n');console.log('Generated',Object.keys(result).length,'species snapshots');
