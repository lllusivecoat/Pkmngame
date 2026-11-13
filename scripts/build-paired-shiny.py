"""User-authorized exact palette edits. Preserve every source pixel's position and alpha.
Each species has material-specific HSV masks checked against bundled canonical Shiny references.
Run from the project root: python scripts/build-paired-shiny.py (Pillow required).
No generated redraws are used; existing poses and outlines remain intact.
"""
from pathlib import Path
import colorsys,json,hashlib
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
entries=json.loads((ROOT/'docs/shiny-palette-sources.json').read_text())
# Material mask separates Gigantamax Charizard's orange skin from its orange flames.
charizard_gmax_mask=Image.new('1',(512,512));_draw=ImageDraw.Draw(charizard_gmax_mask)
for polygon in [ [(344,30),(376,40),(380,58),(354,65),(347,91),(360,124),(348,157),(365,181),(363,222),(335,222),(315,170),(294,145),(285,104),(301,75),(313,45)],[(248,162),(310,168),(361,206),(397,220),(459,216),(495,244),(499,286),(471,305),(435,290),(438,329),(452,387),(473,420),(445,470),(391,481),(347,456),(300,470),(238,466),(190,482),(137,478),(133,454),(169,411),(158,380),(143,352),(164,315),(155,277),(143,246),(153,222),(200,202),(203,183)],[(89,201),(109,200),(104,249),(104,290),(113,326),(142,348),(176,356),(193,379),(181,402),(149,399),(120,383),(95,364),(82,343),(68,307),(64,264),(69,224)] ]:_draw.polygon(polygon,fill=1)
_draw.rectangle((45,205,215,450),fill=1)
_draw.rectangle((430,260,511,400),fill=1)
# The Mega's prismatic crystals are a separate material and keep their existing colours.
steelix_crystal_mask=Image.new('1',(512,512));_crystal_draw=ImageDraw.Draw(steelix_crystal_mask)
for polygon in [[(365,149),(391,87),(424,47),(448,43),(444,76),(417,128),(387,169),(373,181)],[(354,136),(367,137),(381,162),(385,178),(374,195),(357,190),(347,164)],[(393,266),(418,246),(454,225),(477,218),(482,224),(473,243),(449,262),(419,281),(398,284)],[(401,354),(426,358),(454,367),(463,376),(453,384),(425,386),(401,380),(394,369)],[(112,444),(139,424),(180,409),(210,412),(226,426),(224,440),(200,455),(166,462),(135,453)],[(239,342),(242,322),(256,295),(279,272),(298,279),(299,299),(282,319),(256,337),(246,344)],[(245,360),(260,360),(288,372),(305,384),(287,394),(265,383),(250,374)]]:_crystal_draw.polygon(polygon,fill=1)
steelix_mouth_mask=Image.new('1',(200,200));ImageDraw.Draw(steelix_mouth_mask).polygon([(23,73),(50,78),(77,73),(91,69),(88,84),(80,94),(62,101),(42,100),(29,93)],fill=1)

butterfree_eye_mask=Image.new('1',(200,200));_eyes=ImageDraw.Draw(butterfree_eye_mask)
_eyes.ellipse((48,77,74,112),fill=1);_eyes.ellipse((86,75,115,111),fill=1)
butterfree_hand_mask=Image.new('1',(200,200));_hands=ImageDraw.Draw(butterfree_hand_mask)
_hands.ellipse((65,121,84,143),fill=1);_hands.ellipse((88,121,108,144),fill=1)
dragonite_orb_mask=Image.new('1',(512,512))
ImageDraw.Draw(dragonite_orb_mask).polygon([(39,436),(44,417),(57,402),(77,396),(99,403),(113,416),(117,428),(104,434),(96,440),(93,451),(96,460),(105,468),(91,476),(72,479),(55,472),(43,458)],fill=1)
pikachu_gmax_body_mask=Image.new('1',(512,512))
ImageDraw.Draw(pikachu_gmax_body_mask).polygon([(147,257),(170,248),(200,241),(235,232),(268,218),(292,201),(318,197),(300,217),(276,250),(299,270),(329,291),(349,323),(369,359),(377,408),(369,447),(350,472),(340,478),(367,481),(369,487),(321,492),(281,492),(224,490),(185,489),(172,484),(178,476),(156,464),(139,449),(126,423),(124,398),(126,377),(121,389),(113,389),(110,379),(117,357),(126,339),(137,328),(133,311),(132,291)],fill=1)
def recolour(id,r,g,b,x,y):
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
 # Preserve near-black ink, whites and all alpha exactly. Individual rules can whiten coloured material.
 if v<.13 or (s<.09 and v>.94 and id!='espeon'):return r,g,b
 H,S,V=h,s,v
 def tint(hue,sat=None,gain=1):return hue,s if sat is None else sat,min(1,v*gain)
 blue=175<h<250 and s>.16;red=(h<25 or h>335) and s>.32;purple=245<h<315 and s>.15;warm=10<h<65 and s>.25
 if id in ['ivysaur','venusaur','venusaurmega']:
  if blue:H,S,V=tint(108,max(.36,s),1.03)
  elif h>300 and s>.25 and y<.56:H,S,V=tint(50,.75,1.02)
 elif id=='venusaurgmax':
  if 155<h<230 and s>.22:H,S,V=tint(112,.58,1.03)
  elif (h>300 or h<20) and s>.08 and .27<y<.65:H,S,V=tint(48,.75,1.04)
 elif id=='charmeleon':
  if warm and not(x>.7 and y<.65):H,S,V=tint(46,.85,1.04)
 elif id=='charizard':
  if 5<h<60 and s>.45 and not(x>.78 and y>.48):H,S,V=235,.12,.10+v*.27
  elif 155<h<240 and s>.25:H,S,V=tint(350,.75)
 elif id=='charizardmegax':
  if 195<h<240 and s>.25 and v<.68 and (x<.38 or x>.62):H,S,V=tint(350,.78,1.05)
  elif 175<h<220 and s>.2 and .34<x<.68 and y>.45:H,S,V=tint(160,.3)
  elif s<.22 and .14<v<.76:H,S,V=165,.58,min(1,v*1.25)
 elif id=='charizardmegay':
  if 5<h<48 and s>.5 and not(x>.83 and .5<y<.83):H,S,V=tint(260,.23,.90)
  elif 155<h<235 and s>.2:H,S,V=tint(348,.8)
 elif id=='charizardgmax':
  if 4<h<45 and s>.4 and charizard_gmax_mask.getpixel((min(511,int(x*512)),min(511,int(y*512)))) and not(.63<x<.73 and .11<y<.23 and h>35):H,S,V=260,.25,.12+v*.23
 elif id in ['wartortle','blastoise','blastoisemega']:
  if blue:H,S,V=tint(267,min(.6,s*.85))
  elif 12<h<48 and s>.4 and not(.25<x<.7 and y>.48):H,S,V=tint(110,.45)
 elif id=='blastoisegmax':
  if blue:H,S,V=tint(265,s*.75)
  elif 290<h<350 and .15<s<.55 and .05<x<.85:H,S,V=tint(65,.3,.95)
 elif id=='raichu':
  if 20<h<65 and s>.4:H,S,V=tint(26,min(.9,s*1.1),.97)
 elif id=='raichumegax':
  if red and v>.7 and not(.43<x<.61 and .32<y<.44):H,S,V=tint(48,.85,1.12)
  elif 35<h<70 and s>.4:H,S,V=tint(48 if y>.55 or y<.26 else 35,.85)
 elif id in ['pidgeotto','pidgeot']:
  if red:H,S,V=tint(46,.8,1.05)
  elif 15<h<50 and s>.2:H,S,V=tint(55,s*.85,1.04)
 elif id=='pidgeotmega':
  if blue:H,S,V=tint(265,.65)
  elif red:H,S,V=tint(46,.85,1.02)
  elif 15<h<65 and s>.25:H,S,V=tint(48,s*.9,1.05)
 elif id=='metapod':
  if 55<h<150 and s>.2:H,S,V=tint(18,.8,1.05)
 elif id=='butterfree':
  eye=butterfree_eye_mask.getpixel((min(199,int(x*200)),min(199,int(y*200))))
  hand=butterfree_hand_mask.getpixel((min(199,int(x*200)),min(199,int(y*200))))
  if eye and (h<30 or h>330) and s>.15:H,S,V=tint(116,.78,.88)
  elif 175<h<225 and s>.16 and (hand or y>.72):H,S,V=tint(350,.43)
  elif 180<h<275 and s>.15 and y>.3:H,S,V=tint(267,.35,.92)
 elif id=='butterfreegmax':
  if red and .4<x<.61 and .38<y<.63:H,S,V=tint(115,.7)
  elif 175<h<250 and s>.25 and .37<x<.64 and y>.6:H,S,V=tint(345,.48)
  elif 135<h<180 and s>.25:H,S,V=tint(155,s*.8)
 elif id=='vaporeon':
  if 155<h<250 and s>.2:H,S,V=tint(285,s*.9)
 elif id=='jolteon':
  if 35<h<90 and s>.3:H,S,V=tint(78,.65)
 elif id=='flareon':
  if 5<h<60 and s>.35:H,S,V=tint(44,s*.78,1.02)
 elif id=='espeon':
  if 275<h<335:H,S,V=116,.52+.2*s,min(1,v*.80+.035)
 elif id=='umbreon':
  if 35<h<80 and s>.35:H,S,V=tint(210,.9)
  elif red:H,S,V=tint(48,.85)
 elif id=='leafeon':
  if 20<h<65 and s>.15:H,S,V=tint(35,min(1,s*1.13),.96)
  elif 65<h<160 and s>.2:H,S,V=tint(100,min(1,s*1.1),.93)
 elif id=='glaceon':
  if 170<h<235 and s>.15:H,S,V=tint(215 if s>.5 else 195,s*.72,1.05)
 elif id=='sylveon':
  if h>300 and s>.15:H,S,V=tint(205,s)
  elif blue:H,S,V=tint(330,s*.8)
 elif id=='graveler':
  if s<.28 and .17<v<.9:H,S,V=tint(29,.42,1.02)
 elif id=='golem':
  if s<.28 and .17<v<.9:H,S,V=tint(32,.35)
  elif warm:H,S,V=tint(44,s)
 elif id=='haunter':
  if red and y>.45:H,S,V=tint(220,.75)
  elif purple:H,S,V=tint(255,s*.85,.9)
 elif id=='gengar':
  if 235<h<320 and s>.15:H,S,V=tint(255,s*.65,.85)
 elif id=='gengarmega':
  if 245<h<315 and s>.15:H,S,V=265,.035,.72+v*.28
  elif 305<h<350 and s>.25:H,S,V=330,.14,.78+v*.22
  elif red:H,S,V=0,.03,v*.35
 elif id=='gloom':
  if blue or 240<h<290 and s>.2:H,S,V=tint(110,.55)
  elif red and y<.3:H,S,V=tint(40,.48,.9)
  elif (h<65 or h>295) and s>.3 and not(.3<x<.7 and y>.55):H,S,V=tint(48,.75)
 elif id=='vileplume':
  if blue or 240<h<290 and s>.15:H,S,V=tint(110,.6)
  elif red or h>300 and s>.3:H,S,V=tint(30,.75,1.03)
 elif id=='bellossom':
  if 45<h<165 and s>.2 and (.27<y<.57 or y<.7 and (x<.28 or x>.72)):H,S,V=tint(275,.42)
  elif 35<h<80 and s>.3 and y<.3:H,S,V=tint(80,.6)
  elif red or 10<h<40 and s>.4:H,S,V=tint(325,.6)
 elif id=='golduck':
  if blue:H,S,V=tint(218,s*.95,.94)
  elif 30<h<65 and s>.2:H,S,V=tint(350,.45)
 elif id=='dragonair':
  if blue:H,S,V=tint(42,.85) if s>.82 else tint(325,s*.85)
 elif id=='dragonite':
  if 10<h<60 and s>.45:H,S,V=tint(110,.4,.95)
  elif 150<h<235 and s>.25:H,S,V=tint(295,.6)
 elif id=='pikachugmax':
  # Recolour only yellow skin; the glowing tail, lightning and storm clouds stay unchanged.
  if pikachu_gmax_body_mask.getpixel((min(511,int(x*512)),min(511,int(y*512)))) and 35<h<70 and s>.25:H,S,V=tint(38,s,.99)
 elif id=='raichumegay':
  # Cheeks and lightning appendages have separate canonical Shiny colours.
  cheek=((x*512-227)/15)**2+((y*512-243)/17)**2<1 or ((x*512-133)/6)**2+((y*512-263)/13)**2<1
  if cheek and 25<h<75 and s>.3:H,S,V=tint(3,.8)
  elif 20<h<75 and s>.3 and v>.65:H,S,V=tint(51,.88) if h<48 else tint(36,.9)
 elif id=='dragonitemega':
  # Preserve the rainbow orb as one material; a rectangular exclusion cut through the tail.
  orb=dragonite_orb_mask.getpixel((min(511,int(x*512)),min(511,int(y*512))))
  if orb:return r,g,b
  if 5<h<60 and s>.45:H,S,V=tint(210,.6)
  elif 150<h<205 and s>.25:H,S,V=tint(280,.65)
 elif id in ['arcanine','growlithehisui','arcaninehisui']:
  if 5<h<50 and s>.4:H,S,V=tint(48,.85,1.04)
  elif id=='arcaninehisui' and 15<h<75 and .1<s<.4:H,S,V=tint(65,.22,.94)
 elif id=='ninetales':
  if 20<h<80 and s>.12:H,S,V=240,.035,min(1,v*1.02)
  if x>.9 and .25<y<.8 and 20<h<80 and s>.15:H,S,V=225,.38,v
 elif id=='flaaffy':
  if 160<h<255 and s>.25 and x>.7:H,S,V=tint(130,.8)
 elif id in ['ampharos','ampharosmega']:
  if 35<h<75 and s>.35:H,S,V=tint(325,.43)
  elif red:H,S,V=tint(230,.8)
 elif id=='honchkrow':
  if 190<h<275 and s>.25:H,S,V=tint(295,.7,1.08)
 elif id=='donphan':
  if s<.3 and .15<v<.9:H,S,V=tint(30,.65,1.3) if v<.45 else tint(78,.3)
 elif id=='pichu':
  if 35<h<80 and s>.3:H,S,V=tint(47,s,.98)
 elif id=='onix':
  if s<.3 and .15<v<.94:H,S,V=tint(65,.5,1.03)
 elif id in ['steelix','steelixmega']:
  # No broad rectangular face exemption: the whole metal face must turn pale gold.
  # Protect ink, the teeth inside the mouth, the Mega's cyan eye and prismatic crystals.
  mega=id=='steelixmega'
  crystal=mega and steelix_crystal_mask.getpixel((min(511,int(x*512)),min(511,int(y*512))))
  mouth=(.17<x<.29 and .44<y<.53) if mega else (.10<x<.51 and .33<y<.54)
  tooth=(mouth and v>.65 and (s<.1 or h<80)) if mega else bool(steelix_mouth_mask.getpixel((min(199,int(x*200)),min(199,int(y*200)))))
  eye=mega and .28<x<.42 and .31<y<.5 and s>.45
  if crystal or tooth or eye or v<.26:return r,g,b
  if s<.13 or 185<h<265 and s<.5:H,S,V=tint(51,.33+.2*(1-v),1.05)
  elif mega and 175<h<240 and s>.45:H,S,V=tint(164,.7,.82)
 elif id=='raichualola':
  if 10<h<45 and s>.35 and .2<x<.8 and y<.82:H,S,V=tint(25,.7,.62)
 elif id=='vulpixalola':
  if 170<h<250 and s>.1 and (y<.35 or x>.56):H,S,V=tint(265,s*.72)
 elif id=='ninetalesalola':
  if 170<h<250 and s>.1:H,S,V=tint(270,s*.8)
 elif id in ['geodudealola','graveleralola']:
  if s<.3 and .35<v<.92:H,S,V=tint(35,.8,1.05)
 elif id=='golemalola':
  if 40<h<100 and s<.35 and .4<v<.94:H,S,V=tint(42,.75,.95)
 elif id=='laprasgmax':
  if 170<h<255 and s>.2 and (x<.5 or y>.65):H,S,V=tint(275,s*.8,.95)
 elif id=='eeveegmax':
  if 10<h<45 and s>.3:H,S,V=tint(30,s*.35,.95)
  elif 30<h<80 and .1<s<.45 and v>.6:H,S,V=tint(45,.035,1.05)
 else:raise ValueError('No palette for '+id)
 R,G,B=colorsys.hsv_to_rgb((H%360)/360,max(0,min(1,S)),max(0,min(1,V)))
 return round(R*255),round(G*255),round(B*255)
outputs={};images={};report=[]
for e in entries:
 source=e['sheet'];im=images.setdefault(source,Image.open(ROOT/source).convert('RGBA'))
 if source not in outputs:outputs[source]=im.copy()
 out=outputs[source];columns=e.get('columns',6);rows=e.get('rows',4);index=e['index'];cw=im.width//columns;ch=im.height//rows;ox=index%columns*cw;oy=index//columns*ch
 changed=visible=0
 for yy in range(oy,oy+ch):
  for xx in range(ox,ox+cw):
   r,g,b,a=im.getpixel((xx,yy))
   if not a:continue
   visible+=1;rgb=recolour(e['id'],r,g,b,(xx-ox)/cw,(yy-oy)/ch)
   if rgb!=(r,g,b):changed+=1
   out.putpixel((xx,yy),(*rgb,a))
 report.append({'id':e['id'],'changed':changed,'visible':visible})
registry={};asset_report=[]
for source,out in outputs.items():
 src=Path(source);dest=ROOT/('assets/chibi-painted/shiny/'+src.name if 'chibi-painted' in source else 'assets/'+src.stem+'-shiny.webp');dest.parent.mkdir(parents=True,exist_ok=True);out.save(dest,'WEBP',method=6,**({'lossless':True} if src.name in ['mega-dragonite.webp','mega-raichu-y.webp','pikachugmax.webp'] else {'quality':90}))
 assert Image.open(dest).getchannel('A').tobytes()==images[source].getchannel('A').tobytes()
 asset_report.append({'source':source,'shiny':str(dest.relative_to(ROOT)),'dimensions':list(out.size),'sourceSHA256':hashlib.sha256((ROOT/source).read_bytes()).hexdigest(),'shinySHA256':hashlib.sha256(dest.read_bytes()).hexdigest(),'alphaSHA256':hashlib.sha256(out.getchannel('A').tobytes()).hexdigest(),'alphaPreserved':True})
 for e in entries:
  if e['sheet']==source:registry[e['id']]={'sheet':str(dest.relative_to(ROOT)),'index':e['index'],**{k:e[k]for k in ['columns','rows']if k in e}}
(ROOT/'docs/shiny-palette-report.json').write_text(json.dumps({'species':report,'assets':asset_report},indent=2)+'\n');Path('/tmp/shiny-paired-registry.json').write_text(json.dumps(registry));print('Paired',len(registry),'painted Shiny entries across',len(outputs),'assets; alpha unchanged.')
assert all(r['changed']>0 for r in report),report
