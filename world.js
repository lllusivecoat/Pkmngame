// Separate, connected areas. Only the active map is rendered.
const greenwood=['FFFFGGGGGG','FGGGWWGFPP','FGPPWWGFPG','GGPPGBGPPP','FGPPGWRRPG','FGGPGWRRPG','FGGPGBGRPG','FFFGGWFPPR','FGGPPPPPGG','FFGGGFFFFF'];
const ridge=['RRRRGGRRRR','RRGGPPPPPP','RRGPPWRGPG','RGPPGWRGPG','RGPPRBRGPG','RGGPGWRGPG','RGGPGGRGPG','RGGPPPPPPG','PPPPGRRGGG','RRRGGGGRRR'];
const ash=['RRRRGRRRRR','RRGGPPPPPP','RRGPPWRRPG','RGPPGWRRPG','RGPPRBRRPG','RGGPGWRRPG','RRGPGGRRPG','RRGPPPPPPG','PPPPGRRGGG','RRRRGGGRRR'];
const frost=['FFFFGGRRRF','FGGGPPPPPP','FGGPPWWFPG','FGPPGWWFPG','FGPPPBBPPG','FGGPGWWFPG','FGGPGGFFPG','FGGPPPPPPG','PPPPGFFGGG','FFFFGGFFFF'];
const make=(name,map,leader,type,badge,team,levels,description,palette)=>({name,map,center:{x:2,y:3,name:name+' Pokémon Center'},gym:{x:7,y:7,name:name+' Gym',leader,type,badge,team},levels,description,palette,exits:[],landmarks:[{x:7,y:0,name:name==='Greenwood'?'Ruined Observatory':name==='Thunder Ridge'?'Stormwatch Spire':name==='Ashlands'?'Cinder Lookout':'Frozen Sanctuary'},{x:4,y:8,name:name==='Greenwood'?'Fern Meadow':name==='Thunder Ridge'?'Echo Crags':name==='Ashlands'?'Ember Springs':'Snowbell Grove'}]});
export const zones=[
 make('Greenwood',greenwood,'Rowan','Grass','Canopy Badge',['oddish','caterpie','bulbasaur'],[4,8],'Woodland trails, an eastern shoreline, and the old observatory.','woodland'),
 make('Thunder Ridge',ridge,'Lyra','Electric','Tempest Badge',['mareep','pidgey','pikachu'],[7,12],'Cross the high bridges and follow the charged stones.','ridge'),
 make('Ashlands',ash,'Flint','Fire','Cinder Badge',['geodude','vulpix','growlithe'],[10,15],'Warm stone paths wind around mineral pools and ember clearings.','ash'),
 make('Frostfall',frost,'Sera','Water','Glacier Badge',['squirtle','psyduck','lapras'],[13,18],'Snowy pines shelter a still lake and a waterside gym.','frost')
];
// Local trainers are optional challenges, reached on foot. Their IDs survive save migrations.
const trainerGroups=[
 [['fern','Fern','Bug Catcher',3,2,['caterpie','oddish'],5,'The canopy is full of surprises. Ready for a friendly match?'],['milo','Milo','Trail Scout',3,5,['pidgey','eevee'],7,'A good partner makes every trail feel shorter. Let’s test our teamwork!']],
 [['iris','Iris','Storm Watcher',3,2,['mareep','pikachu'],9,'Watch the clouds—and watch our footwork!'],['hugo','Hugo','Hiker',7,5,['geodude','phanpy'],11,'Steady steps and sturdy partners. That’s my way.']],
 [['ruby','Ruby','Ember Ranger',3,2,['vulpix','growlithe'],12,'Keep a cool head, even when the battle heats up.'],['ashby','Ashby','Ruin Explorer',8,6,['gastly','charmander'],14,'There’s always another story beneath the ash.']],
 [['skye','Skye','Snow Guide',3,2,['eevee','pidgey'],15,'The snow is quiet. Our battle won’t be!'],['marin','Marin','Lake Keeper',8,5,['psyduck','lapras'],17,'Take a breath. Find your rhythm. Then make your move.']]
];
for(const [i,z]of zones.entries()){z.trainers=trainerGroups[i].map(([id,name,title,x,y,team,level,dialogue])=>({id,name,title,x,y,team,level,dialogue,sprite:'assets/trainers/'+id+'.svg',portrait:id}));z.gym.sprite='assets/trainers/'+['fern','iris','ruby','marin'][i]+'.svg';z.gym.portrait=['rowan','lyra','flint','sera'][i]}
zones[1].trainers.push({id:'brock',name:'Brock',title:'Visiting Gym Leader',x:6,y:8,team:['geodude','onix','golem'],level:12,dialogue:'My rock-hard determination is evident in every Pokémon I train. Show me your teamwork!',portrait:'brock',sprite:'assets/trainers/hugo.svg',challenge:{name:'Brock’s Rock Gym',badge:'Boulder Badge'}});
export const trainerAt=s=>currentZone(s).trainers.find(t=>t.x===s.position.x&&t.y===s.position.y);
for(let i=0;i<zones.length;i++){
 if(i>0)zones[i].exits.push({x:0,y:8,to:zones[i-1].name,arrival:{x:8,y:1}});
 if(i<zones.length-1)zones[i].exits.push({x:9,y:1,to:zones[i+1].name,arrival:{x:1,y:8}});
}
export const zoneByName=name=>zones.find(z=>z.name===name);
export const currentZone=s=>zoneByName(s.region)||zones[0];
export function locationAt(s){const z=currentZone(s),{x,y}=s.position;return z.exits.find(l=>l.x===x&&l.y===y)?{...z.exits.find(l=>l.x===x&&l.y===y),kind:'exit'}:x===z.gym.x&&y===z.gym.y?{...z.gym,kind:'gym'}:x===z.center.x&&y===z.center.y?{...z.center,kind:'center'}:trainerAt(s)?{...trainerAt(s),kind:'trainer'}:z.landmarks.find(l=>l.x===x&&l.y===y)?{...z.landmarks.find(l=>l.x===x&&l.y===y),kind:'landmark'}:null}
export function discoverLocation(s){const z=currentZone(s),l=locationAt(s);s.visitedTiles??={};s.visitedTiles[z.name]=[...new Set([...(s.visitedTiles[z.name]||[]),`${s.position.x},${s.position.y}`])];if(!l)return '';const id=`${z.name}:${l.kind}:${l.x},${l.y}`;if(s.discoveredLocations.includes(id))return '';s.discoveredLocations.push(id);if(l.kind==='exit'){s.unlockedZones=[...new Set([...s.unlockedZones,l.to])];return `NEW ROUTE DISCOVERED · ${l.to} unlocked! Use the route gate to travel.`}return `LOCATION DISCOVERED · ${l.kind==='gym'?l.name+' · Leader '+l.leader:l.name}`}
export function travel(s,to){const z=currentZone(s),exit=z.exits.find(e=>e.to===to&&e.x===s.position.x&&e.y===s.position.y);if(!s.started||!exit||!s.unlockedZones.includes(to))return {ok:false,message:'Reach the connecting route gate on foot first.'};s.region=to;s.followerPosition=null;s.position={...exit.arrival};s.facing=to===zones[zones.indexOf(z)+1]?.name?'right':'left';discoverLocation(s);return {ok:true,message:`Arrived in ${to}. Find its Pokémon Center, trainers, gym and next route.`}}
export const zoneSpecies={Greenwood:null,'Thunder Ridge':['mareep','pikachu','geodude','pidgey','phanpy','eevee','onix','geodudealola'],'Ashlands':['charmander','growlithe','vulpix','geodude','gastly','phanpy','growlithehisui'],Frostfall:['squirtle','psyduck','lapras','murkrow','eevee','pidgey','vulpixalola','raichualola']};
