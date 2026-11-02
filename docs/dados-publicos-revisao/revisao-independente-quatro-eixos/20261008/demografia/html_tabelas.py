from html.parser import HTMLParser
from pathlib import Path
import json
class P(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None
 def handle_starttag(self,t,a):
  if t=='table':self.table=[]
  elif t=='tr' and self.table is not None:self.row=[]
  elif t in ('td','th') and self.row is not None:self.cell=''
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
 def handle_endtag(self,t):
  if t in ('td','th') and self.cell is not None:self.row.append(self.cell.strip());self.cell=None
  elif t=='tr' and self.row is not None:self.table.append(self.row);self.row=None
  elif t=='table' and self.table is not None:self.tables.append(self.table);self.table=None
p=Path(__file__).parent;q=P();q.feed((p/'brutos/municipal-populacao.html').read_text());(p/'tabelas-municipais.json').write_text(json.dumps(q.tables,ensure_ascii=False,indent=2),encoding='utf-8')
print([(i,len(t),t[:2]) for i,t in enumerate(q.tables)])
