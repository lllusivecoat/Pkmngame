import {chibiAtlas} from './chibi-sources.js?v=20261111-quests26';
import {localArtwork} from './local-artwork.js?v=20261111-quests26';
import {battleForms} from './forms.js?v=20261111-quests26';
import {get} from './data.js?v=20261111-quests26';
import {modernSources} from './modern-sources.js?v=20261111-quests26';
const spriteRoot='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
export function spriteCandidates(c,style='modern',reducedMotion=false,perspective='front'){
 const s=battleForms[c.form]||get(c.species);if(!s)return [];
 const variant=c.variant==='Shiny'?'shiny/':'';
 const bundled=localArtwork[c.variant==='Shiny'?'shiny':'normal']?.[s.number],bundledPixel=localArtwork['shiny-chibi']?.[s.number];
 const official=[...(bundled?[bundled]:[]),`${spriteRoot}/other/home/${variant}${s.number}.png`,`${spriteRoot}/other/official-artwork/${variant}${s.number}.png`];if(style==='official')return official;
 const painted=c.variant!=='Shiny'&&chibiAtlas[c.form||c.species]?.columns===1?chibiAtlas[c.form||c.species].sheet:null;
 const pixel=c.form||s.id==='onix';
 const still=[...(painted?[painted]:[]),...(pixel?[c.variant==='Shiny'?`${spriteRoot}/shiny/${s.number}.png`:`assets/form-icons/${s.number}.png`]:[]),...(([1,4,7,25,16,10,133,74,92,43,54,147,58,37,179,198,231,131].includes(s.number))&&(perspective==='front'||style==='home'||reducedMotion)?[c.variant==='Shiny'?`assets/chibi/shiny/${s.number}.png`:`assets/chibi/${s.number}.svg`]:[]),...official];
 if(c.form&&style!=='home'&&!reducedMotion)return [...official,...still];
 if((style==='home'||reducedMotion)&&c.variant==='Shiny'&&![1,4,7,25,16,10,133,74,92,43,54,147,58,37,179,198,231,131].includes(s.number))return [...(bundledPixel?[bundledPixel]:[]),`${spriteRoot}/shiny/${s.number}.png`,...official];
 if(style==='home'||reducedMotion)return c.variant==='Shiny'?[...still.slice(0,1),`${spriteRoot}/shiny/${s.number}.png`,...still.slice(1)]:still;
 const facing=perspective==='back'?'back/':'';
 return [...(modernSources[s.number]||[]).map(game=>`${spriteRoot}/versions/${game==='sword-shield'?'generation-viii':'generation-ix'}/${game}/${facing}${variant}${s.number}.webp`),...still];
}
export function bindSprite(img){
 let candidates=[];try{candidates=JSON.parse(img.dataset.sources)}catch{}
 let index=0;
 const loaded=()=>{if(img.naturalWidth>0)img.parentElement?.classList.add('has-sprite');if(img.parentElement?.dataset)img.parentElement.dataset.loadState='loaded'};
 img.onload=loaded;
 img.onerror=()=>{img.parentElement?.classList.remove('has-sprite');index++;if(index<candidates.length){img.src=candidates[index]}else{if(img.parentElement?.dataset)img.parentElement.dataset.loadState='missing';img.remove()}};
 if(img.complete){if(img.naturalWidth>0)loaded();else img.onerror()}
}
// Each damage event is ordered by the actual combat initiative. Separate wrapper
// and sprite animations let attacks, recoil and idle motion compose cleanly.
export function turnMotion(effects=[]){
 const plan={ally:{attack:null,hit:null},enemy:{attack:null,hit:null}};
 effects.forEach((effect,i)=>{if(!['ally','enemy'].includes(effect.target))return;const attacker=effect.target==='ally'?'enemy':'ally';const delay=i*420;plan[attacker].attack=delay;plan[effect.target].hit=delay+150});
 return plan;
}
