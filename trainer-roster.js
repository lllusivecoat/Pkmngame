import {expandedSpecies} from './engine-data.js?v=20261126-roster1';
const key=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
export const rosterColumns=[...Array.from({length:6},(_,i)=>['Pokemon '+(i+7),'Level '+(i+7)]).flat(),'Battle team size','Evolution stage'];
export function rosterSpecies(id,level,stage=0){
 if(!stage)return id;
 const chain=[],seen=new Set();let current=expandedSpecies[id];
 while(current&&!seen.has(current.id)){seen.add(current.id);chain.unshift(current);current=expandedSpecies[key(current.prevo)]}
 // A final species pins its branch. A base/intermediate roster entry follows its first registered evolution.
 current=chain.at(-1);while(current?.evos?.length&&chain.length<5){const next=current.evos.map(key).map(id=>expandedSpecies[id]).find(p=>p&&!seen.has(p.id));if(!next)break;chain.push(next);seen.add(next.id);current=next}
 let result=chain[0]?.id||id;
 for(let i=1;i<Math.min(stage,chain.length);i++){const p=chain[i],minimum=p.evoLevel||((p.evoType==='levelFriendship')?10:(i===1?20:35));if(level<minimum)break;result=p.id}
 return result;
}
export function selectRoster(row){
 if(!row.teamSize)return {...row,team:[...row.team],levels:[...row.levels]};
 const count=Math.min(row.teamSize,row.team.length),offset=(row.selectionOffset??0)%row.team.length,indices=Array.from({length:count},(_,i)=>(offset+i)%row.team.length);
 return {...row,roster:[...row.team],team:indices.map(i=>rosterSpecies(row.team[i],row.levels[i],row.evolutionStage)),levels:indices.map(i=>row.levels[i])};
}
