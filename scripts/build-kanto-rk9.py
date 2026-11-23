# Retired historical generator: current art uses RK9/RK1 matching pairs.
raise SystemExit('Use scripts/build-rk-replacements.py; this historical HOME fallback generator is retired.')
"""Bundle PokeOS RK9 where listed; use canonical HOME for missing species/Shiny.
Run build-kanto-temporary.py first to cache the canonical HOME pairs.
"""
import concurrent.futures,hashlib,io,json,pathlib,urllib.request,subprocess,base64
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];cache=pathlib.Path('/tmp/gymbound-kanto-home');rkcache=pathlib.Path('/tmp/gymbound-rk9');rkcache.mkdir(exist_ok=True)
INDEX='https://api.pokeos.com/api/poke/game/assets?versionGroupCode=home';ARCHIVE='https://www.pokeos.com/archive/assets/home';HEADERS={'User-Agent':'Mozilla/5.0','Origin':'https://www.pokeos.com'}
indexfile=pathlib.Path('/tmp/pokeos-home-assets.json')
if not indexfile.exists():
 with urllib.request.urlopen(urllib.request.Request(INDEX,headers=HEADERS),timeout=30) as r:indexfile.write_bytes(r.read())
assets=json.loads(indexfile.read_text());paths={a['path']:a for a in assets if '/rk9/' in a['path']}
old=json.loads((ROOT/'docs/kanto-temporary-artwork.json').read_text());entries=old['entries']
def fetch(e):
 path=f"./home/rk9/broadcast/{e['number']}.png";record=paths.get(path)
 if not record:return None
 url='https://assets.pokeos.com/pokemon/'+path[2:];file=rkcache/(e['id']+'.png')
 if not file.exists():
  with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=30) as r:file.write_bytes(r.read())
 raw=file.read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA');assert im.getbbox()
 if im.getextrema()[3][0]!=0:return None
 return e['id'],(im,url,hashlib.sha256(raw).hexdigest(),record['id'])
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:rk=dict(x for x in pool.map(fetch,entries) if x)
cols=10;rows=(len(entries)+cols-1)//cols;cell=256;atlas={v:Image.new('RGBA',(cols*cell,rows*cell)) for v in ['normal','shiny']};registry={};audit=[]
for i,e in enumerate(entries):
 record={'id':e['id'],'name':e['name'],'number':e['number'],'replacement':'painted-chibi-pending','palettes':{}};registry[e['id']]={}
 for v in atlas:
  if v=='normal' and e['id'] in rk:im,url,sha,assetId=rk[e['id']];provider='RK9 via PokeOS';label='Temporary RK9 sprite'
  else:
   raw=(cache/f"{e['id']}-{v}.png").read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA');url=e['palettes'][v]['source'];sha=hashlib.sha256(raw).hexdigest();assetId=None;provider='Pokémon HOME via PokeAPI/sprites';label='Temporary HOME image'
  im=im.crop(im.getbbox());ratio=min(224/im.width,224/im.height);im=im.resize((max(1,round(im.width*ratio)),max(1,round(im.height*ratio))),Image.Resampling.LANCZOS);buffer=io.BytesIO();im.save(buffer,format='WEBP',quality=92,method=6)
  file=ROOT/f'assets/temporary-pokemon/{v}/{e["id"]}.svg';file.parent.mkdir(parents=True,exist_ok=True);encoded=base64.b64encode(buffer.getvalue()).decode();file.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><image x="{(256-im.width)//2}" y="{(256-im.height)//2}" width="{im.width}" height="{im.height}" href="data:image/webp;base64,{encoded}"/></svg>')
  asset=file.relative_to(ROOT).as_posix();registry[e['id']][v]={'sheet':asset,'preview':asset,'index':0,'columns':1,'rows':1,'label':label,'provider':provider};record['palettes'][v]={'provider':provider,'source':url,'sha256':sha,'pokeosAssetId':assetId,'file':asset}

 audit.append(record)
(ROOT/'temporary-artwork.js').write_text('// Temporary sources only; preserve pending status until painted pairs are supplied.\nexport const temporaryArtwork='+json.dumps(registry,separators=(',',':'))+';\n')
(ROOT/'docs/kanto-temporary-artwork.json').write_text(json.dumps({'archive':ARCHIVE,'index':INDEX,'homeSourceCommit':old.get('commit') or old.get('homeSourceCommit'),'count':len(entries),'rk9NormalCount':len(rk),'homeNormalCount':len(entries)-len(rk),'homeShinyCount':len(entries),'entries':audit},indent=2)+'\n')
print(f'Bundled {len(rk)} RK9 Normal, {len(entries)-len(rk)} HOME Normal and {len(entries)} canonical HOME Shiny replacements.',flush=True)

# Remove superseded intermediate atlases/wrappers; only individual local replacements ship.
for file in (ROOT/'assets/temporary-pokemon').glob('*.webp'):file.unlink()
import shutil
shutil.rmtree(ROOT/'assets/temporary-pokemon/preview',ignore_errors=True)
