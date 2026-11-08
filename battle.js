import {currentZone,locationAt} from './world.js';
import {get} from './data.js';
import {createCreature,spendTool,captureChance,catchCreature,award,grow,updateAchievements} from './core.js';
import {statsFor,movesFor,moveCatalog,STRUGGLE,battleStat,damageFor,typeMultiplier,stageMultiplier,speciesRules} from './rules.js';
export const maxHP=c=>statsFor(c).hp;
const freshState=()=>({stages:{},status:'',sleep:0,confusion:0,toxic:1,seeded:false,trap:0,escapeBlocked:false,protect:false,protectChain:0,endure:false,flinch:false,lastMove:null,disabled:null,disableTurns:0});
const log=(b,t)=>{b.log=[...b.log,t].slice(-12)};
function initialize(b,c){b.pp[c.uid]=Object.fromEntries(movesFor(c).map(m=>[m.id,m.pp]));b.states[c.uid]=freshState()}
export function beginBattle(s,wild,arena=false){if(!s.party.length)throw Error('Party is empty');const level=Math.max(6,Math.min(35,Math.round(s.party.reduce((n,id)=>n+s.collection.find(c=>c.uid===id).level,0)/s.party.length)));const team=arena?[createCreature('geodude',level),createCreature('pikachu',level),createCreature('eevee',level+1)]:[wild];const b={team,index:0,wild:team[0],hp:maxHP(team[0]),max:maxHP(team[0]),active:s.party[0],health:Object.fromEntries(s.party.map(id=>[id,maxHP(s.collection.find(c=>c.uid===id))])),pp:{},states:{},fields:{ally:{},enemy:{}},status:'',playerStatus:{},turn:0,arena,weather:'',weatherTurns:0,log:[arena?'AI practice · 3 opponents. Party HP and PP restored.':'A wild '+get(wild.species).name+' appeared!'],damage:null,effects:[]};for(const id of s.party)initialize(b,s.collection.find(c=>c.uid===id));for(const c of team)initialize(b,c);return b}
export function beginGymBattle(s){const z=currentZone(s);if(!s.started||locationAt(s)?.kind!=='gym'||!s.party.length)return null;const b=beginBattle(s,null,true);b.gym=z.name;b.leader=z.gym.leader;b.team=z.gym.team.map((id,i)=>createCreature(id,Math.min(100,z.levels[1]+i)));for(const c of b.team)initialize(b,c);b.wild=b.team[0];b.hp=maxHP(b.wild);b.max=b.hp;b.log=[`${z.gym.leader} welcomes you to ${z.gym.name}. Three opponents. No captures.`];return b}
const state=(b,c)=>b.states[c.uid];
const side=(b,c)=>c.uid===b.wild.uid?'enemy':'ally';
export const combatState=(b,c)=>({...state(b,c),...b.fields[side(b,c)]});
const health=(b,c)=>c.uid===b.wild.uid?b.hp:b.health[c.uid];
function setHealth(b,c,h){if(c.uid===b.wild.uid)b.hp=Math.max(0,Math.min(b.max,h));else b.health[c.uid]=Math.max(0,Math.min(maxHP(c),h))}
function hurt(b,c,n,direct=false){const before=health(b,c),st=state(b,c),amount=Math.max(0,Math.min(before,Math.floor(n)));setHealth(b,c,direct&&st.endure&&before>0?Math.max(1,before-amount):before-amount);const lost=before-health(b,c);if(lost){const e={target:c.uid===b.wild.uid?'enemy':'ally',amount:lost};b.effects.push(e);b.damage=e}return lost}
function heal(b,c,n){setHealth(b,c,health(b,c)+Math.max(1,Math.floor(n)))}
function sync(b){b.status=state(b,b.wild).status;b.playerStatus=Object.fromEntries(Object.entries(b.states).map(([id,st])=>[id,st.status]));return b}
export function usableMoves(b,c){const st=state(b,c);return movesFor(c).filter(m=>(b.pp[c.uid]?.[m.id]||0)>0&&st.disabled!==m.id&&!(st.taunt&&m.category==='status'))}
function aiMove(b,a,d,r){const usable=usableMoves(b,a);if(!usable.length)return STRUGGLE;const damaging=usable.filter(m=>m.category!=='status'&&typeMultiplier(m.type,state(b,d).types||speciesRules(d).types)>0);const utility=usable.filter(m=>m.category==='status');if(utility.length&&(!damaging.length||r()<.18))return utility[Math.min(utility.length-1,Math.floor(r()*utility.length))];return [...(damaging.length?damaging:usable)].sort((x,y)=>damageFor(a,d,y,{random:()=>1,attacker:combatState(b,a),defender:combatState(b,d),power:y.power||60}).damage-damageFor(a,d,x,{random:()=>1,attacker:combatState(b,a),defender:combatState(b,d),power:x.power||60}).damage)[0]}
function applyStatus(b,target,status,r){const st=state(b,target),types=st.types||speciesRules(target).types;if(b.fields[side(b,target)].safeguard)return false;if(status==='confusion'){if(st.confusion)return false;st.confusion=2+Math.min(3,Math.floor(r()*4));log(b,`${get(target.species).name} became confused!`);return true}if(st.status)return false;if((status==='burn'&&types.includes('Fire'))||(status==='paralysis'&&types.includes('Electric'))||(['poison','toxic'].includes(status)&&types.some(t=>['Poison','Steel'].includes(t)))||(status==='freeze'&&types.includes('Ice')))return false;st.status=status;st.toxic=1;if(status==='sleep')st.sleep=1+Math.min(2,Math.floor(r()*3));log(b,`${get(target.species).name}: ${status}.`);return true}
function stages(b,c,changes){const st=state(b,c);for(const {stat,change}of changes){const old=st.stages[stat]||0;st.stages[stat]=Math.max(-6,Math.min(6,old+change));if(st.stages[stat]!==old)log(b,`${get(c.species).name}'s ${stat} ${change>0?'rose':'fell'}${Math.abs(change)>1?' sharply':''}.`)}}
function canAct(b,c,m,r){const st=state(b,c);if(st.flinch){log(b,get(c.species).name+' flinched!');return false}if(st.status==='sleep'){if(st.sleep>0){st.sleep--;log(b,get(c.species).name+' is asleep.');return false}st.status='';log(b,get(c.species).name+' woke up!')}if(st.status==='freeze'){if(m.id==='flame-wheel'||m.id==='flare-blitz'||r()<.2)st.status='';else{log(b,get(c.species).name+' is frozen.');return false}}if(st.status==='paralysis'&&r()<.25){log(b,get(c.species).name+' is fully paralyzed.');return false}if(st.confusion){st.confusion--;if(r()<1/3){const self={...STRUGGLE,power:40};hurt(b,c,damageFor(c,c,self,{random:r,attacker:st,defender:st,typeless:true}).damage);log(b,get(c.species).name+' hurt itself in confusion!');return false}}return true}
function hitCount(m,r){if(!m.minHits)return 1;if(m.minHits===m.maxHits)return m.minHits;const n=r();return n<.35?2:n<.70?3:n<.85?4:5}
function attack(b,a,d,m,r,defenderMove,alreadyMoved){const A=state(b,a),D=state(b,d);if(!health(b,a)||!health(b,d)||!canAct(b,a,m,r))return;if(m.id!=='struggle'){if(!(b.pp[a.uid]?.[m.id]>0)||A.disabled===m.id||(A.taunt&&m.category==='status')){log(b,'That move cannot be used.');return}b.pp[a.uid][m.id]--}A.lastMove=m.id;log(b,`${get(a.species).name} used ${m.name}!`);
 if(!['protect','endure'].includes(m.id))A.protectChain=0;
 const self=m.target==='user'||m.target==='user-and-allies'||m.target==='users-field';
 if(D.protect&&!self&&m.target!=='entire-field'&&m.id!=='feint'){log(b,'Protected!');return}if(m.id==='feint')D.protect=false;
 let acc=m.accuracy;if((m.id==='thunder'||m.id==='hurricane')&&b.weather==='rain')acc=null;if(m.id==='thunder'&&b.weather==='sun')acc=50;
 const chance=acc===null?1:Math.min(1,acc/100*stageMultiplier((A.stages.accuracy||0)-(D.stages.evasion||0),true));if(!self&&r()>=chance){log(b,'The attack missed!');return}
 const target=self?a:d,changes=m.changes||[];
 if(m.category==='status'){
  if(m.id.endsWith('powder')||m.id==='stun-spore'){if(speciesRules(d).types.includes('Grass')){log(b,'It had no effect.');return}}
  if(m.id==='thunder-wave'&&typeMultiplier('Electric',D.types||speciesRules(d).types)===0){log(b,'It had no effect.');return}
  if(['protect','endure'].includes(m.id)){const success=r()<1/(3**A.protectChain);A.protectChain++;if(success){A[m.id]=true;log(b,m.id==='protect'?'Protected this turn.':'Braced to endure this turn.')}else log(b,'But it failed!');return}
  if(m.id==='leech-seed'){if((D.types||speciesRules(d).types).includes('Grass')||D.seeded){log(b,'But it failed!');return}D.seeded=true;log(b,'The target was seeded.');return}
  if(m.id==='rest'){heal(b,a,maxHP(a));A.status='sleep';A.sleep=2;return}
  if(m.id==='roost'){A.roostTypes=A.types||speciesRules(a).types;A.types=A.roostTypes.filter(t=>t!=='Flying');if(!A.types.length)A.types=['Normal']}
  if(m.healing){let fraction=m.healing/100;if(['synthesis','moonlight'].includes(m.id))fraction=b.weather==='sun'?2/3:b.weather?1/4:1/2;heal(b,a,maxHP(a)*fraction);log(b,'HP restored.');return}
  if(m.id==='rain-dance'){b.weather='rain';b.weatherTurns=5;log(b,'Rain began to fall (5 turns).');return}
  if(m.id==='haze'){for(const st of Object.values(b.states))st.stages={};return}
  if(m.id==='psych-up'){A.stages={...D.stages};return}
  if(m.id==='soak'){D.types=['Water'];return}
  if(m.id==='mean-look'){D.escapeBlocked=true;return}
  if(m.id==='disable'){if(!D.lastMove||D.disabled){log(b,'But it failed!');return}D.disabled=D.lastMove;D.disableTurns=4;return}
  if(m.id==='spite'){if(D.lastMove&&b.pp[d.uid][D.lastMove]!==undefined)b.pp[d.uid][D.lastMove]=Math.max(0,b.pp[d.uid][D.lastMove]-4);else log(b,'But it failed!');return}
  if(m.id==='curse'){if(speciesRules(a).types.includes('Ghost')){hurt(b,a,Math.floor(maxHP(a)/2));D.cursed=true}else stages(b,a,[{stat:'speed',change:-1},{stat:'attack',change:1},{stat:'defence',change:1}]);return}
  const field={'light-screen':['lightScreen',5],tailwind:['tailwind',4],safeguard:['safeguard',5],mist:['mist',5],taunt:['taunt',3]};if(field[m.id]){const [key,turns]=field[m.id];(m.id==='taunt'?D:b.fields[side(b,a)])[key]=turns;return}
  if(m.id==='charge')A.charged=true;
  if(changes.length){if(!self&&b.fields[side(b,d)].mist){log(b,'Mist prevents stat loss.');return}stages(b,target,changes);return}
  if(m.ailment&&m.ailment!=='none'){const status=m.id==='toxic'?'toxic':m.ailment;if(!applyStatus(b,d,status,r))log(b,'But it failed!');return}
  log(b,'But it failed!');return;
 }
 // Damaging moves use their official physical/special category and type.
 if(m.id==='dream-eater'&&D.status!=='sleep'){log(b,'But it failed!');return}
 if(m.id==='sucker-punch'&&(alreadyMoved||defenderMove.category==='status')){log(b,'But it failed!');return}
 let power=m.power;if(m.id==='electro-ball'){const ratio=battleStat(a,'speed',combatState(b,a))/battleStat(d,'speed',combatState(b,d));power=ratio>=4?150:ratio>=3?120:ratio>=2?80:ratio>=1?60:40}
 if(['flail','reversal'].includes(m.id)){const ratio=Math.floor(48*health(b,a)/maxHP(a));power=ratio<=1?200:ratio<=4?150:ratio<=9?100:ratio<=16?80:ratio<=32?40:20}
 if(m.id==='hex'&&D.status)power*=2;if(m.id==='brine'&&health(b,d)<=maxHP(d)/2)power*=2;if(m.id==='payback'&&alreadyMoved)power*=2;
 if(A.charged&&m.type==='Electric'){power*=2;A.charged=false}
 let total=0;const hits=hitCount(m,r);for(let i=0;i<hits&&health(b,d);i++){const crit=r()<(m.critRate>=2?.5:m.critRate===1?1/8:1/24);const result=damageFor(a,d,m,{random:r,critical:crit,attacker:combatState(b,a),defender:combatState(b,d),weather:b.weather,power,typeless:m.id==='struggle'});const amount=hurt(b,d,result.damage,true);total+=amount;if(!result.effectiveness){log(b,'It had no effect.');break}if(crit)log(b,'A critical hit!');if(result.effectiveness>1)log(b,"It's super effective!");else if(result.effectiveness<1)log(b,"It's not very effective.")}
 if(hits>1)log(b,`Hit ${hits} times.`);log(b,`−${total} HP.`);
 if(m.drain>0&&total)heal(b,a,Math.max(1,Math.floor(total*m.drain/100)));if(m.drain<0&&total)hurt(b,a,Math.max(1,Math.round(total*-m.drain/100)));if(m.id==='struggle')hurt(b,a,Math.max(1,Math.floor(maxHP(a)/4)));
 if(['self-destruct','explosion'].includes(m.id))setHealth(b,a,0);
 if(m.id==='rapid-spin'&&total){A.seeded=false;A.trap=0}
 if(m.id==='smack-down'&&total)D.grounded=true;
 if(total&&D.status==='freeze'&&m.type==='Fire')D.status='';
 if(total&&changes.length&&changes.every(x=>x.change>0))stages(b,a,changes);
 if(total&&health(b,d)){
  if(m.ailment==='trap'){D.trap=4+Math.min(1,Math.floor(r()*2));log(b,'The target is bound.')}else if(m.ailment&&m.ailment!=='none'&&r()<(m.ailmentChance||m.effectChance||0)/100)applyStatus(b,d,m.ailment,r);
  if(m.flinch&&r()<m.flinch/100)D.flinch=true;
  if(changes.length&&!changes.every(x=>x.change>0)&&r()<(m.statChance||m.effectChance||100)/100){const positive=changes.every(x=>x.change>0);if(positive||!b.fields[side(b,d)].mist)stages(b,positive?a:d,changes)}
 }
}
function residual(b,c,other){if(!health(b,c))return;const st=state(b,c),max=maxHP(c);if(st.status==='burn')hurt(b,c,Math.max(1,Math.floor(max/16)));if(st.status==='poison')hurt(b,c,Math.max(1,Math.floor(max/8)));if(st.status==='toxic'){hurt(b,c,Math.max(1,Math.floor(max*st.toxic/16)));st.toxic++}if(st.seeded&&health(b,other)){const n=hurt(b,c,Math.max(1,Math.floor(max/8)));heal(b,other,n)}if(st.trap){hurt(b,c,Math.max(1,Math.floor(max/8)));st.trap--}if(st.cursed)hurt(b,c,Math.max(1,Math.floor(max/4)));if(st.roostTypes){st.types=st.roostTypes;delete st.roostTypes}if(st.disableTurns&&!--st.disableTurns)st.disabled=null;for(const key of ['taunt'])if(st[key])st[key]--}
function defeat(s,b){const next=s.party.find(id=>b.health[id]>0);if(next){if(!b.health[b.active]){b.active=next;log(b,'Your next partner takes the field.')}return null}s.position={...currentZone(s).camp};s.followerPosition=null;s.energy=Math.min(200,s.energy+20);return {battle:null,finalBattle:b,event:'Party exhausted. Safely returned to camp.'}}
function victory(s,b){const c=s.collection.find(c=>c.uid===b.active),previous=maxHP(c);grow(c);b.health[c.uid]=Math.min(maxHP(c),b.health[c.uid]+maxHP(c)-previous);s.wins++;s.coins+=80;award(s,60);if(b.arena&&b.index<b.team.length-1){b.index++;b.wild=b.team[b.index];b.hp=maxHP(b.wild);b.max=b.hp;b.status='';b.effects=[];b.damage=null;log(b,'Round won! Next opponent: '+get(b.wild.species).name);updateAchievements(s);return {battle:sync(b),event:'Round won · +60 XP · +80 coins'}}if(b.gym){const gym=currentZone(s).gym;if(!s.badges.includes(gym.badge)){s.badges.push(gym.badge);s.coins+=400;award(s,100)}}else if(b.arena){s.arenaWins++;s.rating+=24;s.coins+=200}updateAchievements(s);return {battle:null,finalBattle:b,event:b.gym?`GYM VICTORY · ${b.leader} defeated · ${currentZone(s).gym.badge}`:b.arena?'ARENA VICTORY · +24 rating · +200 bonus coins':'BATTLE WON · +60 XP · +80 coins'}}
function resolve(s,b){const loss=defeat(s,b);if(loss)return loss;if(!b.hp)return victory(s,b);return {battle:sync(b),event:''}}
function endTurn(s,b){const c=s.collection.find(c=>c.uid===b.active);residual(b,c,b.wild);residual(b,b.wild,c);for(const field of Object.values(b.fields))for(const key of Object.keys(field))if(field[key])field[key]--;if(b.weatherTurns&&!--b.weatherTurns)b.weather='';return resolve(s,b)}
export function battleAction(s,old,action,random=Math.random){if(!old)return {battle:null,event:''};const b=structuredClone(old);b.damage=null;b.effects=[];let c=s.collection.find(c=>c.uid===b.active),w=b.wild;
 if(action.type==='flee'){if(!speciesRules(c).types.includes('Ghost')&&(state(b,c).trap||state(b,c).escapeBlocked))return {battle:sync(b),event:'Your partner cannot flee while trapped.'};return {battle:null,event:'You returned safely to '+currentZone(s).name+'.'}}
 const beginTurn=()=>{b.turn++;for(const st of Object.values(b.states)){st.protect=false;st.endure=false;st.flinch=false}};
 const respond=()=>{const a=s.collection.find(c=>c.uid===b.active);attack(b,w,a,aiMove(b,w,a,random),random,STRUGGLE,false);return endTurn(s,b)};
 if(action.type==='catch'){if(b.arena)return {battle:sync(b),event:'Cannot catch a trainer’s Pokémon.'};const tool=Number(action.tool);if(!spendTool(s,tool))return {battle:sync(b),event:'No Poké Balls of this type left. Visit Market for supplies.'};if(random()<captureChance(b.hp,b.max,tool)){const caught={...b.wild,moves:movesFor(b.wild).map(m=>m.id)};catchCreature(s,caught);grow(c);updateAchievements(s);return {battle:null,event:`${b.wild.variant==='Shiny'?'✧ SHINY ':''}${get(w.species).name} caught! Collection and Pokédex updated.`}}beginTurn();log(b,'It broke free! Lower HP or try a stronger ball.');const r=respond();return r.battle?{...r,event:'Catch failed. Try again.'}:r}
 if(action.type==='swap'){if(action.uid===b.active)return {battle:sync(b),event:'Already active.'};if(!s.party.includes(action.uid)||!b.health[action.uid])return {battle:sync(b),event:'That partner cannot fight.'};if(!speciesRules(c).types.includes('Ghost')&&(state(b,c).trap||state(b,c).escapeBlocked))return {battle:sync(b),event:'That partner is trapped.'};beginTurn();state(b,c).stages={};state(b,c).confusion=0;state(b,c).seeded=false;state(b,w).escapeBlocked=false;b.active=action.uid;log(b,'Swapped to '+get(s.collection.find(c=>c.uid===b.active).species).name);return respond()}
 if(action.type==='item'){if(s.potions<1)return {battle:sync(b),event:'No potions left.'};if(b.health[c.uid]===maxHP(c))return {battle:sync(b),event:'HP is already full.'};beginTurn();s.potions--;heal(b,c,20);log(b,'Potion · restored up to 20 HP.');return respond()}
 if(action.type!=='move')return {battle:sync(b),event:'Choose an action.'};const available=usableMoves(b,c),m=available.length?movesFor(c)[Number(action.index)]:STRUGGLE;if(!m||m.id!=='struggle'&&!available.some(x=>x.id===m.id))return {battle:sync(b),event:'No PP or this move is disabled. Choose another move.'};beginTurn();const enemyMove=aiMove(b,w,c,random);const speedA=battleStat(c,'speed',combatState(b,c)),speedB=battleStat(w,'speed',combatState(b,w));const first=m.priority!==enemyMove.priority?m.priority>enemyMove.priority:speedA!==speedB?speedA>speedB:random()<.5;const order=first?[[c,w,m,enemyMove],[w,c,enemyMove,m]]:[[w,c,enemyMove,m],[c,w,m,enemyMove]];for(let i=0;i<order.length;i++){const [a,d,move,other]=order[i];if(!health(b,a)||!health(b,d))break;attack(b,a,d,move,random,other,i>0)}return endTurn(s,b)
}
