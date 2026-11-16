"""Colour-only variants for the next compact chibi redraws."""
import colorsys
from PIL import Image,ImageDraw
IDS={'cloyster'}
CLOYSTER_FACE=Image.new('1',(512,512));ImageDraw.Draw(CLOYSTER_FACE).polygon([(188,174),(237,170),(287,185),(318,218),(338,263),(346,302),(323,340),(291,372),(250,392),(208,389),(168,373),(135,344),(110,305),(105,265),(114,225),(142,193)],fill=1)
def recolour_chibi55(id,r,g,b,x,y):
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
 if v<.15 or s<.025 and v>.985:return r,g,b
 H,S,V=h,s,v
 if id=='cloyster':
  if not CLOYSTER_FACE.getpixel((min(511,int(x*512)),min(511,int(y*512)))) and 245<h<335 and s>.15:H,S,V=211,min(.68,s*1.45),min(1,v*1.02)
 return tuple(round(c*255)for c in colorsys.hsv_to_rgb(H/360,max(0,min(1,S)),max(0,min(1,V))))
