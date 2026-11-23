"""Build only pending Sinnoh / Unova artwork: prefer RK9, use outlined Final RK1 otherwise.
Preserve Kanto and approved painted sprites. Requires Pillow, NumPy, SciPy.
"""
from pathlib import Path
import json,subprocess,urllib.request,concurrent.futures,hashlib,base64,io,re
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
def cached(url,path):
 path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
 if not path.exists():
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:path.write_bytes(r.read())
 return path.read_bytes()
archive=json.loads(cached('https://api.pokeos.com/api/poke/game/assets?versionGroupCode=home','/tmp/pokeos-home-assets-latest.json'));paths={e['path']:e for e in archive}
js="import {roster} from './data.js';import {artworkPending} from './artwork-status.js';console.log(JSON.stringify(roster.filter(e=>e.number>=387&&e.number<=649&&artworkPending(e.id)).map(({id,name,number})=>({id,name,number})).sort((a,b)=>a.number-b.number)))"
EXCLUSIONS={'shellos':'RK9 depicts East Sea, while the game uses West Sea.', 'gastrodon':'RK9 depicts East Sea, while the game uses West Sea.', 'deerling':'RK9 depicts Summer, while the game uses Spring.', 'sawsbuck':'RK9 depicts Summer, while the game uses Spring.'}
plan=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT));inputs=[]
for e in plan:
 number=e['number'];rk=f'./home/rk9/broadcast/{number}.png';suffix={421:'-overcast',422:'-west',423:'-west',487:'-altered',493:'-normal',585:'-spring',648:'-aria'}.get(number,'');final=f'./home/{number}{suffix}.png';e['rk9Asset']=paths.get(rk) if e['id'] not in EXCLUSIONS else None;e['finalAsset']=paths[final];e['artFamily']='RK9' if e['rk9Asset'] else 'RK1';asset=e['rk9Asset'] or e['finalAsset'];e['source']='https://assets.pokeos.com/pokemon/'+asset['path'][2:];e['sourceFile']=f'/tmp/gymbound-sinnoh-unova/{e["id"]}-{e["artFamily"]}.png';inputs.append((e['source'],e['sourceFile']))
 for v in ['normal','shiny']:
  url='https://raw.githubusercontent.com/PokeAPI/sprites/c0542f7c51215d9672439012838c99f520596cbd/sprites/pokemon/other/home/'+('shiny/' if v=='shiny' else '')+str(number)+'.png';inputs.append((url,f'/tmp/gymbound-kanto-home/{e["id"]}-{v}.png'))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(lambda pair:cached(*pair),inputs))
for e in plan:
 im=Image.open(io.BytesIO(Path(e['sourceFile']).read_bytes())).convert('RGBA')
 if im.getextrema()[3][0]!=0:
  e['artFamily']='RK1';e['source']='https://assets.pokeos.com/pokemon/'+e['finalAsset']['path'][2:];e['sourceFile']=f'/tmp/gymbound-sinnoh-unova/{e["id"]}-final.png';cached(e['source'],e['sourceFile'])
 assert Image.open(e['sourceFile']).convert('RGBA').getextrema()[3][0]==0,e['id']
Path('/tmp/sinnoh-unova-art-plan-ready.json').write_text(json.dumps(plan));print('Downloaded',len(plan),'Sinnoh / Unova source drawings and canonical Shiny references.',flush=True)
if '--download-only' in __import__('sys').argv:raise SystemExit(0)
from rk_palette import recolor,write,decode,ink_cutoff
current_text=(ROOT/'temporary-artwork.js').read_text();registry=json.loads(re.search(r'export const temporaryArtwork=(.*);',current_text).group(1));entries=[];montage=Image.new('RGB',(1920,((len(plan)+7)//8)*160),'#d9e3df');draw=ImageDraw.Draw(montage)
for i,e in enumerate(plan):
 id=e['id'];family=e['artFamily'];raw=Path(e['sourceFile']).read_bytes();base=Image.open(io.BytesIO(raw)).convert('RGBA');base=base.crop(base.getbbox());ratio=min(224/base.width,224/base.height);base=base.resize((max(1,round(base.width*ratio)),max(1,round(base.height*ratio))),Image.Resampling.NEAREST if family=='RK1' else Image.Resampling.LANCZOS);normal=ROOT/f'assets/temporary-pokemon/normal/{id}.svg';shiny=ROOT/f'assets/temporary-pokemon/shiny/{id}.svg';write(normal,base,True);base=decode(normal);colored,ink=recolor(base,id);write(shiny,colored,True);a=np.array(base);b=np.array(decode(shiny));mask=(a[:,:,:3].max(2)<ink_cutoff(id))&(a[:,:,3]>0);assert np.array_equal(a[:,:,3],b[:,:,3]);assert np.array_equal(a[:,:,:3][mask],b[:,:,:3][mask])
 registry[id]={v:{'sheet':f'assets/temporary-pokemon/{v}/{id}.svg','preview':f'assets/temporary-pokemon/{v}/{id}.svg','index':0,'columns':1,'rows':1,'label':family,'family':family,'provider':'RK9 via PokeOS' if family=='RK9' else 'PokeOS outlined Final sprite (game label RK1)','paletteEdit':v=='shiny','inkCutoff':ink_cutoff(id)} for v in ['normal','shiny']}
 asset=e['rk9Asset'] if family=='RK9' else e['finalAsset'];entries.append({'id':id,'name':e['name'],'number':e['number'],'artFamily':family,'replacement':'painted-chibi-pending','sourceNote':EXCLUSIONS.get(id,'RK9 preferred; outlined Final when unavailable'),'palettes':{'normal':{'provider':registry[id]['normal']['provider'],'source':e['source'],'sha256':hashlib.sha256(raw).hexdigest(),'pokeosAssetId':asset['id'],'file':str(normal.relative_to(ROOT))},'shiny':{'provider':f'Canonical Shiny palette edit of {family}','sourceDrawing':str(normal.relative_to(ROOT)),'canonicalNormal':f'https://raw.githubusercontent.com/PokeAPI/sprites/c0542f7c51215d9672439012838c99f520596cbd/sprites/pokemon/other/home/{e["number"]}.png','canonicalShiny':f'https://raw.githubusercontent.com/PokeAPI/sprites/c0542f7c51215d9672439012838c99f520596cbd/sprites/pokemon/other/home/shiny/{e["number"]}.png','file':str(shiny.relative_to(ROOT)),'alphaPreserved':True,'inkProtectedPixels':ink,'inkCutoff':ink_cutoff(id)}}})
 for j,image in enumerate([base,colored]):
  im=image.copy();im.thumbnail((108,125));montage.paste(im,((i%8)*240+j*116+(108-im.width)//2,(i//8)*160+24),im)
 draw.text(((i%8)*240+4,(i//8)*160+5),f'{id} / {family}',fill='#15332f')
(ROOT/'temporary-artwork.js').write_text('// RK9 / RK1 temporary drawings; matching canonical Shiny palette edits.\nexport const temporaryArtwork='+json.dumps(registry,separators=(',',':'))+';\n');(ROOT/'docs/sinnoh-unova-temporary-artwork.json').write_text(json.dumps({'archive':'https://www.pokeos.com/archive/assets/home','count':len(entries),'rk9Count':sum(e['artFamily']=='RK9' for e in entries),'rk1Count':sum(e['artFamily']=='RK1' for e in entries),'entries':entries},indent=2)+'\n');montage.save('/tmp/sinnoh-unova-palette-review.jpg');print('Built',len(entries),'Sinnoh / Unova Normal/Shiny pairs, preserving existing artwork.',flush=True)
