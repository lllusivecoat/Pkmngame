import {isLegendarySpecies,MARKET_SHINY_CHANCE} from './pokemon-individuals.js?v=20261122-portraitgallery1';
import {expandedSpecies} from './engine-data.js?v=20261122-portraitgallery1';
import {createCreature,catchCreature} from './core.js?v=20261122-portraitgallery1';
import {buyItem,itemCatalog} from './items.js?v=20261122-portraitgallery1';
import {gymClock,marketClock} from './gym-clock.js?v=20261122-portraitgallery1';
const babies=new Set('pichu cleffa igglybuff togepi tyrogue smoochum elekid magby azurill wynaut budew chingling bonsly mimejr happiny munchlax riolu mantyke toxel'.split(' '));
const excluded=new Set('articuno zapdos moltres mewtwo mew lugia hooh celebi regirock regice registeel latias latios kyogre groudon rayquaza jirachi deoxys dialga palkia giratina darkrai arceus'.split(' '));
const idOf=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function evolutionStage(id){let stage=1,current=expandedSpecies[id],seen=new Set([id]);while(current?.prevo){const p=idOf(current.prevo);if(babies.has(p)||!expandedSpecies[p]||seen.has(p))break;seen.add(p);stage++;current=expandedSpecies[p]}return stage}
export function normalizeFacilities(raw){return {shop:Math.min(5,Math.max(1,Math.floor(Number(raw?.shop)||1))),market:Math.min(5,Math.max(1,Math.floor(Number(raw?.market)||1)))}}
export const marketTiers=[null,{min:6,max:10,stage:1,bst:360},{min:10,max:16,stage:1,bst:430},{min:16,max:23,stage:2,bst:470},{min:22,max:30,stage:2,bst:540},{min:28,max:38,stage:2,bst:650}];
const prices={shop:[0,0,400,900,1800,3200],market:[0,0,800,1800,3500,6500]},gates={shop:[0,0,20,60,120,240],market:[0,0,40,100,220,400]};
export function facilityUpgrade(s,id){const level=normalizeFacilities(s.gym.facilities)[id];if(!level)return null;return {level,maxed:level===5,cost:prices[id][level+1]||0,reputation:gates[id][level+1]||0}}
export function upgradeFacility(s,id){const u=facilityUpgrade(s,id);if(!u)return 'Unknown building.';if(s.gym.session||s.gym.world.reserve.activeUid)return 'Finish the current challenge or encounter first.';if(!s.collection.length)return 'Choose your starting Pokémon first.';if(u.maxed)return 'This building is fully upgraded.';if(s.gym.reputation<u.reputation)return `Requires ${u.reputation} reputation.`;if(s.coins<u.cost)return 'Not enough coins.';s.coins-=u.cost;s.gym.facilities=normalizeFacilities(s.gym.facilities);s.gym.facilities[id]++;if(id==='market')s.gym.marketStock=null;return `${id==='shop'?'Item shop':'Pokémon Market'} upgraded to level ${u.level+1}.`}
const basic=new Set('pokeball potion antidote paralyzeheal awakening burnheal iceheal'.split(' '));const tier2=new Set('greatball superpotion repel oranberry cheriberry chestoberry pechaberry rawstberry aspearberry'.split(' '));const tier3=new Set('ultraball hyperpotion revive fullheal superrepel sitrusberry leppaberry lumberry'.split(' '));const rareBalls=new Set('masterball cherishball parkball strangeball'.split(' '));
export function shopItemTier(item){if(!item||rareBalls.has(item.id))return Infinity;if(basic.has(item.id))return 1;if(tier2.has(item.id))return 2;if(tier3.has(item.id))return 3;if(['Medicine','Berries','Balls','Battle items'].includes(item.category))return 4;return 5}
export const shopItemAvailable=(s,item)=>shopItemTier(item)<=normalizeFacilities(s.gym.facilities).shop;
export function buyShopItem(s,id){if(s.gym.world.location!=='shop')return {ok:false,message:'Visit the item shop first.'};if(!shopItemAvailable(s,itemCatalog[id]))return {ok:false,message:'Upgrade the item shop to unlock this item.'};return buyItem(s,id)}
export function starterChoices(s){if(!s.gym.type)return [];const preferred='bulbasaur charmander squirtle pikachu eevee vulpix psyduck magnemite oddish snover vulpixalola machop mankey ekans grimer sandshrew geodude pidgey spearow ralts abra caterpie weedle onix gastly dratini bagon murkrow deino beldum clefairy jigglypuff'.split(' ');return [...preferred,...Object.keys(expandedSpecies)].filter((id,i,a)=>a.indexOf(id)===i&&expandedSpecies[id]?.types.includes(s.gym.type)&&evolutionStage(id)===1&&!excluded.has(id)&&Object.values(expandedSpecies[id].baseStats).reduce((a,b)=>a+b,0)<=450).slice(0,6)}
export function claimGymStarter(s,id){if(s.gym.starterClaimed||s.collection.length)return 'Your starting partner has already joined you.';if(!starterChoices(s).includes(id))return 'Choose a starting Pokémon matching your Gym type.';const c=createCreature(id,8);c.variant='Normal';c.location='Gym charter · starting partner';const coins=s.coins;catchCreature(s,c);s.coins=coins;s.gym.starterClaimed=true;return `${expandedSpecies[id].name} is your starting partner. Your charter funds are untouched.`}
function hash(text){let n=2166136261;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0}
function rng(seed){return ()=>{seed+=0x6D2B79F5;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
// Only species with a further permanent evolution are eligible, irrespective of Gym type.
export const marketSpeciesEligible=id=>!!expandedSpecies[id]&&!isLegendarySpecies(id)&&evolutionStage(id)<=2&&(!!expandedSpecies[id].evos?.length||!expandedSpecies[id].prevo);
export const marketListingCounts=level=>({party:[5,6,7,8,10][Math.max(0,Math.min(4,(level||1)-1))],reserve:[3,4,5,6,7][Math.max(0,Math.min(4,(level||1)-1))]});
export function ensureMarketStock(s,now=Date.now()){
 const hour=marketClock(s,now).slotKey,level=normalizeFacilities(s.gym.facilities).market,key=`v5:${hour}:${level}`,old=s.gym.marketStock;
 if(old?.key===key&&Array.isArray(old.offers)&&old.offers.length)return old;
 const tier=marketTiers[level],pool=Object.keys(expandedSpecies).filter(id=>marketSpeciesEligible(id)&&evolutionStage(id)<=tier.stage&&(expandedSpecies[id].evoLevel||1)<=tier.max&&Object.values(expandedSpecies[id].baseStats).reduce((a,b)=>a+b,0)<=tier.bst),offers=[];
 for(const section of ['party','reserve']){
  const random=rng(hash(`${s.gym.clock.seed}:${key}:${section}`));
  const candidates=section==='reserve'?pool.filter(id=>!s.gym.world.reserve.speciesUnlocks.some(u=>u.species===id)):pool;
  const remaining=[...candidates];
  for(let i=0;i<marketListingCounts(level)[section]&&remaining.length;i++){
   const index=Math.floor(random()*remaining.length),id=remaining[index],species=expandedSpecies[id];if(section==='reserve')remaining.splice(index,1);
   const levelNow=Math.max(species.evoLevel||1,tier.min+Math.floor(random()*(tier.max-tier.min+1))),uid=`market-v5-${s.gym.clock.seed}-${hour}-${level}-${section}-${i}`;
   const bst=Object.values(species.baseStats).reduce((a,b)=>a+b,0),price=Math.max(150,Math.round(bst*(levelNow*.10+level*.45)*(section==='reserve'?.65:1)/50)*50);
   if(section==='reserve'){offers.push({id:uid,section,species:id,minLevel:Math.max(species.evoLevel||1,tier.min),maxLevel:tier.max,price,stage:evolutionStage(id)});continue}
   const c=createCreature(id,levelNow,random);c.uid=uid;c.variant=random()<MARKET_SHINY_CHANCE?'Shiny':'Normal';for(const stat of ['hp','attack','defence','specialAttack','specialDefence','speed'])c.ivs[stat]=Math.floor(random()*32);c.caughtAt=new Date(s.gym.clock.startedAt+hour*900000).toISOString();c.originalTrainer='market-breeder-'+i;c.language='en';c.location='Pokémon Market';offers.push({id:uid,section,creature:c,price,stage:evolutionStage(id)});
  }
 }
 s.gym.marketStock={key,hour,level,offers,sold:old?.key===key&&Array.isArray(old.sold)?old.sold.filter(id=>offers.some(o=>o.id===id)):[]};return s.gym.marketStock;
}
export function buyMarketOffer(s,id,now=Date.now()){
 if(s.gym.world.location!=='market')return 'Visit the Pokémon Market first.';
 if(s.gym.session||s.gym.world.reserve.activeUid)return 'Finish the current challenge or encounter first.';
 if(!s.gym.starterClaimed&&!s.collection.length)return 'Choose your starting partner first.';
 const stock=ensureMarketStock(s,now),offer=stock.offers.find(o=>o.id===id);if(!offer)return 'Stock has refreshed. Choose a current offer.';
 if(stock.sold.includes(id)||s.collection.some(c=>c.uid===id))return 'This offer has already been purchased.';
 const reserve=s.gym.world.reserve;
 if(offer.section==='reserve'&&reserve.speciesUnlocks.some(u=>u.species===offer.species))return 'This species is already established in your reserve.';
 if(s.coins<offer.price)return 'Not enough coins.';
 if(offer.section==='party'&&s.party.length>=6)return 'Your party is full. Remove a partner before buying.';
 const balance=s.coins-offer.price;
 if(offer.section==='party'){const c=structuredClone(offer.creature);catchCreature(s,c);s.coins=balance;stock.sold.push(id);return `${expandedSpecies[c.species].name} joined your party.`}
 s.coins=balance;reserve.speciesUnlocks.push({species:offer.species,minLevel:offer.minLevel,maxLevel:offer.maxLevel});stock.sold.push(id);
 return `${expandedSpecies[offer.species].name} is established in your wild reserve. Each encounter finds a new individual.`;
}
