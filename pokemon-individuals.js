import {masteryRank} from './mastery.js?v=20261125-care2';
import {canonicalIdentity} from './species-identity-data.js?v=20261125-care2';
const metadata=id=>canonicalIdentity[id];
export function rollGender(species,random=Math.random){const m=metadata(species);return m?.gender||((random()<(m?.female??.5))?'F':'M')}
export function normalizeGender(c){const m=metadata(c.species);if(m?.gender)return m.gender;if(['M','F'].includes(c.gender)&&!(c.gender==='F'&&m?.female===0)&&!(c.gender==='M'&&m?.female===1))return c.gender;let seed=0;for(const ch of c.uid||c.species)seed=(Math.imul(seed,31)+ch.charCodeAt(0))>>>0;return rollGender(c.species,()=>seed/4294967296)}
export function genderLabel(c){const g=normalizeGender(c);return g==='N'?'Genderless':g==='F'?'♀ Female':'♂ Male'}
export const isLegendarySpecies=id=>!!metadata(id)?.legendary;
export const BASE_SHINY_CHANCE=1/4096;
export const MARKET_SHINY_CHANCE=1/4096;
export const SHINY_MASTERY_MULTIPLIERS=[1,2,4,6,8];
export function shinyHunt(s,id){const partners=(s?.collection||[]).filter(c=>c.species===id),rank=partners.reduce((highest,c)=>Math.max(highest,masteryRank(c)),0),multiplier=SHINY_MASTERY_MULTIPLIERS[Math.max(0,rank-1)];return {rank,multiplier,chance:BASE_SHINY_CHANCE*multiplier}}
export function rollWildShiny(s,id,random=Math.random){return random()<shinyHunt(s,id).chance?'Shiny':'Normal'}
