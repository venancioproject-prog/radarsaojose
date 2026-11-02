from pathlib import Path
import json,hashlib,re
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008'
qa=json.loads((BASE/'qa/validacao-evidencias.json').read_text(encoding='utf8'))
p=BASE/'saude/raw/q2025.pdf';r=PdfReader(p)
t24=r.pages[23].extract_text(extraction_mode='layout');t26=r.pages[25].extract_text(extraction_mode='layout')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='1f0d0893f7b5cb9feafbcecbc9e9830b97191a3f1d1adee9ece218b3b0f1f9b6'
assert 'Cobertura populacional estimada pelas' in t24 and 'equipes de Atenção Primária' in t24
aps=next(x for x in t24.splitlines() if 'Cobertura populacional estimada pelas' in x)
assert re.findall(r'\d+,\d+',aps)==['61,63','57,95','57,95']
mort=next(x for x in t26.splitlines() if 'Taxa de mortalidade infantil Resultado SP' in x)
assert re.findall(r'\d+,\d+',mort)==['9,66','6,77','7,65']
assert 'Resultado 2025' in t24 and 'Resultado 2025' in t26
checks=[{'check':'SMS APS annual2025 page24, distinct quarterly columns','pass_':True,'value':57.95},{'check':'SMS mortality annual2025 page26, distinct quarterly columns','pass_':True,'value':7.65}]
for family,year,value in [('sih',2025,41846),('sim',2024,5028)]:
 assert any(c['axis']=='saude' and c['check']==family+str(year) and c['actual']==value and c['pass_'] for c in qa['checks'])
 checks.append({'check':family+str(year)+' independent RAG QA already reproduced','pass_':True,'value':value})
out={'status':'PASS','checks':checks,'decision':'APROVAR COM LIMITES: atualizar os cinco IDs existentes para competências publicadas; APS é cobertura populacional estimada das equipes APS, não ESF; mortalidade é taxa publicada preliminar, sem inferir numerador/denominador; preservar recortes antigos datados e nove suspensões.','raw':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pages':[24,26]}
(BASE/'qa/validacao-refresh-saude.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(out,ensure_ascii=False))
