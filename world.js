import {kantoMaps,kantoLeaders} from './kanto-leaders.js?v=20261113-kanto35';
import {areaDesigns} from './area-designs.js?v=20261113-kanto35';
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
// Each region keeps its original settlement and four distinct surrounding habitats.
// Stable area IDs preserve old saves: an absent area means the settlement (hub).
const areaDefinitions=[
 [['hub','Greenwood Village','Your woodland base: Rowan’s Grass Gym and free Pokémon Center.',null],['fernwood','Fernwood Canopy','Dense leaves shelter Ralts and woodland Pokémon.',['ralts','caterpie','oddish','bulbasaur']],['brook','Willow Brook','Follow the stepping-stone trail beside quiet pools.',['squirtle','psyduck','pidgey','ralts']],['ruins','Observatory Woods','Mist gathers beneath the old woodland ruins.',['gastly','murkrow','eevee','ralts']],['shore','Moonlit Shore','An open shoreline with winding grass trails.',['psyduck','squirtle','pikachu','eevee']]],
 [['hub','Ridgeway Outpost','Lyra’s Electric Gym stands beside the mountain Pokémon Center.',null],['meadow','Sparkgrass Meadow','Shinx stalks the charged grass under gathering clouds.',['shinx','mareep','pikachu','pidgey']],['crags','Echo Crags','Rocky switchbacks lead through Shinx territory.',['shinx','geodude','onix','phanpy']],['bridge','Stormbridge Pass','Cross the high bridge and search the sheltered banks.',['shinx','mareep','geodudealola','eevee']],['summit','Thunderhead Summit','The upper ridge opens onto exposed stone and grass.',['shinx','pikachu','mareep','onix']]],
 [['hub','Emberfall Settlement','Rest at the Pokémon Center before Flint’s Fire Gym.',null],['caldera','Cinder Caldera','Numel grazes between warm volcanic stones.',['numel','charmander','growlithe','geodude']],['springs','Ember Springs','Mineral pools interrupt the warm, grassy trails.',['numel','vulpix','growlithehisui','phanpy']],['quarry','Obsidian Quarry','A rough rock trail climbs through old workings.',['numel','geodude','onix','growlithe']],['ruins','Ashen Ruins','Smoky paths lead past forgotten stone walls.',['numel','gastly','vulpix','charmander']]],
 [['hub','Snowbell Village','Sera’s Water Gym and the regional Pokémon Center welcome travellers.',null],['pines','Frostpine Forest','Snover hides among the snow-laden pines.',['snover','vulpixalola','eevee','pidgey']],['lake','Mirrorfrost Lake','Walk the frozen banks; keep clear of the deep water.',['snover','psyduck','squirtle','lapras']],['glade','Aurora Glade','A quiet clearing catches the changing northern sky.',['snover','vulpixalola','ralts','eevee']],['sanctuary','Glacier Sanctuary','The far trail winds through ancient snow-covered stones.',['snover','lapras','murkrow','raichualola']]]
];
for(const [index,z]of zones.entries()){
 z.areas=areaDefinitions[index].map(([id,name,description,species],i)=>({id,name,description,species,...areaDesigns[z.name+'/'+id],map:i===0?z.map:areaDesigns[z.name+'/'+id].map,center:i===0?z.center:null,gym:i===0?z.gym:null,trainers:i===0?z.trainers:[],landmarks:i===0?z.landmarks:[{x:5,y:6,name:name+' viewpoint'}],exits:i===0?[...z.exits]:[]}));
 for(const a of z.areas)a.landmarks.push(...a.points);
 for(let i=0;i<5;i++){
  const a=z.areas[i],next=z.areas[(i+1)%5],prev=z.areas[(i+4)%5];
  a.exits.push({x:9,y:8,to:next.name,toArea:next.id,arrival:{x:1,y:1}},{x:0,y:1,to:prev.name,toArea:prev.id,arrival:{x:8,y:8}});
 }
}
// Exhibition maps are extra destinations; the five-area regional loops remain intact.
const greenwoodHub=zones[0].areas[0];
greenwoodHub.exits.push({x:2,y:8,to:'Kanto Leaders Courtyard',toArea:'kanto-courtyard',arrival:{x:5,y:8}});
export const allTrainers=[...zones.flatMap(z=>z.trainers),...kantoLeaders];
export function mapDestinations(){return [...zones.flatMap(z=>z.areas.map(a=>({key:z.name+'/'+a.id,region:z.name,id:a.id,name:a.name,spawn:a.center?{x:a.center.x,y:a.center.y+1}:{x:1,y:1}}))),...kantoMaps.map(a=>({key:a.region+'/'+a.id,region:a.region,id:a.id,name:a.name,spawn:a.spawn}))]}
export const zoneByName=name=>zones.find(z=>z.name===name);
export const areaById=(region,id)=>[...(zoneByName(region)?.areas||[]),...kantoMaps.filter(a=>a.region===region)].find(a=>a.id===id);
export const areaKey=s=>!s.area||s.area==='hub'?s.region:`${s.region}/${s.area}`;
export function currentZone(s){const z=zoneByName(s.region)||zones[0],a=areaById(z.name,s.area)||z.areas[0];return {...z,...a,name:z.name,areaName:a.name,regionGym:z.gym,regionCenter:z.center}}
export function normalizeAreas(s,raw=s){
 s.area=areaById(s.region,raw.area)?.id||'hub';
 const valid=new Set(mapDestinations().map(a=>a.key));
 s.discoveredAreas=[...new Set([...(Array.isArray(raw.discoveredAreas)?raw.discoveredAreas:[]).filter(k=>valid.has(k)),`${s.region}/${s.area}`])];
 s.visitedTiles=Object.fromEntries(Object.entries(raw.visitedTiles||{}).filter(([k,v])=>Array.isArray(v)&&(zoneByName(k)||valid.has(k))).map(([k,v])=>[k,[...new Set(v.filter(t=>typeof t==='string'&&/^[0-9],[0-9]$/.test(t)))]]));
}
export function returnToCenter(s){s.area='hub';const center=zoneByName(s.region)?.center||zones[0].center;s.position={x:center.x,y:center.y};s.followerPosition=null;normalizeAreas(s);return center}
export function locationAt(s){const z=currentZone(s),{x,y}=s.position;return z.exits.find(l=>l.x===x&&l.y===y)?{...z.exits.find(l=>l.x===x&&l.y===y),kind:'exit'}:z.gym&&x===z.gym.x&&y===z.gym.y?{...z.gym,kind:'gym'}:z.center&&x===z.center.x&&y===z.center.y?{...z.center,kind:'center'}:trainerAt(s)?{...trainerAt(s),kind:'trainer'}:z.landmarks.find(l=>l.x===x&&l.y===y)?{...z.landmarks.find(l=>l.x===x&&l.y===y),kind:'landmark'}:null}
export function discoverLocation(s){const z=currentZone(s),l=locationAt(s),key=areaKey(s);s.visitedTiles??={};s.visitedTiles[key]=[...new Set([...(s.visitedTiles[key]||[]),`${s.position.x},${s.position.y}`])];if(!l)return '';const id=`${key}:${l.kind}:${l.x},${l.y}`;if(s.discoveredLocations.includes(id))return '';s.discoveredLocations.push(id);if(l.kind==='exit'){if(l.toArea){s.discoveredAreas=[...new Set([...(s.discoveredAreas||[]),`${s.region}/${l.toArea}`])];return `NEW AREA DISCOVERED · ${l.to}! Use the trail gate to enter.`}s.unlockedZones=[...new Set([...s.unlockedZones,l.to])];return `NEW ROUTE DISCOVERED · ${l.to} unlocked! Use the route gate to travel.`}return `LOCATION DISCOVERED · ${l.kind==='gym'?l.name+' · Leader '+l.leader:l.name}`}
export function travel(s,to){const z=currentZone(s),exit=z.exits.find(e=>e.to===to&&e.x===s.position.x&&e.y===s.position.y);if(!s.started||!exit||(!exit.toArea&&!s.unlockedZones.includes(to)))return {ok:false,message:'Reach the connecting route gate on foot first.'};if(exit.toArea)s.area=exit.toArea;else{s.region=to;s.area='hub'}s.followerPosition=null;s.position={...exit.arrival};s.facing=exit.x===9?'right':'left';normalizeAreas(s);discoverLocation(s);return {ok:true,message:`Arrived in ${currentZone(s).areaName}, ${s.region}. ${currentZone(s).peaceful?'Meet the visiting trainers. No wild encounters here.':'Explore the trails; the region’s Gym and Pokémon Center are in '+zoneByName(s.region).areas[0].name+'.'}`}}
export const zoneSpecies={Greenwood:null,'Thunder Ridge':['mareep','pikachu','geodude','pidgey','phanpy','eevee','onix','geodudealola'],'Ashlands':['charmander','growlithe','vulpix','geodude','gastly','phanpy','growlithehisui'],Frostfall:['squirtle','psyduck','lapras','murkrow','eevee','pidgey','vulpixalola','raichualola']};
export function areaGuide(s){const z=zoneByName(s.region)||zones[0];return `<section class="panel region-areas"><div class="eyebrow">${z.name.toUpperCase()} · FIVE CONNECTED AREAS</div><h2>Follow the regional trails.</h2><p>Walk to an arrow gate to enter the next area. One ${z.gym.type} Gym and one Pokémon Center serve this region, in ${z.areas[0].name}.</p><ol>${z.areas.map((a,i)=>`<li class="${currentZone(s).id===a.id?'current':''}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${a.name}</strong><small>${currentZone(s).id===a.id?'You are here':s.discoveredAreas?.includes(`${s.region}/${a.id}`)?'Trail discovered':'Unexplored'}${i===0?' · Gym + Center':''}</small></div></li>`).join('')}</ol><p class="hint">The trails form a loop: travel in either direction. Regional routes leave from the settlement.</p></section>`}

// Explicit tester convenience: no XP, coins, items, healing or badges are awarded by jumping.
export function jumpToMap(s,key){const target=mapDestinations().find(d=>d.key===key);if(!s.started||!target)return {ok:false,message:'Choose a partner and a valid map first.'};s.region=target.region;s.area=target.id;s.unlockedZones=[...new Set([...s.unlockedZones,target.region])];s.position={...target.spawn};s.facing='down';s.followerPosition=null;normalizeAreas(s);return {ok:true,message:'Map jump · '+target.name}}
