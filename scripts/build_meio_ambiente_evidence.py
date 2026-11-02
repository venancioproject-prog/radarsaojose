"""Extrai somente células municipais e contagens reproduzíveis; não homologa."""
from collect_meio_ambiente_p3 import ROOT, BASE, RAW, OUT, read
import csv, io, zipfile, re, unicodedata, hashlib, json, math
import xlrd, openpyxl
from meio_ambiente_workbooks import spreadsheetml

def save(p,v): p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def norm(v): return ''.join(c for c in unicodedata.normalize('NFD',str(v).upper()) if unicodedata.category(c)!='Mn').strip()
logs=read(RAW/'consultas.json'); evidences=[]; series={}; extraction=[]
def evidence(file,family,period,value,unit,variable,locator,scope='municipality',status='CONFIRMADO',**extra):
    p=RAW/file; source=next(l for l in reversed(logs) if l.get('name')==file and l.get('status')=='OK')
    eid='amb:'+hashlib.sha256(json.dumps([file,family,period,variable,locator],sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:20]
    e=dict(evidence_id=eid,family=family,period=str(period),value=value,unit=unit,variable=variable,spatial_scope=scope,municipality_code='3549904' if scope=='municipality' else None,status=status,url=source['url'],accessed_at=source['accessed_at'],raw_file=source['raw_file'],sha256=source['sha256'],locator=locator,frequency='annual',measurement_type='published_administrative',transformation=None,limitations=[])
    e.update(extra);evidences.append(e);series.setdefault(family,[]).append(e.copy());return e
def number(v):
    if isinstance(v,(float,int)) and not isinstance(v,bool) and math.isfinite(v):return v
    return None
def members(data,path=''):
    z=zipfile.ZipFile(io.BytesIO(data))
    for n in z.namelist():
        if n.lower().endswith('.zip'):
            try:yield from members(z.read(n),path+n+'!')
            except zipfile.BadZipFile:pass
        elif n.lower().endswith(('.xls','.xlsx')):yield path+n,z.read(n)
codes={'IN015','IN016','IN023','IN024','IN046','IN047','IN049','IN055','IN056','IN058','IN059','IN022'}
codes.update(c.replace('IN','I') for c in list(codes))
for p in sorted(RAW.glob('snis-*.zip'))+sorted(RAW.glob('sinisa-*.zip')):
    years=re.findall(r'(?:19|20)\d{2}',p.name); year=int(years[-1]) if years else 2022
    system='sinisa' if p.name.startswith('sinisa') else 'snis'
    if not zipfile.is_zipfile(p):continue
    for member,data in members(p.read_bytes()):
        nm=norm(member)
        if system=='snis' and not ('SABESP' in nm and 'INDIC' in nm or 'MUNIC' in nm and 'INDIC' in nm or 'IND_AGESG' in nm):continue
        if system=='sinisa' and ('INDIC' not in nm or ('MUNIC' not in nm and 'RESID' not in nm)):continue
        try:
            if member.lower().endswith('.xls'):
                if data.lstrip().startswith(b'<?xml'):sheets=spreadsheetml(data)
                else:
                    book=xlrd.open_workbook(file_contents=data);sheets=[(s.name,[s.row_values(r) for r in range(s.nrows)]) for s in book.sheets()]
            else:
                book=openpyxl.load_workbook(io.BytesIO(data),read_only=True,data_only=True);sheets=[(s.title,list(s.values)) for s in book];book.close()
            for sheet,rows in sheets:
                header=next((i for i,row in enumerate(rows[:35]) if sum(bool(re.match(r'^(?:IN?\d{3}|I(?:AG|ES|RS)\d{4})(?:$|\s*-)',str(v).strip())) for v in row)>2),None)
                if header is None:continue
                matched=[(i,row) for i,row in enumerate(rows) if any(norm(v).split('/')[0]=='SAO JOSE DOS CAMPOS' for v in row[:12]) and any(str(v).strip().removesuffix('.0') in ('354990','3549904') for v in row[:12])]
                extraction.append({'file':p.name,'member':member,'sheet':sheet,'year':year,'municipal_rows':[i+1 for i,r in matched],'header_row':header+1})
                for i,row in matched:
                    for c,code in enumerate(rows[header]):
                        raw_header=str(code).strip(); code=raw_header.split(' - ')[0]
                        if (system=='snis' and code not in codes) or (system=='sinisa' and not re.fullmatch(r'I(?:AG|ES|RS)\d{4}',code)):continue
                        raw=row[c] if c<len(row) else None; value=number(raw)
                        labelrow=header+1 if system=='sinisa' and 'RESID' in nm else header-2
                        unitrow=header+2 if system=='sinisa' and 'RESID' in nm else header-1
                        label=str(rows[labelrow][c] or code) if c<len(rows[labelrow]) else code
                        unit=str(rows[unitrow][c] or '') if c<len(rows[unitrow]) else ''
                        if ' - ' in raw_header:
                            label=raw_header.split(' - ',1)[1];match=re.search(r'\[([^]]+)\]',label);unit=match.group(1) if match else '';label=label.split(' [')[0]
                        e=evidence(p.name,system+'_'+code,year,value,unit,label,{'archive_member':member,'member_sha256':hashlib.sha256(data).hexdigest(),'sheet':sheet,'row':i+1,'column':c+1,'code':code,'raw_value':raw,'municipal_row':list(row[:12]),'label_row':labelrow+1,'unit_row':unitrow+1},status='CONFIRMADO' if value is not None and unit.strip() and label!=code else 'DADO_NAO_DISPONIVEL' if value is None else 'DISPONIVEL_COM_LIMITACAO',native_code=code,system=system.upper(),limitations=['SNIS e SINISA separados; código igual não prova continuidade metodológica.','Valores declarados pelo prestador; não são medição universal da população.'])
        except Exception as ex:extraction.append({'file':p.name,'member':member,'error':str(ex)})
    print('Extraído',p.name,flush=True)
# Cada anual foi integralmente lido: zero mensal é contagem de registros, nunca preenchimento de medição ausente.
for p in sorted(RAW.glob('inpe-focos*.zip')):
    year=int(re.search(r'(20\d{2})',p.name).group(1));z=zipfile.ZipFile(p);member=z.namelist()[0]
    rows=list(csv.DictReader(io.StringIO(z.read(member).decode('utf-8-sig'))));chosen=[(i+2,r) for i,r in enumerate(rows) if norm(r['municipio'])=='SAO JOSE DOS CAMPOS']
    ids=[r.get('foco_id') for _,r in chosen]
    assert len(ids)==len(set(ids)),('IDs repetidos',year)
    common=dict(measurement_type='remote_sensing_detection',limitations=['Detecção do produto satélite de referência; não incêndio confirmado, área queimada ou todos os satélites.','Atribuição municipal do provedor; não houve recorte geométrico ou estimativa de área.'],system='INPE BDQueimadas',spatial_scope='satellite_pixel_aggregation',municipality_code='3549904')
    e=evidence(p.name,'focos_anuais',year,len(chosen),'detecções','Focos — satélite de referência',{'archive_member':member,'csv_rows':[i for i,r in chosen],'filter':"normalize(municipio) == SAO JOSE DOS CAMPOS",'total_state_rows':len(rows)},**common)
    e['transformation']={'formula':'COUNT(registros municipais no arquivo anual integral)','components':ids};series['focos_anuais'][-1].update(transformation=e['transformation'])
    for month in range(1,13):
        selected=[(i,r) for i,r in chosen if int(r['data_pas'][5:7])==month]
        evidence(p.name,'focos_mensais',f'{year}-{month:02}',len(selected),'detecções','Focos — satélite de referência',{'archive_member':member,'csv_rows':[i for i,r in selected],'filter':f'municipio normalizado SJC; mês {month}','annual_file_fully_read':True},frequency='monthly',transformation={'formula':'COUNT(registros municipais do mês em arquivo anual integral)'},**common)
def ibge(file,code,family):
    obj=read(RAW/file)
    def walk(v):
        if isinstance(v,dict):
            if 'res' in v and isinstance(v['res'],dict):yield v
            for x in v.values():yield from walk(x)
        elif isinstance(v,list):
            for x in v:yield from walk(x)
    for item in walk(obj):
        for year,value in item['res'].items():
            if value is None or str(value) in ('-','..','...'):continue
            try:value=float(str(value).replace(',','.'))
            except ValueError:continue
            evidence(file,family,year,value,'km²' if code=='95335' else '%',{'60029':'Arborização de vias urbanas — Censo','60030':'Esgotamento sanitário — conceito específico do Censo','95335':'Área urbanizada — IBGE'}[code],{'indicator':code,'response_record':item},measurement_type='census' if code!='95335' else 'remote_sensing_classification',status='DISPONIVEL_COM_LIMITACAO' if code=='95335' and str(year)=='2022' else 'CONFIRMADO',limitations=['Observações censitárias, sem interpolação; 2010 e 2022 exigem conferência de definições.'] if code!='95335' else ['Metadados da API citam publicação 2019; valor 2022 preservado com limitação metodológica.'])
for args in [('ibge-arborizacao.json','60029','arborizacao_censo'),('ibge-censo-esgoto.json','60030','esgoto_censo'),('ibge-area-urbanizada.json','95335','area_urbanizada')]:ibge(*args)
geo=read(RAW/'vegetacao-2020.json')
for i,f in enumerate(geo['features']):
    if str(f['properties'].get('Codigo'))=='3549904':
        evidence('vegetacao-2020.json','vegetacao_nativa',2020,f['properties']['Indice_Cob_Veg_Nativa'],'%','Índice de cobertura vegetal nativa',{'feature_index':i,'properties':f['properties'],'crs':geo.get('crs')},measurement_type='remote_sensing_classification',limitations=['Inventário 2020; imagens 2017–2019. Não equivale a arborização urbana ou proteção legal.','Percentual publicado pelo provedor; nenhuma área calculada.'])
for file,family,value,label in [('parque-ruschi.html','unidades_conservacao',243.49,'Parque Natural Municipal Augusto Ruschi'),('apa-sfx.html','unidades_conservacao',11559,'APA estadual São Francisco Xavier')]:
    evidence(file,family,'posição consultada 2026-10-05',value,'ha',label,{'html_published_area':str(value)},scope='conservation_unit',frequency='cadastro',limitations=['Área cadastral da unidade; não somar áreas sobrepostas nem transformar em total municipal protegido.'])
for f in read(RAW/'cetesb-stations-sjc.json')['features']:
    a=f['attributes']
    evidence('cetesb-stations-sjc.json','ar_iqar_snapshot',a['DATA'],a['Indice'],'IQAr',a['Nome'],{'attributes':a,'geometry':f.get('geometry')},scope='station',status='DISPONIVEL_COM_LIMITACAO',frequency='snapshot',measurement_type='automatic_monitoring',station_name=a['Nome'],station_code=None,source_feature_id=a['ID'],limitations=['Snapshot automático; não total anual de dias bons ou média municipal.','ID é identificador do serviço, não código histórico comprovado da estação.','Fuso horário não declarado no campo DATA.'])
# Remover duplicações de ZIP espelhado, preservando seleção e todas as consultas.
for family,rows in series.items():
    if family.startswith('snis_'):
        seen={};kept=[]
        for e in rows:
            key=e['period']
            if key in seen:
                if seen[key]['value']!=e['value']:e['status']='DIVERGENCIA_NAO_RESOLVIDA';kept.append(e)
            else:seen[key]=e;kept.append(e)
        series[family]=kept
save(OUT/'extracao-planilhas.json',extraction)
store={'round':'P3 — 2026-10-05','scope':'meio_ambiente','homologated':False,'evidences':evidences,'series':series,'sources':logs,'methodology':['Sem interpolação. Ausência numérica permanece null.','Nenhuma estação representa o município inteiro.','SNIS até 2022 e SINISA 2023–2024 são segmentos separados.','Sem soma de unidades de conservação sobrepostas.','Focos INPE não são incêndios confirmados.']}
save(BASE/'meio_ambiente_evidence_2026-10-05.json',store)
print('Evidências',len(evidences),'famílias',len(series),flush=True)
