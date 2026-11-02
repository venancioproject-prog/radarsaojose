"""P5 Educação: snapshot, coleta oficial e evidências reproduzíveis."""
from pathlib import Path
import json,hashlib,datetime,subprocess,requests
from html.parser import HTMLParser
from urllib.parse import urljoin
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p5-educacao';RAW=BASE/'educacao_raw_2026-10-08';DATE='2026-10-08'
OUT.mkdir(parents=True,exist_ok=True);RAW.mkdir(parents=True,exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
class Html(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.text=[];self.href=None;self.label=[]
 def handle_starttag(self,t,a):
  if t=='a':self.href=dict(a).get('href');self.label=[]
 def handle_data(self,d):
  self.text.append(d)
  if self.href is not None:self.label.append(d)
 def handle_endtag(self,t):
  if t=='a' and self.href is not None:self.links.append((self.href,' '.join(''.join(self.label).split())));self.href=None
def links(file):
 h=Html();h.feed((RAW/file).read_text(encoding='utf8'));return h.links
def snapshot():
 if (OUT/'snapshot-inicial.json').exists():return
 files=[ROOT/'app.js',ROOT/'app.html',ROOT/'radar_hub_controller.js',ROOT/'economia_visual.js',ROOT/'financas_visual.js',*BASE.glob('*.json')]
 gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json')
 save(OUT/'snapshot-inicial.json',{'date':DATE,'groundTruth':gt,'registry':reg,'hashes':{str(p.relative_to(ROOT)).replace('\\','/'):sha(p) for p in files}})
 save(OUT/'inventario-inicial.json',{'indicators':[i for i in reg['indicators'] if i['category']=='educacao'],'groundTruth':gt['eixos']['educacao']})
 for f in ['app.html','radar_hub_controller.js']:(OUT/(f+'.before')).write_bytes((ROOT/f).read_bytes())
 for name,args in [('status',['status','--short']),('stat',['diff','--stat']),('appjs',['diff','--','app.js'])]:(OUT/f'git-before-{name}.txt').write_bytes(subprocess.check_output(['git',*args],cwd=ROOT))
session=requests.Session();session.headers['User-Agent']='Mozilla/5.0 RadarSaoJose-P5-audit'
def fetch(name,url,params=None):
 log=RAW/'consultas.json';logs=read(log) if log.exists() else [];p=RAW/name
 if p.exists() and any(l['name']==name and l['status']=='OK' for l in logs):return p
 item={'name':name,'original_url':url,'parameters':params,'method':'GET','accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'round_date':DATE}
 try:
  r=session.get(url,params=params,timeout=60);p.write_bytes(r.content);item.update(http_status=r.status_code,final_url=r.url,content_type=r.headers.get('content-type'),bytes=len(r.content),raw_file=str(p.relative_to(ROOT)).replace('\\','/'),sha256=sha(p),status='OK' if r.ok else 'ACCESS_FAILED',note='HTTP200 não valida conteúdo ou universo; validação separada.');print(name,r.status_code,len(r.content),flush=True)
 except Exception as ex:item.update(status='ACCESS_FAILED',error=str(ex));print(name,str(ex)[:150],flush=True)
 logs.append(item);save(log,logs);return p if p.exists() else None
if __name__=='__main__':snapshot();print(json.dumps(read(OUT/'inventario-inicial.json'),ensure_ascii=False,indent=2))
