// Keep the original 4×4 atlas and its stable cell indices unchanged.
// Brock's cell stays reserved so later atlas users keep their offsets.
import {portraitManifest,portraitPath} from './portrait-manifest.js';
export const PORTRAIT_RELEASE='20261124-sinnohunova1';
const portraits=['fern','milo','iris','hugo','ruby','ashby','skye','marin','rowan','lyra','flint','sera','brock','explorer-male','explorer-female','professor'];
const atlasLocked=new Set(portraits.filter(id=>id!=='brock'));
export const kantoPortraitIds=['brock','misty','lt-surge','erika','koga','sabrina','blaine','giovanni','lorelei','bruno','agatha','lance','blue','red'];
const individuals=new Set(kantoPortraitIds.filter(id=>id!=='brock'));
const files=new Map();
for(const entry of portraitManifest){
 const record={...entry,file:portraitPath(entry)};
 if(files.has(entry.id)||atlasLocked.has(entry.id))throw Error('Portrait id conflicts with the atlas or another portrait: '+entry.id);
 files.set(entry.id,record);
 const qualified=entry.set+'/'+(entry.sourceId||entry.id);
 if(!files.has(qualified))files.set(qualified,record);
}
const versioned=path=>`${path}?v=${PORTRAIT_RELEASE}`;
const bust=(url,attempt)=>`${url}${url.includes('?')?'&':'?'}retry=${attempt}`;
function atlasPortrait(id,gender){const index=portraits.includes(id)?portraits.indexOf(id):gender==='female'?14:13,col=index%4,row=Math.floor(index/4);return `<svg class="npc-portrait" viewBox="0 0 256 256" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" overflow="hidden"><svg x="0" y="0" width="256" height="256" viewBox="0 0 256 256" overflow="hidden"><image href="assets/trainers-classic.webp" x="${-col*256}" y="${-row*256}" width="1024" height="1024" preserveAspectRatio="none"/></svg></svg>`}
function filePortrait(file,gender){const g=gender==='female'?'female':'male';return `<img class="npc-portrait npc-portrait-file" src="${versioned(file+'.webp')}" data-portrait-file="${file}" data-portrait-fallback="${versioned(file+'.png')}" data-portrait-gender="${g}" data-portrait-attempt="0" width="256" height="256" alt="" aria-hidden="true" decoding="async" loading="lazy">`}
export function trainerPortrait(id,gender='male'){
 // Accept canonical IDs and the exhibition's existing aliases without renaming saved trainers.
 const key=typeof id==='string'?id.replace(/^kanto-/,''):id,alias=key==='surge'?'lt-surge':key,canonical=kantoPortraitIds.includes(alias)?alias:id;
 if(individuals.has(canonical))return filePortrait('assets/trainers-kanto/'+canonical,gender);
 if(atlasLocked.has(canonical)||typeof id==='string'&&atlasLocked.has(id))return atlasPortrait(atlasLocked.has(canonical)?canonical:id,gender);
 const entry=files.get(canonical)||(typeof id==='string'?files.get(id):undefined);
 if(entry)return filePortrait(entry.file,gender);
 return atlasPortrait(canonical,gender);
}
// WebP, then PNG, then two cache-busted retries. The atlas stand-in keeps the file
// path so the next render — which always rebuilds from trainerPortrait — tries again.
const RETRY_DELAYS=[400,1200];
export function bindTrainerPortrait(img,{schedule=setTimeout}={}){
 const fail=()=>{
  const file=img.dataset.portraitFile,attempt=Number(img.dataset.portraitAttempt||0);
  if(attempt===0&&img.dataset.portraitFallback){const png=img.dataset.portraitFallback;delete img.dataset.portraitFallback;img.dataset.portraitAttempt='1';img.src=png;return}
  if(file&&attempt<=RETRY_DELAYS.length){const next=attempt+1;img.dataset.portraitAttempt=String(next);const target=versioned(file+(next%2===0?'.webp':'.png'));schedule(()=>{if(img.isConnected===false)return;img.src=bust(target,next)},RETRY_DELAYS[Math.min(Math.max(attempt-1,0),RETRY_DELAYS.length-1)]);return}
  const gender=img.dataset.portraitGender||'';img.onerror=null;img.outerHTML=`<span class="npc-portrait-slot" data-portrait-file="${file||''}" data-portrait-gender="${gender}">${atlasPortrait('',gender)}</span>`;
 };
 img.onerror=fail;
 if(img.complete&&!img.naturalWidth&&img.loading!=='lazy')img.onerror();
}
