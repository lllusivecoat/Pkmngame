import {expandedSpecies,engineMoves} from './engine-data.js?v=20261126-trainers1';
import {learnedMoves,gameMoveId,moveIds} from './rules.js?v=20261126-trainers1';
export const trainerTiers=[{id:'rookie',name:'Rookie',reputation:0},{id:'journeyman',name:'Journeyman',reputation:60},{id:'ace',name:'Ace',reputation:300}];
export const trainerTier=s=>s.gym.reputation>=300?'ace':s.gym.reputation>=60?'journeyman':'rookie';
export const TRAINER_MACHINE_LEVEL=25;
const moveKey=id=>gameMoveId(id).replace(/-/g,'');
export function trainerMovePool(c){
 const natural=learnedMoves({...c,knownTM:[],knownEggMoves:[]}),tms=new Set(),seen=new Set();
 if(c.level>=TRAINER_MACHINE_LEVEL){let ancestor=expandedSpecies[c.species];while(ancestor&&!seen.has(ancestor.id)){seen.add(ancestor.id);for(const id of ancestor.tmMoves||[])if(engineMoves[id])tms.add(id);ancestor=expandedSpecies[String(ancestor.prevo||'').toLowerCase().replace(/[^a-z0-9]/g,'')]}}
 const all=new Map(natural.map(m=>[moveKey(m.id),m]));for(const id of tms)if(!all.has(moveKey(id)))all.set(moveKey(id),{...engineMoves[id],id:gameMoveId(id)});
 return {natural,tms,all:[...all.values()]};
}
export function trainOpponent(c,tier='rookie'){const sp=expandedSpecies[c.species],physical=sp.baseStats.attack>=sp.baseStats.specialAttack,offence=physical?'attack':'specialAttack';c.ivs=Object.fromEntries(['hp','attack','defence','specialAttack','specialDefence','speed'].map(k=>[k,tier==='ace'?31:tier==='journeyman'?20:8]));c.evs=tier==='ace'?{[offence]:252,speed:252,hp:4}:tier==='journeyman'?{[offence]:80,speed:80,hp:40}:{};c.nature=tier==='rookie'?'Hardy':physical?'Adamant':'Modest';c.variant='Normal';const {tms,all}=trainerMovePool(c);c.knownTM=[];c.knownEggMoves=[];c.moves=moveIds(c);if(tier==='rookie')return c;
 const damage=all.filter(m=>m.category!=='status'&&m.power>=35&&m.power<=140&&!['explosion','selfdestruct','hyperbeam','gigaimpact','fissure','sheercold','guillotine','horndrill'].includes(m.id));
 const score=m=>(m.power||0)*(m.accuracy===null?1:(m.accuracy||100)/100)*(sp.types.includes(m.type)?1.5:1)*(m.category===(physical?'physical':'special')?1.3:.75);
 damage.sort((a,b)=>score(b)-score(a));const chosen=[],types=new Set();for(const m of damage){if(chosen.length>=3)break;if(types.has(m.type))continue;chosen.push(m);types.add(m.type)}
 const preference=physical?['swordsdance','dragondance','bulkup','recover','roost','synthesis','thunderwave','willowisp','protect']:['nastyplot','calmmind','quiverdance','recover','roost','synthesis','thunderwave','willowisp','protect'];const utility=preference.map(id=>all.find(m=>m.id.replace(/-/g,'')===id)).find(Boolean);if(utility)chosen.push(utility);for(const m of damage)if(chosen.length<4&&!chosen.includes(m))chosen.push(m);if(chosen.length){c.moves=chosen.slice(0,4).map(m=>gameMoveId(m.id));c.knownTM=chosen.filter(m=>tms.has(moveKey(m.id))).map(m=>moveKey(m.id))}if(tier==='ace')c.heldItem='leftovers';return c}

export function trainedSpecies(id,level,tier){if(tier==='rookie')return id;const seen=new Set();while(!seen.has(id)){seen.add(id);const options=(expandedSpecies[id].evos||[]).map(e=>expandedSpecies[e]).filter(e=>e&&(e.evoLevel||1)<=level).sort((a,b)=>Object.values(b.baseStats).reduce((n,v)=>n+v,0)-Object.values(a.baseStats).reduce((n,v)=>n+v,0));if(!options.length)break;id=options[0].id}return id}
