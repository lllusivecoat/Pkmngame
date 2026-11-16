import {chibiAtlas,shinyChibiAtlas} from './chibi-sources.js?v=20261116-roster46';
export function chibiSprite(c){const cell=(c.variant==='Shiny'?shinyChibiAtlas:chibiAtlas)[c.form||c.species];if(!cell)return '';const columns=cell.columns||6,rows=cell.rows||4,col=cell.index%columns,row=Math.floor(cell.index/columns);return `<svg class="sprite chibi-sheet-sprite" data-chibi-source="${cell.sheet}" viewBox="0 0 200 200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><svg width="200" height="200" viewBox="0 0 200 200" overflow="hidden"><image href="${cell.sheet}?v=20261116-roster46" x="${-col*200}" y="${-row*200}" width="${columns*200}" height="${rows*200}" preserveAspectRatio="none"/></svg></svg>`}

// Only bundled painted chibis are eligible for gameplay. Never substitute a model or pixel sprite.
const baseChibiNumbers=new Set([1,4,7,25,16,10,133,74,92,43,54,147,58,37,179,198,231,131]);
export function chibiSources(c,number){if(!baseChibiNumbers.has(number)||c.form)return [];return [c.variant==='Shiny'?`assets/chibi/shiny/${number}.png?v=20261116-roster46`:`assets/chibi/${number}.svg?v=20261116-roster46`]}
