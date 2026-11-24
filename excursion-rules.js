import {expandedSpecies} from './engine-data.js?v=20261125-visitors1';
import {isLegendarySpecies} from './pokemon-individuals.js?v=20261125-visitors1';
import {evolutionStage} from './gym-commerce.js?v=20261125-visitors1';
import {reserveAwake} from './world-time.js?v=20261125-visitors1';
import {excursionMaps} from './excursions-data.js?v=20261125-visitors1';
export const TRIP_ENCOUNTERS=6;
export const tripStage=s=>s.gym.reputation>=300?3:s.gym.reputation>=60?2:1;
export function tripOffer(s,id){const m=excursionMaps[id];if(!m)return null;const bonus=Math.min(20,Math.floor(s.gym.reputation/150)*2);return {id,name:m.name,fee:m.fee,reputation:m.reputation,unlocked:s.gym.reputation>=m.reputation,stage:tripStage(s),min:Math.min(85,m.levels[0]+bonus),max:Math.min(90,m.levels[1]+bonus)}}
export function safeTripSpecies(id){const p=expandedSpecies[id];return !!p&&!isLegendarySpecies(id)&&!p.isNonstandard&&(!p.formRecord||p.formKind==='regional')}
export function tripPool(s,id){const m=excursionMaps[id],o=tripOffer(s,id);if(!m||!o)return [];return Object.keys(expandedSpecies).filter(id=>safeTripSpecies(id)&&evolutionStage(id)<=o.stage&&(expandedSpecies[id].evoLevel||1)<=o.max&&(m.pool.includes(id)||expandedSpecies[id].types.some(t=>m.types.includes(t))))}
export function pickTripSpecies(s,id,random=Math.random){const pool=tripPool(s,id).filter(id=>reserveAwake(s,id));if(!pool.length)return null;const preferred=pool.filter(id=>evolutionStage(id)===tripStage(s));const choices=preferred.length&&random()<.55?preferred:pool;return choices[Math.min(choices.length-1,Math.floor(random()*choices.length))]}
export function returnFromTrip(s){const w=s.gym.world;w.location='town';w.position={x:19,y:18};w.facing='down';w.trip=null;w.excursionSteps=0;return 'Six encounters complete. Rook brought you back to Bellwick.'}
