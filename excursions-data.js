const trip=(name,theme,pool,levels,tiles)=>({name,theme,pool:pool.split(' '),levels,size:15,spawn:{x:1,y:7},portals:[{x:0,y:7,to:'town',arrival:{x:19,y:21},label:'Return to Bellwick'}],tiles});
export const excursionMaps={
 bramble:trip('Bramble Grove','forest','caterpie oddish shroomish sewaddle petilil fletchling heracross',[6,12],[
 'XXXXXXXXXXXXXXX','XGGFFFGGGFFFGGX','XGPFFFGPGFFFGGX','XGPPPPPPGFFFGGX','XFFGFGGPGGGGGGX','XFFGFGGPPPPPGGX','XGGGGGGPGGGPGGX','PPPPPPPPGGGPGGX','XGGGFGGPGGGPGGX','XGFFFGGPPPPPGGX','XGFFFGGGGGGGGGX','XGGGGPPPPGGFFFX','XGGGGPGGPGGFFFX','XGGGGPPPPGGGGGX','XXXXXXXXXXXXXXX']),
 tideglass:trip('Tideglass Coast','coast','wingull krabby corphish buizel tympole froakie',[10,18],[
 'XXXXXXXXXXXXXXX','XGGGGGGWWWWWWWX','XGGPPPGWWWWWWWX','XGGPGPGGGWWWWWX','XGGPGPPPGGWWWWX','XGGPGGGPGGGWWWX','XGGPGGGPPPGGWWX','PPPPPPPPGPGGWWX','XGGGGGGPGPGGWWX','XGGPPPPPGGGWWWX','XGGPGGGGGGWWWWX','XGGPPPPGGWWWWWX','XGGGGGPGGWWWWWX','XGGGGGPGGWWWWWX','XXXXXXXXXXXXXXX']),
 emberhollow:trip('Ember Hollow','highland','sandshrew aron numel roggenrola sandile litleo bagon',[15,24],[
 'XXXXXXXXXXXXXXX','XRRRRRGGGGRRRRX','XRGGPPPPPPGGRRX','XRGPPRGGGPGGGRX','XRGPGGGGGPPGGRX','XGGPPPPPGGPGGRX','XGGGGGGPGGPPGRX','PPPPPPPPGGGPGGX','XGGGRRGPPPPPGGX','XGGGRRGGGGGGGRX','XPPPPPGGGRRGGRX','XPGGGPGGGRRGGRX','XPPPPPGGGRRGGRX','XGGGGGGGGRRGGRX','XXXXXXXXXXXXXXX'])
};
export const isExcursion=location=>Object.hasOwn(excursionMaps,location);
