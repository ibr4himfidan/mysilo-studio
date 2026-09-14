from pathlib import Path
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
import json
assets={'flat':'mysilo-duz-tabanli-silo.png','economic':'mysilo-ekonomik-konik-revize-2.png','commercial':'mysilo-ticari-konik-min.png','industrial':'mysilo-endustriyel-silo-01.png','square':'svg/mysilo-kare-om-model.svg','feed':'mysilo-yem-silosu-2.png','temporary':'noda.png','elevator':'svg/elevator.svg','walkway':'mysilo-yurume-yolu-p-type.png','tower':'kule/mysilo-elevator-kulesi.png','intake':'mysilo-s-model-alim-bunkeri.png','building':'mysilo-7-model.png','conveyor':'svg/Zincirli-Konveyor-Y-Model.svg','shiploader':'svg/mysilo-mobil-bant-konveyor-2.png','dryer':'mysilo-e-serisi-kurutma.jpeg','cleaner':'s4.png'}
def fetch(pair):
 key,name=pair;url='https://www.mysilo.com/upload/ckfinder/files/'+name;ext=Path(name).suffix;file=Path('public/mysilo')/(key+ext)
 data=urlopen(url,timeout=30).read();file.write_bytes(data)
 return {'id':key,'file':'/mysilo/'+file.name,'source':url,'bytes':len(data),'permission':'User identifies mysilo.com assets as their own and authorizes project use.'}
with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(fetch,assets.items()))
Path('public/mysilo/sources.json').write_text(json.dumps(results,indent=2))
print('Downloaded',len(results),'assets;',sum(r['bytes'] for r in results),'bytes')
