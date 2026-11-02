from pathlib import Path
from pypdf import PdfReader
import re,json,hashlib
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');manifest=json.loads((O/'manifest.json').read_text(encoding='utf-8'));records=[];tables=[]
for edition in range(2019,2026):
 p=O/'raw'/f'rag{edition}.pdf';reader=PdfReader(p)
 page=next(i for i,x in enumerate(reader.pages) if 'Número de nascidos vivos por residência da mãe.' in x.extract_text())
 texts=[x.extract_text(extraction_mode='layout') for x in reader.pages[page:page+5]];body='\n'.join(texts)
 (O/f'rag{edition}.body-layout.txt').write_text(body,encoding='utf-8')
 a=body.index('Número de nascidos vivos por residência da mãe.');b=body.index('3.3. Principais causas',a);c=body.index('3.4. Mortalidade',b)
 d=body.find('Análises e Considerações sobre Dados Demográficos',c)
 if d<0:d=body.find('Análises e Considerações',c)
 assert d>c,(edition,d)
 sections=[('sinasc',body[a:b]),('sih',body[b:c]),('sim',body[c:d])]
 src=next(m for m in manifest if m['raw']==str(p).replace('\\','/'))
 for family,txt in sections:
  lines=txt.splitlines();header=next(x for x in lines if ('Unidade Federação' if family=='sinasc' else 'Capítulo CID-10') in x)
  years=[int(x) for x in re.findall(r'\b20\d{2}\b',header)]
  valueline=next(x for x in lines if ('JOSE DOS CAMPOS' in x.upper() or 'José dos Campos' in x)) if family=='sinasc' else next(x for x in lines if x.strip().startswith('Total'))
  values=[int(x.replace('.','')) for x in re.findall(r'\d[\d.]*',valueline)]
  assert len(years)==len(values)>0,(edition,family,header,valueline)
  date=re.search(r'Data da consulta:\s*([\d/]+)',txt)
  for year,value in zip(years,values):records.append(dict(family=family,year=year,value=value,unit={'sinasc':'nascidos vivos','sih':'internações SUS','sim':'óbitos'}[family],scope={'sinasc':'residência mãe','sih':'residência paciente','sim':'residência falecido'}[family],edition=edition,source_url=src['url'],raw=src['raw'],sha256=src['sha256'],source_query_date=date[1] if date else None,pages=list(range(page+1,page+6)),native_header=header.strip(),native_total_row=valueline.strip()))
  if family!='sinasc':
   rows={}
   for line in lines:
    m=re.match(r'^\s*([IVX]+)\.\s*(.*?)\s{2,}([\d.\-\s]+)$',line)
    if m:
     vals=m[3].split();assert len(vals)==len(years),(edition,family,m[1],vals)
     rows[m[1]]=dict(label=m[2].strip(),values={str(y):None if v=='-' else int(v.replace('.','')) for y,v in zip(years,vals)})
   assert len(rows)>=20,(edition,family,len(rows))
   for year,total in zip(years,values):assert sum(r['values'][str(year)] for r in rows.values() if r['values'][str(year)] is not None)==total,(edition,family,year)
   tables.append(dict(family=family,edition=edition,years=years,rows=rows,totals=dict(zip(map(str,years),values)),source=src,source_query_date=date[1] if date else None))
(O/'historicos-rag-todas-edicoes.json').write_text(json.dumps(dict(observations=records,tables=tables),ensure_ascii=False,indent=2),encoding='utf-8')
chosen={}
for r in records:chosen[(r['family'],r['year'])]=r
(O/'historicos-rag-proposta.json').write_text(json.dumps(list(chosen.values()),ensure_ascii=False,indent=2),encoding='utf-8')
changes=[]
for key,rec in chosen.items():
 versions=[r for r in records if (r['family'],r['year'])==key]
 if len({r['value'] for r in versions})>1:changes.append(dict(family=key[0],year=key[1],versions=versions,rationale='Mesmo escopo de residência e variável. Revisão documental de base publicada em consultas distintas; preservar todas edições e usar consulta documentada no RAG2025 quando presente, sem média/interpolação.'))
(O/'quebras-revisoes-rag.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2),encoding='utf-8')
print({f:{y:r['value'] for (fam,y),r in chosen.items() if fam==f} for f in ['sinasc','sih','sim']});print('revisions',len(changes),'observations',len(records))
