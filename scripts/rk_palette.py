"""Shared RK artwork palette transforms. Code palette edits only; no silhouette redesign."""
from pathlib import Path
import base64,io,re
import numpy as np
from PIL import Image
from scipy.spatial import cKDTree
def ink_cutoff(id):
 return 43 if id in ['unown','houndour','houndoom','sneasel','darkrai'] else 65
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
 ink=flat.max(axis=1)<ink_cutoff(id);white=(flat.min(axis=1)>245);target_n=(nl[idx]*weights[:,:,None]).sum(axis=1)/weights.sum(axis=1)[:,None];target_s=target_n+change
 chroma=np.linalg.norm(l[:,1:],axis=1);ref_chroma=np.linalg.norm(target_n[:,1:],axis=1);scale=np.clip(chroma/np.maximum(8,ref_chroma),.6,1.8)
 mapped=l+change;material_change=np.linalg.norm(change[:,1:],axis=1);blend=np.clip((material_change-3)/8,0,1);mapped[:,1:]=mapped[:,1:]*(1-blend[:,None])+target_s[:,1:]*scale[:,None]*blend[:,None]
 out=rgb(mapped)
 # Explicit material corrections for stylised art whose warm fills overlap reference highlights.
 import colorsys
 if id in ['paras','marowak','clefable','chansey','grimer','muk','jumpluff','crobat','lugia','larvitar','lunatone','riolu','lucario','drifloon','drapion','darkrai','munna','tepig']:
  for j,(r,g,b) in enumerate(flat):
   h,sat,val=colorsys.rgb_to_hsv(r/255,g/255,b/255);x=j%data.shape[1];y=j//data.shape[1]
   if ink[j] or alpha[j]==0:continue
   if id in ['grimer','muk'] and .62<h<.86 and sat>.12:out[j]=np.array(colorsys.hsv_to_rgb(.39,min(.4,max(.22,sat*.7)),val))*255
   if id=='paras' and .02<h<.11 and sat>.45:out[j]=np.array(colorsys.hsv_to_rgb(.04,max(sat,.72),min(1,val*1.04)))*255
   if id=='marowak' and .025<h<.17 and sat>.47:out[j]=np.array(colorsys.hsv_to_rgb(.24,max(.45,sat*.9),val))*255
   if id=='clefable' and .04<h<.2 and sat>.22 and y<data.shape[0]*.3:out[j]=np.array(colorsys.hsv_to_rgb(.27,max(.45,sat),val))*255
   if id=='chansey' and (h>.88 or h<.04) and sat>.1 and ((y<data.shape[0]*.48 and (x<data.shape[1]*.27 or x>data.shape[1]*.74)) or y>data.shape[0]*.86 and (x<data.shape[1]*.32 or x>data.shape[1]*.66)):out[j]=np.array(colorsys.hsv_to_rgb(.39,.28,val))*255
   if id=='jumpluff' and .48<h<.78 and sat>.15:out[j]=np.array(colorsys.hsv_to_rgb(.93,max(.35,sat*.7),min(1,val*1.15)))*255
   if id=='crobat' and .70<h<.9 and sat>.15:out[j]=np.array(colorsys.hsv_to_rgb(.86,max(.3,sat*.65),min(1,val*1.25)))*255
   if id=='lugia' and .52<h<.78 and sat>.2:out[j]=np.array(colorsys.hsv_to_rgb(.96,max(.55,sat),val))*255
   if id=='larvitar' and (h>.88 or h<.04) and sat>.3:out[j]=np.array(colorsys.hsv_to_rgb(.88,sat*.75,min(1,val*1.1)))*255
   if id=='lunatone' and (h>.88 or h<.04) and sat>.3:out[j]=np.array(colorsys.hsv_to_rgb(.6,max(.55,sat),val))*255
   if id in ['riolu','lucario'] and .51<h<.66 and sat>.2:out[j]=np.array(colorsys.hsv_to_rgb(.16,max(.48,sat),min(1,val*1.35)))*255
   if id=='drifloon' and .7<h<.9 and sat>.1:out[j]=np.array(colorsys.hsv_to_rgb(.145,.58,min(1,val*1.5)))*255
   if id=='drapion' and .75<h<1 and sat>.18:out[j]=np.array(colorsys.hsv_to_rgb(.96,sat*.75,val*.95))*255
   if id=='darkrai' and sat<.25 and .16<val<.5:out[j]=np.array(colorsys.hsv_to_rgb(.74,.55,min(1,val*1.1)))*255
   if id=='munna' and .85<h<1 and sat<.4 and val>.5:out[j]=np.array(colorsys.hsv_to_rgb(.15,.48,val*.98))*255
   if id=='tepig' and .03<h<.14 and sat>.45:out[j]=np.array(colorsys.hsv_to_rgb(.145,.85,min(1,val*1.22)))*255
 out[ink|white|(alpha==0)]=flat[ink|white|(alpha==0)].astype(np.uint8);data[:,:,:3]=out.reshape(data.shape[:2]+(3,));return Image.fromarray(data),int(ink.sum())
def decode(file):
 s=file.read_text();encoded=re.search('base64,([^\"]+)',s).group(1);im=Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGBA');return im

def write(file,im,lossless=False):
 b=io.BytesIO();im.save(b,format='WEBP',quality=92,lossless=lossless,method=4);enc=base64.b64encode(b.getvalue()).decode();file.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><image x="{(256-im.width)//2}" y="{(256-im.height)//2}" width="{im.width}" height="{im.height}" href="data:image/webp;base64,{enc}"/></svg>')
