"""Diagnóstico local separado de verificação externa e homologação."""
from pathlib import Path
import json,hashlib,re,gzip,time,collections
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub'
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(n,v):(OUT/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');pkg=read(BASE/'radar_hub_package.json')
code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');html=(ROOT/'app.html').read_text(encoding='utf8')
inline=json.JSONDecoder().raw_decode(code.split('const RADAR_HUB_PACKAGE = ',1)[1])[0]
save('consistencia-inicial.json',{'package_inline_equal':pkg==inline,'ground_truth_equal':pkg.get('groundTruth')==gt,'registry_equal':pkg.get('metadataRegistry')==reg,'dataset_version':pkg.get('dataset_version'),'package_keys':list(pkg),'app_js_sha256':hashlib.sha256((ROOT/'app.js').read_bytes()).hexdigest()})
inventory=read(OUT/'inventario.json')['files'];axis=[]
for name,values in gt['eixos'].items():
 inds=[i for i in reg['indicators'] if i.get('category')==name]
 axis.append({'eixo':name,'fields':list(values),'indicator_count':len(inds),'statuses':dict(collections.Counter(i.get('audit_status') for i in inds)),'indicators':inds,'evidence_files':[r for r in inventory if r['path'].startswith('data/radar_hub/') and (name in r['path'] or name.replace('_','') in r['path']) and 'raw_' not in r['path']],'test_files':[r['path'] for r in inventory if r['path'].startswith('scripts/test') and name in r['path']]})
save('matriz-inicial.json',axis)
stores=[]
for p in BASE.glob('*evidence*.json'):
 try:
  store=read(p);es=store.get('evidences',store.get('evidence',[]));es=list(es.values()) if isinstance(es,dict) else es
  results=[];hashcache={}
  for e in es:
   if not isinstance(e,dict):continue
   raw=e.get('raw_reference') or e.get('raw_file');sha=e.get('sha256');raw=raw if isinstance(raw,str) else None
   if raw and raw not in hashcache:
    q=ROOT/raw;hashcache[raw]=hashlib.sha256(q.read_bytes()).hexdigest() if q.is_file() else None
   results.append({'evidence_id':e.get('evidence_id'),'raw':raw,'exists':bool(raw and hashcache.get(raw)),'sha_matches':bool(raw and sha and hashcache.get(raw)==sha),'has_locator':bool(e.get('locator') or e.get('evidence_excerpt')),'period':e.get('period'),'status':e.get('status')})
  stores.append({'file':p.name,'keys':list(store),'evidence_count':len(es),'results':results})
 except Exception as e:stores.append({'file':p.name,'error':str(e)})
save('evidencias-integridade.json',stores)
perf=[]
for name in ['data/radar_hub/radar_hub_package.json','radar_hub_controller.js','app.html']:
 b=(ROOT/name).read_bytes();start=time.perf_counter();gz=gzip.compress(b,compresslevel=6);elapsed=time.perf_counter()-start
 times=[]
 if name.endswith('.json'):
  for _ in range(3):
   t=time.perf_counter();json.loads(b);times.append(time.perf_counter()-t)
 perf.append({'file':name,'disk_bytes':len(b),'gzip6_bytes_simulated':len(gz),'gzip_seconds':elapsed,'python_parse_seconds':times,'network_transfer':'NÃO MEDIDO; gzip local não comprova compressão HTTP'})
save('performance-local.json',perf)
save('dependencias.json',{'html_scripts':re.findall(r'<script[^>]*src=["\x27]([^"\x27]+)',html),'controller_fetch_literals':re.findall(r'fetch\(["\x27]([^"\x27]+)',code),'canvas_ids':re.findall(r'<canvas[^>]*id=["\x27]([^"\x27]+)',html),'controller_functions':re.findall(r'(?:async\s+)?function\s+(\w+)\(',code),'geo_files':[r for r in inventory if r['path'].endswith(('.geojson','.shp'))]})
print(json.dumps({'consistency':read(OUT/'consistencia-inicial.json'),'axes':[{k:a[k] for k in ['eixo','indicator_count','statuses']} for a in axis],'stores':[{k:s.get(k) for k in ['file','evidence_count','error']} for s in stores],'performance':perf},ensure_ascii=False))
