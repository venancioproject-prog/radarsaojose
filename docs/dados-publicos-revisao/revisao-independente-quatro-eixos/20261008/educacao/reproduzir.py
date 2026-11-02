"""Validação independente: somente lê canônicos e grava nesta pasta.
Execute python -X utf8 docs/.../educacao/reproduzir.py. Requer python-calamine.
Não integra propostas, não infere lacunas, preserva células e cabeçalhos nativos.
"""
from pathlib import Path
import json, hashlib, zipfile, io, datetime
from python_calamine import CalamineWorkbook
OUT=Path(__file__).resolve().parent
ROOT=next(p for p in OUT.parents if (p/'app.js').exists())
PRE=ROOT/'docs/dados-publicos-revisao/consolidacao-geral/20261008T060731Z'
def load(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def save(name,obj): (OUT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
cache={}; rowcache={}; sources=[]; checks=[]
def getrows(p,sheet):
 key=(str(p),sheet)
 if key not in rowcache:rowcache[key]=workbook(p)[0].get_sheet_by_name(sheet).to_python()
 return rowcache[key]
def workbook(p):
 if str(p) not in cache:
  z=zipfile.ZipFile(p); member=next(n for n in z.namelist() if n.endswith('.xlsx')); b=z.read(member)
  w=CalamineWorkbook.from_filelike(io.BytesIO(b))
  cache[str(p)]=(w,member,sha(p),hashlib.sha256(b).hexdigest())
 return cache[str(p)]
def ck(label,cond,details=None):
 checks.append({'test':label,'pass':bool(cond),'details':details})
 if not cond: raise AssertionError(label)
reg=load(ROOT/'data/radar_hub/sjc_metadata_registry.json')
gt=load(ROOT/'data/radar_hub/sjc_open_data_ground_truth.json')['eixos']['educacao']
indicators=[i for i in reg['indicators'] if i['category']=='educacao']
save('inventario.json',{'registry':indicators,'ground_truth':gt,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
old=load(PRE/'educacao-inep-reproduzida.json')
for e in old['evidences']:
 p=ROOT/e['raw_reference'];w,member,s,m=workbook(p)
 rows=getrows(p,e['sheet']); raw=rows[e['row']-1][e['column']-1]
 ck('IDEB '+e['evidence_id'],raw==e['raw_value'] and s==e['sha256'] and m==e['member_sha256'],{'raw':raw,'unit':e['unit']})
for network,series in gt['ideb_series_por_rede'].items():
 for rec in series:
  for stage,key in [('iniciais','anos_iniciais'),('finais','anos_finais')]:
   e=next(x for x in old['evidences'] if x['network']==network and x['stage']==stage and x['native_variable']=='VL_OBSERVADO_'+str(rec['ano']))
   ck('GT IDEB '+network+' '+stage+' '+str(rec['ano']),rec[key]==e['value'])
   if rec['ano']>=2023:ck('Sem metas pós2021 '+network+stage+str(rec['ano']),rec['meta_'+stage] is None)
censo=load(PRE/'censo2023-recorte-municipal.json')
for t in censo['tables']:
 w,member,s,m=workbook(ROOT/t['raw_reference']);rows=w.get_sheet_by_name(t['sheet']).to_python()
 ck('Censo2023 arquivo '+t['sheet'],s==t['sha256'] and m==t['member_sha256'])
 for r in t['rows']:ck('Censo2023 linha '+t['sheet']+':'+str(r['row']),rows[r['row']-1]==r['values'])
for i in indicators:
 if i['value'] is None:ck(i['indicator_id']+' preserva suspensão',i['audit_status']=='SUSPENSO');continue
 e=i['evidencia'];p=ROOT/e['raw_reference'];ck(i['indicator_id']+' hash',sha(p)==e['sha256'])
 if i['indicator_id'].startswith('educ_matriculas'):
  w,member,s,m=workbook(p);l=e['locator'];v=w.get_sheet_by_name(l['sheet']).to_python()[l['row']-1][l['column']-1]
  ck(i['indicator_id']+' célula',v==i['value'])
net=gt['matriculas_por_rede_censo_2023'];ck('Matrículas rede total',sum(x['matriculas'] for x in net)==gt['matriculas_censo_escolar_2023']['total_matriculas'])
for n in net:ck('Percentual '+n['rede'],abs(n['pct']-n['matriculas']/163965*100)<1e-10)
ibge=load(PRE/'fontes-externas/ibge-10058.json')
def walk(o):
 if isinstance(o,dict):
  yield o
  for v in o.values():yield from walk(v)
 elif isinstance(o,list):
  for v in o:yield from walk(v)
school=next(x for x in walk(ibge) if x.get('id')==60045)
ck('Escolarização Censo2022',any(x.get('2022')=='99.09' or x.get('2022')==99.09 for x in walk(school)),school)
save('matriz-evidencias.json',{'ideb':old['evidences'],'censo2023_tables':len(censo['tables']),'registry_checks':checks,'ibge_escolarizacao':school})
new=[]
for year in [2024,2025]:
 p=OUT/'raw'/f'sinopse{year}.zip'
 if not p.exists() or not zipfile.is_zipfile(p):continue
 w,member,s,m=workbook(p);tables=[]
 for name in w.sheet_names:
  rows=w.get_sheet_by_name(name).to_python();selected=[{'row':j+1,'values':r} for j,r in enumerate(rows) if 3549904 in r[:4]]
  if not selected:continue
  footer=next((i for i,r in enumerate(rows) if any(isinstance(c,str) and c.strip().startswith('Fonte:') for c in r)),len(rows))
  tables.append({'sheet':name,'headers':rows[:12],'rows':selected,'notes':rows[footer:],'raw_reference':p.relative_to(ROOT).as_posix(),'sha256':s,'member':member,'member_sha256':m,'period':year,'source_url':f'https://download.inep.gov.br/dados_abertos/sinopses_estatisticas/sinopse_estatistica_censo_escolar_{year}.zip','territory':'Município da escola IBGE3549904, não residência'})
  ck(f'Censo{year} município '+name,all(any(isinstance(c,str) and c.strip()=='São José dos Campos' for c in r['values'][:4]) for r in selected))
 save(f'censo{year}-recorte.json',{'year':year,'homologated':False,'tables':tables});new.append({'year':year,'tables':len(tables),'sha256':s,'member_sha256':m,'member':member,'raw_reference':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'catalog_url':'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas/educacao-basica','source_url':tables[0]['source_url'],'retrieval':'HTTP oficial após reset HTTPS; hash preservado, sem desativar TLS','accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
save('manifest.json',{'sources_existing':[{'file':k,'sha256':v[2],'member':v[1],'member_sha256':v[3]} for k,v in cache.items()],'new_sources':new})
save('testes.json',{'status':'PASS' if all(x['pass'] for x in checks) else 'FAIL','checks_count':len(checks),'checks':checks,'independent_producer_only':True})
print(json.dumps({'status':'PASS','checks':len(checks),'ideb_cells':len(old['evidences']),'censo2023_tables':len(censo['tables']),'new':new},ensure_ascii=False))
