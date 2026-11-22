// Rotate values within the same six tiles; never rebuild the detail dialog or move its scroll.
export function bindStatRotation(root,{enabled=true}={}){const tiles=[...root.querySelectorAll('[data-stat-cycle]')].filter(t=>typeof t.querySelector==='function');if(!tiles.length)return ()=>{};
 const show=(tile,index)=>{tile.dataset.statView=String(index);const labels=['Stat','EV','IV'],keys=['statActual','statEv','statIv'];tile.querySelector('[data-stat-value]').textContent=tile.dataset[keys[index]];tile.querySelector('[data-stat-label]').textContent=labels[index]+' · tap to cycle';tile.setAttribute('aria-label',tile.dataset.statName+': '+labels[index]+' '+tile.dataset[keys[index]])};
 for(const tile of tiles){show(tile,0);tile.onclick=()=>show(tile,(Number(tile.dataset.statView)+1)%3);tile.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tile.click()}}}
 const timer=enabled?setInterval(()=>{if(root.hidden||tiles.some(t=>t.matches(':hover')||t===root.activeElement))return;for(const tile of tiles)show(tile,(Number(tile.dataset.statView)+1)%3)},4000):null;return ()=>{if(timer!==null)clearInterval(timer)}
}
