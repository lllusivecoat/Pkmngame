# Retired historical generator: current art uses RK9/RK1 matching pairs.
raise SystemExit('Use scripts/build-rk-replacements.py; this historical HOME fallback generator is retired.')
"""Bundle canonical HOME renders for the approved Kanto placeholders. Requires Pillow.
Pinned downloads; never required during a normal static build.
"""
import concurrent.futures, hashlib, io, json, pathlib, subprocess, urllib.request
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
COMMIT='c0542f7c51215d9672439012838c99f520596cbd'
BASE=f'https://raw.githubusercontent.com/PokeAPI/sprites/{COMMIT}/sprites/pokemon/other/home/'
js="import {kanto151Species} from './kanto151-data.js';import {artworkPending} from './artwork-status.js';console.log(JSON.stringify(Object.entries(kanto151Species).filter(([id])=>artworkPending(id)).map(([id,p])=>({id,name:p.name,number:p.number}))))"
entries=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT))
cache=pathlib.Path('/tmp/gymbound-kanto-home');cache.mkdir(exist_ok=True)
def fetch(task):
 entry,variant=task;url=BASE+('shiny/' if variant=='shiny' else '')+str(entry['number'])+'.png';file=cache/f"{entry['id']}-{variant}.png"
 if not file.exists():
  with urllib.request.urlopen(url,timeout=45) as r:raw=r.read()
  file.write_bytes(raw)
 raw=file.read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA');assert im.getbbox() and im.getextrema()[3][0]==0
 return entry['id'],variant,im,url,hashlib.sha256(raw).hexdigest()
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(fetch,[(e,v) for e in entries for v in ['normal','shiny']]))
images={(id,v):(im,url,sha) for id,v,im,url,sha in results}
cols=10;rows=(len(entries)+cols-1)//cols;cell=256;atlases={v:Image.new('RGBA',(cols*cell,rows*cell)) for v in ['normal','shiny']};registry={};audit=[]
for i,e in enumerate(entries):
 record={**e,'status':'temporary-official','provider':'Pokémon HOME via PokeAPI/sprites','replacement':'painted-chibi-pending','palettes':{}}
 registry[e['id']]={}
 for v in atlases:
  im,url,sha=images[e['id'],v];im=im.crop(im.getbbox());im.thumbnail((224,224),Image.Resampling.LANCZOS);x=(i%cols)*cell+(cell-im.width)//2;y=(i//cols)*cell+(cell-im.height)//2;atlases[v].alpha_composite(im,(x,y));sheet=f'assets/temporary-pokemon/kanto-home-{v}.webp';registry[e['id']][v]={'sheet':sheet,'index':i,'columns':cols,'rows':rows};record['palettes'][v]={'source':url,'sha256':sha,'sheet':sheet,'cell':i}
 audit.append(record)
out=ROOT/'assets/temporary-pokemon';out.mkdir(exist_ok=True)
for v,im in atlases.items():im.save(out/f'kanto-home-{v}.webp',quality=92,method=6)
(ROOT/'temporary-artwork.js').write_text('// Explicit temporary canonical art. Never register these as painted chibis.\nexport const temporaryArtwork='+json.dumps(registry,separators=(',',':'))+';\n')
(ROOT/'docs/kanto-temporary-artwork.json').write_text(json.dumps({'provider':'PokeAPI/sprites','commit':COMMIT,'count':len(entries),'entries':audit},indent=2)+'\n')
print(f'Bundled {len(entries)} species, {len(results)} canonical Normal/Shiny images in two transparent atlases.',flush=True)
