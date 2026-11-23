// One shared mode keeps every displayed stat in sync, including all Market listings.
let selectedStatMode=0;
export function bindStatRotation(root,{enabled=true}={}){const tiles=[...root.querySelectorAll('[data-stat-cycle]')].filter(t=>typeof t.querySelector==='function');if(!tiles.length)return ()=>{};let mode=selectedStatMode;
 const show=()=>{for(const tile of tiles){const labels=['Stat','EV','IV'],keys=['statActual','statEv','statIv'];tile.dataset.statView=String(mode);tile.querySelector('[data-stat-value]').textContent=tile.dataset[keys[mode]];tile.querySelector('[data-stat-label]').textContent=labels[mode]+' · tap to cycle';tile.setAttribute('aria-label',tile.dataset.statName+': '+labels[mode]+' '+tile.dataset[keys[mode]])}};
 const next=()=>{mode=(mode+1)%3;selectedStatMode=mode;show()};show();for(const tile of tiles){tile.onclick=next;tile.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();next()}}}
 return ()=>{}
}
