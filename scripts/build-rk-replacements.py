"""User-selected RK9 + outlined Final (RK1) temporary sprites.
Canonical Shiny palette edits preserve each Normal drawing's pose, ink and alpha.
Requires Pillow, NumPy and SciPy; raw inputs are cached outside the release.
"""
from pathlib import Path
import json,base64,io,re,hashlib,urllib.request,concurrent.futures
import numpy as np
from PIL import Image,ImageDraw
from scipy.spatial import cKDTree
ROOT=Path(__file__).resolve().parents[1]
AUDIT=ROOT/'docs/kanto-temporary-artwork.json'
old=json.loads(AUDIT.read_text())
def cached(url,path):
 path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
 if not path.exists():
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as r:path.write_bytes(r.read())
 return path.read_bytes()
archive=json.loads(cached('https://api.pokeos.com/api/poke/game/assets?versionGroupCode=home','/tmp/pokeos-home-assets-latest.json'));by_path={e['path']:e for e in archive}
inputs=[]
for e in old['entries']:
 for v in ['normal','shiny']:
  inputs.append((f'https://raw.githubusercontent.com/PokeAPI/sprites/c0542f7c51215d9672439012838c99f520596cbd/sprites/pokemon/other/home/'+('shiny/' if v=='shiny' else '')+str(e['number'])+'.png',f'/tmp/gymbound-kanto-home/{e["id"]}-{v}.png'))
 if e.get('artFamily')=='RK1' or not e.get('artFamily') and not e['palettes']['normal']['provider'].startswith('RK9'):inputs.append((f'https://assets.pokeos.com/pokemon/home/{e["number"]}.png',f'/tmp/gymbound-rk1/{e["id"]}.png'))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(lambda pair:cached(*pair),inputs))
from rk_palette import recolor,decode,write
registry={};entries=[];montage=Image.new('RGB',(8*240,26*160),'#d9e3df');draw=ImageDraw.Draw(montage)
for i,e in enumerate(old['entries']):
 id=e['id'];family=e.get('artFamily') or ('RK9' if e['palettes']['normal']['provider'].startswith('RK9') else 'RK1');normal=ROOT/f'assets/temporary-pokemon/normal/{id}.svg';shiny=ROOT/f'assets/temporary-pokemon/shiny/{id}.svg'
 if family=='RK1':
  raw=Path(f'/tmp/gymbound-rk1/{id}.png').read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA');assert im.getextrema()[3][0]==0;im=im.crop(im.getbbox());scale=min(224/im.width,224/im.height);im=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.NEAREST);write(normal,im);source=f'https://assets.pokeos.com/pokemon/home/{e["number"]}.png';asset=by_path[f'./home/{e["number"]}.png']['id'];sha=hashlib.sha256(raw).hexdigest()
 else:
  source=e['palettes']['normal']['source'];asset=e['palettes']['normal']['pokeosAssetId'];sha=e['palettes']['normal']['sha256']
 base=decode(normal);write(normal,base,True);colored,ink=recolor(base,id);write(shiny,colored,True);assert np.array_equal(np.array(base)[:,:,3],np.array(decode(shiny))[:,:,3]);normal_pixels=np.array(base);shiny_pixels=np.array(decode(shiny));ink_mask=(normal_pixels[:,:,:3].max(axis=2)<65)&(normal_pixels[:,:,3]>0);assert np.array_equal(normal_pixels[:,:,:3][ink_mask],shiny_pixels[:,:,:3][ink_mask])
 registry[id]={v:{'sheet':f'assets/temporary-pokemon/{v}/{id}.svg','preview':f'assets/temporary-pokemon/{v}/{id}.svg','index':0,'columns':1,'rows':1,'label':family,'family':family,'provider':'RK9 via PokeOS' if family=='RK9' else 'PokeOS outlined Final sprite (game label RK1)','paletteEdit':v=='shiny'} for v in ['normal','shiny']}
 entries.append({'id':id,'name':e['name'],'number':e['number'],'artFamily':family,'replacement':'painted-chibi-pending','palettes':{'normal':{'provider':registry[id]['normal']['provider'],'source':source,'sha256':sha,'pokeosAssetId':asset,'file':str(normal.relative_to(ROOT))},'shiny':{'provider':f'Canonical Shiny palette edit of {family}','sourceDrawing':str(normal.relative_to(ROOT)),'canonicalNormal':f'https://raw.githubusercontent.com/PokeAPI/sprites/c0542f7c51215d9672439012838c99f520596cbd/sprites/pokemon/other/home/{e["number"]}.png','canonicalShiny':f'https://raw.githubusercontent.com/PokeAPI/sprites/c0542f7c51215d9672439012838c99f520596cbd/sprites/pokemon/other/home/shiny/{e["number"]}.png','file':str(shiny.relative_to(ROOT)),'alphaPreserved':True,'inkProtectedPixels':ink}}})
 for j,image in enumerate([base,colored]):
  preview=image.copy();preview.thumbnail((108,125));x=(i%8)*240+j*116+(108-preview.width)//2;y=(i//8)*160+24;montage.paste(preview,(x,y),preview)
 draw.text(((i%8)*240+4,(i//8)*160+5),f'{id} / {family}',fill='#15332f')
(ROOT/'temporary-artwork.js').write_text('// RK9 / RK1 temporary drawings; canonical Shiny palette edits preserve each Normal pose.\nexport const temporaryArtwork='+json.dumps(registry,separators=(',',':'))+';\n')
AUDIT.write_text(json.dumps({'archive':'https://www.pokeos.com/archive/assets/home','count':len(entries),'rk9Count':sum(e['artFamily']=='RK9' for e in entries),'rk1Count':sum(e['artFamily']=='RK1' for e in entries),'entries':entries},indent=2)+'\n');montage.crop((0,0,1920,((len(entries)+7)//8)*160)).save('/tmp/rk-palette-review.jpg');print('Built',len(entries),'RK9/RK1 pairs; exact alpha and protected ink verified.',flush=True)
