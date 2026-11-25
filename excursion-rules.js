import {expandedSpecies} from './engine-data.js?v=20261126-world1';
import {isLegendarySpecies} from './pokemon-individuals.js?v=20261126-world1';
import {reserveAwake} from './world-time.js?v=20261126-world1';
import {excursionMaps} from './excursions-data.js?v=20261126-world1';
export const TRIP_ENCOUNTERS=6;
export const tripStage=(s,id)=>excursionMaps[id]?.tier<=2?1:excursionMaps[id]?.tier<=4?2:3;
export function tripOffer(s,id){const m=excursionMaps[id];return m?{id,name:m.name,fee:m.fee,reputation:m.reputation,unlocked:s.gym.reputation>=m.reputation,tier:m.tier,stage:tripStage(s,id),min:m.levels[0],max:m.levels[1]}:null}
export function safeTripSpecies(id){const p=expandedSpecies[id];return !!p&&!isLegendarySpecies(id)&&!p.isNonstandard&&(!p.formRecord||p.formKind==='regional')}
export function tripEvolutionStage(id){let stage=1,p=expandedSpecies[id],seen=new Set([id]);while(p?.prevo){const pre=String(p.prevo).toLowerCase().replace(/[^a-z0-9]/g,'');if(!expandedSpecies[pre]||seen.has(pre))break;seen.add(pre);p=expandedSpecies[pre];stage++}return stage}
export const singleStageSpecies=id=>!!expandedSpecies[id]&&!expandedSpecies[id].prevo&&!expandedSpecies[id].evos.length;
export function tripPool(s,id){const m=excursionMaps[id],o=tripOffer(s,id);if(!m||!o)return [];return Object.keys(expandedSpecies).filter(id=>{const p=expandedSpecies[id],stage=tripEvolutionStage(id),single=singleStageSpecies(id),allowed=m.tier<=2?stage===1&&!single:m.tier<=4?stage===2||single:stage===2||stage===3||single;return safeTripSpecies(id)&&allowed&&(p.evoLevel||1)<=o.max&&(m.pool.includes(id)||p.types.some(t=>m.types.includes(t)))})}
export function pickTripSpecies(s,id,random=Math.random){const pool=tripPool(s,id).filter(id=>reserveAwake(s,id));return pool.length?pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]:null}
export function returnFromTrip(s){const w=s.gym.world;w.location='town';w.position={x:19,y:18};w.facing='down';w.trip=null;w.excursionSteps=0;return 'Six encounters complete. Rook brought you back to Bellwick.'}
