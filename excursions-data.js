const trip=(name,theme,pool,levels,tiles)=>({name,theme,pool:pool.split(' '),levels,size:15,spawn:{x:1,y:7},portals:[{x:0,y:7,to:'town',arrival:{x:19,y:18},label:'Return to Bellwick'}],tiles});
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
excursionMaps.moonfen=trip('Moonfen Wetlands','forest','wooper poliwag gastly spinarak croagunk',[28,42],marshTiles);
excursionMaps.frostwatch=trip('Frostwatch Summit','highland','swinub snorunt snover sneasel bergmite',[38,55],summitTiles);
for(const [id,fee,reputation,types]of [['bramble',150,0,['Grass','Bug','Normal']],['tideglass',250,60,['Water','Flying']],['emberhollow',400,180,['Fire','Rock','Ground']],['moonfen',650,400,['Ghost','Poison','Water']],['frostwatch',900,800,['Ice','Dragon','Rock']]])Object.assign(excursionMaps[id],{fee,reputation,types});
export const isExcursion=location=>Object.hasOwn(excursionMaps,location);
