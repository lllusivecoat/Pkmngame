"""Colour-only Shiny counterparts for the rounder Goomy, Bagon and Trapinch drawings."""
import colorsys
from PIL import Image,ImageDraw
IDS={'goomy','bagon','trapinch','salamencemega'}
GOOMY_CREAM=Image.new('1',(512,512));ImageDraw.Draw(GOOMY_CREAM).polygon([(0,0),(511,0),(511,260),(420,260),(416,287),(410,308),(391,319),(366,317),(346,307),(334,309),(325,324),(314,339),(292,353),(270,355),(246,347),(227,341),(212,341),(193,347),(162,356),(130,359),(99,357),(77,349),(56,339),(36,326),(0,320)],fill=1)
SALAMENCE_MOUTH=Image.new('1',(512,512));ImageDraw.Draw(SALAMENCE_MOUTH).polygon([(89,298),(112,287),(146,287),(170,292),(168,310),(155,326),(139,334),(121,333),(105,323)],fill=1)
def recolour_chibi54(id,r,g,b,x,y):
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
 if v<.13 or s<.025 and v>.985:return r,g,b
 H,S,V=h,s,v
 if id=='salamencemega':
  mouth=SALAMENCE_MOUTH.getpixel((min(511,int(x*512)),min(511,int(y*512))))
  if 175<h<250 and s>.13:H,S,V=112,min(.8,s*.95),min(1,v*1.02)
  elif (h>315 or h<25) and s>.15 and not mouth:H,S,V=20,s*.96,min(1,v*1.03)
  elif .35<x<.85 and .53<y<.89 and 250<h<335 and .03<s<.2 and .3<v<.85:H,S,V=270,.14,v*.97
 elif id=='goomy':
  if 65<h<170 and s>.14:H,S,V=245,min(.62,max(.25,s*.8)),v
  elif 245<h<335 and s>.03:
   cream=GOOMY_CREAM.getpixel((min(511,int(x*512)),min(511,int(y*512))))
   H,S,V=(50,min(.28,.09+s*.55),min(1,v*1.025))if cream else(355,min(.32,.12+s*.45),v)
 elif id=='bagon':
  if 175<h<245 and s>.13:H,S,V=112,min(.75,s*.94),min(1,v*1.02)
 elif id=='trapinch':
  if (h<50 or h>345) and s>.15:H,S,V=(161 if y<.82 else 110),s*(.6 if y<.82 else .8),v
 return tuple(round(c*255)for c in colorsys.hsv_to_rgb(H/360,max(0,min(1,S)),max(0,min(1,V))))
