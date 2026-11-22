import {normalizeGymWorld} from './gym-world-data.js?v=20261122-welcome1';
// Fixed plots keep a developing town on one reachable map, without replacing Gym saves.
export const townProjects=[
 {id:'training',name:'Training wing',kind:'Gym extension',x:2,y:3,cost:600,reputation:20,description:'Attach a training hall to the west side of your Gym.'},
 {id:'recovery',name:'Recovery wing',kind:'Gym extension',x:12,y:3,cost:800,reputation:40,description:'Attach a bright recovery annex to the east side of your Gym. Recovery remains free.'},
 {id:'trophy',name:'Trophy gallery',kind:'Gym extension',x:7,y:0,cost:1200,reputation:80,description:'Raise a gallery behind your Gym to celebrate your team.'},
 {id:'garden',name:'Town garden',kind:'Town upgrade',x:2,y:7,cost:300,reputation:0,description:'Turn the western clearing into a flower garden with benches.'},
 {id:'market',name:'Market forecourt',kind:'Town upgrade',x:12,y:7,cost:450,reputation:20,description:'Add cosmetic stalls beside the Pokémon Market. Upgrade the Market itself at its counter.'},
 {id:'homes',name:'Residential lane',kind:'Town upgrade',x:2,y:11,cost:900,reputation:60,description:'Welcome residents with cottages along the southern road.'},
 {id:'fountain',name:'Fountain plaza',kind:'Town upgrade',x:7,y:11,cost:600,reputation:40,description:'Give your town a gathering place on the main avenue.'},
 {id:'harbour',name:'Riverside promenade',kind:'Town upgrade',x:12,y:11,cost:1000,reputation:80,description:'Build a boardwalk and pavilion beside the river.'}
];
export function normalizeTown(raw){return {version:1,projects:Object.fromEntries(townProjects.map(p=>[p.id,Number.isInteger(raw?.projects?.[p.id])?Math.min(3,Math.max(0,raw.projects[p.id])):0]))}}
export function townSummary(s){const town=normalizeTown(s.gym.town),built=Object.values(town.projects).filter(n=>n>0).length,levels=Object.values(town.projects).reduce((a,n)=>a+n,0);return {built,levels,total:townProjects.length,stage:built>=7?'Thriving town':built>=4?'Growing village':built>=1?'New settlement':'Gym outpost',residents:town.projects.homes*6}}
export function townProjectState(s,id){const p=townProjects.find(p=>p.id===id);if(!p)return null;const level=normalizeTown(s.gym.town).projects[id],cost=p.cost*(level+1),reputation=p.reputation+level*40;return {...p,level,cost,reputation,maxed:level===3,canBuild:level<3&&!!s.collection.length&&!s.gym.session&&s.coins>=cost&&s.gym.reputation>=reputation}}
export function buildTownProject(s,id){const p=townProjectState(s,id);if(!p)return 'Unknown building plot.';if(s.gym.session)return 'Finish the current challenge before building.';if(!s.collection.length)return 'Buy your first Pokémon before developing the town.';if(p.maxed)return 'This project is fully upgraded.';if(s.gym.reputation<p.reputation)return 'Requires '+p.reputation+' Gym reputation.';if(s.coins<p.cost)return 'Not enough coins. Defend your Gym to earn building funds.';s.gym.town=normalizeTown(s.gym.town);s.coins-=p.cost;s.gym.town.projects[id]++;if(s.gym.world)s.gym.world=normalizeGymWorld(s.gym.world,s.gym.town);return p.name+(p.level?' upgraded':' built')+' · Level '+(p.level+1)+' / 3. Your town has grown!'}
