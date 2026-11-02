from collect_mobilidade_p4 import *
from inspect_mobilidade_sources import links
from urllib.parse import urljoin
session.headers['User-Agent']='Mozilla/5.0'
for name,url in [('infosiga-dados-rest.zip','https://infosiga.detran.sp.gov.br/rest/painel/download/file/dados_infosiga.zip'),('infosiga-dicionario-rest.zip','https://infosiga.detran.sp.gov.br/rest/painel/download/file/CGSV_Infosiga_SP_dicionario_dados.zip'),('infosiga-dicionario-atual.zip','https://infosiga.detran.sp.gov.br/rest/painel/download/file/Infosiga_dicionario_dados.zip'),('cicloviario-2024-alternativo.pdf','https://siteprefeitura.sjc.sp.gov.br/media/277822/mapa-cicloviario-2024-site.pdf')]:fetch(name,url)
for url,label in links('senatran-2015.html'):
 if label.strip().lower()=='frota por municipio e tipo' and 'dez' in url.lower():fetch('senatran-municipal-2015-12.rar',url)
log=read(RAW/'consultas.json');anac=next(l['final_url'] for l in reversed(log) if l['name']=='anac-movimentacao-arquivos.html' and l['status']=='OK')
for year in range(2019,2026):fetch(f'anac-movimentacao-{year}-indice.html',urljoin(anac.rstrip('/')+'/',str(year)+'/'))
for url,label in links('anac-estatistica-indice.html'):
 if 'formato-csv' in url or ('arquivos' in label.lower() and 'estat' in label.lower()):fetch('anac-estatistica-arquivos.html',urljoin('https://www.anac.gov.br',url))
