// Exhibition teams deliberately use the current playable roster; no new species or paid services.
const entries=[
 ['brock','Brock','Rock','Gym Leader',['geodude','onix','golem'],12,'A steady bond is the foundation of a strong team.'],
 ['misty','Misty','Water','Gym Leader',['starmie','golduck','lapras'],20,'Let’s see how your team handles a wave of Water-type power!'],
 ['surge','Lt. Surge','Electric','Gym Leader',['pikachu','electrode','raichu'],22,'Show me some electrifying teamwork!'],
 ['erika','Erika','Grass','Gym Leader',['tangela','vileplume','leafeon'],23,'Welcome. Shall we enjoy a graceful battle together?'],
 ['koga','Koga','Poison','Gym Leader',['venomoth','gengar','vileplume'],25,'Patience and precision reveal the path to victory.'],
 ['sabrina','Sabrina','Psychic','Gym Leader',['espeon','gardevoir','gallade'],27,'Your next decision will shape this battle.'],
 ['blaine','Blaine','Fire','Gym Leader',['rapidash','ninetales','arcanine'],29,'Here’s your next challenge: can you stand the heat?'],
 ['giovanni','Giovanni','Ground','Gym Leader',['rhydon','golem','donphan'],31,'A strong team deserves a serious opponent.'],
 ['lorelei','Lorelei','Ice','Elite Four',['dewgong','lapras','glaceon'],35,'Keep your composure. A calm mind finds the winning move.'],
 ['bruno','Bruno','Fighting','Elite Four',['machamp','onix','gallade'],36,'Training together makes both partners stronger!'],
 ['agatha','Agatha','Ghost','Elite Four',['gengar','haunter','honchkrow'],37,'Experience has a few surprises left to teach you.'],
 ['lance','Lance','Dragon','Elite Four',['gyarados','dragonair','dragonite'],39,'Let your partners show the strength of your trust.'],
 ['blue','Blue','Mixed','Champion',['pidgeot','arcanine','blastoise'],42,'You made it! Now let’s see how far your team has come.'],
 ['red','Red','Mixed','Champion',['pikachu','venusaur','charizard'],45,'…!']
];
// Temporary roster-safe substitutes until the corresponding species are added with paired artwork.
const substitutes={starmie:'vaporeon',electrode:'ampharos',tangela:'bellossom',venomoth:'butterfree',alakazam:'espeon',rapidash:'charizard',rhydon:'onix',dewgong:'vaporeon',machamp:'donphan',gyarados:'lapras'};
export const kantoLeaders=entries.map(([key,name,type,title,team,level,dialogue],i)=>({id:'kanto-'+key,name,type,title:'Kanto '+title,team:team.map(id=>substitutes[id]||id),level,dialogue,x:[1,3,6,8][i%4],y:2+2*Math.floor(i/4),portrait:key==='brock'?'brock':'kanto-'+key,gender:['misty','erika','sabrina','lorelei','agatha'].includes(key)?'female':'male',portraitPending:key!=='brock'}));
export const kantoMaps=[
 {id:'kanto-courtyard',region:'Greenwood',name:'Kanto Leaders Courtyard',description:'A quiet exhibition courtyard. Walk up the red path and enter Kanto Leaders.',palette:'woodland',biome:'kanto-courtyard',ground:'#66896b',path:'#d2c6a3',peaceful:true,center:null,gym:null,spawn:{x:5,y:8},map:['FFFFFFFFFF','FGGGGGGGGF','FGGXXXXGGF','FGGXXXXGGF','FGGGPPGGGF','FGGPPPPGGF','FWWPPPPWWF','FWWGPPGWWF','FGGGPPGGGF','FFFFPPFFFF'],building:{x:5,y:4,name:'Kanto Leaders',image:'assets/kanto-leaders-building.svg'},trainers:[],points:[],landmarks:[],decorations:[{type:'shrine',x:160,y:450},{type:'shrine',x:830,y:450},{type:'cottage',x:170,y:800},{type:'well',x:840,y:820}],exits:[{x:5,y:4,to:'Kanto Leaders Hall',toArea:'kanto-hall',arrival:{x:5,y:8},entrance:true},{x:5,y:9,to:'Greenwood Village',toArea:'hub',arrival:{x:2,y:7}}]},
 {id:'kanto-hall',region:'Greenwood',name:'Kanto Leaders Hall',description:'Meet the eight Gym Leaders, Elite Four, Blue and Red. Walk to a trainer to talk and challenge them.',palette:'woodland',biome:'kanto-hall',interior:true,peaceful:true,center:null,gym:null,spawn:{x:5,y:8},map:['XXXXXXXXXX','XPPPPPPPPX','XPPPPPPPPX','XPPPPPPPPX','XPPPPPPPPX','XPPPPPPPPX','XPPPPPPPPX','XPPPPPPPPX','XPPPPPPPPX','XXXXXPPXXX'],trainers:kantoLeaders,points:[],landmarks:[],decorations:[],exits:[{x:5,y:9,to:'Kanto Leaders Courtyard',toArea:'kanto-courtyard',arrival:{x:5,y:5}}]}
];
