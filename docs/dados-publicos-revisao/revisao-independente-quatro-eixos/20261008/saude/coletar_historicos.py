from pathlib import Path
import re,json,subprocess,hashlib,datetime
from pypdf import PdfReader
OUT=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');RAW=OUT/'raw';m=json.loads((OUT/'manifest.json').read_text(encoding='utf-8'));catalog=(RAW/'catalogo.html').read_text(encoding='utf-8')
for url in re.findall(r'href="([^"]+)',catalog):
 match=re.search(r'RelatAnualGest_(20\d\d)_1_',url)
 if not match or not 2016<=int(match[1])<=2023:continue
 p=RAW/f'rag{match[1]}.pdf'
 if p.exists():continue
 c=subprocess.run(['curl.exe','-L','--max-time','35','-sS','-w','%{http_code}','-o',str(p),url],capture_output=True,text=True)
 r=dict(url=url,raw=str(p).replace('\\','/'),accessed_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),http_status=c.stdout,exit_code=c.returncode,error=c.stderr)
 if p.exists():r.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
 if p.exists() and p.read_bytes().startswith(b'%PDF'):
  pages=[dict(page=i+1,text=x.extract_text()) for i,x in enumerate(PdfReader(p).pages)]
  (OUT/(p.name+'.pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
 m.append(r);(OUT/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8');print(p.name,c.stdout,flush=True)
