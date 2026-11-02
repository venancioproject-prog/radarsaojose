import pathlib,json,re
p=pathlib.Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia/brutos')
print([x for x in re.findall('href="([^"]+)"',(p/'estimativas-diretorio.html').read_text(encoding='latin1')) if 'xls' in x or 'pdf' in x or 'ods' in x])
for name in ['sidra4711.json','sidra4712.json','sidra9515.json','sidra9922.json']:
 print(name,json.loads((p/name).read_text())[1:])
from pypdf import PdfReader
for name in ['mapa-setores.pdf','caderno-tecnico.pdf']:
 r=PdfReader(p/name);text='\n'.join('PAGE '+str(i+1)+'\n'+(x.extract_text() or '') for i,x in enumerate(r.pages));(p/(name+'.txt')).write_text(text,encoding='utf-8');print(name,len(r.pages),text[:1000])
