from collect_mobilidade_p4 import *
import re,html
from urllib.parse import urljoin
from html.parser import HTMLParser
def links(file):
 class Anchors(HTMLParser):
  def __init__(self):super().__init__();self.out=[];self.href=None;self.label=[]
  def handle_starttag(self,tag,attrs):
   if tag=='a':self.href=dict(attrs).get('href');self.label=[]
  def handle_data(self,data):
   if self.href is not None:self.label.append(data)
  def handle_endtag(self,tag):
   if tag=='a' and self.href is not None:self.out.append((self.href,''.join(self.label).strip()));self.href=None
 parser=Anchors();parser.feed((RAW/file).read_text(encoding='utf8'));return parser.out
if __name__=='__main__':
 for file in ['ibge-frota-metadados.json','ibge-frota-total.json']:print(file,read(RAW/file))
 for file in ['transporte-operacionais.html','transporte-documentos.html','senatran-indice.html','infosiga.html']:
  print('\nLINKS',file,[(a,b) for a,b in links(file) if any(x in a.lower() for x in ['.pdf','.xls','.zip','.csv','frota-de-veiculos','dados','download','aberto'])])
 print('INFOSIGA SCRIPTS',re.findall(r'<script[^>]*src="([^"]+)"',(RAW/'infosiga.html').read_text(encoding='utf8')))
