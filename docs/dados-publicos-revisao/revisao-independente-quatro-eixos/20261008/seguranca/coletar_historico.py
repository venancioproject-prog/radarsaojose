from pathlib import Path
import subprocess,json,hashlib,datetime,urllib.parse,concurrent.futures
O=Path(__file__).parent
old=json.loads((O/'manifest.json').read_text(encoding='utf-8'))
def collect(y):
 p=O/f'mensal-{y}.json'; url='https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?'+urllib.parse.urlencode(dict(ano=y,grupoDelito=6,tipoGrupo='MUNICÍPIO',idGrupo=560))
 q=subprocess.run(['curl.exe','-L','--fail','--max-time','60','-sS',url,'-o',str(p)],capture_output=True)
 d=dict(name=f'mensal-{y}',url=url,retrieved_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=q.returncode,error=q.stderr.decode(errors='replace'))
 if p.exists():d.update(path=str(p),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size)
 return d
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as e: added=list(e.map(collect,range(2001,2023)))
(O/'manifest.json').write_text(json.dumps(old+added,ensure_ascii=False,indent=2),encoding='utf-8')
print([(a['name'],a['exit_code'],a.get('bytes')) for a in added])
