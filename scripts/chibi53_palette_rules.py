"""Material-specific, colour-only Shiny edits checked against each form's canonical reference."""
import colorsys
IDS={'tentacruel','tyranitarmega','baxcaliburmega','garchomp'}
def recolour_chibi53(id,r,g,b,x,y):
 h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
 if v<.13 or s<.035 and v>.94:return r,g,b
 H,S,V=h,s,v
 if id=='tentacruel':
  if (h>315 or h<25) and s>.18 and y<.65:H,S,V=145,min(.8,s*.9),v*.98
  elif 175<h<245 and s>.03:H,S,V=232,min(.65,s*.7),v
  elif y>.63 and (h<55 or h>345) and .025<s<.35 and v>.25:H,S,V=44,min(.55,max(.1,s*1.6)),min(1,v*1.12)
 elif id=='tyranitarmega':
  if 60<h<140 and s>.13:H,S,V=48,s*.7,v
  elif (h>315 or h<25) and s>.22 and y>.55:H,S,V=280,s*.75,v
 elif id=='garchomp':
  if 185<h<280 and s>.08:H,S,V=212,min(.3,s*.6),v*.9
  elif 0<h<35 and s>.35:H,S,V=28,s*.8,v*.98
 elif id=='baxcaliburmega':
  # This form's verified Shiny reference retains its blue hide and red claws.
  # Only pale ice/gray materials shift slightly; do not apply base Baxcalibur's palette.
  if 170<h<215 and .04<s<.25 and v>.75:H,S,V=185,s*.8,v
  elif 190<h<225 and .08<s<.3 and .25<v<.75:H,S,V=185,min(.4,s*1.8),min(1,v*1.12)
 return tuple(round(c*255)for c in colorsys.hsv_to_rgb(H/360,max(0,min(1,S)),max(0,min(1,V))))
