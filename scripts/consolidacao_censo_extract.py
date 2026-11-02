"""Recorte de todas as tabelas municipais da sinopse oficial 2023."""
from pathlib import Path
import json,zipfile,io,hashlib
from python_calamine import CalamineWorkbook
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
p=OUT/'fontes-externas/sinopse2023.zip';z=zipfile.ZipFile(p);member=next(n for n in z.namelist() if n.endswith('.xlsx'));b=z.read(member);w=CalamineWorkbook.from_filelike(io.BytesIO(b));sha=hashlib.sha256(p.read_bytes()).hexdigest();msha=hashlib.sha256(b).hexdigest();tables=[]
for name in w.sheet_names:
 rows=w.get_sheet_by_name(name).to_python();selected=[{'row':i+1,'values':r} for i,r in enumerate(rows) if 3549904 in r[:4]]
 if not selected:continue
 tables.append({'sheet':name,'headers':rows[:11],'rows':selected,'notes':[r for r in rows[-45:] if any(isinstance(c,str) and (c.strip().startswith(('Fonte:','Notas:','Nota:','1 ','1-','1.')) or 'contabilizado' in c.lower()) for c in r)],'raw_reference':p.relative_to(ROOT).as_posix(),'sha256':sha,'member':member,'member_sha256':msha,'source_url':'https://download.inep.gov.br/dados_abertos/sinopses_estatisticas/sinopse_estatistica_censo_escolar_2023.zip','period':2023,'territory':'Município da escola: São José dos Campos/SP, 3549904; não residência do aluno'})
(OUT/'censo2023-recorte-municipal.json').write_text(json.dumps({'homologated':False,'tables':tables},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Tabelas municipais extraídas',len(tables))
