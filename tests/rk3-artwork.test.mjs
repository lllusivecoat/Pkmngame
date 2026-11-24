import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {temporaryArtwork} from '../temporary-artwork.js';
import {artworkState,temporaryArt} from '../artwork-status.js';
import {artworkEntries,galleryEntries,chibiLabel} from '../developer-tools.js';
import {battleForms} from '../forms.js';import {spriteCandidates} from '../artwork.js';
import {chibiSprite} from '../chibi-art.js';
const audit=JSON.parse(readFileSync(new URL('../docs/rk3-temporary-artwork.json',import.meta.url)));
test('RK3 fills exact-form gaps with source-labelled local Normal and same-drawing Shiny routes',()=>{
 assert.equal(audit.count,125);assert.equal(audit.pendingCount,5);
 assert.equal(Object.keys(temporaryArtwork).length,1324);
 assert.equal(galleryEntries({kind:'rk3'}).length,125);
 for(const e of audit.entries){
  assert.ok(e.palettes.normal.source.startsWith('https://assets.pokeos.com/pokemon/'));
  assert.equal(e.palettes.shiny.sourceDrawing,e.palettes.normal.file);
  assert.equal(e.palettes.shiny.alphaPreserved,true);
  const f=battleForms[e.id],entry=artworkEntries.find(a=>a.id===e.id);
  for(const variant of ['Normal','Shiny']){
   const c={species:f?.base||e.id,form:f?.id,variant},a=temporaryArt(c);
   assert.equal(a.label,'RK3');assert.equal(a.family,'RK3');assert.equal(a.sourceKind,e.sourceKind);
   assert.equal(artworkState(c),'temporary');
   assert.equal(spriteCandidates(c,'home')[0],e.palettes[variant.toLowerCase()].file);
   assert.ok(existsSync(new URL('../'+a.sheet,import.meta.url)));
   assert.ok(chibiSprite(c).includes(a.sheet));
   assert.match(chibiLabel(entry,variant),/^RK3 · .*temporary sprite · chibi art pending$/);
  }
 }
});
test('approved art and RK9/RK1 families are retained; incorrect or nonexistent form sources stay pending',()=>{
 for(const id of ['bulbasaur','charmander','squirtle','dragonitemega','steelixmega'])assert.equal(artworkState(id),'painted');
 assert.equal(temporaryArt('chespin').family,'RK9');assert.equal(temporaryArt('weedle').family,'RK1');
 assert.equal(temporaryArt('minior').family,'RK3');
 assert.match(audit.entries.find(e=>e.id==='minior').palettes.normal.source,/774-red/);
 assert.match(audit.entries.find(e=>e.id==='meowthgmax').palettes.normal.source,/52-gmax/);
 const pending=['pikachucosplay','ogerpontealtera','ogerponwellspringtera','ogerponhearthflametera','ogerponcornerstonetera'];
 assert.deepEqual(galleryEntries({kind:'pending'}).map(e=>e.id).sort(),pending.sort());
 for(const id of pending){assert.equal(temporaryArt(id),null);assert.equal(artworkState(id),'pending')}
 assert.match(audit.pending.find(e=>e.id==='pikachucosplay').reason,/Detective Pikachu/);
});
