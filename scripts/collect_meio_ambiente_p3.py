"""Coleta primária P3 com arquivo bruto, consulta e hash, sem imagens."""
from pathlib import Path
import json,hashlib,datetime,subprocess,csv,requests
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p3-meio-ambiente';RAW=BASE/'meio_ambiente_raw_2026-10-05'
OUT.mkdir(parents=True,exist_ok=True);RAW.mkdir(parents=True,exist_ok=True)
LOG=RAW/'consultas.json';session=requests.Session();session.headers['User-Agent']='RadarSaoJose-P3-audit/1.0'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def snapshot():
    if (OUT/'snapshot-inicial.json').exists():return
    g=read(BASE/'sjc_open_data_ground_truth.json');r=read(BASE/'sjc_metadata_registry.json')
    hashes={str(p.relative_to(ROOT)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'app.js',ROOT/'economia_visual.js',ROOT/'financas_visual.js',*BASE.glob('*.json')]}
    snap={'groundTruth':g,'registry':r,'hashes':hashes};(OUT/'snapshot-inicial.json').write_text(json.dumps(snap,ensure_ascii=False,indent=2),encoding='utf8')
    for f in ['app.html','radar_hub_controller.js']:(OUT/(f+'.before')).write_bytes((ROOT/f).read_bytes())
    for n,args in [('status',['status','--short']),('stat',['diff','--stat']),('appjs',['diff','--','app.js'])]:(OUT/f'git-before-{n}.txt').write_bytes(subprocess.check_output(['git',*args],cwd=ROOT))
    indicators=[i for i in r['indicators'] if i['category']=='meio_ambiente'];(OUT/'inventario-inicial.json').write_text(json.dumps({'indicators':indicators,'ground_truth':g['eixos']['meio_ambiente']},ensure_ascii=False,indent=2),encoding='utf8')
def fetch(name,url):
    logs=read(LOG) if LOG.exists() else []
    p=RAW/name
    if p.exists() and any(l.get('raw_file')==str(p.relative_to(ROOT)).replace('\\','/') and l.get('status')=='OK' for l in logs):return p
    item={'name':name,'url':url,'accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        response=session.get(url,timeout=80);item.update(http_status=response.status_code,final_url=response.url,content_type=response.headers.get('content-type'))
        p.write_bytes(response.content);item.update(raw_file=str(p.relative_to(ROOT)).replace('\\','/'),sha256=hashlib.sha256(response.content).hexdigest(),bytes=len(response.content),status='OK' if response.ok else 'ACCESS_FAILED')
        print(name,response.status_code,len(response.content),flush=True)
    except Exception as e:item.update(status='ACCESS_FAILED',error=str(e));print(name,str(e)[:150],flush=True)
    logs.append(item);LOG.write_text(json.dumps(logs,ensure_ascii=False,indent=2),encoding='utf8');return p if p.exists() else None
if __name__=='__main__':snapshot()
