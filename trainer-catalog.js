import {trainerDirectory} from './trainer-directory.js?v=20261127-unified1';
export const legacyProfiles=[
 {name:'Milo',portrait:'milo',title:'New challenger',team:['pidgey','caterpie'],style:'A balanced first test.'},
 {name:'Iris',portrait:'iris',title:'Woodland specialist',team:['oddish','paras','bulbasaur'],style:'Nature and status moves.'},
 {name:'Marin',portrait:'marin',title:'Coastal challenger',team:['psyduck','squirtle','poliwag'],style:'A team built around Water.'},
 {name:'Ruby',portrait:'ruby',title:'Ember specialist',team:['charmander','growlithe','vulpix'],style:'Fast, offensive Fire Pokémon.'},
 {name:'Flint',portrait:'flint',title:'Veteran challenger',team:['geodude','machop','onix'],style:'A durable physical team.'},
 {name:'Skye',portrait:'skye',title:'Travelling rival',team:['pikachu','eevee','pidgeotto','machoke','kadabra','ivysaur'],style:'A versatile mixed team.'},
 {name:'Rowan',portrait:'explorer-male',title:'Ace trainer',team:['dragonair','gyarados','scyther','magneton','arcanine','alakazam'],style:'An experienced, adaptable challenger.'},
 {name:'Seren',portrait:'explorer-female',title:'Elite challenger',team:['dragonite','blastoise','alakazam','steelix','arcanine','gengar'],style:'A test for established Gym Leaders.'}
];
const keys=['milo','iris','marin','ruby','flint','skye','rowan','seren'];
export const careerTrainers=[...legacyProfiles.map((t,i)=>({...t,id:'defence-'+keys[i],category:'Trainer',group:'classes',type:'Mixed',exhibition:false})),...trainerDirectory];
export const trainerById=new Map(careerTrainers.map(t=>[t.id,t]));
export function trainerReputation(id){const t=trainerById.get(id);if(!t)return Infinity;if(t.category==='Champion')return 2250;if(t.category==='Elite Four'||t.group==='special')return 1750;if(t.category==='Boss')return 1250;if(t.category==='Gym Leader'||t.category==='Admin')return 750;return id.startsWith('defence-')?0:750}
export const trainerUnlocked=(id,rep)=>rep>=trainerReputation(id);
