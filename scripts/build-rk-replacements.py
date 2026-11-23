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
D65=np.array([.95047,1,1.08883]);M=np.array([[.4124564,.3575761,.1804375],[.2126729,.7151522,.0721750],[.0193339,.1191920,.9503041]])
def lab(rgb):
 x=rgb/255.;x=np.where(x>.04045,((x+.055)/1.055)**2.4,x/12.92);x=x@M.T/D65;f=np.where(x>.008856,np.cbrt(x),7.787*x+16/116);return np.stack([116*f[:,1]-16,500*(f[:,0]-f[:,1]),200*(f[:,1]-f[:,2])],axis=1)
def rgb(l):
 fy=(l[:,0]+16)/116;f=np.stack([fy+l[:,1]/500,fy,fy-l[:,2]/200],axis=1);x=np.where(f**3>.008856,f**3,(f-16/116)/7.787)*D65;x=x@np.linalg.inv(M).T;x=np.maximum(x,0);x=np.where(x>.0031308,1.055*x**(1/2.4)-.055,x*12.92);return np.uint8(np.clip(np.rint(x*255),0,255))
def recolor(base,id):
 a=np.array(Image.open(f'/tmp/gymbound-kanto-home/{id}-normal.png').convert('RGBA'));b=np.array(Image.open(f'/tmp/gymbound-kanto-home/{id}-shiny.png').convert('RGBA'));assert a.shape==b.shape
 valid=(a[:,:,3]>230)&(b[:,:,3]>230);n=a[:,:,:3][valid].astype(float);s=b[:,:,:3][valid].astype(float);keys=(n[:,0].astype(int)//8)*1024+(n[:,1].astype(int)//8)*32+n[:,2].astype(int)//8;_,inv=np.unique(keys,return_inverse=True);counts=np.bincount(inv);nc=np.stack([np.bincount(inv,weights=n[:,i])/counts for i in range(3)],axis=1);sc=np.stack([np.bincount(inv,weights=s[:,i])/counts for i in range(3)],axis=1);nl=lab(nc);delta=lab(sc)-nl
 data=np.array(base);flat=data[:,:,:3].reshape(-1,3).astype(float);alpha=data[:,:,3].ravel();l=lab(flat);dist,idx=cKDTree(nl).query(l,k=min(4,len(nl)));weights=1/(dist+1)**3;change=(delta[idx]*weights[:,:,None]).sum(axis=1)/weights.sum(axis=1)[:,None]
 # Exact dark ink/eye pupils and transparent pixels are retained. Coloured eyes still map canonically.
 ink=flat.max(axis=1)<65;white=(flat.min(axis=1)>245);target_n=(nl[idx]*weights[:,:,None]).sum(axis=1)/weights.sum(axis=1)[:,None];target_s=target_n+change
 chroma=np.linalg.norm(l[:,1:],axis=1);ref_chroma=np.linalg.norm(target_n[:,1:],axis=1);scale=np.clip(chroma/np.maximum(8,ref_chroma),.6,1.8)
 mapped=l+change;material_change=np.linalg.norm(change[:,1:],axis=1);blend=np.clip((material_change-3)/8,0,1);mapped[:,1:]=mapped[:,1:]*(1-blend[:,None])+target_s[:,1:]*scale[:,None]*blend[:,None]
 out=rgb(mapped)
 # Explicit material corrections for stylised art whose warm fills overlap reference highlights.
 import colorsys
 if id in ['paras','marowak','clefable','chansey','grimer','muk']:
  for j,(r,g,b) in enumerate(flat):
   h,sat,val=colorsys.rgb_to_hsv(r/255,g/255,b/255);x=j%data.shape[1];y=j//data.shape[1]
   if ink[j] or alpha[j]==0:continue
   if id in ['grimer','muk'] and .62<h<.86 and sat>.12:out[j]=np.array(colorsys.hsv_to_rgb(.39,min(.4,max(.22,sat*.7)),val))*255
   if id=='paras' and .02<h<.11 and sat>.45:out[j]=np.array(colorsys.hsv_to_rgb(.04,max(sat,.72),min(1,val*1.04)))*255
   if id=='marowak' and .025<h<.17 and sat>.47:out[j]=np.array(colorsys.hsv_to_rgb(.24,max(.45,sat*.9),val))*255
   if id=='clefable' and .04<h<.2 and sat>.22 and y<data.shape[0]*.3:out[j]=np.array(colorsys.hsv_to_rgb(.27,max(.45,sat),val))*255
   if id=='chansey' and (h>.88 or h<.04) and sat>.1 and ((y<data.shape[0]*.48 and (x<data.shape[1]*.27 or x>data.shape[1]*.74)) or y>data.shape[0]*.86 and (x<data.shape[1]*.32 or x>data.shape[1]*.66)):out[j]=np.array(colorsys.hsv_to_rgb(.39,.28,val))*255
 out[ink|white|(alpha==0)]=flat[ink|white|(alpha==0)].astype(np.uint8);data[:,:,:3]=out.reshape(data.shape[:2]+(3,));return Image.fromarray(data),int(ink.sum())
def decode(file):
 s=file.read_text();encoded=re.search('base64,([^\"]+)',s).group(1);im=Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGBA');return im

def write(file,im,lossless=False):
 b=io.BytesIO();im.save(b,format='WEBP',quality=92,lossless=lossless,method=4);enc=base64.b64encode(b.getvalue()).decode();file.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><image x="{(256-im.width)//2}" y="{(256-im.height)//2}" width="{im.width}" height="{im.height}" href="data:image/webp;base64,{enc}"/></svg>')
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
