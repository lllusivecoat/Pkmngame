// Local prototype schedule; a future server can supply the active event and expiry.
export const WORLD_PERIOD=180000;
export const worldEvents=[
 {id:'stormfront',name:'Stormfront',description:'Electric and Water species receive 50% more encounter weight.'},
 {id:'moonfall',name:'Moonlit gathering',description:'Murkrow visits every region. Gastly and Murkrow receive twice their normal encounter weight.'},
 {id:'swarm',name:'Regional swarm',description:'One local species receives three times its normal encounter weight.'},
 {id:'survey',name:'Wayfarer survey',description:'Exploration earns +2 trainer XP per step; dedicated hunt rolls increase by 25%.'}
];
export const swarmSpecies={'Greenwood':{id:'caterpie',name:'Caterpie'},'Thunder Ridge':{id:'mareep',name:'Mareep'},'Ashlands':{id:'geodude',name:'Geodude'},'Frostfall':{id:'psyduck',name:'Psyduck'}};
export const currentEvent=s=>worldEvents.find(e=>e.id===s.event)||worldEvents[0];
export function eventWeight(s,p){if(s.event==='stormfront'&&(p.types||[p.type]).some(t=>['Electric','Water'].includes(t)))return 1.5;if(s.event==='moonfall'&&['gastly','murkrow'].includes(p.id))return 2;if(s.event==='swarm'&&p.id===swarmSpecies[s.region||'Greenwood']?.id)return 3;return 1}
export const eventVisitors=s=>s.event==='moonfall'?['murkrow']:[];
export const eventStepBonus=s=>s.event==='survey'?2:0;
export const huntEventMultiplier=s=>s.event==='survey'?1.25:1;
export function eventClock(s,now=Date.now()){const end=Number(s.worldAt)+WORLD_PERIOD;return Math.max(0,Math.min(WORLD_PERIOD,Number.isFinite(end)?end-now:WORLD_PERIOD))}
export function eventCountdown(s,now=Date.now()){const seconds=Math.ceil(eventClock(s,now)/1000);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
export const nextEvent=s=>worldEvents[(worldEvents.findIndex(e=>e.id===currentEvent(s).id)+1)%worldEvents.length];
export function worldEventPanel(s){const e=currentEvent(s),target=swarmSpecies[s.region||'Greenwood'];return `<section class="world-event-panel"><div class="spread"><div class="eyebrow">WORLD EVENT · LOCAL PROTOTYPE</div><strong data-world-countdown role="timer" aria-label="Time until world conditions rotate">${eventCountdown(s)}</strong></div><h3>${e.name}</h3><p>${e.description}</p>${e.id==='swarm'?`<p class="event-impact">Swarm species: <strong>${target?.name||'Caterpie'}</strong> · ${s.region||'Greenwood'}</p>`:e.id==='moonfall'?'<p class="event-impact">Visitor: <strong>Murkrow</strong> · normally absent from Thunder Ridge and Ashlands.</p>':e.id==='survey'?'<p class="event-impact">5 trainer XP per step · maximum learned hunt roll 10% instead of 8%.</p>':'<p class="event-impact">Affects species selection after a normal terrain encounter triggers.</p>'}<p class="hint">Next: ${nextEvent(s).name}. Weather, time and events rotate together every 3 minutes. Encounter weight changes which species appears; it does not make every step a battle or boost combat stats.</p></section>`}
