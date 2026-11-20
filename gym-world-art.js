import {gymWorldMaps} from './gym-world-data.js?v=20261120-interiors1';
import {playerArt} from './visuals.js?v=20261120-interiors1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function gymPlayerView(s){const w=s.gym.world||{location:'town',position:{x:7,y:6},facing:'down'},size=gymWorldMaps[w.location].size;return `<div class="gym-leader-token world-player" style="--player-x:${(w.position.x+.5)/size*100}%;--player-y:${(w.position.y+1)/size*100}%;--actor-width:${112/size}%;--actor-height:${132/size}%;--actor-depth:${(w.position.y+1)*10+1}">${playerArt(w.facing,false,s.trainer)}<span>${esc(s.name)}</span></div>`}
