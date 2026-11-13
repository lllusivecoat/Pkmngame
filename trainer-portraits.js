// Keep the original 4×4 atlas and its stable cell indices unchanged.
const portraits=['fern','milo','iris','hugo','ruby','ashby','skye','marin','rowan','lyra','flint','sera','brock','explorer-male','explorer-female','professor'];
export const kantoPortraitIds=['brock','misty','lt-surge','erika','koga','sabrina','blaine','giovanni','lorelei','bruno','agatha','lance','blue','red'];
const individuals=new Set(kantoPortraitIds.filter(id=>id!=='brock'));
function atlasPortrait(id,gender){const index=portraits.includes(id)?portraits.indexOf(id):gender==='female'?14:13,col=index%4,row=Math.floor(index/4);return `<svg class="npc-portrait" viewBox="0 0 256 256" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" overflow="hidden"><svg x="0" y="0" width="256" height="256" viewBox="0 0 256 256" overflow="hidden"><image href="assets/trainers-classic.webp" x="${-col*256}" y="${-row*256}" width="1024" height="1024" preserveAspectRatio="none"/></svg></svg>`}
export function trainerPortrait(id,gender='male'){
 // Accept canonical IDs and the exhibition's existing aliases without renaming saved trainers.
 const key=typeof id==='string'?id.replace(/^kanto-/,''):id,alias=key==='surge'?'lt-surge':key,canonical=kantoPortraitIds.includes(alias)?alias:id;
 if(individuals.has(canonical))return `<img class="npc-portrait npc-portrait-file" src="assets/trainers-kanto/${canonical}.webp" data-portrait-fallback="assets/trainers-kanto/${canonical}.png" data-portrait-gender="${gender==='female'?'female':'male'}" width="256" height="256" alt="" aria-hidden="true" decoding="async">`;
 return atlasPortrait(canonical,gender);
}
// Bind after insertion; handle cached failures as well as subsequent network errors.
export function bindTrainerPortrait(img){
 img.onerror=()=>{const png=img.dataset.portraitFallback;if(png){delete img.dataset.portraitFallback;img.src=png}else{img.onerror=null;img.outerHTML=atlasPortrait('',img.dataset.portraitGender)}};
 if(img.complete&&!img.naturalWidth)img.onerror();
}
