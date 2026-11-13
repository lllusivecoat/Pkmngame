import {pokemonSizes} from './pokemon-size-data.js?v=20261113-art38';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
// Compress metre differences for readable chibi scenes. Length is not literal standing height.
// Weight contributes a little bulk, so squat species such as Donphan do not read as tiny.
export function pokemonDisplaySize(c={}){
 const data=pokemonSizes[c.form||c.species]||pokemonSizes[c.species]||{height:1,weight:20};
 const scale=clamp(.62+.48*Math.log2(1+data.height)+.065*Math.log10(1+data.weight),.72,1.58);
 return {...data,battle:Number(scale.toFixed(3)),follower:Number(clamp(scale,.78,1.45).toFixed(3)),portrait:Number(clamp(scale,.86,1.14).toFixed(3))};
}
