import {itemCatalog} from './engine-data.js?v=20261126-world1';
export const isKeyItem=item=>!!item&&(item.subtype==='key-item'||item.category==='Key items');
export const ownsUniqueItem=(s,id)=>!!s.uniquePurchases?.includes(id)||(Number(s.bag?.[id])||0)>0;
export function normalizeUniquePurchases(s){s.uniquePurchases=[...new Set([...(Array.isArray(s.uniquePurchases)?s.uniquePurchases.filter(id=>typeof id==='string'&&itemCatalog[id]):[]),...Object.keys(s.bag||{}).filter(id=>isKeyItem(itemCatalog[id])&&s.bag[id]>0)])];return s.uniquePurchases}
