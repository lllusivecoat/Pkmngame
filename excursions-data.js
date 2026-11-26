import {reputationTiers} from './gym-reputation.js?v=20261127-unified1';
const trip=(name,theme,pool,levels,tiles)=>({name,theme,pool:pool.split(' '),levels,size:15,spawn:{x:1,y:7},portals:[],tiles:tiles.map((row,y)=>y===6?row.slice(0,1)+'P'+row.slice(2):y===7?'X'+row.slice(1):row)});
export const excursionMaps={
 bramble:trip('Bramble Grove','forest','caterpie oddish shroomish sewaddle petilil fletchling heracross',[6,12],[
 'XXXXXXXXXXXXXXX','XGGFFFGGGFFFGGX','XGPFFFGPGFFFGGX','XGPPPPPPGFFFGGX','XFFGFGGPGGGGGGX','XFFGFGGPPPPPGGX','XGGGGGGPGGGPGGX','PPPPPPPPGGGPGGX','XGGGFGGPGGGPGGX','XGFFFGGPPPPPGGX','XGFFFGGGGGGGGGX','XGGGGPPPPGGFFFX','XGGGGPGGPGGFFFX','XGGGGPPPPGGGGGX','XXXXXXXXXXXXXXX']),
 tideglass:trip('Tideglass Coast','coast','wingull krabby corphish buizel tympole froakie',[10,18],[
 'XXXXXXXXXXXXXXX','XGGGGGGWWWWWWWX','XGGPPPGWWWWWWWX','XGGPGPGGGWWWWWX','XGGPGPPPGGWWWWX','XGGPGGGPGGGWWWX','XGGPGGGPPPGGWWX','PPPPPPPPGPGGWWX','XGGGGGGPGPGGWWX','XGGPPPPPGGGWWWX','XGGPGGGGGGWWWWX','XGGPPPPGGWWWWWX','XGGGGGPGGWWWWWX','XGGGGGPGGWWWWWX','XXXXXXXXXXXXXXX']),
 emberhollow:trip('Ember Hollow','highland','sandshrew aron numel roggenrola sandile litleo bagon',[15,24],[
 'XXXXXXXXXXXXXXX','XRRRRRGGGGRRRRX','XRGGPPPPPPGGRRX','XRGPPRGGGPGGGRX','XRGPGGGGGPPGGRX','XGGPPPPPGGPGGRX','XGGGGGGPGGPPGRX','PPPPPPPPGGGPGGX','XGGGRRGPPPPPGGX','XGGGRRGGGGGGGRX','XPPPPPGGGRRGGRX','XPGGGPGGGRRGGRX','XPPPPPGGGRRGGRX','XGGGGGGGGRRGGRX','XXXXXXXXXXXXXXX'])
};
const summitTiles=['XXXXXXXXXXXXXXX','XRRRRGGGGRRRRRX','XRRGGGGGGRRRRRX','XGGPPPPPPGGGRRX','XGGPGGGGPGGGRRX','XGGPGGGGPPPPGGX','XGGPGGGGGGGPGGX','PPPPGGGWWWGPGGX','XGGGGGGWWWGPGGX','XGGPPPGGGGGPGGX','XGGPGPPPPPPPGGX','XGGPGGGGGGGGGRX','XGGPPPPPGGRRRRX','XGGGGGGPGGRRRRX','XXXXXXXXXXXXXXX'];
const marshTiles=['XXXXXXXXXXXXXXX','XFFFGGGWWWGGFFX','XFFFGGGWWWGGFFX','XGGGPPPGGGGGGGX','XGGGPGPPPPGWWWX','XWWWPGGGGPGWWWX','XWWWPPPPGPGGGGX','PPPPPGGPGPPPPGX','XGGGGGGPGGGGPGX','XGGWWWGPPPPPPGX','XGGWWWGGGGGPGGX','XGGGGGGPPPPPGGX','XFFGGGGPGGGGFFX','XFFGGGGGGGGGFFX','XXXXXXXXXXXXXXX'];
excursionMaps.moonfen=trip('Moonfen Wetlands','marsh','wooper poliwag gastly spinarak croagunk',[28,42],marshTiles);
excursionMaps.frostwatch=trip('Frostwatch Summit','snow','swinub snorunt snover sneasel bergmite',[38,55],summitTiles);
excursionMaps.sunscar=trip('Sunscar Dunes','desert','hippowdon flygon sandslash krookodile cacturne',[51,60],[
 'XXXXXXXXXXXXXXX','XRRRRRRRRRRRRRX','XRGGGGGRGGGGGRX','XRGPPRGRGPPGGRX','XRGPGGGGGGPGGRX','XRGPPPRRPPPGGRX','XGGGGPGGPGGGGRX','PPPPPPGGPPPPPGX','XRRGGPGGPGGGPGX','XRGGPPPPPGGGPGX','XRGGPGGGPGPPPGX','XRGGPGWWPGPGGRX','XRGGPGWWPPPGGRX','XRRRGGGGGGRRRRX','XXXXXXXXXXXXXXX']);
excursionMaps.ironroot=trip('Ironroot Highlands','ruins','metang aggron lucario magnezone scizor',[61,70],[
 'XXXXXXXXXXXXXXX','XRRRRGGGGGRRRRX','XRGGPPPGGGRRRGX','XRGGPGPGGPPPPGX','XGGGPGPPPPGGPGX','XGPPPGGGGRRGPGX','XGPGGGRRRRGGPGX','PPPGGGRRRRPPPGX','XGPGGGRRGGPGGGX','XGPPPPPPGGPGGGX','XGGGGGGPGGPPPGX','XGWWGGGPGGGGPGX','XGWWGGGPPPPPPGX','XGGGGGGGGGRRRRX','XXXXXXXXXXXXXXX']);
excursionMaps.astralcrown=trip('Astral Crown','astral','dragonite salamence hydreigon gardevoir goodra',[71,80],[
 'XXXXXXXXXXXXXXX','XRRRGGGGGGGRRRX','XRRGPPPPPPPGGRX','XRGGPGWWWGPGGRX','XGGGPGWWWGPGGGX','XGPPPPGGGPPPPGX','XGPGGPGGGPGGPGX','PPPGGPPPPPGGPGX','XGPGGGGGGGGGPGX','XGPPPGXXXGPPPGX','XGGGPGXGXGPGGGX','XGGGPPPPPPPGGGX','XRGGGGGGGGGGGRX','XRRRGGGGGGGRRRX','XXXXXXXXXXXXXXX']);
const themes={bramble:['Grass','Bug','Normal'],tideglass:['Water','Flying'],emberhollow:['Fire','Rock','Ground'],moonfen:['Ghost','Poison','Water'],frostwatch:['Ice','Dragon','Rock'],sunscar:['Ground','Fire','Dragon'],ironroot:['Steel','Fighting','Electric'],astralcrown:['Dragon','Psychic','Fairy']};
for(const [i,t]of reputationTiers.entries())Object.assign(excursionMaps[t.map],{tier:i+1,fee:[0,0,400,650,900,1200,1600,2000][i],reputation:t.reputation,types:themes[t.map],levels:[i*10+1,(i+1)*10]});
export const isExcursion=location=>Object.hasOwn(excursionMaps,location);
