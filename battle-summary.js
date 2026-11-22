import {xpAtLevel} from './progression.js?v=20261122-villainportraits1';
import {expandedSpecies} from './engine-data.js?v=20261122-villainportraits1';
const totalXP=c=>xpAtLevel(c.level,expandedSpecies[c.species]?.growth)+(c.xp||0);
export function startBattleSummary(s){return {coins:s.coins,team:s.party.map(uid=>s.collection.find(c=>c.uid===uid)).filter(Boolean).map(c=>({uid:c.uid,species:c.species,level:c.level,xp:totalXP(c)}))}}
export function finishBattleSummary(s,start){return {coins:s.coins-start.coins,team:start.team.map(old=>{const c=s.collection.find(c=>c.uid===old.uid);return {uid:old.uid,species:c?.species||old.species,fromLevel:old.level,level:c?.level||old.level,xp:c?Math.max(0,totalXP(c)-old.xp):0}})}}
