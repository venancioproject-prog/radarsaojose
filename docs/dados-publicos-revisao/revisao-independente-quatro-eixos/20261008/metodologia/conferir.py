from pathlib import Path
import requests,json,hashlib,datetime,concurrent.futures
from pypdf import PdfReader
P=Path(__file__).parent; (P/'raw').mkdir(parents=True,exist_ok=True)
sources={
'inep-sinopses.html':'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas/educacao-basica',
'inep-metas.html':'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/metas',
'ibge-escolarizacao.json':'https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores/60045?localidade=354990',
'ssp-metodologia.pdf':'https://www.ssp.sp.gov.br/assets/download/Dados_Abertos.pdf',
'ssp2024.json':'https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?ano=2024&grupoDelito=6&tipoGrupo=MUNIC%C3%8DPIO&idGrupo=560',
'ssp2025.json':'https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?ano=2025&grupoDelito=6&tipoGrupo=MUNIC%C3%8DPIO&idGrupo=560',
'ssp-produtividade2024.json':'https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?ano=2024&grupoDelito=9&tipoGrupo=MUNIC%C3%8DPIO&idGrupo=560',
'cnes202412.html':'https://cnes2.datasus.gov.br/Mod_Ind_Tipo_Leito.asp?VEstado=35&VMun=354990&VComp=202412',
'sms2025.pdf':'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf',
'rag2025.pdf':'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/RelatAnualGest_2025_1_20260630122107.pdf',
'sidra9923.json':'https://apisidra.ibge.gov.br/values/t/9923/n6/3549904/v/93/p/2022/c1/all',
'sidra9923-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/9923/metadados',
'sidra6579.json':'https://apisidra.ibge.gov.br/values/t/6579/n6/3549904/v/9324/p/all',
'estimativas2026.xlsx':'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2026/estimativa_dou_2026.xlsx',
}
def fetch(item):
 n,u=item
 try:
  r=requests.get(u,timeout=45); f=P/'raw'/n;f.write_bytes(r.content)
  return dict(file=str(f),url=u,http_status=r.status_code,sha256=hashlib.sha256(r.content).hexdigest(),bytes=len(r.content),accessed_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
 except Exception as e:return dict(file=n,url=u,error=str(e))
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: m=list(ex.map(fetch,sources.items()))
 (P/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8')
 for n in ['ssp-metodologia.pdf','sms2025.pdf','rag2025.pdf']:
  try:
   pages=PdfReader(P/'raw'/n).pages
   (P/(n+'.txt')).write_text('\n'.join(f'\nPAGE {i+1}\n'+(p.extract_text() or '') for i,p in enumerate(pages)),encoding='utf-8')
  except Exception as e:print(n,e)
 print(json.dumps(m,ensure_ascii=False))
