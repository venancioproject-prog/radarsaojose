from collect_mobilidade_p4 import *
from inspect_mobilidade_sources import links
from urllib.parse import urljoin
import re,html
text=(RAW/'transporte-operacionais.html').read_text(encoding='utf8');catalog=[]
for row in re.findall(r'<tr[^>]*>(.*?)</tr>',text,re.S):
 year=re.search(r'<td[^>]*>\s*(20\d{2})\s*</td>',row)
 if not year:continue
 for url,label in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>',row,re.S):
  label=html.unescape(re.sub('<[^>]+>','',label)).strip()
  if not any(label.startswith(v) for v in ['Linhas','Bilhetagem','Quilometragem','IPK']):continue
  kind='linhas' if label.startswith('Linhas') else 'bilhetagem' if label.startswith('Bilhetagem') else 'km' if label.startswith('Quilometragem') else 'ipk'
  name=f'transporte-{kind}-{year[1]}.pdf';catalog.append({'year':int(year[1]),'kind':kind,'label':label,'file':name,'url':urljoin('https://www.sjc.sp.gov.br/',url)});fetch(name,catalog[-1]['url'])
save(RAW/'transporte-catalogo.json',catalog)
for node in read(RAW/'ibge-frota-metadados.json')[0]['children'][0]['children']:
 fetch(f'ibge-frota-{node["id"]}.json',f'https://servicodados.ibge.gov.br/api/v1/pesquisas/22/indicadores/{node["id"]}/resultados/3549904')
for url,label in links('senatran-indice.html'):
 if label.isdigit() and int(label)>=2013 and 'frota-de-veiculos' in url:fetch(f'senatran-{label}.html',url)
fetch('infosiga-main.js','https://infosiga.detran.sp.gov.br/main-5TN6CQIP.js')
