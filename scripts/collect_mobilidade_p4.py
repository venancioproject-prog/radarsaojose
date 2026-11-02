"""P4: snapshot inicial e coleta primária com manifest; sem homologação."""
from pathlib import Path
import json,hashlib,datetime,subprocess,requests
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p4-mobilidade';RAW=BASE/'mobilidade_raw_2026-10-05'
OUT.mkdir(parents=True,exist_ok=True);RAW.mkdir(parents=True,exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def snapshot():
 if (OUT/'snapshot-inicial.json').exists():return
 gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json')
 files=[ROOT/'app.js',ROOT/'app.html',ROOT/'radar_hub_controller.js',ROOT/'economia_visual.js',ROOT/'financas_visual.js',*BASE.glob('*.json')]
 save(OUT/'snapshot-inicial.json',{'groundTruth':gt,'registry':reg,'hashes':{str(p.relative_to(ROOT)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}})
 for f in ['app.html','radar_hub_controller.js']:(OUT/(f+'.before')).write_bytes((ROOT/f).read_bytes())
 for n,args in [('status',['status','--short']),('stat',['diff','--stat']),('appjs',['diff','--','app.js'])]:(OUT/f'git-before-{n}.txt').write_bytes(subprocess.check_output(['git',*args],cwd=ROOT))
 indicators=[i for i in reg['indicators'] if i['category']=='mobilidade'];save(OUT/'inventario-inicial.json',{'indicators':indicators,'ground_truth':gt['eixos']['mobilidade']})
session=requests.Session();session.headers['User-Agent']='RadarSaoJose-P4-audit/1.0'
def fetch(name,url,params=None):
 log=RAW/'consultas.json';logs=read(log) if log.exists() else [];p=RAW/name
 if p.exists() and any(l.get('name')==name and l.get('status')=='OK' for l in logs):return p
 item={'name':name,'url':url,'parameters':params,'accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  r=session.get(url,params=params,timeout=55);p.write_bytes(r.content);item.update(http_status=r.status_code,final_url=r.url,content_type=r.headers.get('content-type'),raw_file=str(p.relative_to(ROOT)).replace('\\','/'),sha256=hashlib.sha256(r.content).hexdigest(),bytes=len(r.content),status='OK' if r.ok else 'ACCESS_FAILED',note='Validação de conteúdo pendente; HTTP200 não é prova de dataset.');print(name,r.status_code,len(r.content),flush=True)
 except Exception as e:item.update(status='ACCESS_FAILED',error=str(e));print(name,str(e)[:180],flush=True)
 logs.append(item);save(log,logs);return p if p.exists() else None
if __name__=='__main__':
 snapshot();i=read(OUT/'inventario-inicial.json');print(json.dumps(i,ensure_ascii=False,indent=2))
