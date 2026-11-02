from pathlib import Path
import json,hashlib
from openpyxl import load_workbook
P=Path(__file__).parent
M=json.loads((P/'manifest.json').read_text(encoding='utf-8'))
checks=[]
def check(n,v):
 checks.append({'check':n,'pass':bool(v)})
 if not v:raise AssertionError(n)
for x in M:
 f=Path(x['file']);check('hash '+f.name,hashlib.sha256(f.read_bytes()).hexdigest()==x['sha256']);check('HTTP '+f.name,x['http_status']==200)
months=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
def row(file,id):
 d=json.loads((P/'raw'/file).read_text(encoding='utf-8'))['data'][0]['listaDados'];return next(r for r in d if r['idDelito']==id)
for file,id,total in [('ssp2024.json',37,143),('ssp2024.json',22,724),('ssp-produtividade2024.json',88,2170),('ssp2024.json',38,23),('ssp2025.json',38,29),('ssp2025.json',41,33)]:
 r=row(file,id);check(f'{file} id{id}: total e soma',r['publicado']==12 and r['total']==total and sum(r[m] for m in months)==total)
check('roubo outros inclui carga/banco',row('ssp2024.json',30)['total']==sum(row('ssp2024.json',i)['total'] for i in [133,46,49]))
d=json.loads((P/'raw/sidra6579.json').read_text(encoding='utf-8'))[1:]
for year,value in [(2024,724756),(2026,729153)]:check('estimativa '+str(year),any(r['D1C']=='3549904' and r['D3C']==str(year) and int(r['V'])==value for r in d))
a=json.loads((P/'raw/sidra9923.json').read_text(encoding='utf-8'))[1:];a={r['D4C']:int(r['V']) for r in a}
check('particao urbano rural',a['1']+a['2']==a['6795']==697054);check('taxa urbana',round(a['1']/a['6795']*100,2)==98.72)
w=load_workbook(P/'raw/estimativas2026.xlsx',read_only=True,data_only=True)
hits=[]
for s in w:
 for cells in s.iter_rows(values_only=True):
  if any('São José dos Campos'==str(c).strip() for c in cells):hits.append((s.title,cells))
check('XLSX 2026 municipio e populacao',any(any(str(c)=='729153' for c in row) for _,row in hits))
(P/'testes-independentes.json').write_text(json.dumps({'checks':checks,'xlsx_rows':hits,'count':len(checks)},ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(len(checks),'PASS')
