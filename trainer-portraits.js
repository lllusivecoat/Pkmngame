// Keep the original 4×4 atlas and its stable cell indices unchanged.
import {portraitManifest,portraitPath} from './portrait-manifest.js';
const portraits=['fern','milo','iris','hugo','ruby','ashby','skye','marin','rowan','lyra','flint','sera','brock','explorer-male','explorer-female','professor'];
const atlasLocked=new Set(portraits);
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
function atlasPortrait(id,gender){const index=portraits.includes(id)?portraits.indexOf(id):gender==='female'?14:13,col=index%4,row=Math.floor(index/4);return `<svg class="npc-portrait" viewBox="0 0 256 256" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" overflow="hidden"><svg x="0" y="0" width="256" height="256" viewBox="0 0 256 256" overflow="hidden"><image href="assets/trainers-classic.webp" x="${-col*256}" y="${-row*256}" width="1024" height="1024" preserveAspectRatio="none"/></svg></svg>`}
function filePortrait(file,gender){const g=gender==='female'?'female':'male';return `<img class="npc-portrait npc-portrait-file" src="${file}.webp" data-portrait-fallback="${file}.png" data-portrait-gender="${g}" width="256" height="256" alt="" aria-hidden="true" decoding="async" loading="lazy">`}
export function trainerPortrait(id,gender='male'){
 // Accept canonical IDs and the exhibition's existing aliases without renaming saved trainers.
 const key=typeof id==='string'?id.replace(/^kanto-/,''):id,alias=key==='surge'?'lt-surge':key,canonical=kantoPortraitIds.includes(alias)?alias:id;
 if(individuals.has(canonical))return filePortrait('assets/trainers-kanto/'+canonical,gender);
 if(atlasLocked.has(canonical)||typeof id==='string'&&atlasLocked.has(id))return atlasPortrait(atlasLocked.has(canonical)?canonical:id,gender);
 const entry=files.get(canonical)||(typeof id==='string'?files.get(id):undefined);
 if(entry)return filePortrait(entry.file,gender);
 return atlasPortrait(canonical,gender);
}
// Bind after insertion; handle cached failures as well as subsequent network errors.
// A lazy image can report complete before it starts, so only an error event swaps it.
export function bindTrainerPortrait(img){
 img.onerror=()=>{const png=img.dataset.portraitFallback;if(png){delete img.dataset.portraitFallback;img.src=png}else{img.onerror=null;img.outerHTML=atlasPortrait('',img.dataset.portraitGender)}};
 if(img.complete&&!img.naturalWidth&&img.loading!=='lazy')img.onerror();
}
