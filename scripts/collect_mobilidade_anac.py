from collect_mobilidade_p4 import *
from inspect_mobilidade_sources import links
from urllib.parse import urljoin
logs=read(RAW/'consultas.json');catalog=[]
for year in range(2019,2026):
 name=f'anac-movimentacao-{year}-indice.html';url=next(l['final_url'] for l in reversed(logs) if l['name']==name and l.get('status')=='OK')
 for href,label in links(name):
  if not href.endswith('.csv') or href.endswith('.csv.csv'):continue
  file='anac-'+href;catalog.append({'file':file,'url':urljoin(url,href),'year':year});fetch(file,catalog[-1]['url'])
 if year==2019:
  for href,label in links(name):
   if href.endswith('201902.json'):fetch('anac-'+href,urljoin(url,href))
save(RAW/'anac-catalogo.json',catalog)
