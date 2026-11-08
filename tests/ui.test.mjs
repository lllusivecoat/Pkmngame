// DOM binding smoke test, not a substitute for visual browser QA.
import test from 'node:test';import assert from 'node:assert/strict';
const elements=new Map();let html='';
const root={get innerHTML(){return html},set innerHTML(value){html=value;elements.clear()}};
function all(selector){if(selector==='img.sprite')return [];if(selector.startsWith('.'))return [];let tags=[...html.matchAll(/<(button|input|select|section|div)\b([^>]*)>/g)].map(m=>{const attrs=Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));const key=m.index;if(!elements.has(key))elements.set(key,{tagName:m[1].toUpperCase(),dataset:Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v])),value:attrs.value||'',id:attrs.id,disabled:m[2].includes('disabled'),style:{},classList:{add(){}},focus(){},setSelectionRange(){},...attrs});return elements.get(key)});if(selector.startsWith('[data-')){const attr=selector.slice(1,-1).slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return tags.filter(e=>attr in e.dataset)}if(selector.startsWith('#'))return tags.filter(e=>e.id===selector.slice(1));return []}
const notice={textContent:'',className:''};globalThis.document={querySelector(s){if(s==='#app')return root;if(s==='#notice')return notice;return all(s)[0]||null},querySelectorAll:all,body:{style:{}},activeElement:null};
globalThis.window={addEventListener(){},scrollTo(){}};const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};globalThis.setInterval=()=>0;const deferred=[];globalThis.setTimeout=(fn,ms)=>{if(ms===700)deferred.push(fn);return 0};globalThis.clearTimeout=()=>{};globalThis.confirm=()=>true;
await import('../app.js');
const navigate=name=>{const b=all('[data-page]').find(e=>e.dataset.page===name);assert.ok(b,'Navigation '+name);b.onclick()};
test('starter UI binds, all navigation renders and supplies purchase persists',()=>{assert.match(html,/Welcome to Greenwood/);const starter=all('[data-starter]').find(e=>e.dataset.starter==='squirtle');assert.ok(starter);starter.onclick();assert.match(html,/Greenwood wilds/);let saved=JSON.parse(memory.get('greenwood.save.v2'));assert.equal(saved.collection[0].species,'squirtle');for(const page of ['Home','Creatures','Pokédex','Market','Guild','Arena','Profile','Settings','Explore']){navigate(page);assert.ok(html.includes('<main>'));assert.ok(!html.includes('undefined'),'No undefined UI on '+page)}navigate('Market');const before=JSON.parse(memory.get('greenwood.save.v2')).coins;all('[data-buy-tool]')[0].onclick();saved=JSON.parse(memory.get('greenwood.save.v2'));assert.equal(saved.coins,before-150);assert.equal(saved.traps,30);navigate('Explore');all('[data-step]').find(e=>e.dataset.step==='1,0').onclick();saved=JSON.parse(memory.get('greenwood.save.v2'));assert.deepEqual(saved.clues,[0]);assert.match(html,/CLUE DISCOVERED/)});

test('encounter UI plays through attack, capture, success panel, collection and AI entry',()=>{
 const originalRandom=Math.random;Math.random=()=>.8;
 try{
  // The previous UI check ended at the first clue; the next step forces an encounter.
  all('[data-step]').find(e=>e.dataset.step==='1,0').onclick();
  assert.match(html,/An unexpected encounter/);assert.match(html,/scenic-battle/);assert.match(html,/trap-options/);assert.match(html,/chance-ring/);
  const attack=all('[data-move]').find(e=>e.dataset.move==='0');assert.ok(attack);attack.onclick();
  assert.match(html,/BATTLE LOG/);assert.match(html,/damage-number/);
  const arcane=all('[data-trap]').find(e=>e.dataset.trap==='2');arcane.onclick();
  Math.random=()=>0;const before=JSON.parse(memory.get('greenwood.save.v2')).collection.length;
  all('#catch')[0].onclick();assert.equal(deferred.length,1);deferred.shift()();
  assert.match(html,/A new story begins/);let saved=JSON.parse(memory.get('greenwood.save.v2'));assert.equal(saved.collection.length,before+1);assert.equal(saved.betterTraps[1],2);
  all('#result-view')[0].onclick();assert.match(html,/Abilities &amp; passive|Abilities & passive/);assert.ok(all('#party-toggle').length);all('#close')[0].onclick();
  navigate('Arena');all('#arena-start')[0].onclick();assert.match(html,/AI PRACTICE/);assert.match(html,/Practice arena/);assert.equal(all('#catch').length,0);all('#flee')[0].onclick();
 }finally{Math.random=originalRandom}
});
