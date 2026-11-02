"""P3: valores primários, invariantes semânticas e preservação do escopo."""
from collect_meio_ambiente_p3 import ROOT,BASE,RAW,OUT,read
import hashlib,json,re,zipfile,io,csv,unicodedata,xlrd,openpyxl
from meio_ambiente_workbooks import spreadsheetml
snap=read(OUT/'snapshot-inicial.json');gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');store=read(BASE/'meio_ambiente_evidence_2026-10-05.json');pkg=read(BASE/'radar_hub_package.json');checks=[]
def check(name,condition):assert condition,name;checks.append(name)
check('demais eixos sem alteração',{k:v for k,v in gt['eixos'].items() if k!='meio_ambiente'}=={k:v for k,v in snap['groundTruth']['eixos'].items() if k!='meio_ambiente'})
check('demais indicadores sem alteração',[i for i in reg['indicators'] if i['category']!='meio_ambiente']==[i for i in snap['registry']['indicators'] if i['category']!='meio_ambiente'])
for f in ['app.js','economia_visual.js','financas_visual.js','data/radar_hub/economia_audit_bindings.json','data/radar_hub/financas_audit_bindings.json','data/radar_hub/economia_evidence_2026-10-04.json','data/radar_hub/financas_evidence_2026-10-05.json']:
    check('hash preservado '+f,hashlib.sha256((ROOT/f).read_bytes()).hexdigest()==snap['hashes'][f])
def axisblocks(v):
    blocks={}
    starts=list(re.finditer(r'<div id="hub-axis-container-([^\"]+)"',v))
    for i,m in enumerate(starts):
        if m[1]=='meio_ambiente':continue
        tail=v[m.start():];end=tail.find('<!-- EIXO:',1)
        blocks[m[1]]=tail[:end] if end>=0 else tail[:tail.find('<!--',1)]
    return blocks
check('HTML demais eixos preservado',axisblocks((ROOT/'app.html').read_text(encoding='utf8'))==axisblocks((OUT/'app.html.before').read_text(encoding='utf8')))
code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');match=re.search(r'const RADAR_HUB_PACKAGE = (.*?);\s*/\* RADAR_HUB_PACKAGE_END',code,re.S)
before_code=(OUT/'radar_hub_controller.js.before').read_text(encoding='utf8')
def nonenv_functions(v):
    starts=list(re.finditer(r'^  function (\w+)\(',v,re.M)); result={}
    for i,m in enumerate(starts):
        if m[1].startswith(('renderMeioAmbiente','updateMeioAmbiente')):continue
        segment=v[m.start():starts[i+1].start() if i+1<len(starts) else len(v)]
        # Final da função, antes de comentários/hook/exportação subsequentes.
        end=segment.rfind('\n  }\n') if i+1==len(starts) else segment.find('\n  }\n')
        result[m[1]]=segment[:end+5]
    if 'renderAxisCharts' in result:result['renderAxisCharts']=result['renderAxisCharts'].replace('      updateMeioAmbienteP3Cards();\n','')
    return result
check('funções dos outros eixos preservadas',nonenv_functions(code)==nonenv_functions(before_code))
check('pacote e fallback idênticos',json.loads(match.group(1))==pkg)
check('sem homologação global',pkg['audit_status']=='AUDITORIA_NAO_CARREGADA' and pkg['meioAmbienteAudit']['homologated'] is False)
cache={};sheet_cache={};numeric=0
for e in store['evidences']:
    p=ROOT/e['raw_file'];check('hash '+e['evidence_id'],hashlib.sha256(p.read_bytes()).hexdigest()==e['sha256'])
    check('metadados '+e['evidence_id'],all(k in e for k in ['spatial_scope','period','frequency','unit','measurement_type','locator','transformation','limitations','url','accessed_at']))
    loc=e['locator']
    if 'sheet' not in loc:continue
    key=(e['raw_file'],loc['archive_member'])
    if key not in cache:
        data=p.read_bytes()
        for member in loc['archive_member'].split('!'):data=zipfile.ZipFile(io.BytesIO(data)).read(member)
        assert hashlib.sha256(data).hexdigest()==loc['member_sha256']
        cache[key]=dict(spreadsheetml(data)) if data.lstrip().startswith(b'<?xml') else xlrd.open_workbook(file_contents=data) if loc['archive_member'].endswith('.xls') else openpyxl.load_workbook(io.BytesIO(data),read_only=True,data_only=True)
    w=cache[key];r,c=loc['row'],loc['column']
    if isinstance(w,dict):raw=w[loc['sheet']][r-1][c-1]
    elif loc['archive_member'].endswith('.xls'):raw=w.sheet_by_name(loc['sheet']).cell_value(r-1,c-1)
    else:
        skey=key+(loc['sheet'],)
        if skey not in sheet_cache:sheet_cache[skey]=list(w[loc['sheet']].values)
        raw=sheet_cache[skey][r-1][c-1]
    assert raw==loc['raw_value'],e['evidence_id']
    if e['value'] is not None:assert raw==e['value'];numeric+=1
    else:assert not isinstance(raw,(int,float))
    assert any(str(x).removesuffix('.0') in ('354990','3549904') for x in loc['municipal_row'])
check('células numéricas reproduzidas',numeric>200)
norm=lambda v:''.join(c for c in unicodedata.normalize('NFD',str(v).upper()) if unicodedata.category(c)!='Mn').strip()
for e in store['series']['focos_anuais']:
    z=zipfile.ZipFile(ROOT/e['raw_file']);rr=list(csv.DictReader(io.StringIO(z.read(e['locator']['archive_member']).decode('utf-8-sig'))));chosen=[r for r in rr if norm(r['municipio'])=='SAO JOSE DOS CAMPOS'];assert len(chosen)==e['value'];assert all(norm(r['estado'])=='SAO PAULO' for r in chosen)
    months=[x for x in store['series']['focos_mensais'] if x['period'].startswith(e['period'])];assert sum(x['value'] for x in months)==e['value'];assert len(months)==12
check('22 anos e 264 meses INPE reconciliados',len(store['series']['focos_anuais'])==22 and len(store['series']['focos_mensais'])==264)
check('SNIS e SINISA separados',all(not(k.startswith('snis') and any(e['period']>'2022' for e in v)) for k,v in store['series'].items()))
check('ar anual e coleta domiciliar suspensos',all(next(i for i in reg['indicators'] if i['indicator_id']==id)['value'] is None for id in ['amb_qualidade_ar_cetesb','amb_qualidade_ar_vista_verde','amb_saneamento_esgoto','amb_area_protegida_km2','amb_percentual_territorio_protegido']))
check('saneamento sem metas falsas','const metas = [99.0, 90.0, 90.0, 25.0]' not in code and 'const values = [99.8, 98.5, 98.2, 22.4]' not in code)
results={'passed':True,'checks':checks,'reproduced_numeric_cells':numeric,'other_axes_preserved':True,'app_js_preserved':True}
(OUT/'testes-escopo.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS P3:',numeric,'células primárias; INPE anual/mensal; pacote; null; escopo e hashes.')
