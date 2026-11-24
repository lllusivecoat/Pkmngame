import {gymClock} from './gym-clock.js?v=20261125-visitors1';
import {expandedSpecies} from './engine-data.js?v=20261125-visitors1';
export const playerPeriod=s=>s.gym?gymClock(s).period:s.time||'Day';
export const isNight=period=>period==='Night';
const nocturnal=new Set('hoothoot noctowl murkrow honchkrow misdreavus mismagius gastly haunter gengar zubat golbat crobat umbreon chingling chimecho sableye shuppet banette duskull dusclops dusknoir sneasel weavile gligar gliscor spinarak ariados cleffa clefairy clefable lunatone volbeat illumise'.split(' '));
const diurnal=new Set('ledyba ledian sunkern sunflora espeon budew roselia roserade riolu lucario starly staravia staraptor swablu altaria hoppip skiploom jumpluff beautifly butterfree combee vespiquen'.split(' '));
export function reserveActivity(id){return nocturnal.has(id)?'Night':diurnal.has(id)?'Day':'Any time'}
export function reserveAwake(s,id){const activity=reserveActivity(id),night=isNight(playerPeriod(s));return activity==='Any time'||(activity==='Night'?night:!night)}
