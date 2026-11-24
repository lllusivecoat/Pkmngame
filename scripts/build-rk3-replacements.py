"""Official PokeOS fallbacks for the remaining catalogue gaps (game label RK3).

Prefer official line illustrations / Dream World vectors. Exact-form HOME views
or still frames are a last resort. Never overwrite painted, RK9 or RK1 entries.
"""
from pathlib import Path
import sys,json,re,io,hashlib,urllib.request,concurrent.futures,importlib.util,shutil
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('remaining',ROOT/'scripts/build-remaining-replacements.py')
remaining=importlib.util.module_from_spec(spec);spec.loader.exec_module(remaining)
cached=remaining.cached
CACHE=Path('/tmp/gymbound-rk3');CACHE.mkdir(exist_ok=True)
ORIGIN='https://assets.pokeos.com/pokemon/'
AUDIT=ROOT/'docs/rk3-temporary-artwork.json'

# These states have canonically identical anatomy; only size, starting moves or
# ability changes. The alias is explicit and recorded, never used for a Mega.
SAME_VISUAL={'raticatealolatotem':'20-regional-a','marowakalolatotem':'105-regional-a',
 'gumshoostotem':'735','vikavolttotem':'738','ribombeetotem':'743',
 'araquanidtotem':'752','lurantistotem':'754','salazzletotem':'758',
 'togedemarutotem':'777','mimikyutotem':'778','rockruffdusk':'744',
 'greninjabond':'658','pikachustarter':'25','eeveestarter':'133'}
STEMS={'minior':'774-red','pikachucosplay':'10085','eternatuseternamax':'10190',
 'floetteeternal':'670-eternal','urshifugmax':'892-single-strike-gmax',
 'toxtricitylowkeygmax':'849-gmax','meowsticmmega':'678-mega','meowsticfmega':'678-mega',
 'magearnaoriginalmega':'801-mega-original','tatsugiricurlymega':'978-mega',
 'tatsugiridroopymega':'978-mega-droopy','tatsugiristretchymega':'978-mega-stretchy',
 'mimikyubusted':'778-busted','mimikyubustedtotem':'778-busted'}
REFERENCE_STEMS={'minior':'774-red','mimikyutotem':'778','rockruffdusk':'744',
 'greninjabond':'658','pikachustarter':'25','eeveestarter':'133',
 'gumshoostotem':'735','vikavolttotem':'738','ribombeetotem':'743',
 'araquanidtotem':'752','lurantistotem':'754','salazzletotem':'758','togedemarutotem':'777',
 'raticatealolatotem':'20-regional-a','marowakalolatotem':'105-regional-a'}
EXCLUDED={'pikachucosplay':'PokeOS file 10085 depicts Detective Pikachu, not Cosplay Pikachu.'}

def url(asset):return ORIGIN+asset['path'][2:]
def cachefile(asset):return CACHE/(hashlib.sha256(asset['path'].encode()).hexdigest()[:16]+Path(asset['path']).suffix)
def make_plan():
    home=json.loads(Path('/tmp/pokeos-home-assets-latest.json').read_text())
    official=json.loads(cached('https://api.pokeos.com/api/poke/artworks?type=official','/tmp/pokeos-artworks-official.json'))
    dream=json.loads(cached('https://api.pokeos.com/api/poke/artworks?type=dream-world','/tmp/pokeos-artworks-dream-world.json'))
    paths={e['path']:e for e in home+official+dream}
    plan=[]
    for original in json.loads((ROOT/'docs/remaining-temporary-artwork.json').read_text())['pending']:
        e={k:original[k] for k in ['id','name','number','forme','kind']}
        id=e['id'];stem=STEMS.get(id,SAME_VISUAL.get(id,str(e['number'])+'-'+e['forme'].lower()))
        if id.startswith('alcremie') and not id.endswith('gmax'):
            stem=str(e['number'])+'-'+e['forme'].lower()+'-strawberry-sweet'
        e['stem']=stem;e['candidates']=[]
        # Named official art avoids ambiguous numbered pose collections.
        for prefix,ext,kind in [('artworks/dream-world/','.svg','Dream World illustration'),
                ('artworks/official/','.png','Official illustration'),
                ('home/render/','.png','Official HOME form render'),
                ('home/animated/','.gif','Official HOME form still')]:
            p='./'+prefix+stem+ext
            if p in paths and id not in EXCLUDED:e['candidates'].append({'asset':paths[p],'sourceKind':kind})
        refstem=REFERENCE_STEMS.get(id,stem)
        refs=None
        for folder,ext in [('home/render/','.png'),('home/animated/','.gif')]:
            n='./'+folder+refstem+ext;s='./'+folder+'shiny/'+refstem+ext
            if n in paths and s in paths:refs={'normal':paths[n],'shiny':paths[s]};break
        if not refs or 'gmax'in id or id=='raticatealolatotem':
            # Prefer aligned archived static pairs over differently cropped GIFs.
            for version in ['v3.1.0','v2.0.0','v1.0.0','beta2020-01-31','beta2020-01-10']:
                n='./home/render/versions/'+version+'/'+refstem+'.png'
                s='./home/render/versions/'+version+'/shiny/'+refstem+'.png'
                if n in paths and s in paths:refs={'normal':paths[n],'shiny':paths[s]};break
        if not refs and id.startswith('alcremie') and id!='alcremiegmax':
            n='./home/render/'+refstem+'.png';s='./home/render/shiny/869.png'
            if n in paths and s in paths:refs={'normal':paths[n],'shiny':paths[s]}
        if not refs:
            api={'pikachucosplay':10085,'pikachurockstar':10080,'pikachubelle':10081,
                'pikachupopstar':10082,'pikachuphd':10083,'pikachulibre':10084,
                'urshifugmax':10226,'urshifurapidstrikegmax':10227}.get(id)
            n=f'./home/render/{api}.png';s=f'./home/render/shiny/{api}.png'
            if api and n in paths and s in paths:refs={'normal':paths[n],'shiny':paths[s]}
        if not refs:
            # Some HOME defaults are indexed by their API Pokémon ID.
            n='./home/render/'+str(e['number'])+'.png';s='./home/render/shiny/'+str(e['number'])+'.png'
            if id in SAME_VISUAL and n in paths and s in paths:refs={'normal':paths[n],'shiny':paths[s]}
        if not refs and id=='pikachucosplay':
            n='./artworks/official/10085.png';s='./artworks/official/shiny/10085.png'
            if n in paths and s in paths:refs={'normal':paths[n],'shiny':paths[s]}
        if id=='floetteeternal':
            refs={'normal':paths['./home/render/670-eternal.png'],'shiny':paths['./home/render/shiny/670-eternal.png']}
            e['manualPalette']='Blue stems/body become pale pink; black/red flower remains unchanged.'
        e['references']=refs
        if id in SAME_VISUAL:e['visualAlias']='Canonically identical appearance; size/ability/starting moves differ.'
        if id in ['meowsticmmega','meowsticfmega','toxtricitylowkeygmax']:
            e['visualAlias']='This transformed appearance is shared by both base forms.'
        plan.append(e)
    (CACHE/'plan.json').write_text(json.dumps(plan,indent=2))
    print('RK3 plan:',len(plan),'gaps;',sum(bool(e['candidates'])for e in plan),'sources;',sum(bool(e['candidates'] and e['references'])for e in plan),'paired sources.',flush=True)
    return plan

def download(plan):
    assets={a['path']:a for e in plan for a in [*[c['asset']for c in e['candidates']],*(e.get('references')or{}).values()]}
    def one(a):
        try:cached(url(a),cachefile(a));return None
        except Exception as ex:return {'path':a['path'],'error':str(ex)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8)as pool:errors=[x for x in pool.map(one,assets.values())if x]
    (CACHE/'errors.json').write_text(json.dumps(errors,indent=2));print('Downloaded',len(assets),'sources;',len(errors),'errors.',flush=True)

def bitmap(asset):
    p=cachefile(asset)
    if p.suffix=='.svg':
        import cairosvg
        return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=p.read_bytes(),output_width=512,output_height=512))).convert('RGBA')
    im=Image.open(p);im.seek(0);return im.convert('RGBA')

def build(plan):
    from rk_palette import recolor,write,decode
    regfile=ROOT/'temporary-artwork.js'
    registry=json.loads(re.search(r'export const temporaryArtwork=(.*);',regfile.read_text()).group(1))
    old_ids={e['id']for e in json.loads(AUDIT.read_text())['entries']}if AUDIT.exists()else set()
    entries=[];pending=[];review=[]
    for e in plan:
        id=e['id']
        if id in registry and id not in old_ids:raise ValueError('Existing art is immutable: '+id)
        chosen=None
        for c in e['candidates']:
            try:
                im=bitmap(c['asset'])
                if im.getextrema()[3][0]!=0:continue
                chosen=c,im;break
            except Exception:continue
        if not chosen or not e['references']:
            pending.append({**e,'reason':EXCLUDED.get(id,'No exact-form source or reliable paired palette reference in PokeOS.')})
            if id in old_ids:
                registry.pop(id,None)
                for v in ['normal','shiny']:(ROOT/f'assets/temporary-pokemon/{v}/{id}.svg').unlink(missing_ok=True)
            continue
        c,im=chosen;im=im.crop(im.getbbox());ratio=min(224/im.width,224/im.height)
        im=im.resize((max(1,round(im.width*ratio)),max(1,round(im.height*ratio))),Image.Resampling.LANCZOS)
        n=bitmap(e['references']['normal']);s=bitmap(e['references']['shiny'])
        refid='rk3-'+id
        if id in ['floetteeternal','floettemega']:
            import colorsys
            a=np.array(im);out=a.copy()
            for y,x in np.argwhere(a[:,:,3]>0):
                r,g,b=a[y,x,:3]/255;h,sat,v=colorsys.rgb_to_hsv(r,g,b)
                if .50<h<.78 and sat>.20 and max(r,g,b)*255>=43:
                    hue=.72 if id=='floettemega'and y<a.shape[0]*.73 else .96
                    out[y,x,:3]=np.array(colorsys.hsv_to_rgb(hue,min(.40,sat*.65),min(1,v*1.12)))*255
            colored=Image.fromarray(out)
        elif id in ['mimikyubusted','mimikyubustedtotem']:
            a=np.array(im);out=a.copy();gray=np.rint(a[:,:,:3].astype(float)@np.array([.299,.587,.114])).astype('uint8')
            mask=(a[:,:,:3].max(2)>=43)&(a[:,:,3]>0)
            out[mask,:3]=np.repeat(gray[mask,None],3,axis=1)
            colored=Image.fromarray(out)
        elif id in ['pikachurockstar','pikachubelle','pikachupopstar','pikachuphd','pikachulibre']:
            import colorsys
            a=np.array(im);out=a.copy()
            for y,x in np.argwhere(a[:,:,3]>0):
                r,g,b=a[y,x,:3]/255;h,sat,v=colorsys.rgb_to_hsv(r,g,b)
                if .10<h<.19 and sat>.45 and max(r,g,b)*255>=43:out[y,x,:3]=np.array(colorsys.hsv_to_rgb(.105,sat,min(1,v*.98)))*255
            colored=Image.fromarray(out)
        elif n.size!=s.size:
            pending.append({**e,'reason':'Normal/Shiny references do not share an aligned pose.'});continue
        else:
            refs=Path('/tmp/gymbound-kanto-home');refs.mkdir(exist_ok=True)
            n.save(refs/(refid+'-normal.png'));s.save(refs/(refid+'-shiny.png'))
            colored,_=recolor(im,refid,allow_white_materials=True,ink_threshold=43)
        normal=ROOT/f'assets/temporary-pokemon/normal/{id}.svg';shiny=ROOT/f'assets/temporary-pokemon/shiny/{id}.svg'
        write(normal,im,True);write(shiny,colored,True)
        a=np.array(decode(normal));b=np.array(decode(shiny));ink=(a[:,:,:3].max(2)<43)&(a[:,:,3]>0)
        assert np.array_equal(a[:,:,3],b[:,:,3]),id
        assert np.array_equal(a[:,:,:3][ink],b[:,:,:3][ink]),id
        identical=bool(np.array_equal(a,b))
        registry[id]={v:{'sheet':f'assets/temporary-pokemon/{v}/{id}.svg','preview':f'assets/temporary-pokemon/{v}/{id}.svg',
            'index':0,'columns':1,'rows':1,'label':'RK3','family':'RK3','provider':'PokeOS '+c['sourceKind'],
            'paletteEdit':v=='shiny','paletteIdentical':v=='shiny'and identical,'inkCutoff':43,
            'sourceKind':c['sourceKind']}for v in ['normal','shiny']}
        entries.append({'id':id,'name':e['name'],'number':e['number'],'artFamily':'RK3','sourceKind':c['sourceKind'],
            'visualAlias':e.get('visualAlias'),'manualPalette':e.get('manualPalette'),
            'palettes':{'normal':{'source':url(c['asset']),'pokeosAssetId':c['asset']['id'],
                'sha256':hashlib.sha256(cachefile(c['asset']).read_bytes()).hexdigest(),'file':str(normal.relative_to(ROOT))},
                'shiny':{'sourceDrawing':str(normal.relative_to(ROOT)),'canonicalNormal':url(e['references']['normal']),
                    'canonicalShiny':url(e['references']['shiny']),'file':str(shiny.relative_to(ROOT)),
                    'alphaPreserved':True,'inkCutoff':43,'paletteIdentical':identical}}})
        review.append((id,im,colored))
    regfile.write_text('// RK9 / RK1 / RK3 temporary art; matching same-drawing Shiny palettes.\nexport const temporaryArtwork='+json.dumps(registry,separators=(',',':'))+';\n')
    AUDIT.write_text(json.dumps({'archive':'https://www.pokeos.com/archive/artworks','count':len(entries),
        'pendingCount':len(pending),'entries':entries,'pending':pending},indent=2)+'\n')
    for start in range(0,len(review),48):
        batch=review[start:start+48];a=Image.new('RGB',(1920,((len(batch)+7)//8)*170),'#d9e3df');d=ImageDraw.Draw(a)
        for i,(id,n,s)in enumerate(batch):
            for j,im in enumerate([n,s]):
                im=im.copy();im.thumbnail((108,135));a.paste(im,(i%8*240+j*116,i//8*170+24),im)
            d.text((i%8*240+3,i//8*170+4),id,fill='#123')
        a.save(CACHE/f'review-{start//48:02}.jpg')
    print('Built',len(entries),'RK3 pairs;',len(pending),'still unavailable.',flush=True)

if __name__=='__main__':
    plan=make_plan()
    if '--plan'not in sys.argv:
        download(plan)
        if '--download-only'not in sys.argv:build(plan)
