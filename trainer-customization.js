// Original detailed sprite atlas with material-specific colour overlays. No whole-sprite hue shifts.
export const trainerOptions={
 gender:[['male','Male'],['female','Female']],
 outfit:[['explorer','Woodland'],['ranger','Coastal'],['scholar','Twilight']],
 skin:[['fair','Fair','#f5d7bd'],['warm','Warm','#e9bb96'],['tan','Tan','#c58c63'],['olive','Olive','#ae805d'],['brown','Brown','#895b43'],['deep','Deep','#5e3d32']],
 hair:[['brown','Chestnut','#664434'],['black','Midnight','#2c303a'],['blonde','Golden','#dab576'],['auburn','Auburn','#a75c40'],['silver','Silver','#c4cbd0'],['violet','Violet','#79638f']],
 color:[['green','Fern','#5b9674'],['blue','Ocean','#547fae'],['red','Coral','#c86560'],['purple','Orchid','#9376b2'],['gold','Ochre','#c49b53'],['teal','Lagoon','#4f9fa1']],
 hairstyle:[['short','Short'],['bob','Bob'],['ponytail','Ponytail']],
 hat:[['cap','Adventure cap'],['beanie','Beanie'],['none','No hat']]
};
export const defaultTrainer={gender:'male',outfit:'explorer',skin:'warm',hair:'brown',color:'green',hairstyle:'short',hat:'cap'};
export function normalizeTrainer(raw){return Object.fromEntries(Object.keys(defaultTrainer).map(k=>[k,trainerOptions[k].some(([id])=>id===raw?.[k])?raw[k]:defaultTrainer[k]]))}
export function trainerName(raw){return String(raw??'').normalize('NFKC').replace(/[^\p{L}\p{N} .’'\-]/gu,'').trim().slice(0,20).trim()||'Shaun'}
export function presetTrainer(gender,outfit,base={}){const a=normalizeTrainer({...base,gender,outfit});return {...a,color:{explorer:'green',ranger:'blue',scholar:'purple'}[outfit]||a.color,hairstyle:gender==='female'?'ponytail':'short',hat:'cap'}}
let spriteUID=0;
const frameGeometry={
 down:{skin:'<ellipse cx="128" cy="96" rx="32" ry="28"/><ellipse cx="87" cy="169" rx="15" ry="28"/><ellipse cx="170" cy="169" rx="13" ry="27"/>',hair:'<ellipse cx="128" cy="90" rx="73" ry="37"/>',face:'<ellipse cx="128" cy="98" rx="33" ry="28"/>',coat:'<rect x="55" width="145" height="67"/><rect x="96" y="127" width="68" height="76"/>'},
 left:{skin:'<ellipse cx="109" cy="99" rx="29" ry="27"/><ellipse cx="136" cy="168" rx="14" ry="28"/>',hair:'<ellipse cx="127" cy="91" rx="57" ry="36"/>',face:'<ellipse cx="107" cy="100" rx="28" ry="27"/>',coat:'<rect x="58" width="145" height="65"/><rect x="92" y="127" width="47" height="72"/>'},
 right:{skin:'<ellipse cx="147" cy="99" rx="29" ry="27"/><ellipse cx="120" cy="168" rx="14" ry="28"/>',hair:'<ellipse cx="129" cy="91" rx="57" ry="36"/>',face:'<ellipse cx="149" cy="100" rx="28" ry="27"/>',coat:'<rect x="53" width="145" height="65"/><rect x="117" y="127" width="47" height="72"/>'},
 up:{skin:'<ellipse cx="82" cy="171" rx="13" ry="26"/><ellipse cx="174" cy="171" rx="13" ry="26"/>',hair:'<ellipse cx="128" cy="97" rx="69" ry="34"/>',face:'',coat:'<rect x="55" width="145" height="76"/>'}
};
export function trainerSVG(raw={},facing='down'){
 facing=['down','left','right','up'].includes(facing)?facing:'down';
 const a=normalizeTrainer(raw),id='trainer-material-'+(++spriteUID),column=['down','left','right','up'].indexOf(facing),image=a.gender==='female'?'assets/trainer-female-atlas.webp':'assets/trainer-atlas.webp',g=frameGeometry[facing],female=a.gender==='female';
 const source=`<image href="${image}" x="${-column*256}" y="0" width="1024" height="512" preserveAspectRatio="none"/>`;
 const rgba=key=>trainerOptions[key].find(([v])=>v===a[key])[2].slice(1).match(/../g).map(v=>parseInt(v,16)/255);
 const tint=(key,ref)=>{const rgb=rgba(key),luma=[.2126,.7152,.0722],rows=rgb.map(v=>[...luma.map(n=>n*v/ref),0,0].join(' '));return `<filter id="${id}-${key}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${rows.join(' ')} 0 0 0 1 0"/></filter>`};
 // Thresholds are evaluated on the ORIGINAL source, preserving outlines, eyes and shading.
 const pigment=(name,matrix,low=0)=>`<filter id="${id}-${name}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  ${matrix}"/><feComponentTransfer><feFuncA type="linear" slope="3" intercept="${low}"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter>`;
 const hairExtra=female?{down:'<ellipse cx="187" cy="121" rx="20" ry="41"/>',left:'<ellipse cx="177" cy="127" rx="30" ry="39"/>',right:'<ellipse cx="79" cy="127" rx="30" ry="39"/>',up:'<ellipse cx="129" cy="130" rx="29" ry="37"/>'}[facing]:'';
 const skinWalking={down:'<ellipse cx="93" cy="165" rx="25" ry="16"/><ellipse cx="172" cy="181" rx="14" ry="18"/>',left:'<ellipse cx="91" cy="164" rx="24" ry="16"/><ellipse cx="154" cy="185" rx="16" ry="16"/>',right:'<ellipse cx="165" cy="164" rx="24" ry="16"/><ellipse cx="102" cy="185" rx="16" ry="16"/>',up:g.skin}[facing];
 const row=(walking=false)=>{const offset=walking?-256:0,src=source.replace('y="0"',`y="${offset}"`),suffix=walking?'walk':'idle';return `<g class="atlas-${suffix}">${src}${a.color!=='green'?`<g clip-path="url(#${id}-coat-clip)" mask="url(#${id}-coat-${suffix})"><g filter="url(#${id}-color)">${src}</g></g>`:''}${a.hair!=='brown'?`<g clip-path="url(#${id}-hair-clip)" mask="url(#${id}-hair-${suffix})"><g mask="url(#${id}-hair-face-cut)"><g filter="url(#${id}-hair)">${src}</g></g></g>`:''}${a.skin!=='warm'?`<g clip-path="url(#${id}-skin-${suffix}-clip)" mask="url(#${id}-skin-${suffix})"><g filter="url(#${id}-skin)">${src}</g></g>`:''}</g>`};
 const masks=['idle','walk'].map((row)=>{const src=source.replace('y="0"',`y="${row==='walk'?-256:0}"`);return ['coat','hair','skin'].map(material=>`<mask id="${id}-${material}-${row}" mask-type="alpha"><g filter="url(#${id}-${material}-pigment)">${src}</g></mask>`).join('')}).join('');
 return `<svg class="custom-trainer-art detailed-trainer-art" viewBox="0 0 256 256" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" data-trainer-gender="${a.gender}" data-trainer-outfit="${a.outfit}" data-facing="${facing}" data-trainer-color="${a.color}"><defs><clipPath id="${id}-frame"><rect width="256" height="256"/></clipPath>${tint('color',.34)}${tint('hair',.3)}${tint('skin',.65)}${pigment('coat-pigment','-8 8 0 0 -.04')}${pigment('hair-pigment','5 -3 -2 0 -.02')}${pigment('skin-pigment','1.1 1.5 .4 0 -1.05')}<clipPath id="${id}-coat-clip">${g.coat}</clipPath><clipPath id="${id}-hair-clip">${g.hair}${hairExtra}</clipPath><mask id="${id}-hair-face-cut"><rect width="256" height="256" fill="white"/><g fill="black">${g.face}</g></mask><clipPath id="${id}-skin-idle-clip">${g.skin}</clipPath><clipPath id="${id}-skin-walk-clip">${skinWalking}${facing!=='up'?g.skin.split('/>')[0]+'/>':''}</clipPath>${masks}</defs><g clip-path="url(#${id}-frame)">${row(false)}${row(true)}</g></svg>`;
}
