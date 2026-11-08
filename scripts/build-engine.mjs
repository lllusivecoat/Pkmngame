import {build} from 'esbuild';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
await mkdir('vendor',{recursive:true});
await build({stdin:{contents:"export {Battle,Dex} from '@pkmn/sim';",resolveDir:process.cwd(),sourcefile:'greenwood-simulator-entry.js'},bundle:true,platform:'browser',format:'esm',minify:true,keepNames:true,legalComments:'eof',outfile:'vendor/simulator.js'});
for(const [pkg,name]of [['@pkmn/sim','pokemon-simulator'],['@pkmn/sets','pokemon-sets'],['@pkmn/streams','pokemon-streams'],['ts-chacha20','chacha20']]){for(const file of ['LICENSE','LICENSE.txt','LICENSE.md'])try{await copyFile(`node_modules/${pkg}/${file}`,`vendor/LICENSE-${name}.txt`);break}catch{}}
console.log('Browser battle engine built locally; no runtime API calls.');
