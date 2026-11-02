"""P2: extração reproduzível exclusivamente das respostas oficiais desta rodada."""
import csv, hashlib, html, io, json, re, unicodedata, zipfile
from collections import defaultdict
from decimal import Decimal
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/'data/radar_hub'; RAW=BASE/'financas_raw_2026-10-05'; OUT=ROOT/'docs/dados-publicos-revisao/p2-financas'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s) if not unicodedata.combining(c)).lower()
logs=read(RAW/'access_log.json'); accesses={a['name']:a for a in logs if a.get('status_code')==200}
evidences=[]; records=defaultdict(list); observations=defaultdict(list); selectors={}

def ev(eid,a,value,excerpt,**fields):
    assert hashlib.sha256((ROOT/a['raw_file']).read_bytes()).hexdigest()==a['sha256']
    e={'evidence_id':eid,'institution':'Tesouro Nacional','system':'SICONFI / FINBRA','url':a['url'],'endpoint':a['requested_url'],'accessed_at':a['accessed_at'],'territory':'São José dos Campos - SP','ibge_code':'3549904','fiscal_entity_code':'3549904','fiscal_code_meaning':'Código IBGE usado pelo SICONFI','sphere':'Municipal','currency':'BRL','unit':'BRL','price_basis':'valores correntes','raw_value':value,'display_value':value,'transformation':None,'evidence_excerpt':excerpt,'raw_file':a['raw_file'],'sha256':a['sha256'],'status':'CONFIRMADO_FONTE_OFICIAL',**fields}
    if e['unit'].startswith('%'):e.update(currency=None,price_basis=None)
    if e['institution']=='Tribunal de Contas do Estado de São Paulo':
        e.update(fiscal_entity_code='sao-jose-dos-campos',fiscal_code_meaning='Slug oficial TCESP, vinculado pelo catálogo municipal a São José dos Campos / IBGE 3549904')
    if e['institution']=='Prefeitura de São José dos Campos':
        e.update(fiscal_entity_code='46.643.466/0001-06',fiscal_code_meaning='CNPJ da Prefeitura identificado no PDF oficial; território municipal IBGE 3549904')
    evidences.append(e);return e

def add_api(name,index,row,family):
    a=accesses[name]; assert row['cod_ibge']==3549904 and row['uf']=='SP'
    kind=name.split('-')[0];year=row['exercicio'];period=row.get('periodo',1);unit='%' if '%' in row['coluna'] or row['cod_conta'].startswith('Percentual') else 'BRL'
    if kind=='rgf':assert row['co_poder']=='E'
    stage=row['coluna'];annex=row['anexo'];pct=norm(row['coluna'])
    eid=f'p2-{name}-row-{index+1}'
    competence=str(year) if kind=='dca' else f'{year}-{kind.upper()}-{"B" if kind=="rreo" else "Q"}{period}'
    e=ev(eid,a,row['valor'],{'json_pointer':f'/items/{index}','record':row},indicator_id=family,exercise=year,period=competence,period_number=period,frequency='Anual' if kind=='dca' else ('Bimestral' if kind=='rreo' else 'Quadrimestral'),statement=annex,variable=row['conta'],classification=row['cod_conta'],accounting_stage=stage,scope='Poder Executivo' if kind=='rgf' else 'Município, abrangência do demonstrativo consolidado',power='E' if kind=='rgf' else None,unit=unit,currency=None if unit=='%' else 'BRL',price_basis=None if unit=='%' else 'valores correntes',partial=year==2026,methodological_note='Classificação e estágio nativos preservados; contas pai/filha não podem ser somadas. Comparabilidade depende da taxonomia de cada exercício.')
    ob={'evidence_id':eid,'exercise':year,'competence':competence,'period_number':period,'partial':year==2026,'statement':annex,'classification':row['cod_conta'],'label':row['conta'],'stage':stage,'value':row['valor'],'unit':unit,'status':e['status'],'scope':e['scope'],'break_segment':'2013–2017' if year<2018 else ('2018–2021' if year<2022 else '2022 em diante')}
    observations[family].append(ob);selectors[(name,annex,row['cod_conta'],row['coluna'],row['conta'])]=e
    return e

# Apenas observações definidas por sua taxonomia nativa; nunca somar anexos.
for name,a in sorted(accesses.items()):
    if not re.fullmatch(r'(dca-\d{4}|rreo-\d{4}-\d|rgf-\d{4}-\d)',name):continue
    j=read(ROOT/a['raw_file']);assert j.get('hasMore') is False,'Resposta incompleta: '+name
    records[name]=j['items']
    for index,row in enumerate(j['items']):
        ann=row['anexo'];ann=('DCA-'+ann) if name.startswith('dca-') and ann.startswith('Anexo ') else ann
        col=norm(row['coluna']);code=row['cod_conta'];family=None
        if ann=='DCA-Anexo I-C':family='receita_dca_natureza'
        elif ann=='DCA-Anexo I-D':family='despesa_dca_natureza'
        elif ann=='DCA-Anexo I-E' and re.match(r'^\d{2} - ',row['conta']):family='despesa_dca_funcao'
        elif ann=='RREO-Anexo 01' and (code in ['TotalReceitas','SubtotalDasReceitas','TotalDespesas','SubtotalDasDespesas','ReceitasExcetoIntraOrcamentarias','ReceitasIntraOrcamentarias','ReceitasCorrentes','ReceitasDeCapital','ReceitaTributaria','ImpostosTaxasEContribuicoesDeMelhoria','TransferenciasCorrentes','OperacoesDeCredito','Investimentos']) and ('%' not in col and not col.startswith('saldo')):family='balanco_rreo'
        elif ann=='RREO-Anexo 14' and (code.endswith('BalancoOrcamentario') or 'ReceitaCorrenteLiquida' in code or 'AplicacaoTotalDasDespesasComAcoesEServicosPublicosDeSaude'==code or 'MinimoAnualDasReceitasDeImpostosNaManutencaoEDesenvolvimentoDoEnsino' in code or 'RestosAPagarProcessadosDemonstrativo' in code or 'RestosAPagarNaoProcessadosDemonstrativo' in code or code.startswith('ResultadoPrimario') or code.startswith('ResultadoNominal')):family='resumo_rreo'
        elif ann=='RGF-Anexo 01' and (code in ['DespesaComPessoalTotal','ReceitaCorrenteLiquida','ReceitaCorrenteLiquidaLimiteLegal','ReceitaCorrenteLiquidaAjustada','ReceitaCorrenteLiquidaAjustadaParaCalculoDosLimitesDaDespesaComPessoal'] or code.startswith(('LimiteMaximoDespesa','LimitePrudencialDespesa','LimiteDeAlertaDespesa'))):family='pessoal_rgf'
        elif ann=='RGF-Anexo 02' and ('quadrimestre' in col and (str(row['periodo'])+'o quadrimestre' in col or str(row['periodo'])+'º quadrimestre' in col)):
            family='divida_rgf'
        elif ann=='RGF-Anexo 04':family='credito_rgf'
        elif ann=='RGF-Anexo 05' and row['conta'].startswith('TOTAL ('):family='caixa_restos_rgf'
        elif ann=='RGF-Anexo 06' and ('Limite' in code or 'ReceitaCorrenteLiquida' in code or 'DividaConsolidada' in code):family='limites_rgf'
        if family:add_api(name,index,row,family)

def pick(name,annex,code,column=None,label=None):
    found=[e for (n,an,c,cl,la),e in selectors.items() if n==name and an==annex and c==code and (column is None or cl==column) and (label is None or la==label)]
    assert len(found)==1,(name,annex,code,column,label,len(found));return found[0]

def derived(id,parts,formula,value,unit='BRL',name=None):
    assert parts and all(p['display_value'] is not None for p in parts)
    p=parts[0]; e={**p,'evidence_id':id,'indicator_id':id,'variable':name or id,'raw_value':[a['display_value'] for a in parts],'display_value':float(value),'unit':unit,'currency':None if unit=='%' else 'BRL','price_basis':None if unit=='%' else 'valores correntes','transformation':{'formula':formula,'component_evidence_ids':[a['evidence_id'] for a in parts]},'status':'CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS','evidence_excerpt':{'component_evidence_ids':[a['evidence_id'] for a in parts]},'accounting_stage':p['accounting_stage'] if formula=='BRL / 1000000' else name or formula};evidences.append(e);return e

def dec(e):return Decimal(str(e['display_value']))
budget=[]
for year in range(2015,2027):
    name=f'rreo-{year}-'+('4' if year==2026 else '6'); p='Até o Bimestre'
    suffix='DemonstrativoSimplificadoBalancoOrcamentario'
    fields={'previsao_inicial':'PrevisaoInicial','previsao_atualizada':'PrevisaoAtualizada','receita_realizada':'ReceitasRealizadas','dotacao_inicial':'DotacaoInicial','dotacao_atualizada':'DotacaoAtualizada','despesa_empenhada':'DespesasEmpenhadas','despesa_liquidada':'DespesasLiquidadas','despesa_paga':'DespesasPagas'}
    row={'ano':year,'periodo':4 if year==2026 else 6,'parcial':year==2026,'abrangencia':'RREO consolidado, inclui intraorçamentárias conforme total do balanço','unidade':'BRL','evidence_ids':{}}
    parts={}
    for field,code in fields.items():
        try:e=pick(name,'RREO-Anexo 14',code+suffix,p)
        except AssertionError:
            row[field]=None;row['evidence_ids'][field]=None;continue
        row[field]=e['display_value'];row['evidence_ids'][field]=e['evidence_id'];parts[field]=e
    if 'receita_realizada' in parts and 'despesa_empenhada' in parts:
        e=derived(f'p2-resultado-orcamentario-{year}',[parts['receita_realizada'],parts['despesa_empenhada']],'receita realizada − despesa empenhada',dec(parts['receita_realizada'])-dec(parts['despesa_empenhada']),name='Resultado orçamentário calculado do balanço RREO')
        row['resultado_orcamentario']=e['display_value'];row['evidence_ids']['resultado_orcamentario']=e['evidence_id']
    for namefield,numer,denom in [('realizacao_receita_pct','receita_realizada','previsao_atualizada'),('empenhado_dotacao_pct','despesa_empenhada','dotacao_atualizada'),('liquidado_dotacao_pct','despesa_liquidada','dotacao_atualizada'),('pago_dotacao_pct','despesa_paga','dotacao_atualizada')]:
        if numer in parts and denom in parts and dec(parts[denom])!=0:
            e=derived(f'p2-{namefield}-{year}',[parts[numer],parts[denom]],f'{numer} / {denom} × 100',dec(parts[numer])/dec(parts[denom])*100,'%',namefield)
            row[namefield]=e['display_value'];row['evidence_ids'][namefield]=e['evidence_id']
        else:row[namefield]=None;row['evidence_ids'][namefield]=None
    budget.append(row)

# Reconciliação TCESP: soma decimal dos registros, sem misturar eventos.
tce_summary=[]
for year in [2023,2024]:
    for kind in ['receitas','despesas']:
        name=f'tce-{kind}-{year}';a=accesses[name];z=zipfile.ZipFile(ROOT/a['raw_file']);member=z.namelist()[0];sums=defaultdict(Decimal);counts=defaultdict(int);rows=0
        with z.open(member) as binary:
            for i,r in enumerate(csv.DictReader(io.TextIOWrapper(binary,encoding='latin1'),delimiter=';'),2):
                assert r['ano_exercicio']==str(year) and r['ds_municipio']=='São José dos Campos'
                val=Decimal(r['vl_arrecadacao' if kind=='receitas' else 'vl_despesa'].replace('.','').replace(',','.'))
                group='Arrecadação' if kind=='receitas' else r['tp_despesa'];sums[group]+=val;counts[group]+=1;rows+=1
        for group,total in sums.items():
            e=ev(f'p2-tce-{kind}-{year}-{norm(group).replace(" ","-")}',a,str(total),{'zip_member':member,'selector':{'ano_exercicio':str(year),'ds_municipio':'São José dos Campos',**({'tp_despesa':group} if kind=='despesas' else {})},'record_count':counts[group],'total_file_records':rows,'aggregation':'Soma decimal do valor assinado original; nenhum ajuste de sinal presumido'},institution='Tribunal de Contas do Estado de São Paulo',system='Transparência Municipal / AUDESP',fiscal_entity_code='sao-jose-dos-campos',fiscal_code_meaning='Slug oficial, mapeado pelo endpoint municipios para São José dos Campos',exercise=year,period=str(year),statement='Arquivo detalhado anual',variable=group,classification='Evento original',accounting_stage=group,scope='Todos os órgãos presentes no arquivo municipal',transformation={'formula':'soma decimal dos registros com o mesmo evento','selector':group},display_value=float(total),status='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS')
            tce_summary.append({'year':year,'kind':kind,'event':group,'value':float(total),'evidence_id':e['evidence_id'],'records':counts[group]})

# Reconciliação do saldo de empenhos: eventos separados e painel como prova da operação.
reconciliation=[]
emap={e['evidence_id']:e for e in evidences}
for year in [2023,2024]:
    events={r['event']:emap[r['evidence_id']] for r in tce_summary if r['year']==year and r['kind']=='despesas'}
    e=derived(f'p2-tce-empenhado-liquido-{year}',[events['Empenhado'],events['Reforço'],events['Anulação']],'Empenhado + Reforço − Anulação',dec(events['Empenhado'])+dec(events['Reforço'])-dec(events['Anulação']),name='Empenhos líquidos de anulação (TCESP)')
    panel=accesses[f'tce-painel-{year}']; text=html.unescape(re.sub('<.*?>',' ',(ROOT/panel['raw_file']).read_text(encoding='utf8')))
    raw=re.search(r'Despesa Total:\s*R\$([\d.,]+)',text).group(1);value=Decimal(raw.replace('.','').replace(',','.'))
    assert value==dec(e),'Agregação não coincide com o painel TCE'
    pe=ev(f'p2-tce-painel-empenhado-{year}',panel,raw,{'exact_excerpt':re.search(r'Despesa Total:.{0,130}',text).group(0)},institution='Tribunal de Contas do Estado de São Paulo',system='Painel municipal TCESP',exercise=year,period=str(year),statement='Painel municipal consolidado',variable='Despesa empenhada consolidada',accounting_stage='Empenhada líquida de anulações',classification='Total',display_value=float(value))
    row=next(r for r in budget if r['ano']==year)
    for field,event in [('receita_realizada','Arrecadação'),('despesa_liquidada','Valor Liquidado'),('despesa_paga','Valor Pago'),('despesa_empenhada',None)]:
        tc=e if event is None else emap[next(r['evidence_id'] for r in tce_summary if r['year']==year and r['event']==event)]
        reconciliation.append({'indicator':field,'exercise':year,'siconfi':row[field],'tce':tc['display_value'],'municipal':None,'siconfi_evidence_id':row['evidence_ids'][field],'tce_evidence_id':tc['evidence_id'],'difference':float(Decimal(str(row[field]))-dec(tc)),'decision':'CONCORDANTE' if row[field]==tc['display_value'] else 'DIVERGENCIA_NAO_RESOLVIDA','explanation':'Mesma abrangência consolidada e estágio. Empenhado TCESP é líquido de anulações; soma dos eventos reconciliada com o total publicado no painel.'})

# Conferência textual dos PDFs municipais: prova independente com página e valor exato.
from pypdf import PdfReader
pdfchecks=[]
for year in [2023,2024,2025]:
    for kind in ['rreo','rgf']:
        name=next(n for n in accesses if n.startswith(f'prefeitura-{kind}-{year}-'))
        a=accesses[name];pages=[p.extract_text() or '' for p in PdfReader(ROOT/a['raw_file']).pages]
        targets=[]
        if kind=='rreo':
            row=next(r for r in budget if r['ano']==year)
            targets=[(field,next(e for e in evidences if e['evidence_id']==row['evidence_ids'][field])) for field in ['receita_realizada','despesa_empenhada','despesa_liquidada','despesa_paga']]
        else:
            for column in ['Valor','% sobre a RCL Ajustada']:
                targets.append(('pessoal_'+column,pick(f'rgf-{year}-3','RGF-Anexo 01','DespesaComPessoalTotal',column)))
        for field,e in targets:
            formatted=f"{e['display_value']:,.2f}".replace(',','X').replace('.',',').replace('X','.')
            hits=[(i+1,t) for i,t in enumerate(pages) if formatted in t]
            if hits:
                page,text=hits[0]; start=text.index(formatted);raw=formatted
                pe=ev(f'p2-municipal-{kind}-{year}-{field}',a,raw,{'pdf_page':page,'exact_numeric_token':raw,'excerpt':text[max(0,start-160):start+len(raw)+160]},institution='Prefeitura de São José dos Campos',system='Portal da Transparência / relatórios fiscais publicados',exercise=year,period=e['period'],statement=e['statement'],accounting_stage=e['accounting_stage'],classification=e['classification'],variable=e['variable'],unit=e['unit'],display_value=float(Decimal(raw.replace('.','').replace(',','.'))),scope=e['scope'],publication_note=re.search(r'Documento gerado em [\d/]+ [\d:]+',text).group(0) if re.search(r'Documento gerado em [\d/]+ [\d:]+',text) else None)
                pdfchecks.append({'field':field,'exercise':year,'source_evidence_id':e['evidence_id'],'municipal_evidence_id':pe['evidence_id'],'page':page,'status':'TOKEN_EXATO_CONFERIDO_NO_DEMONSTRATIVO','value':pe['display_value']})
                for rec in reconciliation:
                    if rec['exercise']==year and rec['indicator']==field:rec.update(municipal=pe['display_value'],municipal_evidence_id=pe['evidence_id'])
            else:pdfchecks.append({'field':field,'exercise':year,'source_evidence_id':e['evidence_id'],'status':'DIVERGENCIA_OU_VERSAO_MUNICIPAL_DISTINTA','municipal_url':a['url']})
conflicts=[]
# Retificação posterior é documentada, mas a alteração exata ainda não está demonstrada.
# Não escolher entre dois montantes de DTP enquanto essa diferença não for reproduzida.
e=pick('rgf-2025-3','RGF-Anexo 01','DespesaComPessoalTotal','Valor')
if any(p['source_evidence_id']==e['evidence_id'] and p['status'].startswith('DIVERGENCIA') for p in pdfchecks):
    a=accesses[next(n for n in accesses if n.startswith('prefeitura-rgf-2025-'))]
    pages=[p.extract_text() or '' for p in PdfReader(ROOT/a['raw_file']).pages]
    page,text=next((i+1,t) for i,t in enumerate(pages) if re.search(r'DESPESA TOTAL COM PESSOAL - DTP[^\n]*[\d.,]+',t))
    line=next(l for l in text.splitlines() if l.startswith('DESPESA TOTAL COM PESSOAL - DTP'))
    raw=re.findall(r'\d{1,3}(?:\.\d{3})+,\d{2}',line)[0];municipal=Decimal(raw.replace('.','').replace(',','.'))
    pe=ev('p2-municipal-dtp-2025-divergente',a,raw,{'pdf_page':page,'exact_excerpt':line},institution='Prefeitura de São José dos Campos',system='RGF publicado no Portal da Transparência',exercise=2025,period='2025-RGF-Q3',statement='RGF-Anexo 01',variable='DTP Executivo',classification='DespesaComPessoalTotal',accounting_stage='Valor',display_value=None,status='NAO_VERIFICADO',source_value=float(municipal))
    entry=next(r for r in read(ROOT/accesses['siconfi-entregas-2025']['raw_file'])['items'] if r['instituicao'].startswith('Prefeitura') and r['entregavel']=='Relatório de Gestão Fiscal' and r['periodo']==3)
    conflicts.append({'indicator':'DTP Executivo 2025 Q3, valor absoluto','siconfi':e['display_value'],'municipal':float(municipal),'difference':float(dec(e)-municipal),'status':'DIVERGENCIA_NAO_RESOLVIDA','siconfi_evidence_id':e['evidence_id'],'municipal_evidence_id':pe['evidence_id'],'revision_record':entry,'revision_source':accesses['siconfi-entregas-2025'],'municipal_generated_at':'30/01/2026 16:58:48','explanation':'RGF SICONFI retificado em 30/04/2026, posterior ao PDF municipal de janeiro. A versão distinta está demonstrada; o ajuste de R$ 4.867,04 não foi isolado em documento comparativo. Valor absoluto suspenso, sem escolher fonte silenciosamente.'})
    e.update(source_value=e['display_value'],display_value=None,status='NAO_VERIFICADO',limitation=conflicts[-1]['explanation'])
    for rows in observations.values():
        for row in rows:
            if row['evidence_id']==e['evidence_id']:row.update(value=None,status='NAO_VERIFICADO',source_value=e['source_value'],limitation=e['limitation'])
for code,prefix,is_pct in [('DividaConsolidada','DÍVIDA CONSOLIDADA - DC',False),('DividaConsolidadaLiquida','DÍVIDA CONSOLIDADA LÍQUIDA (DCL)',False),('PercentualDaDCLSobreARCL','% da DCL sobre a RCL',True)]:
    e=pick('rgf-2025-3','RGF-Anexo 02',code,'Até o 3º Quadrimestre')
    name=next(n for n in accesses if n.startswith('prefeitura-rgf-2025-'));a=accesses[name]
    pages=[p.extract_text() or '' for p in PdfReader(ROOT/a['raw_file']).pages]
    page,text=next((i+1,t) for i,t in enumerate(pages) if any(l.startswith(prefix) for l in t.splitlines()))
    line=next(l for l in text.splitlines() if l.startswith(prefix));raw=re.findall(r'\d[\d.]*,\d{2}',line)[-1];value=Decimal(raw.replace('.','').replace(',','.'))
    if value!=dec(e):
        pe=ev('p2-municipal-'+code+'-2025-divergente',a,raw,{'pdf_page':page,'exact_excerpt':line,'column':'Até o 3º Quadrimestre'},institution='Prefeitura de São José dos Campos',system='RGF publicado no Portal da Transparência',exercise=2025,period='2025-RGF-Q3',statement='RGF-Anexo 02',variable=e['variable'],classification=code,accounting_stage='Até o 3º Quadrimestre',unit='%' if is_pct else 'BRL',display_value=None,status='NAO_VERIFICADO',source_value=float(value))
        conflicts.append({'indicator':e['variable']+' — 2025 Q3','siconfi':e['display_value'],'municipal':float(value),'difference':float(dec(e)-value),'status':'DIVERGENCIA_NAO_RESOLVIDA','siconfi_evidence_id':e['evidence_id'],'municipal_evidence_id':pe['evidence_id'],'revision_record':entry,'revision_source':accesses['siconfi-entregas-2025'],'municipal_generated_at':'30/01/2026 16:58:48','explanation':'API SICONFI e PDF municipal apresentam valores distintos após retificação registrada. Ajuste exato não reconciliado. Indicador suspenso, sem escolher um valor.'})
        e.update(source_value=e['display_value'],display_value=None,status='NAO_VERIFICADO',limitation=conflicts[-1]['explanation'])
        for rows in observations.values():
            for row in rows:
                if row['evidence_id']==e['evidence_id']:row.update(value=None,status='NAO_VERIFICADO',source_value=e['source_value'],limitation=e['limitation'])
# O anexo simplificado repete DCL e DCL/RCL: a suspensão acompanha os aliases,
# impedindo que o mesmo dado reapareça confirmado sob outro código.
for row in observations['limites_rgf']:
    if row['exercise']==2025 and row['period_number']==3 and row['classification']=='DividaConsolidadaLiquidaDemonstrativoSimplificado':
        e=next(e for e in evidences if e['evidence_id']==row['evidence_id'])
        e.update(source_value=e['display_value'],display_value=None,status='NAO_VERIFICADO',limitation='Alias de DCL/DCL-RCL 2025 Q3 com divergência não resolvida entre API e PDF municipal.')
        row.update(source_value=row['value'],value=None,status='NAO_VERIFICADO',limitation=e['limitation'])
save(OUT/'divergencias-nao-resolvidas.json',conflicts)
save(OUT/'reconciliacao-fontes.json',reconciliation);save(OUT/'conferencia-pdfs-municipais.json',pdfchecks)

# Decisão de cada indicador antigo: exercícios mantidos, conceitos corrigidos.
before=read(OUT/'snapshot-inicial.json'); decisions=[]
specs={
 'fin_orcamento_realizado':('Receita orçamentária realizada — RREO consolidado 2023',budget[8]['evidence_ids']['receita_realizada'],'R$ milhões'),
 'fin_orcamento_realizado_2024':('Receita orçamentária realizada — RREO consolidado 2024',budget[9]['evidence_ids']['receita_realizada'],'R$ milhões'),
 'fin_despesa_liquidada_2023':('Despesa orçamentária liquidada — RREO consolidado 2023',budget[8]['evidence_ids']['despesa_liquidada'],'R$ milhões'),
 'fin_superavit_orcamentario_2023':('Resultado orçamentário — receita realizada menos despesa empenhada (2023)',budget[8]['evidence_ids']['resultado_orcamentario'],'R$ milhões'),
 'fin_despesa_saude_pct':('Aplicação em ASPS — percentual publicado no RREO (2023)',pick('rreo-2023-6','RREO-Anexo 14','AplicacaoTotalDasDespesasComAcoesEServicosPublicosDeSaude','% Aplicado Até o Bimestre')['evidence_id'],'% da base de impostos e transferências do demonstrativo ASPS'),
 'fin_despesa_educacao_pct':('Aplicação em MDE — percentual publicado no RREO (2023)',pick('rreo-2023-6','RREO-Anexo 14','MinimoAnualDasReceitasDeImpostosNaManutencaoEDesenvolvimentoDoEnsinoDemonstrativoSimplificado','% Aplicado Até o Bimestre')['evidence_id'],'% da base de impostos e transferências do demonstrativo MDE'),
 'fin_despesa_pessoal_rcl_pct':('Despesa total com pessoal — Executivo / RCL ajustada (2023-Q3)',pick('rgf-2023-3','RGF-Anexo 01','DespesaComPessoalTotal','% sobre a RCL Ajustada')['evidence_id'],'% da RCL ajustada para pessoal'),
 'fin_receita_iss_milhoes':('ISSQN — receita bruta realizada na DCA (2023)',pick('dca-2023','DCA-Anexo I-C','RO1.1.1.4.51.1.0','Receitas Brutas Realizadas')['evidence_id'],'R$ milhões')}
emap={e['evidence_id']:e for e in evidences}
for old in before['indicators']:
    id=old['indicator_id'];name,eid,unit=specs[id];e=emap[eid];value=e['display_value']
    if unit=='R$ milhões':
        e=derived('p2-'+id+'-milhoes',[e],'BRL / 1000000',dec(e)/1000000,unit,name);eid=e['evidence_id'];value=e['display_value']
    decisions.append({'id':id,'name':name,'before':old['value'],'after':value,'exercise':e['exercise'],'period':e['period'],'unit':unit,'concept':e['variable'],'accounting_stage':e['accounting_stage'],'status':e['status'],'evidence_id':eid,'decision':'CORRIGIDO_COM_EVIDENCIA_P2','reason':'Valor/período/estágio legado não comprovado. Substituído pelo registro exato do exercício, com conceito explícito. O ID de superávit é preservado por compatibilidade, mas nome e fórmula são de resultado assinado.'})

store={'round':'P2-2026-10-05','scope':'financas','homologated':False,'source_accesses':logs,'evidences':evidences,'series':dict(observations),'budget_annual':budget,'tce_aggregates':tce_summary,'indicators':decisions,'unresolved_conflicts':conflicts,'methodology':{'result':'Receitas realizadas menos despesas empenhadas do MESMO RREO, subtotal/total consolidado. Exclui linha de financiamento do déficit/superávit e saldos de exercícios anteriores. Não equivale a resultado primário, nominal ou saldo de caixa.','nominal':'Todos os valores monetários correntes, sem deflator.','functions':'DCA I-E: funções de dois dígitos; subfunções não somadas novamente. Estágios mantidos separados. Função Saúde/Educação não equivale a ASPS/MDE.','taxonomies':'Receitas DCA: mudanças de códigos em 2018 e 2022 preservadas em segmentos. Sem concatenar códigos como se fossem a mesma conta. RGF: RCL ajustada depende da finalidade e mudanças nos demonstrativos.','partial':'2026 RREO até B4; RGF até Q2. Não é exercício encerrado. Fluxos acumulados não podem ser somados entre bimestres/quadrimestres.','scope':'RREO/DCA conforme relatório consolidado; RGF somente Executivo, sem Legislativo. Caixa por recursos mantém grupos; totais não somados a seus filhos.','older':'FINBRA 2012 bruto MDB preservado; incompatível para concatenação automática com PCASP/DCA. Não normalizado nesta rodada. PDFs municipais antigos ficam como oportunidades, sem números extraídos automaticamente para a base.','per_capita':'Não calculado: Demografia ainda não homologada.','revisions':'Extrato de entregas preserva homologação/retificação por exercício; a resposta consultada é um snapshot, não uma série de versões anteriores.'}}
save(BASE/'financas_evidence_2026-10-05.json',store);save(OUT/'reconciliacao-indicadores.json',decisions);save(OUT/'agregados-tce.json',tce_summary)
print('P2:',len(evidences),'evidências;',dict((k,len(v)) for k,v in observations.items()),';',len(decisions),'decisões antigas')
