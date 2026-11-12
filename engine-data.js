import {habitatSpecies} from './habitat-species.js?v=20261113-kanto35';
import {expandedSpecies as originalSpecies} from './species-data.js?v=20261113-kanto35';
import {additionalSpecies} from './additional-species.js?v=20261113-kanto35';
export const expandedSpecies={...originalSpecies,...additionalSpecies,...habitatSpecies};
export {battleForms} from './additional-species.js?v=20261113-kanto35';
export {engineMoves} from './moves-data.js?v=20261113-kanto35';
export {abilityCatalog} from './ability-data.js?v=20261113-kanto35';
export {itemCatalog} from './items-data.js?v=20261113-kanto35';
