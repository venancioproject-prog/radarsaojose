"""Confere a extração contra fontes brutas e a preservação do escopo."""
import hashlib,json,re,zipfile
from decimal import Decimal
from pathlib import Path
import openpyxl
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p1-economia'
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
snap=read(OUT/'snapshot-inicial.json');pkg=read(BASE/'radar_hub_package.json');store=read(BASE/'economia_evidence_2026-10-04.json');emap={e['evidence_id']:e for e in store['evidences']}
assert hashlib.sha256((ROOT/'app.js').read_bytes()).hexdigest()==snap['app_js_sha256']
assert {k:v for k,v in pkg['groundTruth']['eixos'].items() if k!='economia'}==snap['other_axes']
assert [i for i in pkg['metadataRegistry']['indicators'] if i['category']!='economia']==snap['other_indicators']
assert set(a['id'] for a in store['indicators'])==set(i['indicator_id'] for i in snap['indicators'])
for a in pkg['economiaAudit']['indicators'].values():
    e=emap[a['evidence_id']];assert a['value']==e['display_value'];assert a['period']==e['period'];assert a['status']==e['status'];assert a['sha256']==e['sha256']
for access in store['source_accesses']:
    if access.get('sha256'):assert hashlib.sha256((ROOT/access['raw_file']).read_bytes()).hexdigest()==access['sha256']
# Reparse the exact fixed-width records; no GT-to-GT equality as external proof.
zips={};lines_cache={}
for e in emap.values():
    excerpt=e['evidence_excerpt']
    if isinstance(excerpt,dict) and 'position' in excerpt:
        rawfile=ROOT/e['raw_file']
        if rawfile not in zips:zips[rawfile]=zipfile.ZipFile(rawfile)
        key=(rawfile,excerpt['member'])
        if key not in lines_cache:lines_cache[key]=zips[rawfile].read(excerpt['member']).decode('latin1').splitlines()
        lines=lines_cache[key]
        row=lines[excerpt['line']-1];assert row[46:53]=='3549904';assert row[:4]==e['period']
        start,end=excerpt['position'];assert row[start-1:end].strip()==e['raw_value']
        assert row==excerpt['record']
    if e['status']=='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS':
        components=[emap[id] for id in e['transformation']['components']]
        assert all(c['display_value'] is not None for c in components)
        if e['unit']=='%':assert abs(e['display_value']-float(Decimal(components[0]['raw_value'])/Decimal(components[1]['raw_value'])*100))<1e-10
        else:assert e['display_value']==sum(c['display_value'] for c in components)
source_rows={}
for name in ['mte-dez2024.xlsx','mte-ago2026.xlsx']:
    w=openpyxl.load_workbook(BASE/'economia_raw_2026-10-04'/name,read_only=True,data_only=True)
    row=list(w['Tabela 8.1'].iter_rows(min_row=3831,max_row=3831,values_only=True))[0];assert row[2]==354990
    source_rows[name]=row;w.close()
for e in emap.values():
    excerpt=e['evidence_excerpt']
    if isinstance(excerpt,dict) and 'cell' in excerpt:
        col,_=openpyxl.utils.cell.coordinate_from_string(excerpt['cell']);row=source_rows[Path(e['raw_file']).name]
        assert row[openpyxl.utils.column_index_from_string(col)-1]==e['raw_value']
series=store['series'];assert [r['ano'] for r in series['pib']]==list(range(2002,2024));assert len(series['novo_caged'])==80
assert [r['competencia'] for r in series['novo_caged']]==sorted(r['competencia'] for r in series['novo_caged'])
assert all(v is None for r in series['pib'] if r['ano'] in [2022,2023] for v in r['components_mil_reais'].values())
assert all(a['value'] is None for a in store['indicators'] if a['status']=='NAO_VERIFICADO')
controller=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');embedded=json.loads(re.search(r'const RADAR_HUB_PACKAGE = (.*?);\n/\* RADAR_HUB_PACKAGE_END',controller,re.S).group(1));assert embedded==pkg
old=(OUT/'radar_hub_controller.js.before').read_text(encoding='utf8').split('/* RADAR_HUB_PACKAGE_END */',1)[1];new=controller.split('/* RADAR_HUB_PACKAGE_END */',1)[1]
pattern=r'  (?:async )?function (render(?:Demografia|Saude|Seguranca|MeioAmbiente|Educacao|Mobilidade|Financas)\w*)\([^\n]*\) \{.*?\n  \}'
oldfunc={m.group(1):m.group(0) for m in re.finditer(pattern,old,re.S)};newfunc={m.group(1):m.group(0) for m in re.finditer(pattern,new,re.S)};assert oldfunc==newfunc
print('PASS: 11 IDs anteriores; evidências brutas, fórmulas, unidades, 22 anos/80 meses, null, pacote/fallback, app.js e',len(oldfunc),'renderizadores protegidos.')
