import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {temporaryArtwork} from '../temporary-artwork.js';
import {artworkState,temporaryArt} from '../artwork-status.js';
import {galleryEntries,chibiLabel} from '../developer-tools.js';
import {chibiSprite} from '../chibi-art.js';
import {spriteCandidates} from '../artwork.js';
import {battleForms} from '../forms.js';
const rk3=JSON.parse(readFileSync(new URL('../docs/rk3-temporary-artwork.json',import.meta.url)));const rk3Ids=new Set(rk3.entries.map(e=>e.id));
const audit=JSON.parse(readFileSync(new URL('../docs/remaining-temporary-artwork.json',import.meta.url)));
test('every available new drawing has two local, labelled, form-specific palette routes',()=>{
 assert.equal(audit.count,646);assert.equal(audit.pendingCount,130);
 assert.equal(audit.entries.length+audit.pending.length,776);
 assert.equal(new Set([...audit.entries,...audit.pending].map(e=>e.id)).size,776);
 assert.equal(Object.keys(temporaryArtwork).length,1199+rk3.count);
 for(const e of audit.entries){
  assert.ok(['RK9','RK1'].includes(e.artFamily));
  assert.ok(!e.palettes.normal.source.includes('/render/'));
  assert.ok(!e.palettes.normal.source.includes('/animated/'));
  assert.equal(e.palettes.shiny.sourceDrawing,e.palettes.normal.file);
  const f=battleForms[e.id];
  for(const variant of ['Normal','Shiny']){
   const c={species:f?.base||e.id,form:f?.id,variant};
   const cell=temporaryArt(c),file=e.palettes[variant.toLowerCase()].file;
   assert.equal(cell.sheet,file,e.id);assert.equal(cell.label,e.artFamily);
   assert.equal(artworkState(c),'temporary');
   assert.equal(spriteCandidates(c,'home')[0],file);
   assert.ok(chibiSprite(c).includes(file));
   assert.match(chibiLabel({id:e.id,species:c.species,form:c.form},variant),/RK[19].*temporary.*chibi art pending/);
   assert.ok(existsSync(new URL('../'+file,import.meta.url)));
  }
 }
});
test('unavailable and mismatched sources remain pending instead of using a different form or model',()=>{
 assert.equal(galleryEntries({kind:'pending'}).length,rk3.pendingCount);
 for(const e of audit.pending.filter(e=>!rk3Ids.has(e.id))){
  assert.equal(temporaryArt(e.id),null,e.id);assert.equal(artworkState(e.id),'pending');
  assert.ok(e.reason.length>10);
  for(const variant of ['Normal','Shiny'])assert.ok(chibiSprite({species:e.id,variant}).includes('chibi-pending-'+variant.toLowerCase()+'.svg'));
 }
 for(const id of ['minior','clefablemega','cinderacegmax','silvallyfire'])assert.equal(artworkState(id),'temporary');assert.equal(galleryEntries({kind:'rk3'}).length,rk3.count);
 assert.equal(temporaryArt('maushold').label,'RK9');
 assert.match(audit.entries.find(e=>e.id==='maushold').palettes.normal.source,/family-of-three/);
 assert.match(audit.entries.find(e=>e.id==='mausholdfour').palettes.normal.source,/family-of-four/);
 for(const id of ['bulbasaur','charmander','squirtle','steelixmega','dragonitemega'])assert.equal(artworkState(id),'painted');
});
