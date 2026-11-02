"""Invariantes finais de consolidação; falhas não são homologação implícita."""
from pathlib import Path
import json,hashlib,zipfile,collections,gzip,time
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
pkg=read(BASE/'radar_hub_package.json');gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');inline=json.JSONDecoder().raw_decode(code.split('const RADAR_HUB_PACKAGE = ',1)[1])[0];snap=read(OUT/'inventario.json');original={r['path']:r for r in snap['files']};checks=[]
def check(name,ok):
 assert ok,name
 checks.append(name)
check('Package = fallback = ground truth = registry',pkg==inline and pkg['groundTruth']==gt and pkg['metadataRegistry']==reg)
payload={k:v for k,v in pkg.items() if k not in ['schema_version','dataset_version','source_registry_version','audit_status','auditReport','audit_note']};fingerprint=hashlib.sha256(json.dumps(payload,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest();check('Versão identifica todo o payload','sha256:'+fingerprint==pkg['dataset_version'])
check('app.js exatamente preservado',hashlib.sha256((ROOT/'app.js').read_bytes()).hexdigest()==original['app.js']['sha256'])
protected=[r for r in snap['files'] if r['path'].startswith('docs/dados-publicos-revisao/') or ('data/radar_hub/' in r['path'] and ('_evidence_' in r['path'] or '_raw_' in r['path']))]
for r in protected:check('Preservado '+r['path'],hashlib.sha256((ROOT/r['path']).read_bytes()).hexdigest()==r['sha256'])
check('Sem homologação global',pkg['auditReport'] is None and pkg['consolidacaoStatus']['homologated'] is False)
ids=[r['indicator_id'] for r in reg['indicators']];check('122 IDs únicos',len(ids)==len(set(ids))==122)
for i in reg['indicators']:
 if i.get('audit_status','').startswith('SUSPENSO'):check('Suspenso = null '+i['indicator_id'],i['value'] is None)
 if i['value'] is not None:
  e=i.get('evidencia',{});p=ROOT/(e.get('raw_file') or e.get('raw_reference') or '')
  check('Vínculo bruto '+i['indicator_id'],p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==e.get('sha256'))
with zipfile.ZipFile(OUT/'snapshot-canonico.zip') as z:
 old=json.loads(z.read('data/radar_hub/sjc_open_data_ground_truth.json'))
 for axis in ['economia','financas','meio_ambiente']:check('Ground truth preservado '+axis,old['eixos'][axis]==gt['eixos'][axis])
 for n in ['sjc_setores_socioeconomicos_geo.json','sjc_regioes_geo.json']:
  previous=json.loads(z.read('data/radar_hub/'+n));current=read(BASE/n);check('Geometria preservada '+n,[f['geometry'] for f in previous['features']]==[f['geometry'] for f in current['features']])
future=[r for r in gt['eixos']['mobilidade']['series_auditadas']['transporte_bilhetagem'] if r['period']>'2026-08' and r['period']<'2027'];check('144 competências após corte permanecem null',len(future)==144 and all(r['value'] is None for r in future))
for axis,name in [('economia','economia'),('financas','financas'),('meio_ambiente','meioAmbiente'),('mobilidade','mobilidade')]:
 for id,b in pkg[name+'Audit']['indicators'].items():
  i=next(i for i in reg['indicators'] if i['indicator_id']==id);check('Binding '+id,i['value']==b['value'] and (i['audit_status']==b['status'] or i['value'] is None))
edu=gt['eixos']['educacao'];check('11 ciclos de IDEB por rede',all(len(r)==11 for r in edu['ideb_series_por_rede'].values()));check('Metas posteriores a 2021 null',all(r['meta_iniciais'] is None and r['meta_finais'] is None for r in edu['ideb_inep_serie'] if r['ano']>2021));check('Matrículas não duplicadas por rede',sum(r['matriculas'] for r in edu['matriculas_por_rede_censo_2023'])==163965)
perf=[]
for name in ['data/radar_hub/radar_hub_package.json','radar_hub_controller.js','app.html']:
 b=(ROOT/name).read_bytes();times=[]
 if name.endswith('.json'):
  for _ in range(3):t=time.perf_counter();json.loads(b);times.append(time.perf_counter()-t)
 perf.append({'file':name,'bytes':len(b),'gzip6_simulated_bytes':len(gzip.compress(b,6)),'python_parse_seconds':times,'note':'Gzip local estimado; transferência real descrita no teste Chrome, produção não medida.'})
result={'status':'PASS','checks_count':len(checks),'checks':checks,'dataset_version':pkg['dataset_version'],'protected_files':len(protected),'statuses':dict(collections.Counter(i['audit_status'] for i in reg['indicators'])),'performance':perf}
(OUT/'testes-integridade-final.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('PASS',len(checks),'invariantes;',len(protected),'arquivos anteriores preservados.')
