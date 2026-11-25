export const musicTracks=[
 {id:'TXb2utExhkk',name:'All Champions · core series & remakes',group:'Champions'},
 {id:'J4aOX5s9nhM',name:'Kieran · Blueberry Champion',group:'Champions'},
 {id:'Ff7-T2QUU8s',name:'All Gym Leaders · original games & remakes',group:'Gym Leaders'},
 {id:'zqsX8CLZT5s',name:'Gym Leaders · Generations 1–9',group:'Gym Leaders'},
 {id:'-A0xtdP2TT8',name:'All Elite Four · core series & remakes',group:'Elite Four'},
 {id:'cJ36mhkjkiE',name:'Blueberry Elite Four · Indigo Disk',group:'Elite Four'},
 {id:'UT0htQFnVXE',name:'Indigo Disk · complete battle collection',group:'Elite Four'},
 {id:'r2BWx32tXXo',name:'Super-Ancient Pokémon · Ruby & Sapphire',group:'Legendary battles'},
 {id:'6j-LuyJ0SyA',name:'Ruby, Sapphire & Emerald · battle collection',group:'Legendary battles'},
 {id:'6NTha0KS48k',name:'Wild encounters · all core-series versions',group:'Wild battles'},
 {id:'im6tbN9SZXs',name:'Littleroot Town · Ruby & Sapphire',group:'Town & walking'},
 {id:'dxU12PZTzmc',name:'New Bark Town · HeartGold & SoulSilver',group:'Town & walking'},
 {id:'e2663mQL9EY',name:'Around the world · town themes',group:'Town & walking'},
 {id:'DzFlPk2UnQg',name:'Ruby & Sapphire · soundtrack',group:'Relaxing & collections'},
 {id:'N7W-CgUFYQE',name:'Pokopia · relaxing game music',group:'Relaxing & collections'},
 {id:'quVTxd6B1jg',name:'Bidoofwave · relax & study',group:'Relaxing & collections'},
 {id:'XEUeyux8AqI',name:'Pokémon Partner Chill',group:'Relaxing & collections'},
 {id:'eibce4Jutdc',name:'Take It Easy, Quaxly',group:'Relaxing & collections'}
];
export function mountMusic(doc=document,storage=localStorage){
 if(!doc.getElementById||!doc.createElement||!doc.body?.append||doc.getElementById('music-dock'))return;
 let selected=musicTracks[0].id;
 try{const saved=storage.getItem('greenwood.music.v1');if(musicTracks.some(t=>t.id===saved))selected=saved}catch{}
 const dock=doc.createElement('aside');dock.id='music-dock';dock.hidden=true;dock.setAttribute('aria-label','Pokémon music player');
 dock.innerHTML=`<section id="music-panel" class="panel" hidden><div class="spread music-heading"><strong id="music-heading">Pokémon music</strong><div class="music-window-actions"><button class="secondary" id="music-minimize" aria-label="Minimize music window" title="Minimize music window" disabled>−</button><button class="secondary" id="music-close" aria-label="Close and stop music" title="Close and stop music">×</button></div></div><div class="music-controls"><label>Choose music<select id="music-track">${[...new Set(musicTracks.map(t=>t.group))].map(group=>`<optgroup label="${group}">${musicTracks.filter(t=>t.group===group).map(t=>`<option value="${t.id}" ${t.id===selected?'selected':''}>${t.name}</option>`).join('')}</optgroup>`).join('')}</select></label><p class="hint">YouTube soundtrack collections; use the player’s chapters to choose a battle theme. Minimize to keep music playing while you play. Close or Stop ends playback. Internet required.</p><button id="music-play" class="primary">Play music</button><button id="music-stop" class="secondary">Stop</button></div><div id="music-frame"></div><a id="music-source" target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a></section>`;
 doc.body.append(dock);
 const el=id=>doc.getElementById(id),panel=el('music-panel'),frame=el('music-frame');let playing=false,minimized=false;
 function sync(){const wasMinimized=dock.dataset.minimized==='true';dock.inert=minimized;dock.setAttribute('aria-hidden',String(minimized||dock.hidden));dock.dataset.playing=String(playing);dock.dataset.minimized=String(minimized);dock.classList.toggle('music-minimized',minimized);const control=el('music-minimize');control.disabled=!playing;control.textContent=minimized?'+':'−';control.setAttribute('aria-label',minimized?'Restore music window':'Minimize music window');control.title=minimized?'Restore music window':'Minimize music window';el('music-heading').textContent=minimized?'Music':'Pokémon music';bindMusicButton(doc);if(minimized&&!wasMinimized)el('music-toggle')?.focus({preventScroll:true})}
 function source(){el('music-source').href='https://www.youtube.com/watch?v='+selected}
 function play(){playing=true;frame.innerHTML=`<iframe width="288" height="200" title="${musicTracks.find(t=>t.id===selected).name}" src="https://www.youtube-nocookie.com/embed/${selected}?autoplay=1&loop=1&playlist=${selected}&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;sync()}
 function stop(){playing=false;minimized=false;frame.replaceChildren();sync()}
 dock.toggleMusic=()=>{if(panel.hidden){panel.hidden=false;dock.hidden=false;minimized=false}else if(playing)minimized=!minimized;else{panel.hidden=true;dock.hidden=true}sync()};
 el('music-minimize').onclick=()=>{if(playing){minimized=!minimized;sync()}};
 el('music-close').onclick=()=>{stop();panel.hidden=true;dock.hidden=true;sync()};
 el('music-play').onclick=play;el('music-stop').onclick=stop;
 el('music-track').onchange=e=>{selected=e.target.value;try{storage.setItem('greenwood.music.v1',selected)}catch{}source();if(playing)play()};source();sync();
}

export function bindMusicButton(doc=document){if(!doc.getElementById)return;const button=doc.getElementById('music-toggle'),panel=doc.getElementById('music-panel'),dock=doc.getElementById('music-dock');if(!button||!panel||!dock)return;button.setAttribute('aria-expanded',String(!panel.hidden&&dock.dataset.minimized!=='true'));button.setAttribute('aria-controls','music-panel');button.title=dock.dataset.minimized==='true'?'Restore music window · playing in background':'Music player';button.setAttribute('aria-label',dock.dataset.minimized==='true'?'Restore music window; music playing in background':'Music player');button.onclick=()=>dock.toggleMusic?.()}
