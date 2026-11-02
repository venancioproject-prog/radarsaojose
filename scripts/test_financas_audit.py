"""Verifica P2 contra arquivos oficiais brutos e escopo do snapshot inicial."""
import csv, hashlib, io, json, re, zipfile
from collections import defaultdict
from decimal import Decimal
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p2-financas'
def read(p):return json.loads(p.read_text(encoding='utf8'))
store=read(BASE/'financas_evidence_2026-10-05.json');pkg=read(BASE/'radar_hub_package.json');snap=read(OUT/'snapshot-inicial.json');cache={}
emap={e['evidence_id']:e for e in store['evidences']};assert len(emap)==len(store['evidences'])
for a in store['source_accesses']:
    if a.get('raw_file'):assert hashlib.sha256((ROOT/a['raw_file']).read_bytes()).hexdigest()==a['sha256'],a['name']
zero=0;derived_zero=0;conflict=0
for e in store['evidences']:
    assert e['ibge_code']=='3549904' and e['exercise']>=2013
    if e['evidence_excerpt'].get('json_pointer'):
        if e['raw_file'] not in cache:cache[e['raw_file']]=read(ROOT/e['raw_file'])
        i=int(e['evidence_excerpt']['json_pointer'].split('/')[-1]);row=cache[e['raw_file']]['items'][i]
        assert row==e['evidence_excerpt']['record']
        assert row['valor']==e['raw_value'];assert row['exercicio']==e['exercise']
        assert row['anexo']==e['statement'] and row['coluna']==e['accounting_stage']
        assert row['cod_ibge']==3549904 and row['uf']=='SP'
        if e['display_value'] is None:
            assert e['status']=='NAO_VERIFICADO' and e['source_value']==row['valor'];conflict+=1
        else:assert e['display_value']==row['valor']
        if row['valor']==0:assert e['display_value']==0;zero+=1
        if e['statement'].startswith('RGF'):assert row['co_poder']=='E'
    if e['transformation'] and 'component_evidence_ids' in e['transformation']:
        parts=[emap[id] for id in e['transformation']['component_evidence_ids']];values=[Decimal(str(p['display_value'])) for p in parts];f=e['transformation']['formula']
        assert all(p['exercise']==e['exercise'] for p in parts)
        if f=='BRL / 1000000':expected=values[0]/1000000
        elif f=='receita realizada − despesa empenhada':expected=values[0]-values[1];assert parts[0]['statement']==parts[1]['statement']=='RREO-Anexo 14'
        elif f=='Empenhado + Reforço − Anulação':expected=values[0]+values[1]-values[2]
        elif f.endswith('× 100'):assert values[1]!=0;expected=values[0]/values[1]*100
        else:raise AssertionError(f)
        assert abs(float(expected)-e['display_value'])<1e-6,e['evidence_id']
        if expected==0:assert e['display_value']==0;derived_zero+=1
assert derived_zero>0 and len(store['unresolved_conflicts'])==4 and conflict==6
# Reconciliação de CSVs TCESP recalculada do bruto, sem tomar o JSON gerado como prova.
for year in [2023,2024]:
    for kind in ['receitas','despesas']:
        source=next(a for a in reversed(store['source_accesses']) if a['name']==f'tce-{kind}-{year}' and a.get('status_code')==200)
        sums=defaultdict(Decimal);counts=defaultdict(int)
        with zipfile.ZipFile(ROOT/source['raw_file']) as archive:
            with archive.open(archive.namelist()[0]) as binary:
                for row in csv.DictReader(io.TextIOWrapper(binary,encoding='latin1'),delimiter=';'):
                    assert row['ano_exercicio']==str(year) and row['ds_municipio']=='São José dos Campos'
                    group='Arrecadação' if kind=='receitas' else row['tp_despesa']
                    value=Decimal(row['vl_arrecadacao' if kind=='receitas' else 'vl_despesa'].replace('.','').replace(',','.'))
                    sums[group]+=value;counts[group]+=1
        for row in store['tce_aggregates']:
            if row['year']==year and row['kind']==kind:
                assert float(sums[row['event']])==row['value'] and counts[row['event']]==row['records']
fin=pkg['groundTruth']['eixos']['financas']
for rows in fin['series_auditadas'].values():
    # Agrupadas por conceito: cronologia é comparável só dentro da mesma série nativa.
    groups={}
    for r in rows:
        assert r['value']==emap[r['evidence_id']]['display_value'];assert r['unit']==emap[r['evidence_id']]['unit'];assert r['partial']==(r['exercise']==2026)
        groups.setdefault((r['statement'],r['classification'],r['label'],r['stage']),[]).append((r['exercise'],r['period_number']))
    for points in groups.values():assert sorted(points)==points,'cronologia nativa fora de ordem'
annual=fin['series_orcamentarias_anuais'];assert [r['ano'] for r in annual]==list(range(2015,2027));assert annual[-1]['parcial'] and annual[-1]['periodo']==4
assert all(not r.get('parcial') for r in fin['orcamento_serie_historica'])
oldids={i['indicator_id'] for i in snap['indicators']};assert oldids=={a['id'] for a in store['indicators']}
for i in pkg['metadataRegistry']['indicators']:
    if i['category']!='financas':continue
    b=pkg['financasAudit']['indicators'][i['indicator_id']];e=emap[b['evidence_id']]
    assert i['value']==b['value']==e['display_value']==fin['indicator_values'][i['indicator_id']]
    assert i['competencia']==b['period']==e['period'];assert i['official_url']==e['url']
    assert i['unit']==e['unit'] or (e['unit']=='%' and i['unit'].startswith('% da '))
assert fin['despesas_por_funcao_governo_2023_reais_milhoes']==[] and fin['composicao_receitas_2023']==[]
assert fin['orcamento_municipal_tce_siconfi_2023']['indice_efetividade_gestao_iegm_tce'] is None
assert {k:v for k,v in pkg['groundTruth']['eixos'].items() if k!='financas'}==snap['other_axes']
assert [i for i in pkg['metadataRegistry']['indicators'] if i['category']!='financas']==snap['other_indicators']
assert pkg['economiaAudit']==snap['economiaAudit'];assert pkg['auditReport'] is None
hashes=read(OUT/'hashes-iniciais.json')
for name in ['app.js','economia_visual.js','data/radar_hub/economia_audit_bindings.json','data/radar_hub/economia_evidence_2026-10-04.json']:assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==hashes[name]
code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');before=(OUT/'radar_hub_controller.js.before').read_text(encoding='utf8')
embedded=json.loads(re.search(r'const RADAR_HUB_PACKAGE = (.*?);\n/\* RADAR_HUB_PACKAGE_END',code,re.S).group(1));assert embedded==pkg
pattern=r'  (?:async )?function (render(?:Demografia|Saude|Seguranca|MeioAmbiente|Educacao|Mobilidade|Economia)\w*)\([^\n]*\) \{.*?\n  \}'
functions=lambda s:{m.group(1):m.group(0) for m in re.finditer(pattern,s,re.S)}
assert functions(code)==functions(before),'renderizador de outro eixo alterado'
def strip_fin(s):
    a=s.index('  <div id="hub-axis-container-financas"');b=s.index('  <!-- EIXO: BENCHMARK',a);return s[:a]+s[b:]
assert strip_fin((ROOT/'app.html').read_text(encoding='utf8'))==strip_fin((OUT/'app.html.before').read_text(encoding='utf8'))
result={'status':'PASS','evidences':len(emap),'legacy_decisions':len(oldids),'bound_indicators':len(pkg['financasAudit']['indicators']),'published_zeros':zero,'legitimate_derived_zeros':derived_zero,'unresolved_api_nulls':conflict,'other_axes_unchanged':True,'app_js_unchanged':True,'package_fallback_equal':True,'screenshots_created':False}
(OUT/'teste-evidencia-escopo.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8');print(json.dumps(result))
