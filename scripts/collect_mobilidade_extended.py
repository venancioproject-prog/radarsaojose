from collect_mobilidade_p4 import *
from inspect_mobilidade_sources import links
from urllib.parse import urljoin
for name,url in [('infosiga-dados-abertos.html','https://infosiga.detran.sp.gov.br/painel/dadosAbertos'),('infosiga-glossario.html','https://infosiga.detran.sp.gov.br/painel/glossario'),('infosiga-historico.html','https://infosiga.detran.sp.gov.br/painel/historico'),('infosiga-catalogo.json','https://dadosabertos.sp.gov.br/api/3/action/package_show?id=sinistros-infosiga'),('cicloviario-2024.pdf','https://www.sjc.sp.gov.br/media/277822/mapa-cicloviario-2024-site.pdf'),('cicloviario.html','https://www.sjc.sp.gov.br/servicos/mobilidade-urbana/ciclovias/'),('planmob-indicadores.pdf','https://www.sjc.sp.gov.br/media/z0wh1zsd/indicadores_planmob.pdf'),('obras-2019-2025.pdf','https://www.sjc.sp.gov.br/media/pe2lta1t/planilha-de-obras-2019-2025-semob-v2.pdf'),('anac-movimentacao.html','https://www.anac.gov.br/acesso-a-informacao/dados-abertos/areas-de-atuacao/operador-aeroportuario/dados-de-movimentacao-aeroportuaria'),('anac-estatistica-metadados.html','https://www.anac.gov.br/acesso-a-informacao/dados-abertos/areas-de-atuacao/voos-e-operacoes-aereas/dados-estatisticos-do-transporte-aereo/48-dados-estatisticos-do-transporte-aereo')]:fetch(name,url)
for file in ['transporte-documentos.html','transporte-operacionais.html']:
 for url,label in links(file):
  if any(t in label for t in ['Histórico','Mobilidade Elétrica','Linha Verde','auditoria operacional','Autonomia']):fetch('documento-'+url.split('/')[-1],urljoin('https://www.sjc.sp.gov.br',url))
catalog=[]
for url,label in links('senatran-indice.html'):
 if url.endswith('.zip') and (label.isdigit() or label=='Anteriores a 2000'):
  name='senatran-'+(label if label.isdigit() else 'anteriores2000')+'.zip';catalog.append({'file':name,'url':url,'label':label});fetch(name,url)
months=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
for year in range(2013,2027):
 for url,label in links(f'senatran-{year}.html'):
  if label.strip().lower() not in ['frota por município e tipo','frota por município','frota por municipio e tipo','frota por municipio']:continue
  if not any(url.lower().endswith(x) for x in ['.zip','.xls','.xlsx','.csv']):continue
  if year!=2026 and not any(m in url.lower() for m in ['dezembro','dez','12_','12.','12-']):continue
  month=next((i+1 for i,m in enumerate(months) if m in url.lower()),None)
  if month is None:month=12 if year!=2026 else None
  if month is None:continue
  extension=url.split('.')[-1].lower();name=f'senatran-municipal-{year}-{month:02}.{extension}'
  if any(c['file']==name for c in catalog):continue
  catalog.append({'file':name,'url':url,'label':label,'year':year,'month':month});fetch(name,url)
save(RAW/'senatran-catalogo.json',catalog)
