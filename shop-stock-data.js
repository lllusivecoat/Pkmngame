import {itemCatalog,itemContext} from './items.js?v=20261126-world1';
import {isKeyItem} from './key-items.js?v=20261126-world1';
export const shopTypes=['Key items','Balls','Medicine','Battle items','Berries','Held items','TMs','Evolution'];
export const shopHeaders=['Item ID','Name','Item type','Min shop level','Price coins','Buy once','Enabled'];
const basic=new Set('pokeball potion antidote paralyzeheal awakening burnheal iceheal'.split(' ')),tier2=new Set('greatball superpotion repel oranberry cheriberry chestoberry pechaberry rawstberry aspearberry'.split(' ')),tier3=new Set('ultraball hyperpotion revive fullheal superrepel sitrusberry leppaberry lumberry'.split(' ')),rare=new Set('masterball cherishball parkball strangeball'.split(' '));
export function defaultShopTier(item){if(!item||rare.has(item.id))return 5;if(isKeyItem(item)||basic.has(item.id))return 1;if(tier2.has(item.id))return 2;if(tier3.has(item.id))return 3;return ['Medicine','Berries','Balls','Battle items'].includes(item.category)?4:5}
export const defaultShopRows=Object.values(itemCatalog).map(i=>({id:i.id,name:i.name,type:i.category,level:defaultShopTier(i),price:i.cost,once:isKeyItem(i),enabled:!rare.has(i.id)&&!itemContext(i)}));
