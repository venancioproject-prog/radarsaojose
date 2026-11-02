"""Independent QA: XML XLSX, native CSV/JSON and PDF text; never writes canonical data."""
from pathlib import Path
import json, hashlib, zipfile, io, re, csv, xml.etree.ElementTree as ET
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008'
OUT=BASE/'qa';OUT.mkdir(exist_ok=True)
checks=[];decisions=[];books={}
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ck(axis,label,actual,expected):
 ok=actual==expected;checks.append(dict(axis=axis,check=label,actual=actual,expected=expected,pass_=ok))
 if not ok:raise AssertionError((axis,label,actual,expected))
def book(e):
 path=ROOT/e['raw_reference'];key=str(path)
 if key not in books:
  raw=path.read_bytes();ck('educacao','zip hash '+path.name,hashlib.sha256(raw).hexdigest(),e['sha256'])
  outer=zipfile.ZipFile(io.BytesIO(raw));member=e.get('member') or next(x for x in outer.namelist() if x.endswith('.xlsx'));b=outer.read(member)
  if e.get('member_sha256'):ck('educacao','member hash '+path.name,hashlib.sha256(b).hexdigest(),e['member_sha256'])
  z=zipfile.ZipFile(io.BytesIO(b));ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
  strings=[]
  if 'xl/sharedStrings.xml' in z.namelist():
   for _,el in ET.iterparse(z.open('xl/sharedStrings.xml'),events=['end']):
    if el.tag.endswith('}si'):strings.append(''.join(t.text or '' for t in el.iter() if t.tag.endswith('}t')));el.clear()
  rels={x.attrib['Id']:x.attrib['Target'].lstrip('/') for x in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
  sheets={x.attrib['name']:rels[x.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']] for x in ET.fromstring(z.read('xl/workbook.xml')).find('s:sheets',ns)}
  sheets={k:v if v.startswith('xl/') else 'xl/'+v for k,v in sheets.items()};books[key]=(z,strings,sheets,{})
 return books[key]
def cells(e,needed):
 z,strings,sheets,cache=book(e);sheet=e['sheet']
 if sheet not in cache:
  result={}
  for _,row in ET.iterparse(z.open(sheets[sheet]),events=['end']):
   if not row.tag.endswith('}row'):continue
   n=int(row.attrib['r'])
   if n in needed:
    for c in row:
     ref=c.attrib['r'];letters=re.match('[A-Z]+',ref)[0];col=0
     for x in letters:col=col*26+ord(x)-64
     v=next((x.text for x in c if x.tag.endswith('}v')),None)
     if c.attrib.get('t')=='s':v=strings[int(v)] if v is not None else None
     elif c.attrib.get('t')=='inlineStr':v=''.join(x.text or '' for x in c.iter() if x.tag.endswith('}t'))
     elif v is not None:
      try:v=float(v)
      except ValueError:pass
     result[n,col]=v
   row.clear()
  cache[sheet]=result
 return cache[sheet]
ideb=load(BASE/'educacao/matriz-evidencias.json')['ideb'];props=load(BASE/'educacao/propostas.json');ev=ideb+props['evidences'];groups={}
for e in ev:groups.setdefault((e['raw_reference'],e['sheet']),[]).append(e)
for _,es in groups.items():
 rows={e['row'] for e in es};data=cells(es[0],rows)
 for e in es:ck('educacao',e['evidence_id'],data.get((e['row'],e['column'])),e['raw_value'])
for year in [2023,2024,2025]:
 rec=next(x for x in load(BASE/'educacao/ampliacao-censo2023-2025.json')['series'] if x['year']==year)
 ck('educacao','networks '+str(year),sum(x['value'] for x in rec['redes']),{2023:163965,2024:161959,2025:156378}[year])
 if year==2023:
  e=next(e for e in rec['matriculas'] if e['field']=='educacao_profissional_total');data=cells(e,{e['row']});ck('educacao','profissional total2023',data[e['row'],16],7322)
  ck('educacao','profissional tecnico2023',data[e['row'],17],7316)
decisions.append(dict(axis='educacao',decision='APROVAR',scope='Células IDEB, Censo2023–25 e taxas2025 reproduzidas por XML XLSX independente; 7322 profissional total versus7316 técnico são variáveis distintas; preservar rótulos e unidades.'))
# Re-extract published RAG sections from PDF, independently locate headings and totals.
observations=load(BASE/'saude/historicos-rag-proposta.json');pdftexts={}
for r in observations:
 p=ROOT/r['raw']
 if str(p) not in pdftexts:
  ck('saude','PDF hash '+p.name,hashlib.sha256(p.read_bytes()).hexdigest(),r['sha256']);pdftexts[str(p)]='\n'.join(x.extract_text(extraction_mode='layout') for x in PdfReader(p).pages)
 text=pdftexts[str(p)];marker={'sinasc':'Número de nascidos vivos por residência da mãe.','sih':'3.3. Principais causas','sim':'3.4. Mortalidade'}[r['family']]
 anchor=text.index('Número de nascidos vivos por residência da mãe.');start=text.index(marker,anchor);end=text.find({'sinasc':'3.3. Principais causas','sih':'3.4. Mortalidade','sim':'Análises e Considerações'}[r['family']],start+len(marker));section=text[start:end if end>start else start+22000]
 lines=section.splitlines();head=next(x for x in lines if ('Unidade Federação' if r['family']=='sinasc' else 'Capítulo CID-10') in x);years=list(map(int,re.findall(r'\b20\d{2}\b',head)))
 row=next(x for x in lines if ('José dos Campos' in x or 'JOSE DOS CAMPOS' in x)) if r['family']=='sinasc' else next(x for x in lines if x.strip().startswith('Total'))
 vals=[int(x.replace('.','')) for x in re.findall(r'\d[\d.]*',row)];ck('saude',r['family']+str(r['year']),dict(zip(years,vals))[r['year']],r['value'])
for r in load(BASE/'saude/dengue-cve-extracao.json'):
 p=ROOT/r['raw'];raw=p.read_bytes();ck('saude','CVE hash '+str(r['year']),hashlib.sha256(raw).hexdigest(),r['sha256'])
 if zipfile.is_zipfile(io.BytesIO(raw)):raw=zipfile.ZipFile(io.BytesIO(raw)).read(r['zip_member'])
 rows=list(csv.reader(io.StringIO(raw.decode('latin1')),delimiter=';'));row=rows[r['csv_row']-1];j=r['municipality_column']-1
 ck('saude','CVE identity '+str(r['year']),'José dos Campos' in row[j] or 'Jose dos Campos' in row[j],True)
 nums=[int(v.replace('.','').strip()) if v.strip() else None for v in row[j+1:j+40]]
 for col in range(3):ck('saude','CVE month sum '+str(r['year'])+':'+str(col),sum(nums[col:36:3]),nums[36+col])
 ck('saude','CVE confirmed '+str(r['year']),nums[37]+nums[38],r['total_confirmed'])
decisions.append(dict(axis='saude',decision='APROVAR_COM_LIMITES',scope='31 observações RAG e CVE anual/mensal reproduzidas; CVE não substitui recortes SMS SE1–50. Nove escalares suspensos permanecem null; CNES não promovido.'))
months=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];sec=BASE/'seguranca';annual={int(x['ano']):x for x in load(sec/'ocorrencias.json')['data']};conflicts=[]
for year in range(2001,2027):
 native=load(sec/f'mensal-{year}.json');rows={r['idDelito']:r for group in native['data'] for r in group['listaDados']}
 for id,r in rows.items():
  p=r['publicado'];ck('seguranca',f'publication bounds {year}:{id}',0<=p<=12,True)
  if p>0:ck('seguranca',f'published sum {year}:{id}',sum(r[m] for m in months[:p]),r['total'])
 for name,ids in [('homicidio',[38]),('roubo',[30]),('furto',[21]),('frv',[37,22])]:
  if year in annual and annual[year][name]!=sum(rows[i]['total'] for i in ids):conflicts.append((year,name))
 if year==2025:ck('seguranca','2025 occurrence/victim',[rows[38]['total'],rows[41]['total']],[29,33])
 if year==2024:ck('seguranca','vehicles2024',[rows[37]['total'],rows[22]['total']],[143,724]);ck('seguranca','robbery universe2024',rows[30]['total'],sum(rows[i]['total'] for i in [133,46,49]))
 if year==2026:ck('seguranca','2026 cut',sorted(set(r['publicado'] for r in rows.values())),[8])
pr={r['idDelito']:r for g in load(sec/'produtividade-2024.json')['data'] for r in g['listaDados']};ck('seguranca','native prisões',[pr[88]['total'],pr[86]['total']+pr[87]['total']],[2170,2531]);ck('seguranca','2001 conflicts',conflicts,[(2001,'homicidio'),(2001,'roubo'),(2001,'furto'),(2001,'frv')])
decisions.append(dict(axis='seguranca',decision='APROVAR_COM_LIMITES',scope='Promover143 roubos/724 furtos de veículos e2170 prisões2024. Vítimas2025=33, ocorrências=29. Quatro divergências2001 devem ficar explícitas; nenhum total de API não publicado vira dado mensal.'))
demo=BASE/'demografia';raw=demo/'brutos';series=load(raw/'sidra6579.json')[1:];est={int(r['D3C']):int(r['V']) for r in series};ck('demografia','2024/2026 estimates',[est[2024],est[2026]],[724756,729153]);ck('demografia','estimation rows',len(series),22)
rs=load(raw/'sidra9514-quinquenal-correto.json')[1:];groups={}
for r in rs:groups.setdefault(r['D4C'],{})[r['D5C']]=int(r['V'])
for sex,vals in groups.items():ck('demografia','age sum sex'+sex,sum(v for k,v in vals.items() if k!='100362'),vals['100362'])
for age,v in groups['6794'].items():ck('demografia','sex add age'+age,groups['4'][age]+groups['5'][age],v)
urban={r['D4C']:int(r['V']) for r in load(raw/'sidra9923.json')[1:]};ck('demografia','native urban/rural',[urban['1'],urban['2'],urban['6795']],[688155,8899,697054]);ck('demografia','urban rate',round(urban['1']/urban['6795']*100,2),98.72)
decisions.append(dict(axis='demografia',decision='APROVAR_COM_LIMITES',scope='Estimativas2024/2026, taxa98.72 e pirâmide21faixas aprovadas. Nenhum vínculo dos35polígonos comprovado; mapa e atributos populacionais permanecem suspensos.'))
# Re-hash every manifest, including preserved unsuccessful requests as evidence of limitations.
for axis in ['seguranca','saude','demografia']:
 for r in load(BASE/axis/'manifest.json'):
  path=r.get('path') or r.get('raw') or r.get('file')
  if path and r.get('sha256'):ck(axis,'manifest hash '+Path(path).name,hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),r['sha256'])
out=dict(status='PASS',parser='Independent XLSX OOXML XML; native CSV/JSON; PDF text. No producer script executed.',checks_count=len(checks),checks=checks,decisions=decisions,limitations=['Primary archives independently parsed; live re-download of every national archive not performed.','CNES nine suspended scalar definitions not approved.','No screenshots or deployment.'])
(OUT/'validacao-evidencias.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(dict(status='PASS',checks=len(checks),decisions=decisions),ensure_ascii=False))
