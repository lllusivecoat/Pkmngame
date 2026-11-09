import {readdir,cp,mkdir,rm} from 'node:fs/promises';
await rm('.site',{recursive:true,force:true});
await mkdir('.site');
for(const name of await readdir('.')) if(/\.(js|css|html)$/.test(name)||name==='.nojekyll'||name==='manifest.webmanifest') await cp(name,`.site/${name}`);
for(const name of ['assets','vendor']) await cp(name,`.site/${name}`,{recursive:true});
console.log('Static release staged in .site (without development dependencies).');

await import('./build-precache.mjs');
