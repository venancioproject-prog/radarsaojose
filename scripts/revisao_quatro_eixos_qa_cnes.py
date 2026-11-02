from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import parse_qs,urlparse
import json,hashlib,re
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008';p=BASE/'saude/raw/cnes-leitos-202412.html'
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.rows=[];self.current=[];self.cell=None;self.href=None;self.options=[];self.option=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='tr':self.current=[];self.href=None
  if tag=='td':self.cell=[]
  if tag=='a' and 'VCod_Leito=' in a.get('href',''):self.href=a['href']
  if tag=='option' and 'selected' in a:self.option=[a.get('value'),[]]
 def handle_data(self,data):
  if self.cell is not None:self.cell.append(data)
  if self.option is not None:self.option[1].append(data)
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.current.append(' '.join(''.join(self.cell).split()));self.cell=None
  if tag=='tr':self.rows.append((self.href,self.current));self.current=[];self.href=None
  if tag=='option' and self.option is not None:self.options.append([self.option[0],' '.join(''.join(self.option[1]).split())]);self.option=None
parser=Parser();raw=p.read_bytes();parser.feed(raw.decode('latin1'))
assert ['35','SAO PAULO'] in parser.options and ['354990','SAO JOSE DOS CAMPOS'] in parser.options and ['202412','12/2024'] in parser.options
out=[];label=None
for href,cells in parser.rows:
 if 'Habilitados' in cells:label='HABILITADOS'
 elif 'SUS' in [c.upper() for c in cells]:label='SUS'
 if href:
  q=parse_qs(urlparse(href).query)
  assert q['VEstado']==['35'] and q['VMun']==['354990'] and q['VComp']==['202412']
  assert len(cells)==4 and cells[0]==q['VCod_Leito'][0] and cells[2].isdigit() and cells[3].isdigit(), (href,cells)
  out.append(dict(code=q['VCod_Leito'][0],description=cells[1],existing=int(cells[2]),second_column=int(cells[3]),second_column_label=label,type=q['VTipo_Leito'][0]))
producer=json.loads((BASE/'saude/cnes-extracao.json').read_text(encoding='utf8'))['rows'];assert len(out)==len(producer)==52
checks=[]
for row in out:
 match=next(r for r in producer if r['code']==row['code'])
 for field in ['description','existing','second_column','second_column_label']:
  assert row[field]==(match[field].upper() if field=='second_column_label' else match[field]),(row,field,match)
  checks.append(dict(code=row['code'],field=field,actual=row[field],pass_=True))
assert {r['second_column_label'] for r in out if r['type']=='3'}=={'HABILITADOS'}
assert {r['second_column_label'] for r in out if r['type']!='3'}=={'SUS'}
assert sum(r['existing'] for r in out if r['type']!='3')==1569
assert sum(r['existing'] for r in out if r['type']=='3')==352
result=dict(status='PASS',checks_count=len(checks)+5,checks=checks,rows=out,sha256=hashlib.sha256(raw).hexdigest(),decision='APROVAR apenas códigos individuais existentes por local do estabelecimento e competência202412. Coluna complementar HABILITADOS não é SUS; nenhum total geral/SUS/UTI ou número de estabelecimentos promovido; nove KPI Saúde suspensos permanecem null.')
(BASE/'qa/validacao-cnes.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({k:result[k] for k in ['status','checks_count','decision']},ensure_ascii=False))
