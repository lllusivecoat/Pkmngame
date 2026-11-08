import {get} from './data.js';
import {modernSources} from './modern-sources.js';
const spriteRoot='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
export function spriteCandidates(c,style='modern',reducedMotion=false,perspective='front'){
 const s=get(c.species);if(!s)return [];
 const variant=c.variant==='Shiny'?'shiny/':'';
 const still=[...(perspective==='front'?[c.variant==='Shiny'?`assets/chibi/shiny/${s.number}.png`:`assets/chibi/${s.number}.svg`]:[]),`${spriteRoot}/other/home/${variant}${s.number}.png`,`${spriteRoot}/other/official-artwork/${variant}${s.number}.png`];
 if(style==='home'||reducedMotion)return still;
 const facing=perspective==='back'?'back/':'';
 return [...(modernSources[s.number]||[]).map(game=>`${spriteRoot}/versions/${game==='sword-shield'?'generation-viii':'generation-ix'}/${game}/${facing}${variant}${s.number}.webp`),...still];
}
export function bindSprite(img){
 let candidates=[];try{candidates=JSON.parse(img.dataset.sources)}catch{}
 let index=0;
 const loaded=()=>{if(img.naturalWidth>0)img.parentElement?.classList.add('has-sprite')};
 img.onload=loaded;
 img.onerror=()=>{img.parentElement?.classList.remove('has-sprite');index++;if(index<candidates.length){img.src=candidates[index]}else{img.remove()}};
 if(img.complete){if(img.naturalWidth>0)loaded();else img.onerror()}
}
// Each damage event is ordered by the actual combat initiative. Separate wrapper
// and sprite animations let attacks, recoil and idle motion compose cleanly.
export function turnMotion(effects=[]){
 const plan={ally:{attack:null,hit:null},enemy:{attack:null,hit:null}};
 effects.forEach((effect,i)=>{if(!['ally','enemy'].includes(effect.target))return;const attacker=effect.target==='ally'?'enemy':'ally';const delay=i*420;plan[attacker].attack=delay;plan[effect.target].hit=delay+150});
 return plan;
}
