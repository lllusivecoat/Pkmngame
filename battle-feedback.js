const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const statusInfo={
 paralysis:{name:'Paralysis',help:'Speed is halved. Each turn has a 25% chance of being fully paralyzed; otherwise it can attack normally.'},
 burn:{name:'Burn',help:'Loses 1/16 max HP at the end of each turn. Physical damage is usually halved.'},
 poison:{name:'Poison',help:'Loses 1/8 max HP at the end of each turn.'},
 toxic:{name:'Badly poisoned',help:'Poison damage increases each turn, starting at 1/16 max HP. Switching resets the damage counter.'},
 sleep:{name:'Sleep',help:'Usually cannot act for 1–3 turns, then wakes up. Some moves can be used while asleep.'},
 freeze:{name:'Freeze',help:'Usually cannot act; each turn has a 20% chance to thaw. Certain moves also thaw it.'},
 confusion:{name:'Confusion',help:'For 2–5 turns it has a 1/3 chance to hurt itself instead of using its move. Switching clears confusion.'},
};
export function statusBadges(st={}){const conditions=[st.status,...(st.confusion?['confusion']:[])].filter(Boolean);return conditions.map(id=>{const info=statusInfo[id]||{name:id,help:id};return `<span class="battle-condition" data-condition="${esc(id)}" tabindex="0" title="${esc(info.help)}">${esc(info.name)}<span class="battle-condition-help" role="tooltip">${esc(info.help)}</span></span>`}).join('')}
export function cantMessage(name,reason,move=''){
 const text={par:`${name} is fully paralyzed and couldn't move this turn. It may attack next turn.`,slp:`${name} is asleep and couldn't use its move this turn.`,frz:`${name} is frozen and couldn't move this turn.`,flinch:`${name} flinched and couldn't move this turn.`,attract:`${name} is immobilized by infatuation this turn.`,recharge:`${name} must recharge and cannot attack this turn.`,truant:`${name} is loafing around because of Truant this turn.`,nopp:`${name} has no PP left for ${move||'that move'}.`, 'move: Disable':`${name}'s ${move||'selected move'} is disabled.`, 'move: Taunt':`${name} cannot use ${move||'that status move'} while taunted.`, 'move: Torment':`${name} cannot use the same move twice in a row because of Torment.`, 'ability: Damp':`${name}'s move was prevented by Damp.`};
 return text[reason]||`${name} couldn't use ${move||'its move'} this turn (${reason}).`;
}
export function turnFeedback(b){return b.turnMessages?.length?`<section class="battle-turn-feedback" aria-label="Last turn events" aria-live="polite"><strong>Turn ${Math.max(1,b.turn)} · what happened</strong><ul>${b.turnMessages.slice(-16).map(message=>`<li>${esc(message)}</li>`).join('')}</ul></section>`:''}
