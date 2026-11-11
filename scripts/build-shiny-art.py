"""Recolour the existing atlas without changing pose, silhouette, shading or alpha.
Offline art build tool: python scripts/build-shiny-art.py (requires Pillow).
Palettes checked against PokeAPI normal/shiny sprite pairs, species by species.
Each material is masked separately; this is intentionally not a global hue filter.
"""
from pathlib import Path
import colorsys,json
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
IDS=[1,4,7,25,16,10,133,74,92,43,54,147,58,37,179,198,231,131]
NAMES=['Bulbasaur','Charmander','Squirtle','Pikachu','Pidgey','Caterpie','Eevee','Geodude','Gastly','Oddish','Psyduck','Dratini','Growlithe','Vulpix','Mareep','Murkrow','Phanpy','Lapras']
NOTES=['Lime-green skin; deeper green bulb','Golden-yellow skin; original flame','Periwinkle skin; green shell','Deeper orange-gold coat','Olive-gold plumage; cream underside','Golden body; red antenna retained','Silver coat; pale ivory ruff','Gold stone; white eyes','Blue gas; purple core','Green body; bright green leaves','Blue body; cream bill','Pink body; white fins and belly','Golden coat; cream mane and dark stripes','Pale yellow-green coat; orange-gold curls; green eyes and olive paws/inner ears','Pink wool; blue face and gold orb','Magenta plumage; yellow bill','Paler blue skin; coral markings','Purple body; unchanged shell and cream underside']
def recolour(n,r,g,b,x,y):
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
 # Leave transparent pixels, near-black ink, and neutral white highlights alone.
 if v<.15 or (s<.10 and v>.88):return (r,g,b)
 if n==179 and x>.69 and y<.30:return (r,g,b)
 H,S,V=h,s,v
 def tint(hue,sat=None,gain=1):return hue,s if sat is None else sat,min(1,v*gain)
 if n==1:
  if 140<h<210 and s>.15:H,S,V=tint(88,min(.76,s*1.25),1.03)
  elif 65<h<=140 and s>.2:H,S,V=tint(125,min(.85,s*1.08),.90)
 elif n==4:
  if 5<h<48 and s>.4 and not (x>.70 and y<.65):H,S,V=tint(48,s,1.02)
 elif n==7:
  if 165<h<235 and s>.18:H,S,V=tint(226,s*.80)
  elif 12<h<48 and s>.35 and x>.66 and y>.37:H,S,V=tint(95,s*.85)
 elif n==25:
  if 38<h<68 and s>.35:H,S,V=tint(38,min(.90,s*1.08))
 elif n==16:
  if 7<h<53 and s>.25:H,S,V=tint(57,min(.85,s*1.05),.97)
 elif n==10:
  if 65<h<165 and s>.25:H,S,V=tint(45,min(.93,s*1.07),1.05)
 elif n==133:
  if 10<h<65 and s>.16:H,S,V=tint(45,.055 if v>.65 else .075,1.06)
 elif n==74:
  if s<.40 and .20<v<.92:H,S,V=tint(43,.80,1.08)
 elif n==92:
  if 255<h<325 and s>.15:
   H,S,V=tint(199,s*.85,1.06) if v>.45 else tint(282,min(.7,s*1.6),1.05)
 elif n==43:
  if 165<h<255 and s>.18:H,S,V=tint(95,min(.85,s*1.22),1.1)
 elif n==54:
  # Cream bill and feet have a lower saturation than the yellow skin.
  if 25<h<65 and (s>.55 or (y<.40 and s>.15)):H,S,V=tint(190,s*.64)
 elif n==147:
  if 195<h<265 and s>.18:H,S,V=tint(318,s*.95)
 elif n==58:
  if 5<h<42 and s>.45:H,S,V=tint(52,s,1.02)
 elif n==37:
  eye=(((x-.16)/.055)**2+((y-.47)/.085)**2<1 or ((x-.405)/.075)**2+((y-.48)/.095)**2<1)
  inner_ear=(.07<x<.29 and .15<y<.4) or (.55<x<.76 and .26<y<.46)
  chest=.23<x<.36 and .69<y<.84 and v>.75 and s<.4
  if chest:return r,g,b
  if eye and s>.15 and v<.65:H,S,V=145,.5,min(1,v*1.05+.05)
  elif (inner_ear or y>.83 and x<.62) and 5<h<60 and s>.15 and v<.7:H,S,V=tint(80,.43,.95)
  elif 5<h<55 and s>.25:
   curls=(y<.43 and .20<x<.57) or (x>.57 and y>.35)
   H,S,V=tint(36,min(.65,s*.75),1.02) if curls else tint(62,.42+.1*s,.95)
 elif n==179:
  if 25<h<65 and .10<s<.48:H,S,V=tint(321,max(.20,s*.8))
 elif n==198:
  if 205<h<285 and s>.15:H,S,V=tint(316,min(.85,s*1.15),1.13)
 elif n==231:
  if 165<h<260 and s>.16:H,S,V=tint(h,s*.66,1.17)
 elif n==131:
  if 165<h<240 and s>.20:H,S,V=tint(273,min(.83,s*1.03))
 rgb=colorsys.hsv_to_rgb(H/360,S,V)
 return tuple(round(c*255) for c in rgb)
def main():
 atlas=Image.open(ROOT/'assets/chibi-atlas.webp').convert('RGBA');outdir=ROOT/'assets/chibi/shiny';outdir.mkdir(exist_ok=True)
 board=Image.new('RGB',(800,len(IDS)*210),'#dce4df');d=ImageDraw.Draw(board)
 for i,n in enumerate(IDS):
  normal=atlas.crop((i%6*200,i//6*200,i%6*200+200,i//6*200+200));shiny=normal.copy()
  src=normal.load();dst=shiny.load()
  protected=Image.new('1',(200,200));m=ImageDraw.Draw(protected)
  # Hand-traced feature boundaries keep ink/antialias pixels with the feature.
  polygons={4:[[(49,82),(98,86),(89,103),(73,107),(60,100)]],133:[[(56,115),(76,117),(73,130),(65,135),(59,128)]],74:[[(57,103),(83,116),(78,127),(61,124)],[(100,116),(123,101),(120,125),(103,129)],[(70,139),(119,139),(111,156),(94,162),(78,155)]],37:[[(35,114),(55,115),(51,129),(44,133),(39,126)]]}
  for polygon in polygons.get(n,[]):m.polygon(polygon,fill=1)
  if n==133:
   m.ellipse((38,82,54,110),fill=1);m.ellipse((87,85,103,114),fill=1)
  for y in range(200):
   for x in range(200):
    r,g,b,a=src[x,y]
    if a and not protected.getpixel((x,y)):dst[x,y]=(*recolour(n,r,g,b,x/200,y/200),a)
  assert shiny.getchannel('A').tobytes()==normal.getchannel('A').tobytes()
  assert shiny.tobytes()!=normal.tobytes()
  shiny.save(outdir/f'{n}.png',optimize=True)
  board.paste(normal,(180,i*210),normal);board.paste(shiny,(410,i*210),shiny)
  d.text((10,i*210+45),NAMES[i],fill='black');d.text((10,i*210+75),'Normal / Shiny',fill='black')
 board.save('/tmp/chibi-shiny-review.png')
 (ROOT/'assets/chibi/shiny/palettes.json').write_text(json.dumps([{'number':n,'name':name,'materials':note,'reference':f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/{n}.png'} for n,name,note in zip(IDS,NAMES,NOTES)],indent=2)+'\n')
if __name__=='__main__':main()
