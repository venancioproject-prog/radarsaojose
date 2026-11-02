"""Reprodução das observações P4 a partir de arquivos externos preservados."""
from mobilidade_evidence_core import *
from build_mobilidade_fleet import members,read_sheets
from pypdf import PdfReader
from functools import lru_cache
import collections,csv,re,subprocess

@lru_cache(maxsize=4)
def workbook(file,member):
 p=ROOT/file
 if p.suffix=='.rar':data=subprocess.check_output(['tar','-xOf',str(p),member])
 elif p.suffix=='.zip':data=next(d for n,d in members(p.read_bytes()) if n==member)
 else:data=p.read_bytes()
 return hashlib.sha256(data).hexdigest(),dict(read_sheets(data,member))
@lru_cache(maxsize=64)
def pdf(file):
 reader=PdfReader(ROOT/file)
 return [(p.extract_text(extraction_mode='layout').splitlines(),p.extract_text()) for p in reader.pages]

data=read(BASE/'mobilidade_evidence_2026-10-05.json');rows=data['evidences'];reproduced=0;checks=collections.Counter();seen=set();verified=set();air=collections.defaultdict(list)
for e in rows:
 assert e['evidence_id'] not in seen;seen.add(e['evidence_id'])
 for key in ['institution','source_url','accessed_at','territory','ibge_code','period','frequency','universe','variable','category','unit','raw_value','normalized_value','transformation','partial','status','raw_reference','sha256','limitations','break_segment']:assert key in e,(e['evidence_id'],key)
 if e['raw_reference'] not in verified:
  assert hashlib.sha256((ROOT/e['raw_reference']).read_bytes()).hexdigest()==e['sha256'];verified.add(e['raw_reference'])
 loc=e['locator'];family=e['family']
 if family=='frota_senatran':
  sha,sheets=workbook(e['raw_reference'],loc['archive_member']);assert sha==loc['member_sha256'];sheet=sheets[loc['sheet']];cell=sheet[loc['row']-1][loc['column']-1]
  assert num(cell)==(num(e['raw_value']) if e['status']=='SUSPENSO' else e['value']),(e['evidence_id'],cell,e['value']);assert any(norm(v)=='SAO JOSE DOS CAMPOS' for v in sheet[loc['row']-1][:8]);assert any(norm(v)=='SP' for v in sheet[loc['row']-1][:4]);assert norm(sheet[loc['header_row']-1][loc['column']-1])==e['category'];reproduced+=1
 elif family=='frota_ibge':
  x=read(ROOT/e['raw_reference'])[0]['res'];r=next(r for r in x if r['localidade']==loc['localidade']);assert num(r['res'][loc['year']])==e['value'];reproduced+=1
 elif family=='frota_motos_calculada':
  components=[next(r for r in rows if r['evidence_id']==i) for i in e['transformation']['components']];assert all(c['period']==e['period'] for c in components);assert sum(c['value'] for c in components)==e['value']
 elif family=='aeroporto_sbsj':
  for line in loc['rows']:air[line].append(e)
 elif e['raw_reference'].endswith('.pdf'):
  lines,plain=pdf(e['raw_reference'])[loc['page']-1]
  if 'text_match' in loc:assert loc['text_match'] in plain or loc['text_match'] in '\n'.join(lines)
  if 'line' in loc:
   line=lines[loc['line']-1];assert line==loc['layout_line']
   if 'column' in loc:assert re.split(r'\s{2,}',line.strip())[loc['column']-1]==loc['raw_cell']
   if family in ['transporte_linhas','transporte_frota_cadastrada']:
    match=re.search(r'(?:TOTAL DE LINHAS|FROTA TOTAL)\s+(\d+)',norm(line)) or re.search(r'(\d+)\s+TOTAL DE LINHAS EM OPERACAO',norm(line));assert match and int(match[1])==e['value'];reproduced+=1
  if loc.get('raw_cell') is not None:assert num(loc['raw_cell'])==e['value'];reproduced+=1
 elif family=='estacionamento_rotativo':assert loc['raw_cell'] in (ROOT/e['raw_reference']).read_text(encoding='utf8');assert num(loc['raw_cell'])==e['value'];reproduced+=1
 checks[family]+=1
 # Nulls representam células ausentes; zeros continuam como observações externas.
 if e['value'] is None:assert e['status'] in ['NAO_DISPONIVEL','SUSPENSO']
 if family.startswith('transporte') and e['period'].startswith('2026-') and e['frequency']=='monthly':assert e['partial']

aggregated=collections.defaultdict(list);csv_records=0;csv_cells=0
if air:
 with (RAW/'anac-estatistica-completa.csv').open(encoding='utf-8-sig') as f:
  assert next(f).startswith('Atualizado');reader=csv.DictReader(f,delimiter=';')
  for line,r in enumerate(reader,3):
   if line not in air:continue
   assert r['AEROPORTO_DE_ORIGEM_SIGLA']=='SBSJ' or r['AEROPORTO_DE_DESTINO_SIGLA']=='SBSJ';csv_records+=1
   for e in air[line]:
    filters=e['locator']['filters'];key='AEROPORTO_DE_ORIGEM_SIGLA' if filters['direction']=='partida' else 'AEROPORTO_DE_DESTINO_SIGLA'
    assert r[key]=='SBSJ' and r['NATUREZA']==filters['nature'] and r['GRUPO_DE_VOO']==filters['flight_group'];assert e['period']==f"{r['ANO']}-{int(r['MES']):02}";aggregated[e['evidence_id']].append(num(r[e['variable']]));csv_cells+=1
 for e in data['series']['aeroporto_sbsj']:
  values=aggregated[e['evidence_id']];assert len(values)==len(e['locator']['rows']);assert (sum(values) if all(v is not None for v in values) else None)==e['value']
reproduced+=csv_cells

# Escopo e fallback: objetos dos outros eixos e registry anterior devem ser idênticos.
snapshot=read(OUT/'snapshot-inicial.json');gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');pkg=read(BASE/'radar_hub_package.json')
for axis,before in snapshot['groundTruth']['eixos'].items():
 if axis!='mobilidade':assert gt['eixos'][axis]==before,axis
old=[i for i in snapshot['registry']['indicators'] if i['category']!='mobilidade'];new=[i for i in reg['indicators'] if i['category']!='mobilidade'];assert old==new
for file in ['app.js','economia_visual.js','financas_visual.js','data/radar_hub/meio_ambiente_evidence_2026-10-05.json','data/radar_hub/meio_ambiente_audit_bindings.json','data/radar_hub/economia_audit_bindings.json','data/radar_hub/financas_audit_bindings.json']:
 assert hashlib.sha256((ROOT/file).read_bytes()).hexdigest()==snapshot['hashes'][file],file
assert subprocess.check_output(['git','diff','--','app.js'],cwd=ROOT)==(OUT/'git-before-appjs.txt').read_bytes()
code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');inline=json.loads(re.search(r'const RADAR_HUB_PACKAGE = (.*?);\s*/\* RADAR_HUB_PACKAGE_END',code,re.S)[1]);assert inline==pkg and pkg['groundTruth']==gt and pkg['metadataRegistry']==reg
assert pkg['audit_status']=='AUDITORIA_NAO_CARREGADA' and not pkg['mobilidadeAudit']['homologated']
def tail(s):return s.split('/* RADAR_HUB_PACKAGE_END */',1)[1]
before=tail((OUT/'radar_hub_controller.js.before').read_text(encoding='utf8'));after=tail(code)
def strip_mob(s):
 start=s.index('  // G14: Mobilidade');end=s.index('  // P2: somente cards',start);s=s[:start]+s[end:]
 if '  function updateMobilidadeP4Cards()' in s:
  start=s.index('  function updateMobilidadeP4Cards()');end=s.index('  window.getRadarHubExport',start);s=s[:start]+s[end:]
 s=s.replace('      updateMobilidadeP4Cards();\n','')
 s=re.sub(r"      \.\.\.\(RADAR_HUB_CACHE.activeAxis === 'mobilidade'.*\n",'',s)
 s=s.replace(',...(exportData.mobilidade_series || [])','');return s
assert strip_mob(before)==strip_mob(after),'Código dos outros eixos/controlador fora da integração P4 foi modificado'
before_html=(OUT/'app.html.before').read_text(encoding='utf8');after_html=(ROOT/'app.html').read_text(encoding='utf8')
for axis in snapshot['groundTruth']['eixos']:
 if axis=='mobilidade':continue
 token=f'<div id="hub-axis-container-{axis}"'
 if token not in before_html:continue
 def axis_html(s):
  start=s.index(token);end=s.find('<!-- EIXO:',start);return s[start:end if end>=0 else s.find('<!--',start)]
 assert axis_html(before_html)==axis_html(after_html),axis+' HTML'
assert all(i['value'] is None for i in reg['indicators'] if i['indicator_id'] in ['mob_taxa_motorizacao','mob_fatalidades_transito','mob_fatalidades_transito_2024','mob_vitimas_motociclistas_pct'])
assert len([e for e in rows if e['value']==0])>0 and len([e for e in rows if e['value'] is None])>0
save(OUT/'testes-reproducao.json',{'status':'PASS','observations':len(rows),'external_cells_reproduced':reproduced,'csv_records_reproduced':csv_records,'csv_cells_reproduced':csv_cells,'families':dict(checks),'source_files_hashed':len(verified),'scope':'outros eixos, registry, app.js hash/diff, visuais Economia/Finanças/P3 idênticos ao snapshot','package':'online e fallback idênticos; sem homologação automática'})
print('PASS P4 reprodução:',reproduced,'células;',csv_records,'registros CSV;',len(rows),'observações; escopo e pacote preservados.')
