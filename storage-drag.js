// Event delegation survives storage redraws. Native drag for mouse; press/hold drag for touch.
export function bindStorageDrag(root,{drop,locked=()=>false}={}){
 let uid=null,touch=null,timer=null,ghost=null,over=null,suppressUntil=0,scrollFrame=null,point=null;
 const target=e=>e?.closest?.('[data-storage-kind][data-storage-index]');
 const clear=()=>{if(scrollFrame!==null)cancelAnimationFrame(scrollFrame);scrollFrame=null;point=null;clearTimeout(timer);timer=null;ghost?.remove();ghost=null;over?.classList.remove('storage-drop-over');over=null;root.querySelectorAll('.storage-dragging').forEach(e=>e.classList.remove('storage-dragging'));uid=null;touch=null};
 const mark=e=>{const next=target(e);if(next!==over){over?.classList.remove('storage-drop-over');over=next;over?.classList.add('storage-drop-over')}};
 const finish=el=>{const id=uid,t=target(el),destination=t&&{kind:t.dataset.storageKind,index:Number(t.dataset.storageIndex),box:Number(t.dataset.storageBox)};clear();if(id&&destination&&!locked())drop(id,destination)};
 const start=e=>{const card=e.target.closest('[data-storage-drag]');if(!card||locked()||card.draggable===false)return e.preventDefault();uid=card.dataset.storageDrag;card.classList.add('storage-dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',uid)};
 const dragover=e=>{if(!uid||locked())return;if(target(e.target)){e.preventDefault();e.dataTransfer.dropEffect='move';mark(e.target)}};
 const dropped=e=>{if(!uid)return;e.preventDefault();finish(e.target)};
 const down=e=>{if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;const card=e.target.closest('[data-storage-drag]');if(!card||locked()||card.draggable===false)return;touch={id:e.pointerId,x:e.clientX,y:e.clientY,card};timer=setTimeout(()=>{if(!touch)return;uid=card.dataset.storageDrag;card.classList.add('storage-dragging');ghost=card.cloneNode(true);ghost.classList.add('storage-drag-ghost');ghost.removeAttribute('id');ghost.style.left=touch.x+'px';ghost.style.top=touch.y+'px';document.body.append(ghost);document.documentElement.setPointerCapture?.(touch.id);navigator.vibrate?.(20)},220)};
 const edgeScroll=()=>{scrollFrame=null;if(!uid||!touch||!point)return;const delta=point.y<70?-12:point.y>innerHeight-70?12:0;if(delta){window.scrollBy(0,delta);mark(document.elementFromPoint(point.x,point.y));scrollFrame=requestAnimationFrame(edgeScroll)}};
 const move=e=>{if(touch?.id!==e.pointerId)return;if(!uid){if(Math.hypot(e.clientX-touch.x,e.clientY-touch.y)>10)clear();return}e.preventDefault();point={x:e.clientX,y:e.clientY};if(scrollFrame===null)scrollFrame=requestAnimationFrame(edgeScroll);ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';mark(document.elementFromPoint(e.clientX,e.clientY))};
 const up=e=>{if(touch?.id!==e.pointerId)return;if(uid){e.preventDefault();suppressUntil=Date.now()+500;finish(document.elementFromPoint(e.clientX,e.clientY))}else clear()};
 const click=e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopPropagation()}};
 const cancel=()=>clear(),pointerCancel=e=>{if(touch?.id===e.pointerId)clear()};const events=[['dragstart',start],['dragover',dragover],['drop',dropped],['dragend',cancel],['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',pointerCancel],['click',click,true]];
 for(const [type,fn,capture=false]of events)root.addEventListener(type,fn,{capture,passive:false});window.addEventListener('blur',cancel);
 return ()=>{clear();for(const[type,fn,capture=false]of events)root.removeEventListener(type,fn,capture);window.removeEventListener('blur',cancel)};
}
