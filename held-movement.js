// Input state stays outside saves and survives map redraws. One tile per cadence, independent of OS key repeat.
export const MOVE_INTERVAL_MS=200;
export const movementDirections={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
export function createHeldMovement({step,canMove=()=>true,schedule=setTimeout,cancel=clearTimeout,interval=MOVE_INTERVAL_MS,onHoldingChange=()=>{}}){
 const held=new Map();let timer=null;
 function stop(){const active=held.size>0;held.clear();if(timer!==null)cancel(timer);timer=null;if(active)onHoldingChange(false)}
 function tick(){timer=null;if(!held.size)return;if(!canMove()){stop();return}const direction=[...held.values()].at(-1);if(step(...direction)===false||!canMove()){stop();return}if(held.size)timer=schedule(tick,interval)}
 return {press(source,direction){if(held.has(source)||!canMove())return;const active=held.size>0;held.set(source,direction);if(!active)onHoldingChange(true);if(timer===null)tick()},release(source){held.delete(source);if(!held.size){if(timer!==null)cancel(timer);timer=null;onHoldingChange(false)}},tap(direction){if(canMove())step(...direction)},stop,get active(){return held.size>0}};
}
export function bindHeldMovement({doc=document,win=window,step,canMove,onHoldingChange,interval=MOVE_INTERVAL_MS}){
 if(!doc?.addEventListener||!win?.addEventListener)return {stop(){},destroy(){}};
 const controller=createHeldMovement({step,canMove,onHoldingChange,interval}),editing=node=>!!node?.closest?.('input,select,textarea,[contenteditable="true"],[contenteditable=""]');
 const down=e=>{const key=e.key.toLowerCase(),direction=movementDirections[key];if(!direction||e.ctrlKey||e.metaKey||e.altKey)return;if(editing(e.target)||!canMove()){controller.stop();return}e.preventDefault();if(!e.repeat)controller.press('key:'+key,direction)};
 const up=e=>{if(movementDirections[e.key.toLowerCase()])controller.release('key:'+e.key.toLowerCase())};
 const button=e=>e.target?.closest?.('[data-gym-walk],[data-step]');
 const pointer=e=>{const target=button(e);if(!target||e.button!==0)return;if(editing(doc.activeElement))doc.activeElement.blur?.();if(!canMove())return;e.preventDefault();try{doc.documentElement.setPointerCapture(e.pointerId)}catch{}controller.press('pointer:'+e.pointerId,(target.dataset.gymWalk||target.dataset.step).split(',').map(Number))};
 const release=e=>{controller.release('pointer:'+e.pointerId);try{doc.documentElement.releasePointerCapture(e.pointerId)}catch{}};
 const click=e=>{const target=button(e);if(!target)return;e.preventDefault();e.stopPropagation();if(e.detail===0&&canMove())controller.tap((target.dataset.gymWalk||target.dataset.step).split(',').map(Number))};
 const blur=()=>controller.stop(),visibility=()=>{if(doc.hidden)controller.stop()};
 win.addEventListener('keydown',down);win.addEventListener('keyup',up);win.addEventListener('blur',blur);win.addEventListener('pointerup',release);win.addEventListener('pointercancel',release);doc.addEventListener('pointerdown',pointer,{passive:false});doc.addEventListener('click',click);doc.addEventListener('visibilitychange',visibility);
 return {stop:controller.stop,destroy(){controller.stop();win.removeEventListener('keydown',down);win.removeEventListener('keyup',up);win.removeEventListener('blur',blur);win.removeEventListener('pointerup',release);win.removeEventListener('pointercancel',release);doc.removeEventListener('pointerdown',pointer);doc.removeEventListener('click',click);doc.removeEventListener('visibilitychange',visibility)}};
}
