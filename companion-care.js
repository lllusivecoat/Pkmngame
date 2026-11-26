import {expandedSpecies} from './engine-data.js?v=20261126-roster1';
export const cleanNickname=value=>typeof value==='string'?[...value.normalize('NFC').replace(/[\x00-\x1f\x7f<>]/g,'').trim()].slice(0,12).join(''):'';
export const companionName=c=>cleanNickname(c?.nickname)||expandedSpecies[c?.species]?.name||'Pokémon';
export const careLocked=(s,inBattle=false)=>inBattle||!!s.gym?.session||!!s.gym?.world?.reserve?.activeUid;
export function nicknamePokemon(s,uid,value,inBattle=false){if(careLocked(s,inBattle))return 'Finish your current challenge or battle first.';const c=s.collection.find(c=>c.uid===uid);if(!c)return 'Choose an owned Pokémon.';if(typeof value!=='string'||[...value.trim()].length>12)return 'Use up to 12 characters.';c.nickname=cleanNickname(value);return c.nickname?'Nickname saved: '+c.nickname+'.':'Species name restored.'}
export function normalizeBoxes(s){const parents=new Set(s.gym?.breeding?.parents||[]),available=new Set(s.collection.filter(c=>!s.party.includes(c.uid)&&!parents.has(c.uid)).map(c=>c.uid)),used=new Set(),old=Array.isArray(s.boxes)?s.boxes:[],count=Math.max(32,Math.min(200,old.length),Math.ceil(available.size/30)+1);s.boxes=Array.from({length:count},(_,i)=>({name:cleanNickname(old[i]?.name)||'Box '+(i+1),slots:Array.from({length:30},(_,slot)=>{const uid=old[i]?.slots?.[slot];if(!available.has(uid)||used.has(uid))return null;used.add(uid);return uid})}));for(const uid of available){if(used.has(uid))continue;let box=s.boxes.find(b=>b.slots.includes(null));if(!box){box={name:'Box '+(s.boxes.length+1),slots:Array(30).fill(null)};s.boxes.push(box)}box.slots[box.slots.indexOf(null)]=uid;used.add(uid)}return s.boxes}
export function depositPokemon(s,uid,boxIndex=0,inBattle=false){if(careLocked(s,inBattle))return 'Finish your current challenge or battle first.';if(!s.party.includes(uid))return 'Choose a Pokémon from your party.';if(s.party.length<=1)return 'Keep at least one Pokémon in your party.';normalizeBoxes(s);const box=s.boxes[boxIndex];if(!box||!box.slots.includes(null))return 'Choose a box with an empty slot.';s.party=s.party.filter(id=>id!==uid);box.slots[box.slots.indexOf(null)]=uid;return companionName(s.collection.find(c=>c.uid===uid))+' deposited in '+box.name+'.'}
export function withdrawPokemon(s,uid,inBattle=false){if(careLocked(s,inBattle))return 'Finish your current challenge or battle first.';normalizeBoxes(s);if(s.party.length>=6)return 'Your party is full. Deposit a Pokémon first.';const box=s.boxes.find(b=>b.slots.includes(uid));if(!box)return 'Choose a Pokémon in storage.';box.slots[box.slots.indexOf(uid)]=null;s.party.push(uid);return companionName(s.collection.find(c=>c.uid===uid))+' joined your party.'}
export function moveBoxPokemon(s,uid,destination,inBattle=false){if(careLocked(s,inBattle))return 'Finish your current challenge or battle first.';normalizeBoxes(s);const from=s.boxes.find(b=>b.slots.includes(uid)),to=s.boxes[destination];if(!from||!to||!to.slots.includes(null))return 'Choose an available Pokémon and a box with space.';if(from===to)return 'Already in this box.';from.slots[from.slots.indexOf(uid)]=null;to.slots[to.slots.indexOf(null)]=uid;return 'Pokémon moved to '+to.name+'.'}

// Atomic drag/drop transaction: occupied targets swap, empty targets move.
export function transferStoredPokemon(s,uid,target,inBattle=false){
 if(careLocked(s,inBattle))return {ok:false,message:'Finish your current challenge or battle first.'};
 if(!s.collection.some(c=>c.uid===uid))return {ok:false,message:'Choose an owned Pokémon.'};
 normalizeBoxes(s);const partyIndex=s.party.indexOf(uid),boxIndex=s.boxes.findIndex(b=>b.slots.includes(uid)),slot=boxIndex<0?-1:s.boxes[boxIndex].slots.indexOf(uid);
 if(partyIndex<0&&boxIndex<0)return {ok:false,message:'This Pokémon is unavailable while at the nursery.'};
 const toParty=target?.kind==='party',box=toParty?null:s.boxes[target?.box];let index=target?.index;
 if(!Number.isInteger(index)||index<0||index>=(toParty?6:30)||(!toParty&&!box))return {ok:false,message:'Choose a valid destination.'};
 if(toParty)index=Math.min(index,s.party.length);
 const other=toParty?s.party[index]:box.slots[index];if(other===uid)return {ok:true,message:''};
 if(partyIndex>=0&&!toParty&&!other&&s.party.length<=1)return {ok:false,message:'Keep at least one Pokémon in your party.'};
 if(partyIndex>=0){if(toParty){const order=[...s.party];order.splice(partyIndex,1);order.splice(Math.min(index,order.length),0,uid);s.party=order;}else{box.slots[index]=uid;if(other)s.party[partyIndex]=other;else s.party.splice(partyIndex,1)}}
 else if(toParty){if(other){s.boxes[boxIndex].slots[slot]=other;s.party[index]=uid}else{if(s.party.length>=6)return {ok:false,message:'Your party is full. Drop onto a party Pokémon to swap.'};s.boxes[boxIndex].slots[slot]=null;s.party.push(uid)}}
 else{s.boxes[boxIndex].slots[slot]=other||null;box.slots[index]=uid}
 return {ok:true,message:other?'Pokémon swapped.':'Pokémon moved.'};
}
