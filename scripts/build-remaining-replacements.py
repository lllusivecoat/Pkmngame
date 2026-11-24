"""Fill missing catalogue art with RK9 then outlined Final/RK1, never HOME models.

Existing art is immutable. Missing form drawings stay pending. HOME renders are
downloaded ONLY as aligned colour references for same-drawing Shiny edits.
Run --plan, --download-only, or without flags to build cached inputs.
"""
from pathlib import Path
import json, re, subprocess, urllib.request, concurrent.futures, time, hashlib, io, sys
from PIL import Image, ImageDraw
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path('/tmp/gymbound-remaining-art')
CACHE.mkdir(exist_ok=True)
ARCHIVE = Path('/tmp/pokeos-home-assets-latest.json')
PLAN = CACHE / 'plan.json'
AUDIT = ROOT / 'docs/remaining-temporary-artwork.json'
ORIGIN = 'https://assets.pokeos.com/pokemon/'
API = 'https://api.pokeos.com/api/poke/game/assets?versionGroupCode=home'

def cached(url, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    marker=path.with_suffix(path.suffix+'.source')
    if path.exists() and marker.exists() and marker.read_text()!=url: path.unlink()
    if path.exists():
        marker.write_text(url)
        return path.read_bytes()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=40) as r: data = r.read()
            if not data: raise ValueError('Empty source')
            path.write_bytes(data)
            marker.write_text(url)
            return data
        except Exception:
            if attempt == 3: raise
            time.sleep(attempt + 1)

def norm(s): return re.sub('[^a-z0-9]', '', s.lower())

# Source names are not identical to simulator form names. These aliases are
# explicit rather than falling back to a different form of the same species.
ALIASES = {'regional-a':'alola', 'regional-g':'galar', 'regional-h':'hisui',
 'regional-p':'paldea', 'regional-p-combat':'paldeacombat',
 'regional-p-blaze':'paldeablaze', 'regional-p-aqua':'paldeaaqua',
 'regional-g-standard':'galar', 'regional-g-zen':'galarzen',
 'female':'f',
 'family-of-four':'four', 'family-of-three':'', 'family-three':'',
 'three-segment':'threesegment', 'two-segment':'', 'noice':'noice',
 'noice-face':'noice', 'school':'school', 'tera':'terastal',
 'wellspring-mask':'wellspring', 'hearthflame-mask':'hearthflame',
 'cornerstone-mask':'cornerstone', 'black':'black', 'white':'white',
 'exclamation':'exclamation', 'question':'question'}
DEFAULTS = {'normal','male','natural','red','red-striped','plant','altered','land',
 'incarnate','ordinary','aria','shield','50','baile','solo','disguised','amped',
 'single-strike','ice','ice-face','full-belly','hero','two-segment','overcast',
 'west','spring','meadow','confined','average','vanilla-cream','curly'}
# These source defaults are known to depict a different registered form.
EXACT = {'minior':'774-core', 'miniormeteor':'774-meteor',
 'maushold':'925-family-of-three', 'mausholdfour':'925-family-of-four',
 'vivillon':'666', 'flabebe':'669-red', 'unown':'201-a'}
EXCLUDE_RK9 = {'vivillon': 'RK9 pattern is not explicitly identified as Meadow.',
 'minior':'RK9 does not explicitly identify the registered Red Core form.'}
EXCLUDE_DRAWING={'minior':'All three Final names and RK9 depict Meteor, not Red Core.'}
# Identical reference poses sometimes live under API IDs or archived filenames.
# Normal/Shiny hat images are indexed with different names by the provider.
REFERENCE_NAMES = {
 'furfrou':('676-natural','676-natural'), 'zygarde':('718','718'),
 'xerneas':('716-active','716-active'),
 'minior':('774-red','774-red'), 'miniormeteor':('774','774'),
 'kommoototem':('784','784'),
 'alcremiecaramelswirl':('869-caramel-swirl-strawberry-sweet','869'),
 **{id:(str(n),'25-'+cap+'-cap') for id,n,cap in [
 ('pikachuoriginal',10094,'original'),('pikachuhoenn',10095,'hoenn'),
 ('pikachusinnoh',10096,'sinnoh'),('pikachuunova',10097,'unova'),
 ('pikachukalos',10098,'kalos'),('pikachualola',10099,'alola'),
 ('pikachupartner',10148,'partner'),('pikachuworld',10160,'world')]}}
WHITE_MATERIALS={'solgaleo','wooloo','dubwool','pheromosa','furfrou',
 'furfrouheart','furfroustar','furfroudiamond','furfroudebutante','furfroumatron',
 'furfroudandy','furfroulareine','furfroukabuki','furfroupharaoh'}
DARK_MATERIALS={'litten','torracat','incineroar','ironjugulis','xerneas',
 'xerneasneutral','guzzlord','necrozma','necrozmaduskmane','necrozmadawnwings',
 'wooloo','dubwool','furfrou'}

def refine_materials(base,colored,id,cutoff):
    """Keep broad coat fills smooth when tiny source shading differs from HOME."""
    if id=='tyrantrum':
        import colorsys
        a=np.array(base);out=np.array(colored)
        for y,x in np.argwhere((a[:,:,3]>0)&(a[:,:,:3].max(2)>=cutoff)):
            r,g,b=a[y,x,:3]/255;h,s,v=colorsys.rgb_to_hsv(r,g,b)
            if (0<=h<.085 or h>.90) and s>.35:
                out[y,x,:3]=np.array(colorsys.hsv_to_rgb(.59,max(.5,s*.8),min(1,v*1.16)))*255
            elif .085<=h<.18 and s>.35 and y<a.shape[0]*.32:
                out[y,x,:3]=int(min(255,v*255))
        return Image.fromarray(out)
    if id not in WHITE_MATERIALS: return colored
    from scipy.ndimage import label
    a=np.array(base);out=np.array(colored);rgb=a[:,:,:3].astype(float)/255
    hi=rgb.max(2);lo=rgb.min(2);sat=(hi-lo)/np.maximum(hi,.001)
    neutral=(sat<.25)&(hi>.6)&(a[:,:,3]>0)
    labels,_=label(neutral);sizes=np.bincount(labels.ravel());coat=neutral&(sizes[labels]>40)
    if id=='pheromosa':
        yy,xx=np.indices(hi.shape)
        coat&=(yy>hi.shape[0]*.48)&(xx>hi.shape[1]*.20)&(xx<hi.shape[1]*.85)
    if id=='solgaleo':
        v=hi*.9
        out[coat,0]=(v[coat]*255).astype('uint8')
        out[coat,1]=(v[coat]*.20*255).astype('uint8')
        out[coat,2]=(v[coat]*.25*255).astype('uint8')
    else:
        shade=(hi*55+35).astype('uint8')
        out[coat,:3]=np.repeat(shade[coat,None],3,axis=1)
    protected=(a[:,:,:3].max(2)<cutoff)|(a[:,:,3]==0)
    out[protected,:3]=a[protected,:3]
    return Image.fromarray(out)

def make_plan():
    archive = json.loads(cached(API, ARCHIVE))
    paths = {a['path']: a for a in archive}
    rebuilding={e['id'] for e in json.loads(PLAN.read_text())} if PLAN.exists() else set()
    if AUDIT.exists(): rebuilding.update(e['id'] for e in json.loads(AUDIT.read_text())['entries'])
    js = "const rebuilding=new Set("+json.dumps(sorted(rebuilding))+");"+"""import {artworkEntries} from './developer-tools.js';
import {artworkPending,temporaryArt} from './artwork-status.js';
import {expandedSpecies,battleForms} from './engine-data.js';
import {Dex} from '@pkmn/sim';
console.log(JSON.stringify(artworkEntries.filter(e=>artworkPending(e.id)&&(!temporaryArt(e.id)||rebuilding.has(e.id))).map(e=>{
 const d=Dex.species.get(e.id),s=expandedSpecies[e.id]||battleForms[e.id];
 return {id:e.id,name:e.name,number:d.num,forme:d.forme||'',base:d.baseSpecies,kind:e.formKind||e.kind,apiNumber:s.apiNumber||null};
})));"""
    entries = json.loads(subprocess.check_output(['node','--input-type=module','-e',js], cwd=ROOT))
    result = []
    for e in entries:
        form = norm(e['forme'])
        candidates = []
        for family, prefix in [('RK9','./home/rk9/broadcast/'), ('RK1','./home/')]:
            if e['id'] in EXCLUDE_DRAWING: continue
            if family == 'RK9' and e['id'] in EXCLUDE_RK9: continue
            matches = []
            for p, asset in paths.items():
                if not p.startswith(prefix) or '/' in p[len(prefix):] or not p.endswith('.png'): continue
                stem = p[len(prefix):-4]
                n, _, suffix = stem.partition('-')
                if n != str(e['number']): continue
                sf = norm(ALIASES.get(suffix, suffix.removesuffix('-cap')))
                if e['number']==800: sf={'dawn':'dawnwings','dusk':'duskmane'}.get(sf,sf)
                score = 0
                if e['id'] in EXACT:
                    if stem == EXACT[e['id']]: score = 120
                elif form and sf == form: score = 110
                elif not form and not suffix: score = 100
                elif not form and suffix in DEFAULTS: score = 95
                if score: matches.append((score, asset))
            if matches:
                a = max(matches, key=lambda m:m[0])[1]
                candidates.append({'family':family,'asset':a})
        e['candidates'] = candidates
        # Palette references must identify this same form, never just its Dex number.
        if candidates:
            stem = candidates[0]['asset']['path'].split('/')[-1]
            ref = './home/render/' + stem
            if ref not in paths:
                # Same canonical API identity is safe only for non-cosmetic defaults.
                api_id = str(e['apiNumber'] or candidates[0]['asset']['pokemon_species_id'])
                options = [a['path'] for a in archive if a['path'].startswith('./home/render/')
                    and '/' not in a['path'][len('./home/render/'):] and str(a['pokemon_species_id']) == api_id]
                ref = options[0] if len(options) == 1 else None
            shiny = ref.replace('/render/','/render/shiny/') if ref else None
            if e['id'] in REFERENCE_NAMES:
                normal_name,shiny_name=REFERENCE_NAMES[e['id']]
                ref='./home/render/'+normal_name+'.png'
                shiny='./home/render/shiny/'+shiny_name+'.png'
            if e['id']=='zygarde10':
                ref='./home/render/versions/v2.0.0/718-10.png'
                shiny='./home/render/versions/v2.0.0/shiny/718-10.png'
            if e['id']=='ursalunabloodmoon':
                ref='./home/render/versions/v3.1.0/901-bloodmoon.png'
                shiny='./home/render/versions/v3.1.0/shiny/901-bloodmoon.png'
            if ref in paths and shiny in paths:
                e['references'] = {'normal':paths[ref], 'shiny':paths[shiny]}
            else:
                e['referenceIssue'] = 'No unambiguous matching Normal/Shiny palette reference in archive.'
        result.append(e)
    PLAN.write_text(json.dumps(result, indent=2))
    print('Plan:',len(result),'missing entries;',sum(bool(e['candidates']) for e in result),'have drawings;',
          sum(bool(e.get('references')) for e in result),'have paired references.',flush=True)
    return result

def download(plan):
    jobs=[]
    for e in plan:
        if not e.get('references'): continue
        for c in e['candidates']:
            jobs.append((ORIGIN+c['asset']['path'][2:], CACHE/f"{e['id']}-{c['family']}.png"))
        for v,a in e['references'].items():
            jobs.append((ORIGIN+a['path'][2:], Path('/tmp/gymbound-kanto-home')/f"{e['id']}-{v}.png"))
    errors=[]
    def one(pair):
        try: cached(*pair)
        except Exception as ex: return {'url':pair[0],'error':str(ex)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for i,r in enumerate(pool.map(one,jobs)):
            if r: errors.append(r)
            if i%100==0: print('Downloaded',i,'/',len(jobs),flush=True)
    (CACHE/'download-errors.json').write_text(json.dumps(errors,indent=2))
    print('Download complete:',len(jobs),'files;',len(errors),'errors.',flush=True)

def build(plan):
    from rk_palette import recolor, write, decode, ink_cutoff
    text=(ROOT/'temporary-artwork.js').read_text()
    registry=json.loads(re.search(r'export const temporaryArtwork=(.*);',text).group(1))
    # Rebuilding the same audited batch is safe; never rewrite older approved art.
    old_ids={e['id'] for e in json.loads(AUDIT.read_text())['entries']} if AUDIT.exists() else set()
    entries=[];pending=[];review=[]
    for e in plan:
        id=e['id']
        if id in registry and id not in old_ids: raise ValueError('Would overwrite existing art: '+id)
        chosen=None
        for c in e['candidates']:
            file=CACHE/f"{id}-{c['family']}.png"
            if not file.exists(): continue
            im=Image.open(file).convert('RGBA')
            if im.getextrema()[3][0]!=0: continue
            chosen=(c,file,im);break
        if not chosen or not e.get('references'):
            pending.append({**e,'reason':EXCLUDE_DRAWING.get(id,e.get('referenceIssue','No suitable transparent RK9 or outlined Final drawing.'))})
            # Remove only this audited batch's superseded temporary route.
            if id in old_ids:
                registry.pop(id,None)
                for v in ['normal','shiny']:
                    (ROOT/f'assets/temporary-pokemon/{v}/{id}.svg').unlink(missing_ok=True)
            continue
        c,file,im=chosen;family=c['family'];im=im.crop(im.getbbox())
        ratio=min(224/im.width,224/im.height)
        im=im.resize((max(1,round(im.width*ratio)),max(1,round(im.height*ratio))),Image.Resampling.NEAREST if family=='RK1' else Image.Resampling.LANCZOS)
        try:
            cutoff=43 if id in DARK_MATERIALS else ink_cutoff(id)
            colored,ink=recolor(im,id,allow_white_materials=id in WHITE_MATERIALS,ink_threshold=cutoff)
            colored=refine_materials(im,colored,id,cutoff)
        except Exception as ex:
            pending.append({**e,'reason':'Palette reference is unusable: '+str(ex)});continue
        normal=ROOT/f'assets/temporary-pokemon/normal/{id}.svg';shiny=ROOT/f'assets/temporary-pokemon/shiny/{id}.svg'
        write(normal,im,True);write(shiny,colored,True)
        a=np.array(decode(normal));b=np.array(decode(shiny));mask=(a[:,:,:3].max(2)<cutoff)&(a[:,:,3]>0)
        assert np.array_equal(a[:,:,3],b[:,:,3]),id
        assert np.array_equal(a[:,:,:3][mask],b[:,:,:3][mask]),id
        identical=bool(np.array_equal(a,b))
        registry[id]={v:{'sheet':f'assets/temporary-pokemon/{v}/{id}.svg','preview':f'assets/temporary-pokemon/{v}/{id}.svg',
            'index':0,'columns':1,'rows':1,'label':family,'family':family,
            'provider':'RK9 via PokeOS' if family=='RK9' else 'PokeOS outlined Final sprite (game label RK1)',
            'paletteEdit':v=='shiny','paletteIdentical':v=='shiny' and identical,'inkCutoff':cutoff} for v in ['normal','shiny']}
        entries.append({'id':id,'name':e['name'],'number':e['number'],'kind':e['kind'],'artFamily':family,
            'replacement':'painted-chibi-pending','sourceNote':EXCLUDE_RK9.get(id,'RK9 preferred; outlined Final when unavailable.'),
            'palettes':{'normal':{'source':ORIGIN+c['asset']['path'][2:],'pokeosAssetId':c['asset']['id'],
                'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'file':str(normal.relative_to(ROOT))},
                'shiny':{'sourceDrawing':str(normal.relative_to(ROOT)),
                    'canonicalNormal':ORIGIN+e['references']['normal']['path'][2:],
                    'canonicalShiny':ORIGIN+e['references']['shiny']['path'][2:],
                    'file':str(shiny.relative_to(ROOT)),'alphaPreserved':True,'inkCutoff':cutoff,'inkProtectedPixels':ink,
                    'paletteIdentical':identical}}})
        review.append((id,family,im,colored))
        if len(entries)%50==0: print('Built',len(entries),'pairs',flush=True)
    (ROOT/'temporary-artwork.js').write_text('// RK9 / RK1 temporary drawings; matching canonical Shiny palette edits.\nexport const temporaryArtwork='+json.dumps(registry,separators=(',',':'))+';\n')
    AUDIT.write_text(json.dumps({'archive':'https://www.pokeos.com/archive/assets/home','count':len(entries),
        'rk9Count':sum(e['artFamily']=='RK9' for e in entries),'rk1Count':sum(e['artFamily']=='RK1' for e in entries),
        'pendingCount':len(pending),'entries':entries,'pending':pending},indent=2)+'\n')
    for start in range(0,len(review),64):
        batch=review[start:start+64];canvas=Image.new('RGB',(1920,((len(batch)+7)//8)*160),'#d9e3df');d=ImageDraw.Draw(canvas)
        for i,(id,family,normal,shiny) in enumerate(batch):
            for j,image in enumerate([normal,shiny]):
                im=image.copy();im.thumbnail((108,125));canvas.paste(im,((i%8)*240+j*116+(108-im.width)//2,(i//8)*160+24),im)
            d.text(((i%8)*240+4,(i//8)*160+5),f'{id} / {family}',fill='#15332f')
        canvas.save(CACHE/f'review-{start//64:02}.jpg')
    print('Built',len(entries),'pairs;',len(pending),'remain explicitly pending.',flush=True)

if __name__=='__main__':
    plan=json.loads(PLAN.read_text()) if PLAN.exists() and '--plan' not in sys.argv else make_plan()
    if '--plan' in sys.argv: raise SystemExit(0)
    download(plan)
    if '--download-only' not in sys.argv: build(plan)
