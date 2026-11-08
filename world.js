// Separate, connected areas. Only the active map is rendered.
const greenwood=['FFFFGGGGGG','FGGGWWGFPP','FGPPWWGFPG','GGPPGBGPPP','FGPPGWRRPG','FGGPGWRRPG','FGGPGBGRPG','FFFGGWFPPR','FGGPPPPPGG','FFGGGFFFFF'];
const ridge=['RRRRGGRRRR','RRGGPPPPPP','RRGPPWRGPG','RGPPGWRGPG','RGPPRBRGPG','RGGPGWRGPG','RGGPGGRGPG','RGGPPPPPPG','PPPPGRRGGG','RRRGGGGRRR'];
const ash=['RRRRGRRRRR','RRGGPPPPPP','RRGPPWRRPG','RGPPGWRRPG','RGPPRBRRPG','RGGPGWRRPG','RRGPGGRRPG','RRGPPPPPPG','PPPPGRRGGG','RRRRGGGRRR'];
const frost=['FFFFGGRRRF','FGGGPPPPPP','FGGPPWWFPG','FGPPGWWFPG','FGPPPBBPPG','FGGPGWWFPG','FGGPGGFFPG','FGGPPPPPPG','PPPPGFFGGG','FFFFGGFFFF'];
const make=(name,map,leader,type,badge,team,levels,description,palette)=>({name,map,camp:{x:2,y:3},gym:{x:7,y:7,name:name+' Gym',leader,type,badge,team},levels,description,palette,exits:[],landmarks:[{x:7,y:0,name:name==='Greenwood'?'Ruined Observatory':name==='Thunder Ridge'?'Stormwatch Spire':name==='Ashlands'?'Cinder Lookout':'Frozen Sanctuary'},{x:4,y:8,name:name==='Greenwood'?'Fern Meadow':name==='Thunder Ridge'?'Echo Crags':name==='Ashlands'?'Ember Springs':'Snowbell Grove'}]});
export const zones=[
 make('Greenwood',greenwood,'Rowan','Grass','Canopy Badge',['oddish','caterpie','bulbasaur'],[4,8],'Woodland trails, an eastern shoreline, and the old observatory.','woodland'),
 make('Thunder Ridge',ridge,'Lyra','Electric','Tempest Badge',['mareep','pidgey','pikachu'],[7,12],'Cross the high bridges and follow the charged stones.','ridge'),
 make('Ashlands',ash,'Flint','Fire','Cinder Badge',['geodude','vulpix','growlithe'],[10,15],'Warm stone paths wind around mineral pools and ember clearings.','ash'),
 make('Frostfall',frost,'Sera','Water','Glacier Badge',['squirtle','psyduck','lapras'],[13,18],'Snowy pines shelter a still lake and a waterside gym.','frost')
];
for(let i=0;i<zones.length;i++){
 if(i>0)zones[i].exits.push({x:0,y:8,to:zones[i-1].name,arrival:{x:8,y:1}});
 if(i<zones.length-1)zones[i].exits.push({x:9,y:1,to:zones[i+1].name,arrival:{x:1,y:8}});
}
export const zoneByName=name=>zones.find(z=>z.name===name);
export const currentZone=s=>zoneByName(s.region)||zones[0];
export function locationAt(s){const z=currentZone(s),{x,y}=s.position;return z.exits.find(l=>l.x===x&&l.y===y)?{...z.exits.find(l=>l.x===x&&l.y===y),kind:'exit'}:x===z.gym.x&&y===z.gym.y?{...z.gym,kind:'gym'}:x===z.camp.x&&y===z.camp.y?{...z.camp,name:'Trail camp',kind:'camp'}:z.landmarks.find(l=>l.x===x&&l.y===y)?{...z.landmarks.find(l=>l.x===x&&l.y===y),kind:'landmark'}:null}
export function discoverLocation(s){const z=currentZone(s),l=locationAt(s);s.visitedTiles??={};s.visitedTiles[z.name]=[...new Set([...(s.visitedTiles[z.name]||[]),`${s.position.x},${s.position.y}`])];if(!l)return '';const id=`${z.name}:${l.kind}:${l.x},${l.y}`;if(s.discoveredLocations.includes(id))return '';s.discoveredLocations.push(id);if(l.kind==='exit'){s.unlockedZones=[...new Set([...s.unlockedZones,l.to])];return `NEW ROUTE DISCOVERED · ${l.to} unlocked! Use the route gate to travel.`}return `LOCATION DISCOVERED · ${l.kind==='gym'?l.name+' · Leader '+l.leader:l.name}`}
export function travel(s,to){const z=currentZone(s),exit=z.exits.find(e=>e.to===to&&e.x===s.position.x&&e.y===s.position.y);if(!s.started||!exit||!s.unlockedZones.includes(to))return {ok:false,message:'Reach the connecting route gate on foot first.'};s.region=to;s.position={...exit.arrival};s.facing=to===zones[zones.indexOf(z)+1]?.name?'right':'left';discoverLocation(s);return {ok:true,message:`Arrived in ${to}. Find its camp, gym and next route.`}}
export const zoneSpecies={Greenwood:null,'Thunder Ridge':['mareep','pikachu','geodude','pidgey','phanpy','eevee'],'Ashlands':['charmander','growlithe','vulpix','geodude','gastly','phanpy'],Frostfall:['squirtle','psyduck','lapras','murkrow','eevee','pidgey']};
