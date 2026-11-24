import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {trainerTeamDefaults,trainerSheetHeader} from '../trainer-teams-data.js';
import {trainersFromCSV,validateTrainerRows,createTrainerFeed,trainerFeed,parseCSV,TRAINER_CACHE_KEY} from '../trainer-feed.js?v=20261125-trainers1';
import {freshGym,nextChallenger,acceptChallenger,startDefense,settleDefense,saveGym,loadGym} from '../gym-mode.js';
import {claimGymStarter} from '../gym-commerce.js';
import {trainerDirectory} from '../trainer-directory.js';
import {visitorTeam} from '../visitor-gallery.js';
const copy=()=>structuredClone(trainerTeamDefaults);
const csv=rows=>[trainerSheetHeader,...rows.map(r=>[r.id,r.name,r.kind,r.min,r.max,...Array.from({length:6},(_,i)=>[r.team[i]||'',r.levels[i]||'']).flat(),r.enabled])].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
assert.equal(new Set(trainerTeamDefaults.map(r=>r.id)).size,trainerDirectory.length+8);
assert.deepEqual(trainersFromCSV(csv(copy())),validateTrainerRows(copy()));
assert.deepEqual(parseCSV('\uFEFFA,B\r\n"a,b","one ""two""\nthree"'),[['A','B'],['a,b','one "two"\nthree']]);
for(const mutate of [r=>r[0].team=['missing'],r=>r[0].levels=[101],r=>r[0].min=-1,r=>r[0].max=-1,r=>r.push({...r[0]}),r=>r.splice(0,7),r=>r[0].enabled='yes',r=>r[0].kind='Defence']){const rows=copy();mutate(rows);assert.throws(()=>validateTrainerRows(rows))}
assert.throws(()=>trainersFromCSV('<html>Sign in</html>'),/publicly readable/);
assert.throws(()=>trainersFromCSV(csv(copy()).replace('"Pokemon 1"','"Wrong header"')),/headers/);
let response=csv(copy()),saved={},clock=1;const storage={getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v};
const feed=createTrainerFeed({storage,now:()=>clock,fetcher:async()=>({ok:true,text:async()=>response})});assert.equal(await feed.sync(),true);assert.equal(feed.status.source,'Live Google Sheet');assert.ok(saved[TRAINER_CACHE_KEY]);
const update=copy();Object.assign(update.find(r=>r.id==='defence-milo'&&r.min===0),{name:'Edited Milo',team:['squirtle','eevee'],levels:[13,17]});response=csv(update);clock++;assert.equal(await feed.sync(),true);assert.deepEqual(feed.row('defence-milo',0).levels,[13,17]);assert.equal(feed.row('defence-milo',40).levels[0],8);const detached=feed.row('defence-milo',0);detached.team[0]='mew';assert.equal(feed.row('defence-milo',0).team[0],'squirtle');
response=csv(update).replace('"squirtle","13"','"invalid","13"');assert.equal(await feed.sync(),false);assert.equal(feed.row('defence-milo',0).name,'Edited Milo');assert.match(feed.status.message,/valid Species/);
const offline=createTrainerFeed({storage,fetcher:async()=>{throw Error('Offline')}});assert.equal(await offline.sync(),false);assert.equal(offline.row('defence-milo',0).name,'Edited Milo');assert.equal(offline.status.source,'Saved sheet backup');const corrupt=createTrainerFeed({storage:{getItem:()=>'{bad'},fetcher:async()=>{throw Error('Offline')}});assert.equal(await corrupt.sync(),false);assert.equal(corrupt.row('defence-milo',0).name,'Milo');
const disabled=copy();disabled.find(r=>r.id==='league-rowan'&&r.min===0).enabled=false;response=csv(disabled);assert.equal(await feed.sync(),true);assert.equal(feed.row('league-rowan',0),null);assert.ok(!feed.eligible('Gallery',0).some(r=>r.id==='league-rowan'));assert.equal(feed.row('league-rowan',40).enabled,true);
// Exercise the actual shared provider and persisted match snapshot, not only parsing.
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:true,text:async()=>csv(update)});try{assert.equal(await trainerFeed.sync(),true);const s=freshGym();s.gym.type='Water';claimGymStarter(s,'squirtle');const preview=nextChallenger(s);assert.deepEqual(preview.team,['squirtle','eevee']);assert.deepEqual(preview.teamLevels,[13,17]);acceptChallenger(s);const accepted=structuredClone(s.gym.session.challenger);const newer=copy();Object.assign(newer.find(r=>r.id==='defence-milo'&&r.min===0),{team:['rattata'],levels:[3]});globalThis.fetch=async()=>({ok:true,text:async()=>csv(newer)});await trainerFeed.sync();assert.deepEqual(s.gym.session.challenger,accepted);s.gym.session.status='ready';const b=startDefense(s);assert.deepEqual(b.team.map(c=>c.level),[13,17]);assert.deepEqual(b.team.map(c=>c.species),['squirtle','eevee']);const store={getItem:()=>saved.save,setItem:(k,v)=>saved.save=v};saveGym(store,s);const loaded=loadGym(store);assert.deepEqual(loaded.gym.session.challenger.teamLevels,[13,17]);settleDefense(s,'withdraw');assert.deepEqual(nextChallenger({...s,gym:{...s.gym,visits:0}}).team,['rattata']);const gallery=visitorTeam({gym:{reputation:300}},trainerDirectory[0],'test-visit',1);assert.equal(gallery.sheetTrainerId,trainerDirectory[0].id);assert.equal(gallery.reputation,0);assert.equal(gallery.lossReputation,0);
}finally{globalThis.fetch=async()=>({ok:true,text:async()=>csv(copy())});await trainerFeed.sync();globalThis.fetch=originalFetch}
console.log('TRAINER SHEET: all IDs, CSV/quotes, bands, individual levels, validation, disabled rows, live edits, offline/corrupt cache, active match snapshots and Gallery policy passed');
