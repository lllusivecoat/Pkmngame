import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root = new URL('..', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const html = read('index.html');
const css = read('mobile.css');
const app = read('app.js');
const tag = '20261116-roster45';

test('phones load the touch stylesheet with the current cache tag', () => {
  assert.match(html, new RegExp(`mobile\\.css\\?v=${tag}`));
  assert.match(html, new RegExp(`app\\.js\\?v=${tag}`));
  assert.equal(html.includes('20261113-art40'), false);
  assert.equal(app.includes('20261113-art40'), false);
  assert.match(html, /viewport-fit=cover/);
});

test('touch rules keep taps usable and stop the playfield from eating gestures', () => {
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(css, /100dvh/);
  assert.match(css, /pointer-events:\s*none/);
  assert.match(css, /user-select:\s*none/);
  assert.match(css, /:active:not\(:disabled\)/);
  assert.match(css, /min-height:\s*54px/);
  assert.match(css, /grid-template-columns:\s*repeat\(5,/);
  assert.match(css, /font-size:\s*16px/);
  assert.match(css, /flex-wrap:\s*wrap/);
});

test('direction controls stay with the map and battle commands remain in the page', () => {
  const stage = app.slice(app.indexOf('class="map-stage"'), app.indexOf('class="legend"'));
  assert.match(stage, /class="dpad"/);
  assert.match(stage, /data-step="0,-1"/);
  assert.match(stage, /data-step="1,0"/);
  assert.equal(app.match(/class="spread controls"/g).length, 1);
  assert.match(app, /id="battle-bag"/);
  assert.match(app, /id="flee"/);
  assert.match(app, /id="swap"/);
  assert.match(app, /data-battle-swap/);
});
