import requests,json,hashlib,pathlib,datetime,concurrent.futures
out=pathlib.Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia');(out/'brutos').mkdir(exist_ok=True)
old=pathlib.Path('docs/dados-publicos-revisao/consolidacao-geral/20261008T060731Z/fontes-externas')
m=json.loads((old/'9514-metadados.json').read_text(encoding='utf-8'));ages=[str(x['id']) for c in m['classificacoes'] if c['id']==287 for x in c['categorias'] if x['nivel']==1];print(ages)
urls={'sidra6579.json':'https://apisidra.ibge.gov.br/values/t/6579/n6/3549904/v/9324/p/all','sidra9514-quinquenal.json':'https://apisidra.ibge.gov.br/values/t/9514/n6/3549904/v/93/p/2022/c2/all/c287/'+','.join(['100362']+ages)+'/c12311/113635','municipal-populacao.html':'https://www.sjc.sp.gov.br/servicos/governanca/populacao/','mapa-setores.pdf':'https://www.sjc.sp.gov.br/media/xsenkby1/18_mapa16_setores_socioeconomicos.pdf','caderno-tecnico.pdf':'https://www.sjc.sp.gov.br/media/11wgbczj/cadernotecnico_final.pdf','sidra4714.json':'https://apisidra.ibge.gov.br/values/t/4714/n6/3549904/v/all/p/2022','sidra4711.json':'https://apisidra.ibge.gov.br/values/t/4711/n6/3549904/v/all/p/2022','sidra4712.json':'https://apisidra.ibge.gov.br/values/t/4712/n6/3549904/v/all/p/2022','sidra9515.json':'https://apisidra.ibge.gov.br/values/t/9515/n6/3549904/v/all/p/2022','estimativas-diretorio.html':'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2026/'}
def get(kv):
 k,u=kv
 try:
  r=requests.get(u,timeout=100);p=out/'brutos'/k;p.write_bytes(r.content);return {'file':str(p),'url':u,'status_http':r.status_code,'sha256':hashlib.sha256(r.content).hexdigest(),'bytes':len(r.content),'accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 except Exception as e:return {'file':k,'url':u,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:results=list(ex.map(get,urls.items()))
(out/'manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(results,ensure_ascii=False,indent=2))
