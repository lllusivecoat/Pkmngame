import {battleForms,expandedSpecies} from './engine-data.js?v=20261110-arena24';
export {battleForms};
export const formsFor=species=>Object.values(battleForms).filter(f=>f.base===species);
export const activeForm=(b,c)=>battleForms[b?.states?.[c.uid]?.form]||null;
export function displayCreature(b,c){const f=activeForm(b,c);return f?{...c,form:f.id}:c}
export function formInfo(id){return battleForms[id]||expandedSpecies[id]}
export function supportsGmax(species){return formsFor(species).some(f=>f.kind==='gmax')}
