from pathlib import Path
import subprocess,json,hashlib,datetime
from pypdf import PdfReader
OUT=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude'); RAW=OUT/'raw';RAW.mkdir(exist_ok=True)
base='https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/'
sources={'q2025.pdf':base+'Quadri_3_2025_1_20260227124829.pdf','rag2025.pdf':base+'RelatAnualGest_2025_1_20260630122107.pdf','q2024.pdf':base+'Quadri_3_2024_1_20250228153444.pdf','rag2024.pdf':base+'RelatAnualGest_2024_1_20260630122038.pdf','catalogo.html':'https://servicos.sjc.sp.gov.br/portal_da_transparencia/relatorio_anual_gestao.aspx','cnes-leitos-202412.html':'https://cnes2.datasus.gov.br/Mod_Ind_Tipo_Leito.asp?VEstado=35&VMun=354990&VComp=202412','retrospectiva.html':'https://www.sjc.sp.gov.br/noticias/2025/dezembro/23/retrospectiva-2025-joseense-ganha-mais-cuidados-com-a-saude/','dengue2019.html':'https://www.sjc.sp.gov.br/noticias/2019/janeiro/9/com-acoes-de-prevencao-casos-de-dengue-caem-quase-pela-metade-em-sao-jose/'}
m=json.loads((OUT/'manifest.json').read_text(encoding='utf-8')) if (OUT/'manifest.json').exists() else []
for name,url in sources.items():
 p=RAW/name
 if p.exists():continue
 c=subprocess.run(['curl.exe','-L','--max-time','35','-sS','-w','%{http_code}','-o',str(p),url],capture_output=True,text=True)
 r=dict(url=url,raw=str(p).replace('\\','/'),accessed_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),http_status=c.stdout,exit_code=c.returncode,error=c.stderr)
 if p.exists():r.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
 if p.exists() and name.endswith('.pdf') and p.read_bytes().startswith(b'%PDF'):
  pages=[dict(page=i+1,text=x.extract_text(extraction_mode='layout')) for i,x in enumerate(PdfReader(p).pages)]
  (OUT/(name+'.pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
 m.append(r);print(name,c.stdout,c.returncode,flush=True)
 (OUT/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8')
