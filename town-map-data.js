// A fixed, authored town. Camera movement reveals it; terrain is never rerolled.
export const TOWN_SIZE=39;
export const TOWN_OFFSET=12;
export const townRiverX=y=>31+Math.round(Math.sin(y/4)*1.4);
export const townCottages=[{x:7,y:12},{x:8,y:27},{x:12,y:31},{x:25,y:32},{x:26,y:8}];
export function townTerrain(x,y){if(x<0||y<0||x>=TOWN_SIZE||y>=TOWN_SIZE)return 'edge';if(x===10&&y===17)return 'path';const river=townRiverX(y),water=Math.abs(x-river)<=1;if(water&&[8,9,27,28].includes(y))return 'bridge';if(water)return 'water';if(x>=16&&x<=22&&y>=21&&y<=25)return 'path';if((x>=18&&x<=20&&y>=5&&y<=36)||(y>=18&&y<=20&&x>=3&&x<=36)||(y>=26&&y<=28&&x>=6&&x<=36)||(y>=8&&y<=9&&x>=6&&x<=36)||(x===14||x===24)&&y>=19&&y<=23||y===15&&x>=14&&x<=24||y===23&&x>=14&&x<=24||x>=17&&x<=21&&y>=17&&y<=20)return 'path';return 'grass'}
const hash=(x,y)=>(x*73856093^y*19349663)>>>0;
const trees=[];
for(let y=1;y<38;y++)for(let x=1;x<38;x++){if(townTerrain(x,y)!=='grass'||x>=12&&x<=26&&y>=11&&y<=26)continue;if(townCottages.some(p=>Math.abs(p.x-x)<=2&&y>=p.y-3&&y<=p.y+1))continue;const outer=x<4||x>35||y<5||y>35,grove=[[7,6],[6,16],[9,22],[11,10],[27,14],[28,31],[7,33]].some(([a,b])=>Math.abs(a-x)<=1&&Math.abs(b-y)<=1);if((outer&&(x+y)%2===0)||(grove&&hash(x,y)%4!==0))trees.push({x,y,type:hash(x,y)%3?'oak':'pine'})}
export const townTrees=trees;
export function townBaseWalkable(x,y){if(x<=0||y<=0||x>=38||y>=38||townTerrain(x,y)==='water')return false;if(townTrees.some(t=>t.x===x&&t.y===y))return false;if(townCottages.some(p=>x>=p.x-1&&x<=p.x+1&&y>=p.y-2&&y<=p.y-1))return false;return true}
export function townDistrict(x,y){if(x>=29)return 'Riverwalk';if(y<=10)return 'Northwood';if(y>=27)return 'South Quarter';if(x<12)return 'Orchard Lane';return 'Gym District'}
export function visibleTownTiles(position,radius=9){const tiles=[];for(let y=Math.max(0,position.y-radius);y<=Math.min(TOWN_SIZE-1,position.y+radius);y++)for(let x=Math.max(0,position.x-radius);x<=Math.min(TOWN_SIZE-1,position.x+radius);x++)tiles.push({x,y});return tiles}
