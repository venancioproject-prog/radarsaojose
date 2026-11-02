"""Inventário não destrutivo da consolidação; saída imutável por execução."""
from pathlib import Path
import hashlib, json, subprocess, datetime, zipfile, os
ROOT=Path(__file__).resolve().parent.parent
STAMP=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT=ROOT/'docs/dados-publicos-revisao/consolidacao-geral'/STAMP
OUT.mkdir(parents=True,exist_ok=False)
def git(*args):
 p=subprocess.run(['git',*args],cwd=ROOT,capture_output=True)
 return p.stdout.decode('utf8',errors='replace')
tracked=set(git('ls-files').splitlines())
ignored=set(git('ls-files','--others','--ignored','--exclude-standard').splitlines())
records=[]
excluded={'.git','node_modules','.venv','venv','__pycache__'}
for directory, dirs, files in os.walk(ROOT):
 dirs[:]=[d for d in dirs if d not in excluded and (Path(directory)/d)!=OUT]
 for name in files:
  p=Path(directory)/name; rel=p.relative_to(ROOT).as_posix()
  try:
   h=hashlib.sha256()
   with p.open('rb') as f:
    for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
   records.append({'path':rel,'bytes':p.stat().st_size,'sha256':h.hexdigest(),'mtime_utc':datetime.datetime.fromtimestamp(p.stat().st_mtime,datetime.timezone.utc).isoformat(),'tracked':rel in tracked,'ignored':rel in ignored})
  except OSError as e:records.append({'path':rel,'error':str(e)})
def save(name,data):(OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
save('inventario.json',{'captured_at_utc':STAMP,'excluded_dependency_directories':sorted(excluded),'files':records})
for name,args in {'status':['status','--short','--branch'],'branches':['branch','-avv'],'commits':['log','-40','--date=iso-strict','--format=%H %ad %s'],'diff':['diff','--binary'],'ignored':['ls-files','--others','--ignored','--exclude-standard'],'remotes':['remote','-v']}.items():(OUT/(name+'.txt')).write_text(git(*args),encoding='utf8')
with zipfile.ZipFile(OUT/'snapshot-canonico.zip','w',zipfile.ZIP_DEFLATED) as z:
 for r in records:
  rel=r['path']
  if rel in ['app.js','app.html','radar_hub_controller.js','.gitignore','server.js'] or (rel.startswith('data/radar_hub/') and '/' not in rel[len('data/radar_hub/'): ] and rel.endswith('.json')) or rel.startswith('scripts/'):
   z.write(ROOT/rel,rel)
save('snapshot-manifest.json',{'archive':'snapshot-canonico.zip','sha256':hashlib.sha256((OUT/'snapshot-canonico.zip').read_bytes()).hexdigest(),'purpose':'Estado inicial; não constitui homologação. Dados brutos mantidos no disco e inventariados com SHA256.'})
print(json.dumps({'output':str(OUT),'files':len(records),'bytes':sum(r.get('bytes',0) for r in records),'untracked_scripts':[r['path'] for r in records if r['path'].startswith('scripts/') and not r['tracked']]},ensure_ascii=False))
