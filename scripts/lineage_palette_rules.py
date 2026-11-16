"""Material-specific canonical Shiny recolours; never redraw or move source pixels."""
import colorsys
from PIL import Image,ImageDraw
LINEAGE_IDS={'gible','gabite','jangmoo','kommoo','arctibax','beldum','metang','metagross','trapinch','vibrava','flygon','deino','zweilous','hydreigon','goomy','sliggoo','goodra','dreepy','drakloak','dragapult'}
def mask(polygons):
 im=Image.new('1',(512,512));d=ImageDraw.Draw(im)
 for p in polygons:d.polygon(p,fill=1)
 return im
METAGROSS_CROSS=mask([[(175,193),(195,181),(256,229),(319,184),(337,199),(276,247),(337,292),(322,308),(256,264),(194,308),(177,292),(237,246)]])
FLYGON_BLUE=mask([[(231,166),(235,124),(264,94),(313,71),(411,59),(470,59),(470,79),(396,81),(341,95),(312,117),(287,151),(272,167)],[(100,333),(128,346),(134,361),(145,397),(130,414),(110,396),(99,370)],[(188,422),(214,420),(228,424),(227,447),(212,451),(190,448)],[(262,407),(278,399),(292,414),(280,425),(263,434)],[(305,378),(320,365),(336,382),(322,398)]])
for box in [(140,257,213,320),(131,342,159,399),(171,341,204,399)]:ImageDraw.Draw(FLYGON_BLUE).ellipse(box,fill=1)
GABITE_CYAN=mask([[(220,28),(247,39),(230,75),(229,108),(210,98),(210,62)],[(412,19),(433,29),(445,52),(429,74),(411,69),(406,47)],[(155,328),(183,299),(202,308),(188,340),(174,352),(154,379),(143,381)],[(355,313),(371,315),(387,336),(405,367),(397,368),(377,346),(363,336)],[(263,397),(291,400),(312,383),(312,414),(290,431),(265,420)]])
JANGMOO_YELLOW=mask([[(0,0),(511,0),(511,306),(300,306),(244,313),(180,316),(100,310),(0,305)],[(233,333),(256,292),(296,275),(336,261),(393,262),(399,283),(358,284),(321,303),(292,328),(279,342)],[(120,305),(160,289),(192,298),(188,332),(164,355),(131,358)]])
for box in [(200,304,253,354),(242,289,287,329)]:ImageDraw.Draw(JANGMOO_YELLOW).ellipse(box,fill=1)
JANGMOO_EYE=mask([[(105,173),(209,164),(201,205),(184,225),(156,232),(125,222)]])
GOODRA_PINK=mask([[(245,132),(278,146),(300,194),(299,246),(315,273),(333,274),(347,284),(348,301),(335,313),(313,315),(295,307),(282,280),(277,230),(275,194),(261,164)],[(153,380),(180,365),(220,369),(247,387),(254,420),(240,454),(209,473),(162,467),(151,435)]])
GOOMY_CREAM=mask([[(0,0),(511,0),(511,350),(379,350),(355,335),(339,324),(324,327),(306,338),(288,339),(273,335),(263,337),(251,347),(237,353),(219,357),(201,352),(190,354),(179,362),(167,375),(150,389),(135,396),(116,395),(101,389),(86,381),(70,369),(55,354),(41,340),(0,330)]])
SLIGGOO_CREAM=mask([[(0,0),(511,0),(511,350),(350,350),(300,350),(260,358),(248,386),(230,414),(201,420),(174,408),(154,389),(153,356),(127,345),(0,345)]])
def recolour_lineage(id,r,g,b,x,y):
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
 if v<.12 or(s<.025 and v>.985):return r,g,b
 H,S,V=h,s,v;px=(min(511,int(x*512)),min(511,int(y*512)))
 def tint(hue,sat=None,gain=1):return hue,s if sat is None else sat,min(1,v*gain)
 if id=='gible':
  if 170<h<250 and s>.1:H,S,V=tint(200,min(.8,s*1.12),1.04)
  elif 0<h<55 and s>.3:H,S,V=tint(54,s*.95)
 elif id=='gabite':
  if GABITE_CYAN.getpixel(px) and 175<h<280 and s>.06:H,S,V=tint(184,min(.65,s*.9),1.05)
  elif 185<h<280 and s>.08:H,S,V=tint(233,min(.82,s*1.4),.95)
 elif id=='jangmoo':
  if JANGMOO_EYE.getpixel(px):return r,g,b
  if 30<h<75 and s>.25:H,S,V=tint(325,s*.95)
  elif JANGMOO_YELLOW.getpixel(px) and s<.3 and v>.25:H,S,V=tint(60,.7)
 elif id=='kommoo':
  if 30<h<75 and s>.25:H,S,V=tint(312,s*.92)
  elif not(.43<x<.65 and y>.72) and s<.28 and s>.045 and v>.35 and not(.24<x<.5 and .44<y<.61 and s<.1):H,S,V=tint(60,.84)
 elif id=='arctibax':
  if 15<h<65 and s>.3 and y>.5:H,S,V=tint(330,s*.72)
  elif 175<h<245 and s>.18:H,S,V=tint(174,s*.85,1.02)
 elif id in {'beldum','metang','metagross'}:
  if id=='metagross' and METAGROSS_CROSS.getpixel(px):H,S,V=47,.48 if v<.96 else .22,v
  elif 165<h<250 and s>.075:H,S,V=210,min(.075,s*.10),min(1,.14+v*.91)
  else:
   if id=='beldum':gold=x>.73 and y>.42
   elif id=='metang':gold=(y>.68 or y<.41) and not(.43<x<.57 and .16<y<.30)
   else:gold=(.33<x<.69 and .34<y<.62 or y>.65) and not(.39<x<.46 and .42<y<.50 or .55<x<.62 and .42<y<.50)
   if gold and s<.27 and v>.27:H,S,V=47,.48 if v<.96 else .22,v
 elif id=='trapinch':
  if (h<50 or h>345) and s>.04:H,S,V=tint(164,s*.66)
  elif y>.6 and s<.2 and v>.25 and (150<h<280 or s<.025):H,S,V=tint(110,.56)
 elif id=='vibrava':
  if 60<h<165 and s>.2:H,S,V=tint(32,min(.85,s*1.15))
 elif id=='flygon':
  if FLYGON_BLUE.getpixel(px) and 60<h<195 and s>.1:H,S,V=tint(201,s*.82,1.05)
  elif (h>315 or h<20) and s>.2:H,S,V=tint(42,s*.95,1.08)
  elif 60<h<110 and s>.2:H,S,V=tint(96,s*.9,1.03)
 elif id in {'deino','zweilous','hydreigon'}:
  if 175<h<275 and s>.15:H,S,V=tint(101,s*.85)
  elif 300<h<345 and s>.2:H,S,V=tint(282,s*.82)
 elif id in {'goomy','sliggoo','goodra'}:
  if 65<h<170 and s>.14:H,S,V=tint(245,min(.62,max(.25,s*.8)))
  elif 245<h<335 and s>.03:
   cream=GOOMY_CREAM.getpixel(px) if id=='goomy' else SLIGGOO_CREAM.getpixel(px) if id=='sliggoo' else not GOODRA_PINK.getpixel(px)
   H,S,V=(50,min(.28,.09+s*.55),min(1,v*1.025)) if cream else (355,min(.32,.12+s*.45),v)
 elif id in {'dreepy','drakloak','dragapult'}:
  pink=(h>315 or h<15) and s>.2
  if pink:
   if id=='dreepy':yellow=y<.35
   elif id=='drakloak':yellow=not(.25<x<.76 and .34<y<.46)
   else:yellow=not(.36<x<.72 and .29<y<.42)
   if yellow:H,S,V=tint(57,min(.94,s*1.15),1.09)
  elif 180<h<280 and s>.06 and (y<.52 if id=='dreepy' else y<.58):H,S,V=tint(201,min(.8,max(.32,s*1.8)))
 return tuple(round(c*255)for c in colorsys.hsv_to_rgb(H/360,max(0,min(1,S)),max(0,min(1,V))))
