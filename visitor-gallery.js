import {trainerDirectory} from './trainer-directory.js?v=20261125-visitors1';
import {trainerTier,trainedSpecies} from './trainer-training.js?v=20261125-visitors1';
import {expandedSpecies} from './engine-data.js?v=20261125-visitors1';
import {evolutionStage} from './gym-commerce.js?v=20261125-visitors1';
import {isLegendarySpecies} from './pokemon-individuals.js?v=20261125-visitors1';
import {gymClock} from './gym-clock.js?v=20261125-visitors1';
export const galleryRooms=['gallery','gallery-leaders','gallery-stars'];
export const galleryRoomNames=['Visitor’s Gallery','Leaders’ Lounge','Hall of Stars'];
export const visitorPositions=[{x:3,y:3},{x:7,y:3},{x:11,y:3},{x:3,y:7},{x:11,y:7},{x:4,y:10},{x:10,y:10}];
export const isGallery=id=>galleryRooms.includes(id);
export const galleryRoomLevel=id=>galleryRooms.indexOf(id)+1;
export const galleryLevel=s=>Math.min(3,Math.max(1,Math.floor(Number(s.gym.gallery?.level)||1)));
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
function seeded(seed){let v=hash(seed);return ()=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v/4294967296}}
export function normalizeGallery(raw){return {level:Math.min(3,Math.max(1,Math.floor(Number(raw?.level)||1))),day:Number.isInteger(raw?.day)?raw.day:0,rooms:Array.isArray(raw?.rooms)?raw.rooms:[],defeated:Array.isArray(raw?.defeated)?raw.defeated.filter(id=>typeof id==='string'):[]}}
function candidates(room){return trainerDirectory.filter(t=>room===1?['Trainer','Grunt'].includes(t.category)&&t.group!=='special':room===2?['Gym Leader','Boss','Admin'].includes(t.category):['Elite Four','Champion'].includes(t.category)||t.group==='special')}
export function ensureGallery(s,now=Date.now()){s.gym.gallery=normalizeGallery(s.gym.gallery);const g=s.gym.gallery,day=gymClock(s,now).day;
 // Never replace an opponent or visitor identity while a match is active.
 if(s.gym.session?.challenger.galleryVisit)return g;
 if(g.day===day&&g.rooms.length===3&&g.rooms.every(r=>Array.isArray(r)))return g;
 const rooms=[];for(let room=1;room<=3;room++){const pool=[...candidates(room)],random=seeded(s.gym.clock.seed+':visitors:'+day+':'+room);for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}const count=5+Math.floor(random()*3),required=room===1?[t=>t.category==='Trainer',t=>t.category==='Grunt']:room===2?[t=>t.category==='Gym Leader',t=>t.group==='villain']:[t=>t.category==='Elite Four',t=>t.category==='Champion',t=>t.group==='special'],selected=[];for(const matches of required){const t=pool.find(t=>matches(t)&&!selected.includes(t));if(t)selected.push(t)}selected.push(...pool.filter(t=>!selected.includes(t)).slice(0,count-selected.length));rooms.push(selected.map((t,i)=>({id:`gallery-${day}-${room}-${i}`,trainerId:t.id,...visitorPositions[i]})))}g.day=day;g.rooms=rooms;g.defeated=[];return g}
export function galleryVisitors(s,location=s.gym.world.location){const room=galleryRoomLevel(location);if(!room||room>galleryLevel(s))return [];const g=ensureGallery(s);return (g.rooms[room-1]||[]).map(v=>({...v,trainer:trainerDirectory.find(t=>t.id===v.trainerId)})).filter(v=>v.trainer)}
export function visitorTeam(s,t,visitId,room){const rep=s.gym.reputation,level=Math.min(85,5+Math.floor(rep/25)+(room-1)*2),stage=rep>=300?3:rep>=60?2:1,bst=rep>=600?750:rep>=300?600:rep>=60?500:420,count=rep>=1000?6:rep>=600?5:rep>=300?4:rep>=120?3:rep>=40?2:1;
 const all=Object.keys(expandedSpecies).filter(id=>{const p=expandedSpecies[id];return !isLegendarySpecies(id)&&(!p.formRecord||p.formKind==='regional')&&evolutionStage(id)<=stage&&(p.evoLevel||1)<=level&&Object.values(p.baseStats).reduce((a,b)=>a+b,0)<=bst}),typed=all.filter(id=>t.type==='Mixed'||expandedSpecies[id].types.includes(t.type)),pool=typed.length?typed:all,random=seeded(visitId+':'+rep),team=[];
 for(let i=0;i<count&&pool.length;i++){const choices=pool.filter(id=>!team.includes(id));team.push((choices.length?choices:pool)[Math.floor(random()*(choices.length||pool.length))])}
 return {...t,id:visitId,team,level,aiTier:trainerTier(s),difficulty:rep>=300?'Ace':rep>=60?'Journeyman':'Rookie',reward:140+room*80+Math.floor(rep/20)*10,reputation:room*10,exhibition:true,galleryVisit:true,galleryRoom:room,lossReputation:5+room*5,style:`${t.type} visitor · team and level scale with your Gym reputation.`}}
export function nearbyVisitor(s){return galleryVisitors(s).find(v=>Math.abs(v.x-s.gym.world.position.x)+Math.abs(v.y-s.gym.world.position.y)<=1)}
export function galleryOpponent(s,id){const v=galleryVisitors(s).find(v=>v.id===id);if(!v||s.gym.gallery.defeated.includes(id)||Math.abs(v.x-s.gym.world.position.x)+Math.abs(v.y-s.gym.world.position.y)>1)return null;return visitorTeam(s,v.trainer,id,galleryRoomLevel(s.gym.world.location))}
export function galleryUpgrade(s){const level=galleryLevel(s);return level===3?null:{cost:level===1?1200:3500,reputation:level===1?60:300,next:galleryRoomNames[level]}}
export function upgradeGallery(s){if(!isGallery(s.gym.world.location))return 'Visit the Gallery first.';if(s.gym.session||s.gym.world.reserve.activeUid)return 'Finish your battle first.';const next=galleryUpgrade(s);if(!next)return 'All three rooms are open.';if(s.gym.reputation<next.reputation)return `Requires ${next.reputation} reputation.`;if(s.coins<next.cost)return 'Not enough coins.';s.coins-=next.cost;s.gym.gallery.level++;return next.next+' is now open.'}
