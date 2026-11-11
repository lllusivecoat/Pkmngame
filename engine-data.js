import {habitatSpecies} from './habitat-species.js?v=20261111-world28';
import {expandedSpecies as originalSpecies} from './species-data.js?v=20261111-world28';
import {additionalSpecies} from './additional-species.js?v=20261111-world28';
export const expandedSpecies={...originalSpecies,...additionalSpecies,...habitatSpecies};
export {battleForms} from './additional-species.js?v=20261111-world28';
export {engineMoves} from './moves-data.js?v=20261111-world28';
export {abilityCatalog} from './ability-data.js?v=20261111-world28';
export {itemCatalog} from './items-data.js?v=20261111-world28';
