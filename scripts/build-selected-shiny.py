"""Use the user's selected Normal drawings and canonical Shiny colours, without changing geometry.
The reference pairs share the same camera, framing and pose. Normal alpha is retained exactly.
"""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
forms={'raichumegay':10305,'gengargmax':10202,'pikachugmax':10199};report=[]
for id,number in forms.items():
 normal=f'assets/artwork/normal/{number}.webp';reference=f'assets/artwork/shiny/{number}.webp';target=f'assets/selected-forms/shiny/{number}.webp'
 a=Image.open(ROOT/normal).convert('RGBA');b=Image.open(ROOT/reference).convert('RGBA');assert a.size==b.size
 out=a.copy();aa=a.load();bb=b.load();dst=out.load();changed=0
 for y in range(a.height):
  for x in range(a.width):
   if not aa[x,y][3]:continue
   rgb=bb[x,y][:3]
   if not bb[x,y][3]:
    # A few antialias pixels differ in the reference; sample the nearest coloured edge.
    neighbours=[]
    for radius in range(1,5):
     for dy in range(-radius,radius+1):
      for dx in range(-radius,radius+1):
       xx=x+dx;yy=y+dy
       if 0<=xx<a.width and 0<=yy<a.height and bb[xx,yy][3]>0:neighbours.append((dx*dx+dy*dy,bb[xx,yy]))
     if neighbours:break
    rgb=min(neighbours,key=lambda p:p[0])[1][:3] if neighbours else aa[x,y][:3]
   changed+=rgb!=aa[x,y][:3];dst[x,y]=(*rgb,aa[x,y][3])
 dest=ROOT/target;dest.parent.mkdir(parents=True,exist_ok=True);out.save(dest,'WEBP',lossless=True,method=6)
 decoded=Image.open(dest).convert('RGBA');assert decoded.size==a.size;assert decoded.getchannel('A').tobytes()==a.getchannel('A').tobytes()
 report.append({'id':id,'number':number,'normal':normal,'shiny':target,'canonicalShiny':reference,'dimensions':list(a.size),'changedPixels':changed,'alphaPreserved':True,'alphaSHA256':hashlib.sha256(a.getchannel('A').tobytes()).hexdigest(),'normalSHA256':hashlib.sha256((ROOT/normal).read_bytes()).hexdigest(),'shinySHA256':hashlib.sha256(dest.read_bytes()).hexdigest()})
(ROOT/'docs/selected-artwork-report.json').write_text(json.dumps(report,indent=2)+'\n');print('Prepared three selected reference pairs with identical Normal/Shiny silhouettes and alpha.')
