"""Build the offline JS data bundle from checked-in PokeAPI snapshots. Python stdlib only."""
import json
from pathlib import Path
p=Path(__file__).resolve().parents[1]
source=json.loads((p/'combat-data.json').read_text())
keys={'hp':'hp','attack':'attack','defense':'defence','special-attack':'specialAttack','special-defense':'specialDefence','speed':'speed'}
species={s['id']:{'number':s['number'],'baseStats':{keys[k]:v for k,v in s['stats'].items()},'types':[t.title() for t in s['types']],'learnset':s['learnset'],'version':s['version']} for s in source['species']}
moves={m['id']:{'id':m['id'],'name':m['name'],'type':m['type'].title(),'category':m['category'],'power':m['power'],'accuracy':m['accuracy'],'pp':m['pp'],'priority':m['priority'],'target':m['target'],'effectChance':m['effectChance'],'description':m.get('description') or m.get('effect',''),'effect':m.get('effect',''),'ailment':(m['meta']or{}).get('ailment',{}).get('name','none'),'ailmentChance':(m['meta']or{}).get('ailment_chance',0),'flinch':(m['meta']or{}).get('flinch_chance',0),'statChance':(m['meta']or{}).get('stat_chance',0),'drain':(m['meta']or{}).get('drain',0),'healing':(m['meta']or{}).get('healing',0),'critRate':(m['meta']or{}).get('crit_rate',0),'minHits':(m['meta']or{}).get('min_hits'),'maxHits':(m['meta']or{}).get('max_hits'),'changes':[{'stat':keys.get(x['stat']['name'],x['stat']['name']),'change':x['change']} for x in m['statChanges']]} for m in source['moves']}
# Gen IX changes absent from old prose; numeric data is authoritative.
moves['rapid-spin']['changes']=[{'stat':'speed','change':1}];moves['rapid-spin']['statChance']=100
moves['wave-crash']['drain']=-33
chart=json.loads((p/'type-chart.json').read_text())
(p/'combat-data.js').write_text('// Generated from PokeAPI/api-data; see combat-data.json and scripts/build-combat-data.py.\n'+''.join('export const '+name+'='+json.dumps(data,separators=(',',':'))+';\n' for name,data in [('officialSpecies',species),('moveCatalog',moves),('typeChart',chart)]))
