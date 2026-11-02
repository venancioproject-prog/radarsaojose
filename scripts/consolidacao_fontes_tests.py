"""Reprodução independente das novas células externas, sem alterar dados ativos."""
from pathlib import Path
import json,hashlib,zipfile,io,re,runpy
from python_calamine import CalamineWorkbook
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
checks=[];cache={}
def check(name,ok):
 assert ok,name
 checks.append(name)
def workbook(e):
 key=e['raw_reference']
 if key not in cache:
  p=ROOT/key;z=zipfile.ZipFile(p);b=z.read(e['member'])
  check('SHA bruto '+key,hashlib.sha256(p.read_bytes()).hexdigest()==e['sha256'])
  check('SHA planilha '+key,hashlib.sha256(b).hexdigest()==e['member_sha256'])
  cache[key]=CalamineWorkbook.from_filelike(io.BytesIO(b))
 return cache[key]
edu=read(OUT/'educacao-inep-reproduzida.json')
rows_cache={}
for e in edu['evidences']:
 w=workbook(e);key=(e['raw_reference'],e['sheet'])
 if key not in rows_cache:rows_cache[key]=w.get_sheet_by_name(e['sheet']).to_python()
 rows=rows_cache[key];row=rows[e['row']-1]
 check(e['evidence_id']+' célula',row[e['column']-1]==e['raw_value'])
 check(e['evidence_id']+' município/rede',row[1]==3549904 and row[3]==e['network'])
 check(e['evidence_id']+' coluna',rows[e['header_row']-1][e['column']-1]==e['native_variable'])
 raw=e['raw_value'];v=float(raw.replace(',','.')) if isinstance(raw,str) and re.fullmatch(r'\d+(?:,\d+)?',raw) else raw if isinstance(raw,(int,float)) else None
 check(e['evidence_id']+' normalização sem preencher lacuna',v==e['value'])
censo=read(OUT/'censo2023-recorte-municipal.json')
for t in censo['tables']:
 rows=workbook(t).get_sheet_by_name(t['sheet']).to_python()
 check('Censo cabeçalhos '+t['sheet'],rows[:11]==t['headers'])
 for r in t['rows']:check('Censo linha '+t['sheet']+str(r['row']),rows[r['row']-1]==r['values'] and 3549904 in r['values'][:4])
reg=read(ROOT/'data/radar_hub/sjc_metadata_registry.json')['indicators']
for i in reg:
 if i['category']!='demografia' or i['value'] is None:continue
 e=i['evidencia'];r=e['locator']['native_record'];native=read(ROOT/e['raw_file'])
 check('IBGE registro '+i['indicator_id'],r in native and float(r['V'])==i['value'] and r['D1C']=='3549904')
gt=read(ROOT/'data/radar_hub/sjc_open_data_ground_truth.json')['eixos']
ssp=read(OUT/'fontes-externas/ssp-ocorrencias.json')['data'];mapping=read(OUT/'fontes-externas/ssp-municipios-todos.json')
records=mapping['data'] if isinstance(mapping,dict) else mapping
check('SSP identificação territorial 560',any('São José dos Campos' in str(r) and '560' in str(r) for r in records))
check('SSP 25 anos publicados',sorted(r['ano'] for r in ssp)==list(range(2001,2026)))
for row in gt['seguranca']['taxa_homicidios_dolosos_serie']:
 native=next(r for r in ssp if r['ano']==row['ano'])
 count=row.get('ocorrencias',row.get('homicidios_dolosos'))
 check('SSP ocorrências '+str(row['ano']),count==native['homicidio'] and row.get('vitimas') is None)
ns=runpy.run_path(str(ROOT/'scripts/saude_documental_20261002.py'))
layout=ns['layout'].split('3.4. Mortalidade por grupos de causas')[-1].split('Análises e Considerações sobre Dados Demográficos')[0]
for line in layout.splitlines():
 m=re.match(r'^\s*([IVX]+)\.\s*(.*?)\s{2,}([\d.\-\s]+)$',line)
 if not m:continue
 for year,raw in zip([2021,2022,2023,2024],m[3].split()):
  check('SIM célula '+m[1]+' '+str(year),ns['sim'][m[1]]['valores'][str(year)]==(None if raw=='-' else int(raw.replace('.',''))))
pdf=PdfReader(OUT/'fontes-externas/saude-rag2025.pdf')
text='\n'.join(pdf.pages[n].extract_text() for n in [5,6])
for token in ['7.463','38.738','41.846','5.028']:check('RAG PDF total publicado '+token,token in text)
q=PdfReader(OUT/'fontes-externas/saude-q2025.pdf');qtext=q.pages[25].extract_text()
for token in ['8,2','7,65']:check('SMS PDF taxa publicada '+token,token in qtext)
check('Saúde sinal de ausência preservado',all(v is None or isinstance(v,int) for r in ns['sim'].values() for v in r['valores'].values()))
check('Saúde nascidos vivos por residência',ns['s']['nascidos_vivos_sinasc']['total_2024']==gt['saude']['nascidos_vivos_sinasc']['total_2024']==7463)
check('Saúde total SIH publicado',ns['total_sih'][2024]==38738 and ns['total_sih'][2025]==41846)
overlay=read(ROOT/'data/radar_hub/mobilidade_reconciliation_20261008.json')
check('Mobilidade corte temporal',all(r['value'] is None for r in gt['mobilidade']['series_auditadas']['transporte_bilhetagem'] if '2026-08'<r['period']<'2027'))
result={'status':'PASS','checks_count':len(checks),'checks':checks,'ideb_cells':len(edu['evidences']),'censo_tables':len(censo['tables']),'note':'Reprodução das novas fontes; P1–P3 têm suite independente. Não é homologação.'}
(OUT/'testes-fontes-novas.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS',len(checks),'verificações externas novas')
