"""Reproduz P1 exclusivamente dos arquivos oficiais preservados; não usa GT como prova."""
import csv, hashlib, json, zipfile
from decimal import Decimal
from pathlib import Path
import openpyxl
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'data/radar_hub'
RAW = BASE / 'economia_raw_2026-10-04'
OUT = ROOT / 'docs/dados-publicos-revisao/p1-economia'
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,v): p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
logs = read(RAW/'access_log.json')
def access(name):
    a = next(x for x in reversed(logs) if x['name']==name and x.get('status_code')==200)
    assert hashlib.sha256((ROOT/a['raw_file']).read_bytes()).hexdigest()==a['sha256']
    return a
evidences=[]
def ev(id,name,agency,table,variable,period,unit,raw,final,excerpt,transformation=None,limitation=None,status=None):
    a=access(name)
    e={'evidence_id':id,'source':agency,'url':a['url'],'requested_url':a['requested_url'],'accessed_at':a['accessed_at'],
       'table':table,'variable':variable,'territory':'São José dos Campos, SP','ibge_code':'3549904',
       'period':str(period),'unit':unit,'raw_value':raw,'display_value':final,'evidence_excerpt':excerpt,
       'transformation':transformation,'status':status or ('CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS' if transformation and isinstance(transformation,dict) else 'VALIDADO_EXTERNAMENTE'),
       'limitation':limitation,'raw_file':a['raw_file'],'sha256':a['sha256']}
    evidences.append(e); return e

# Leiautes oficiais fixos, posições 1-based. Filtro EXATO da coluna municipal.
positions={'agro':821,'industria':840,'servicos':859,'administracao':878,'vab_total':897,'impostos':916,'pib_mil_reais':935,'pib_per_capita':954}
pib=[]
for name in ['ibge-base2002-2009.zip','ibge-base2010-2023.zip']:
    z=zipfile.ZipFile(RAW/name); member=next(x for x in z.namelist() if x.endswith('.txt'))
    for line_no,line in enumerate(z.read(member).decode('latin1').splitlines(),1):
        if line[46:53]!='3549904': continue
        year=int(line[:4]); row={'ano':year,'components_mil_reais':{},'evidence_ids':{}}
        for field,pos in positions.items():
            raw=line[pos-1:pos+17].strip(); val=float(Decimal(raw)) if raw else None
            unit='R$/habitante' if field=='pib_per_capita' else 'R$ mil'
            id=f'ibge-pib-{year}-{field}'
            e=ev(id,name,'IBGE','PIB dos Municípios 2022–2023, base referência 2010',field,year,unit,raw,val,
                 {'member':member,'line':line_no,'municipal_code_position':[47,53],'position':[pos,pos+17],'record':line},
                 limitation='2022/2023 sujeitos a revisão; abertura setorial não publicada. PIB nominal. Per capita: estimativas até 2021; Censo 2022 em 2022/2023.',status='NAO_DISPONIVEL' if val is None else None)
            row['evidence_ids'][field]=id
            if field=='pib_mil_reais':row['pib_milhoes']=float(Decimal(raw)/1000)
            elif field=='pib_per_capita':row[field]=val
            else:row['components_mil_reais'][field]=val
        pib.append(row)
pib.sort(key=lambda r:r['ano']); assert [x['ano'] for x in pib]==list(range(2002,2024))

w=openpyxl.load_workbook(RAW/'mte-dez2024.xlsx',read_only=True,data_only=True)
s=w['Tabela 8.1']; heads=list(s.iter_rows(min_row=5,max_row=6,values_only=True))
matches=[(i,r) for i,r in enumerate(s.values,1) if len(r)>3 and r[2]==354990]
assert len(matches)==1
rownum,row=matches[0]; assert row[1]=='SP' and row[3]=='Sp-Sao Jose dos Campos'
months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
caged=[]
for col,h in enumerate(heads[0]):
    if not isinstance(h,str) or '/' not in h or h.split('/')[0] not in months:continue
    month,year=h.split('/'); period=f'{year}-{months.index(month)+1:02d}'
    record={'ano':int(year),'mes':months.index(month)+1,'competencia':period,'evidence_ids':{},'status':'VALIDADO_EXTERNAMENTE'}
    for offset,field in enumerate(['estoque','admissoes','desligamentos','saldo']):
        cell=f'{openpyxl.utils.get_column_letter(col+offset+1)}{rownum}'; value=row[col+offset]
        assert isinstance(value,int)
        e=ev('mte-'+period+'-'+field,'mte-dez2024.xlsx','Ministério do Trabalho e Emprego','Novo CAGED, edição dezembro/2024, Tabela 8.1 — série com ajustes',field,period,'vínculos' if field=='estoque' else 'movimentações',value,value,
             {'sheet':s.title,'cell':cell,'municipal_code':354990,'municipal_name':row[3],'month_header':h,'variable_header':heads[1][col+offset]},
             limitation='Retrato da edição dezembro/2024; revisões posteriores não verificadas. Código MTE de seis dígitos 354990 corresponde ao município IBGE 3549904, SP-São José dos Campos.')
        record[field]=value;record['evidence_ids'][field]=e['evidence_id']
    assert record['admissoes']-record['desligamentos']==record['saldo'];caged.append(record)
assert len(caged)==60
annual=[]
for year in range(2020,2025):
    rs=[r for r in caged if r['ano']==year]; value=sum(r['saldo'] for r in rs)
    if year==2024:
        assert value==row[305] # KT: saldo acumulado oficialmente publicado
        e=ev('mte-saldo-2024','mte-dez2024.xlsx','Ministério do Trabalho e Emprego','Novo CAGED, Tabela 8.1, acumulado 2024 com ajustes','Saldo acumulado',year,'vínculos líquidos',row[305],value,{'sheet':s.title,'cell':f'KT{rownum}','admissoes_cell':f'KR{rownum}','desligamentos_cell':f'KS{rownum}','admissoes':row[303],'desligamentos':row[304]},limitation='Edição dezembro/2024; sujeito a revisões posteriores.')
    else:
        e=ev(f'mte-saldo-{year}','mte-dez2024.xlsx','Ministério do Trabalho e Emprego','Novo CAGED, Tabela 8.1, série com ajustes','Saldo anual',year,'vínculos líquidos',[r['saldo'] for r in rs],value,{'sheet':s.title,'month_evidence_ids':[r['evidence_ids']['saldo'] for r in rs]}, {'formula':'soma dos 12 saldos mensais publicados','components':[r['evidence_ids']['saldo'] for r in rs]},'Novo CAGED desde 2020; não concatenado à RAIS ou CAGED antigo.')
    annual.append({'ano':year,'saldo':value,'status':e['status'],'evidence_id':e['evidence_id']})
w.close()

# Edição mais recente aberta nesta rodada. Preserva a edição anterior para
# comparação documental de revisões, sem concatenar vintages na série ativa.
caged_dec2024=caged;annual_dec2024=annual
w=openpyxl.load_workbook(RAW/'mte-ago2026.xlsx',read_only=True,data_only=True)
s=w['Tabela 8.1'];heads=list(s.iter_rows(min_row=5,max_row=6,values_only=True))
matches=[(i,r) for i,r in enumerate(s.values,1) if len(r)>3 and r[2]==354990];assert len(matches)==1
rownum,row=matches[0];assert row[1]=='SP' and row[3]=='Sp-Sao Jose dos Campos'
caged=[]
for col,h in enumerate(heads[0]):
    if not isinstance(h,str) or '/' not in h or h.split('/')[0] not in months:continue
    month,year=h.split('/');period=f'{year}-{months.index(month)+1:02d}'
    record={'ano':int(year),'mes':months.index(month)+1,'competencia':period,'evidence_ids':{},'status':'VALIDADO_EXTERNAMENTE','edition':'2026-08'}
    for offset,field in enumerate(['estoque','admissoes','desligamentos','saldo']):
        cell=f'{openpyxl.utils.get_column_letter(col+offset+1)}{rownum}';value=row[col+offset];assert isinstance(value,int)
        e=ev('mte-202608-'+period+'-'+field,'mte-ago2026.xlsx','Ministério do Trabalho e Emprego','Novo CAGED, edição agosto/2026, Tabela 8.1 — série com ajustes',field,period,'vínculos' if field=='estoque' else 'movimentações',value,value,{'sheet':s.title,'cell':cell,'municipal_code':354990,'municipal_name':row[3],'month_header':h,'variable_header':heads[1][col+offset]},limitation='Retrato da edição agosto/2026, com ajustes e revisões retrospectivas. 2026 parcial até agosto. Código MTE 354990, nome e UF conferidos contra município IBGE 3549904.')
        record[field]=value;record['evidence_ids'][field]=e['evidence_id']
    assert record['admissoes']-record['desligamentos']==record['saldo'];caged.append(record)
assert len(caged)==80
annual=[]
for year in range(2020,2027):
    rs=[r for r in caged if r['ano']==year];value=sum(r['saldo'] for r in rs);partial=year==2026
    if partial:
        assert value==row[405]
        e=ev('mte-202608-saldo-2026','mte-ago2026.xlsx','Ministério do Trabalho e Emprego','Novo CAGED, Tabela 8.1, acumulado janeiro–agosto/2026 com ajustes','Saldo acumulado parcial','2026-01/2026-08','vínculos líquidos',row[405],value,{'sheet':s.title,'cell':f'OP{rownum}'},limitation='2026 parcial até agosto; não comparar como ano completo.')
    else:
        e=ev(f'mte-202608-saldo-{year}','mte-ago2026.xlsx','Ministério do Trabalho e Emprego','Novo CAGED, Tabela 8.1, edição agosto/2026 com ajustes','Saldo anual',year,'vínculos líquidos',[r['saldo'] for r in rs],value,{'sheet':s.title,'month_evidence_ids':[r['evidence_ids']['saldo'] for r in rs]},{'formula':'soma dos 12 saldos mensais publicados','components':[r['evidence_ids']['saldo'] for r in rs]},'Série retrospectivamente revisada na edição agosto/2026.')
    annual.append({'ano':year,'saldo':value,'parcial':partial,'meses':len(rs),'status':e['status'],'evidence_id':e['evidence_id']})
w.close()

cempre=[]
for v in read(RAW/'ibge-cempre-sjc.json'):
    series=v['resultados'][0]['series'][0];assert series['localidade']['id']=='3549904'
    for year,raw in series['serie'].items():
        value=float(raw) if v['id'] in ['1606','10143'] else int(raw)
        e=ev(f'cempre-{v["id"]}-{year}','ibge-cempre-sjc.json','IBGE','SIDRA 9510, CNAE 12762 categoria 117897 (Total)',v['variavel'],year,v['unidade'],raw,value,{'variable_id':v['id'],'classification':v['resultados'][0]['classificacoes'],'series':series},limitation='CEMPRE: empresas e outras organizações / unidades locais; não equivale a CNPJs ativos da Receita. Quebra metodológica em 2022; não concatenar à série anterior.')
        cempre.append({'variable_id':v['id'],'ano':int(year),'value':value,'evidence_id':e['evidence_id']})

snap=read(OUT/'snapshot-inicial.json'); prior=snap['indicators']; byyear={r['ano']:r for r in pib}
bindings={'econ_pib_municipal':'ibge-pib-2021-pib_mil_reais','econ_pib_municipal_2022':'ibge-pib-2022-pib_mil_reais',
          'econ_pib_per_capita':'ibge-pib-2023-pib_per_capita','econ_pib_per_capita_2022':'ibge-pib-2022-pib_per_capita',
          'econ_caged_estoque':'mte-2023-12-estoque','econ_caged_estoque_2024':'mte-2024-12-estoque',
          'econ_caged_saldo_2024':'mte-saldo-2024','econ_salario_medio':'cempre-1606-2022'}
for id,field in [('econ_pib_setor_servicos_pct','servicos'),('econ_pib_setor_industria_pct','industria')]:
    # Preserve the requested share-of-PIB meaning; separate public administration and taxes.
    r=byyear[2021];num=r['components_mil_reais'][field];den=r['pib_milhoes']*1000
    a=next(e for e in evidences if e['evidence_id']==r['evidence_ids'][field]);b=next(e for e in evidences if e['evidence_id']==r['evidence_ids']['pib_mil_reais'])
    ev(id,'ibge-base2010-2023.zip','IBGE','PIB dos Municípios, base referência 2010',field+' / PIB',2021,'%',{'numerator':a['raw_value'],'denominator':b['raw_value']},float(Decimal(a['raw_value'])/Decimal(b['raw_value'])*100),{'numerator':a['evidence_id'],'denominator':b['evidence_id']},{'formula':'100 * VAB da atividade / PIB a preços correntes','components':[a['evidence_id'],b['evidence_id']]},'Serviços excluem administração pública. Participação no PIB, não no VAB; impostos aparecem separadamente. Última abertura: 2021.')
    bindings[id]=id
ev('econ_total_empresas_ativas','rfb-layout.pdf','Receita Federal','Leiaute dos Dados Abertos do CNPJ','Estabelecimentos em situação ATIVA no município',2024,'estabelecimentos CNPJ',None,None,{'pages':[1,2,3,4],'finding':'Leiaute comprova estrutura, não a contagem municipal de 2024. Não extraída base completa de estabelecimentos, empresas e Simples para a competência requerida.'},limitation='MEI é opção SIMEI; ME/EPP são porte da empresa. DEMAIS não demonstra médias/grandes. Necessário cruzamento e deduplicação; não são parcelas mutuamente exclusivas.',status='NAO_VERIFICADO')
bindings['econ_total_empresas_ativas']='econ_total_empresas_ativas'
emap={e['evidence_id']:e for e in evidences}; audited=[]
for year in [2021,2022,2023]:
    original=emap[f'ibge-pib-{year}-pib_mil_reais']
    converted=dict(original,evidence_id=f'ibge-pib-{year}-milhoes',unit='R$ milhões',raw_unit='R$ mil',display_value=float(Decimal(original['raw_value'])/1000),transformation='Conversão de unidade: R$ mil / 1000 = R$ milhões; sem estimativa ou arredondamento adicional.')
    evidences.append(converted);emap[converted['evidence_id']]=converted
bindings['econ_pib_municipal']='ibge-pib-2021-milhoes'
bindings['econ_pib_municipal_2022']='ibge-pib-2022-milhoes'
bindings['econ_caged_estoque']='mte-202608-2023-12-estoque'
bindings['econ_caged_estoque_2024']='mte-202608-2024-12-estoque'
bindings['econ_caged_saldo_2024']='mte-202608-saldo-2024'
for ind in prior:
    id=ind['indicator_id']; e=emap[bindings[id]];value=e['display_value']
    if id in ['econ_pib_municipal','econ_pib_municipal_2022']:value=float(Decimal(e['raw_value'])/1000)
    audited.append({'id':id,'previous':ind,'evidence_id':e['evidence_id'],'value':value,'period':e['period'],'unit':ind['unit'] if id.startswith('econ_pib_municipal') else e['unit'],'status':e['status'],'decision':'INDISPONIVEL' if value is None else 'MANTIDO' if value==ind['value'] else 'CORRIGIDO'})
store={'scope':'economia somente; evidência externa, aguardando revisão humana','round':'P1-2026-10-04','source_accesses':logs,'indicators':audited,'evidences':evidences,'series':{'pib':pib,'novo_caged':caged,'saldo_anual':annual,'novo_caged_edicao_dez2024':caged_dec2024,'saldo_anual_edicao_dez2024':annual_dec2024,'cempre':cempre},'unresolved_legacy_stocks':[
 {'value':v,'previous_meaning':meaning,'status':'ORIGEM_NAO_COMPROVADA','finding':'Não foi localizado nos estoques municipais extraídos das duas edições; não atribuída revisão, competência ou universo sem prova.','matches':[r['competencia'] for r in caged+caged_dec2024 if r['estoque']==v]} for v,meaning in [(204815,'trecho antigo dizia dezembro/2024'),(211530,'GT dizia 2023'),(212800,'registry e GT alternativo diziam 2023'),(214042,'registry e GT diziam 2024')]]}
save(BASE/'economia_evidence_2026-10-04.json',store)
store['methodology_evidence']=[]
for name,pages in [('mte-methodology.pdf',[1,2,3]),('ibge-cempre-methodology.pdf',[1,2,3]),('ibge-pib-methodology.pdf',[1])]:
    a=access(name);reader=PdfReader(RAW/name)
    store['methodology_evidence'].append({'source':'MTE' if name.startswith('mte') else 'IBGE','url':a['url'],'accessed_at':a['accessed_at'],'raw_file':a['raw_file'],'sha256':a['sha256'],'pages':pages,'excerpts':[reader.pages[n-1].extract_text()[:350] for n in pages]})
save(BASE/'economia_evidence_2026-10-04.json',store)
save(OUT/'inventario-anterior.json',snap['p0_rows'])
save(OUT/'matriz-economia.json',audited)
with (OUT/'matriz-economia.csv').open('w',encoding='utf-8-sig',newline='') as f:
    keys=['id','valor_anterior','valor_encontrado','periodo','unidade','fonte_oficial','url_aberta','evidence_id','decisao']; writer=csv.DictWriter(f,fieldnames=keys);writer.writeheader()
    for a in audited:
        e=emap[a['evidence_id']];writer.writerow(dict(zip(keys,[a['id'],a['previous']['value'],a['value'],a['period'],a['unit'],e['source'],e['url'],e['evidence_id'],a['decision']])))
print('Investigados:',len(audited),'evidências:',len(evidences),'PIB:',len(pib),'CAGED:',len(caged))
