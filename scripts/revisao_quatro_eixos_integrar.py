"""Integra apenas decisões revisadas; único escritor dos artefatos canônicos nesta fase."""
from pathlib import Path
import json,hashlib,copy,sys,importlib.util,re,functools
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008'
BASE=ROOT/'data/radar_hub';AXES=['educacao','saude','seguranca','demografia']
def read(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def dump(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
@functools.lru_cache(maxsize=None)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def relative(p):
    s=str(p or '').replace('\\','/')
    return s[len(str(ROOT).replace('\\','/'))+1:] if s.startswith(str(ROOT).replace('\\','/')+'/') else s
def canonical(v):return json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':'))

# A revisão humana final permanece pendente. Esta porta exige os dois pareceres técnicos.
if '--prepare' not in sys.argv:
    approval=read(OUT/'decisoes-integracao.json')
    assert approval['qa_approved'] and approval['methodology_approved'],'Faltam validações independentes'
    assert sha(OUT/'qa/validacao-evidencias.json')==approval['qa_sha256']
    assert sha(OUT/'metodologia/matriz-decisoes.json')==approval['methodology_sha256']
    for p,digest in approval['additional_validations'].items():assert sha(OUT/p)==digest,p
    approved_gt=read(OUT/'integracao-proposta-ground-truth.json');approved_reg=read(OUT/'integracao-proposta-registry.json')
    assert sha(OUT/'integracao-proposta-ground-truth.json')==approval['proposed_gt_sha256']
    assert sha(OUT/'integracao-proposta-registry.json')==approval['proposed_registry_sha256']

gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json')
before_gt=copy.deepcopy(gt);before_reg=copy.deepcopy(reg)
initial=read(OUT/'estado-inicial.json');initialhash={e['path']:e['sha256'] for e in initial['files']}
assert sha(ROOT/'app.js')==initialhash['app.js']
assert sha(BASE/'sjc_open_data_ground_truth.json')==initialhash['data/radar_hub/sjc_open_data_ground_truth.json'],'Não reaplicar sobre base já integrada'
registry={i['indicator_id']:i for i in reg['indicators']}
series={a:{} for a in AXES};metadata={a:{} for a in AXES};seen=set()
def add(axis,family,value,variable,period,unit,source,locator=None,extra=None,status=None,eid=None):
    src={'institution':source.get('institution',{'educacao':'INEP','saude':'SMS-SJC / SES-SP / Ministério da Saúde','seguranca':'SSP-SP','demografia':'IBGE'}[axis]),
         'source_url':source.get('source_url',source.get('url')),
         'raw_file':relative(source.get('raw_file',source.get('raw_reference',source.get('raw',source.get('file'))))),
         'sha256':source.get('sha256'),'accessed_at':source.get('accessed_at','2026-10-08'),
         'territory':source.get('territory',source.get('territorio','São José dos Campos/SP; IBGE 3549904')),
         'methodology':source.get('methodology',source.get('method',source.get('definition','Célula nativa publicada; ausências preservadas como null.'))),
         'edition':source.get('edition',source.get('year',None)),
         'source_query_date':source.get('source_query_date'),
         'member':source.get('member',source.get('zip_member')),'member_sha256':source.get('member_sha256')}
    assert src['raw_file'] and src['sha256'] and src['source_url'],(axis,family,source)
    assert sha(ROOT/src['raw_file'])==src['sha256'],src['raw_file']
    key=axis+':'+hashlib.sha256(canonical(src).encode()).hexdigest()[:20];metadata[axis][key]=src
    row={'evidence_id':eid or 'rev20261008:'+axis+':'+hashlib.sha256(canonical([family,variable,str(period),locator,extra]).encode()).hexdigest()[:24],
         'variable':variable,'period':str(period),'value':value,'unit':unit,'status':status or ('CONFIRMADO_FONTE_OFICIAL' if value is not None else 'SEM_DADO_NA_FONTE'),
         'source_metadata_id':key,'locator':locator or {},**(extra or {})}
    assert row['evidence_id'] not in seen,row['evidence_id'];seen.add(row['evidence_id'])
    series[axis].setdefault(family,[]).append(row)
    return {**src,**row,'raw_reference':src['raw_file'],'source_url':src['source_url']}

def source_manifest(axis,name):
    entries=read(OUT/axis/'manifest.json')
    candidates=[s for s in entries if Path(str(s.get('file',s.get('raw',s.get('path',s.get('name','')))))).name==name]
    assert candidates,(axis,name)
    x=candidates[-1];return {**x,'raw_file':relative(x.get('file',x.get('raw',x.get('path')))),'source_url':x.get('url',x.get('source_url'))}

# EDUCAÇÃO: edição, rede, etapa e universo são campos da observação, não agregações inferidas.
edu=read(OUT/'educacao/propostas.json')
for c in edu['registry_changes']:registry[c['indicator_id']][c['field']]=c['after']
old=read(ROOT/'docs/dados-publicos-revisao/consolidacao-geral/20261008T060731Z/educacao-inep-reproduzida.json')
for e in old['evidences']:
    add('educacao','inep_ideb_saeb_rendimento',e['value'],e['native_variable'],e['period'],e['unit'],e,
        {k:e[k] for k in ['sheet','row','column','header_row'] if k in e},
        {k:e[k] for k in ['stage','network','raw_value'] if k in e},eid=e['evidence_id'])
censos=read(OUT/'educacao/ampliacao-censo2023-2025.json')['series']
for year in censos:
    for e in year['matriculas']:
        add('educacao','censo_matriculas',e['value'],e['field'],year['year'],e['unit'],e,
            {k:e[k] for k in ['sheet','row','column']},{'network':e['network'],'raw_value':e['raw_value']},eid=e['evidence_id'])
    for e in year['redes']:
        add('educacao','censo_matriculas_por_rede',e['value'],'matriculas',year['year'],'matrículas',e,
            {'sheet':e['sheet'],'row':e['row'],'columns_summed':e['columns']},
            {'network':e['network'],'urban':e['urban'],'rural':e['rural'],'denominator':e['denominator'],'percentage':e['pct']},status='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS')
    for e in year['auxiliares']:
        add('educacao','censo_'+e['family'],e['value'],e['family'],year['year'],e['unit'],e,
            {k:e[k] for k in ['sheet','row','column']},{'definition':e['definition'],'notes_reference':relative(OUT/'educacao/ampliacao-censo2023-2025.json')})
for e in read(OUT/'educacao/indicadores2025-reproduzidos.json')['evidences']:
    add('educacao',e['family'],e['value'],e['native_variable'],e['year'],e['unit'],e,
        {k:e[k] for k in ['sheet','row','column']},{k:e[k] for k in ['location','network','raw_value']},eid=e['evidence_id'])

# SAÚDE: edições históricas RAG preservadas externamente; seleção com revisão datada explícita.
for e in read(OUT/'saude/historicos-rag-proposta.json'):
    add('saude',e['family']+'_residentes_rag',e['value'],e['family'],e['year'],e['unit'],e,
        {'pages':e['pages'],'native_header':e['native_header'],'native_total_row':e['native_total_row']},
        {'scope':e['scope'],'source_query_date':e['source_query_date'],'edition':e['edition'],'selection_policy':'Edição selecionada na matriz RAG; revisões preservadas em quebras-revisoes-rag.json.'})
for e in read(OUT/'saude/dengue-cve-extracao.json'):
    src={**e,'institution':'SES-SP / CVE','methodology':e['definition']+' '+e['coverage']}
    add('saude','dengue_cve_anual',e['total_confirmed'],'casos_confirmados_autoctones_importados',e['year'],'casos confirmados',src,
        {'csv_row':e['csv_row'],'municipality_column':e['municipality_column'],'field':'TOTAL'},
        {'autoctones':e['total_confirmed_autochthonous'],'importados':e['total_confirmed_imported'],'coverage':e['coverage']})
    for m in e['months']:
        add('saude','dengue_cve_mensal',m['confirmed_autochthonous']+m['confirmed_imported'],'casos_confirmados_autoctones_importados',f"{e['year']}-{m['month']:02}",'casos confirmados',src,
            {'csv_row':e['csv_row'],'month':m['month']},{'autoctones':m['confirmed_autochthonous'],'importados':m['confirmed_imported'],'notificados':m['notified']})
cn=read(OUT/'saude/cnes-extracao.json');cnsource={**source_manifest('saude','cnes-leitos-202412.html'),'institution':'Ministério da Saúde / DATASUS / CNES','territory':'Município do estabelecimento354990, SP35; competência12/2024'}
for e in cn['rows']:
    add('saude','cnes_codigos_202412',e['existing'],e['description'],'2024-12','leitos existentes',cnsource,
        {'html_tr_index':e['html_tr_index'],'code':e['code']},
        {'native_code':e['code'],'second_column_value':e['second_column'],'second_column_label':e['second_column_label'],'warning':'Habilitados em complementares não equivalem à coluna SUS; não converter estes códigos nos KPIs suspensos.'},status='DISPONIVEL_COM_LIMITACAO')
for c in read(OUT/'saude/propostas.json'):
    if 'indicator_id' in c and isinstance(c.get('after'),dict):registry[c['indicator_id']].update(c['after'])
for c in read(OUT/'saude/propostas.json'):
    if c.get('action')!='UPDATE_EXISTING_CONFIRMED_PERIOD_AFTER_QA':continue
    i=registry[c['indicator_id']];preliminary=c['indicator_id']=='saude_mortalidade_infantil'
    src={**c['primary'],'methodology':c['reason']+' '+('Resultado preliminar2025; não recalculado com contagens de outra edição.' if preliminary else 'Competência anual nativa publicada; residentes ou cobertura APS conforme definição da fonte.')}
    proof=add('saude','indicadores_competencias_revisadas',c['after'],c['indicator_id'],c['base_year'],i['unit'],src,
        {'page':c['page'],'indicator':c['indicator_id']},{'preliminary':preliminary},
        status='DISPONIVEL_COM_LIMITACAO' if preliminary else 'CONFIRMADO_FONTE_OFICIAL')
    i.update(value=c['after'],base_year=c['base_year'],competencia=str(c['base_year'])+(' (preliminar)' if preliminary else ''),evidencia=proof,
        audit_status=proof['status'],status_badge=proof['status'],official_url=proof['source_url'],methodology=src['methodology'],audit_date='2026-10-08')
    if preliminary:i['name']='Taxa de mortalidade infantil publicada pela SMS — 2025 preliminar'

# SEGURANÇA: localizar cada delito, preservar unidade e competências publicadas.
security_evidence={}
for e in read(OUT/'seguranca/evidencias-reproduzidas.json'):
    year=e['locator']['data_year'];ident=e['locator']['idDelito'];conflict=year==2001 and ident in [38,30,21,37,22]
    security_evidence[(year,ident)]=add('seguranca','ssp_anuais_por_delito',None if conflict else e['value'],e['native_label'],e['competence'],e['unit'],e,e['locator'],
        {'native_total':e['native_total'],'native_id':ident,'published_months':e['published'],'partial':e['partial'],
         'scope':'Julho/2001 em diante: município da ocorrência; janeiro–junho/2001: município de registro.',
         'conflict':conflict},status='SUSPENSO_CONFLITO_EDICAO' if conflict else None,eid=e['evidence_id'])
    for i,val in enumerate(e['monthly_values']):
        add('seguranca','ssp_mensais_por_delito',val,e['native_label'],f'{year}-{i+1:02}',e['unit'],e,
            {**e['locator'],'field':['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'][i]},
            {'native_id':ident,'published_months':e['published'],'territorial_scope':'local de registro' if year==2001 and i<6 else 'local de ocorrência'},
            status='SEM_COMPETENCIA_PUBLICADA' if val is None else 'CONFIRMADO_FONTE_OFICIAL',eid=e['evidence_id']+':'+str(i+1))
for e in read(OUT/'seguranca/taxas-evidencias.json'):
    add('seguranca','ssp_taxas_publicadas',e['value'],e['locator']['field'],e['year'],e['unit'],e,e['locator'],
        {'native':e['native'],'denominator_source':e['denominator_source'],'denominator_value':None},eid=e['evidence_id'])
prodsrc=source_manifest('seguranca','produtividade-2024.json')
pr={r['idDelito']:r for b in read(OUT/'seguranca/produtividade-2024.json')['data'] for r in b['listaDados']}
prodproof={}
for ident,e in pr.items():
    prodproof[ident]=add('seguranca','ssp_produtividade_2024',e['total'],e['delito']['delito'],'2024','registros administrativos SSP (rótulo nativo)',prodsrc,
        {'grupoDelito':9,'idDelito':ident,'field':'total'},
        {'native_id':ident,'published_months':e['publicado'],'warning':'Não somar prisões, flagrantes e mandados nem interpretar como pessoas únicas.'})
for name,ident,total in [('seg_roubos_veiculos_2024',37,143),('seg_furtos_veiculos_2024',22,724)]:
    i=registry[name];proof=security_evidence[(2024,ident)];assert proof['value']==total
    i.update(value=total,unit='ocorrencias',audit_status='CONFIRMADO_FONTE_OFICIAL',status_badge='CONFIRMADO_FONTE_OFICIAL',evidencia=proof,
             official_url=proof['source_url'],source_system='SSP-SP / OcorrenciasMensais, município560, grupo6, delito'+str(ident),audit_date='2026-10-08',methodology='Total nativo de 12 meses, confirmado por soma mensal; município da ocorrência, não vítimas nem pessoas únicas.')
i=registry['seg_produtividade_prisoes'];proof=prodproof[88]
i.update(value=2170,name='Prisões — indicador administrativo nativo SSP, 2024',unit='registros administrativos',audit_status='CONFIRMADO_FONTE_OFICIAL',status_badge='CONFIRMADO_FONTE_OFICIAL',evidencia=proof,
         official_url=proof['source_url'],source_system='SSP-SP / Produtividade, município560, grupo9, delito88',audit_date='2026-10-08',methodology='Total nativo2170, soma12meses. Não é soma de flagrantes1420 e mandados1111; não comprova pessoas únicas.')
for e in gt['eixos']['seguranca']['taxa_homicidios_dolosos_serie']:
    if e['ano']==2001:
        e.update(ocorrencias=None,vitimas=None,status='DISPONIVEL_COM_LIMITACAO',occurrences_status='SUSPENSO_CONFLITO_EDICAO',rate_status='CONFIRMADO_FONTE_OFICIAL',universe='Taxa nativa SSP/SEADE separada; contagem2001 conflita entre anual231 e mensal229; quebra territorial em julho2001. Vítimas não substituem ocorrências.')
    else:
        e['vitimas']=security_evidence[(e['ano'],41)]['value']
        e['universe']='Ocorrências delito38; vítimas delito41; taxa nativa SSP/SEADE, unidades distintas.'
gt['eixos']['seguranca']['produtividade_policial_2024']['prisoes_efetuadas']=2170
gt['eixos']['seguranca']['produtividade_policial_2024']['audit_status']='DISPONIVEL_COM_LIMITACAO'
gt['eixos']['seguranca']['produtividade_policial_2024']['consolidacao_note']='Somente prisões2170 promovidas; demais campos legados suspensos. Não confundir prisões com pessoas únicas ou soma flagrante/mandado.'

# DEMOGRAFIA: censos, estimativas e classificação domiciliar são produtos distintos.
demo=read(OUT/'demografia/propostas.json');dmatrix={e['indicator_id']:e for e in read(OUT/'demografia/matriz-evidencias.json')}
for family,key,filename in [('estimativas_populacionais','estimativas_2001_2026','sidra6579.json'),('censos_populacionais','censos_1970_2022','sidra202-historica.json')]:
    for e in demo[key]:
        src=source_manifest('demografia','sidra4714.json' if family=='censos_populacionais' and e['ano']==2022 else filename)
        add('demografia',family,e['populacao'],'populacao',e['ano'],'habitantes',src,{'year':e['ano'],'source_row':e['source_row']},{'population_type':e['tipo']})
psource=source_manifest('demografia','sidra9514-quinquenal-correto.json')
for e in demo['piramide_2022_21faixas']:
    for sex,code in [('homens','4'),('mulheres','5'),('total','6794')]:
        add('demografia','piramide_etaria_censo_2022',e[sex],'populacao','2022','habitantes',psource,
            {'D4C':code,'D5C':e['classe_id']},{'sex':sex,'age_band':e['faixa'],'age_class':e['classe_id']})
usource=source_manifest('demografia','sidra9923.json')
for code,value in demo['situacao_domicilio_2022'].items():
    add('demografia','situacao_domicilio_2022',value,{'1':'urbana','2':'rural','6795':'total'}[code],'2022','habitantes',usource,{'D4C':code},
        {'classification':'Situação do domicílio IBGE/Censo2022; diverge classificação municipal publicada.'})
dsource=source_manifest('demografia','sidra4711-especies-correto.json')
for code,e in demo['domicilios_2022_especies'].items():
    add('demografia','domicilios_especies_2022',e['valor'],e['nome'],'2022','domicílios',dsource,{'D4C':code},
        {'classification_code':code,'warning':'Categorias hierárquicas; não somar total com subcategorias.'})
for name,value in demo['registry_values'].items():
    m=dmatrix[name];src=source_manifest('demografia',Path(m['arquivo_bruto'].replace('\\','/')).name)
    proof=add('demografia','indicadores_derivados_revisados',value,name,m['competencia'],m['unidade'],src,
        {'selection':m['locator']},{'definition':m['metodo']},status='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS' if name=='demo_taxa_urbanizacao' else None)
    i=registry[name];i.update(value=value,status_badge=proof['status'],audit_status=proof['status'],audit_date='2026-10-08',evidencia=proof,
        source_agency='Instituto Brasileiro de Geografia e Estatística (IBGE)',source_system='IBGE / SIDRA9923 / Censo2022' if name=='demo_taxa_urbanizacao' else 'IBGE / SIDRA6579 / Estimativas da População',official_url=src['source_url'],raw_file=src['raw_file'])
    if name=='demo_taxa_urbanizacao':
        i.update(name='População urbana — situação do domicílio IBGE, Censo2022',methodology='688155residentesurbanos /697054residentestotais×100=98.7233468%; exibido98.72%. Não usar681842 da classificação municipal divergente.',base_year=2022)
    else:
        y=2024 if name.endswith('2024') else 2026
        i.update(name=f'População residente estimada (IBGE, referência1julho{y})',methodology=f'Estimativa nativa oficial IBGE/SIDRA6579 para{y}; não projeção linear nem resultado censitário.',base_year=y,frequency='Anual')
        block=gt['eixos']['demografia'][f'populacao_estimada_{y}']
        block.update(total=value,valor=value,tipo='Estimativa oficial IBGE',audit_status='CONFIRMADO_FONTE_OFICIAL',nota=i['methodology'],fonte_nome='IBGE / Estimativas da População',fonte_url=src['source_url'],data_consulta='2026-10-08',consolidacao_note='Confirmado nesta revisão por SIDRA6579;2026 corroborado XLSX original.')

# Metadados obsoletos são preservados em histórico externo, sem funcionar como prova ativa.
legacy=[]
for i in reg['indicators']:
    if i['category'] not in AXES:continue
    original=next(x for x in before_reg['indicators'] if x['indicator_id']==i['indicator_id'])
    legacy.append({'indicator_id':i['indicator_id'],'before':original,'reason':'Histórico anterior à revisão independente; não é autoridade da versão ativa.'})
    i['audit_date']='2026-10-08'
    proof=i.get('evidencia') or {}
    i['raw_file']=relative(proof.get('raw_file',proof.get('raw_reference'))) or None
    i['trecho_bruto']=None
    i['legacy_metadata_reference']=relative(OUT/'metadados-legados-preservados.json')
    if i['value'] is None:
        i['verificacao']='nao_verificado';i['evidence_id']=None
        i['evidencia']={'value':None,'url':i.get('official_url'),'data_consulta':'2026-10-08','motivo_nao_verificado':'Escopo ou denominador deste indicador não reproduzido; não representa zero. Histórico preservado separadamente.'}
        i['methodology']='Indicador suspenso: escopo, competência ou denominador sem reprodução externa suficiente para este KPI; não representa zero. Ver relatório do eixo nesta revisão.'
        i['context_warning']='Suspensão mantida; textos e valores anteriores preservados no histórico, sem autoridade ativa.'
    else:
        i['verificacao']='primaria';i['last_checked']='2026-10-08'
        i['evidence_id']=proof.get('evidence_id')
        proof['url']=proof.get('source_url',proof.get('url',i.get('official_url')))
        proof['data_consulta']=proof.get('accessed_at',proof.get('data_consulta','2026-10-08'))
        proof['resumo_conferencia']=f"Reprodução independente: {i['value']} {i['unit']}; competência {i.get('competencia',i['base_year'])}; arquivo/hash/locator na evidência. Revisão humana final pendente."
        i['evidencia']=proof
        i['context_warning']='Evidência reproduzida e validada independentemente; revisão humana final pendente. Universo e edição explícitos.'
    if i['indicator_id']=='seg_roubos_gerais':
        i['methodology']='Total roubo-outros965=959roubo-outros+6roubocarga+0roubobanco; veículos separados. Delito30SSP, município560,2024.'
    if i['indicator_id']=='seg_homicidios_dolosos_2024':i['source_system']='SSP-SP / OcorrenciasAnuais, município560; reconciliação mensal delito38'
    if i['indicator_id']=='seg_taxa_homicidios':i['methodology']='Taxa nativa publicada SSP3.28/100milhabitantes em2024; população de referência SEADE. Não recalculada comIBGEatual; denominador exato não consta endpoint.'
for axis in AXES:
    gt['eixos'][axis]['series_auditadas']=series[axis]
    gt['eixos'][axis]['series_metadata']=metadata[axis]
    gt['eixos'][axis]['revisao_independente']={'date':'2026-10-08','human_review_pending':True,'report':relative(OUT/axis/'relatorio.md'),'methodology':relative(OUT/'metodologia/relatorio.md'),'qa':relative(OUT/'qa/validacao-evidencias.json'),'scope':'Fontes e recortes validados; gráficos sob quarentena mantêm gates até vínculo completo; sem homologação geral.'}
reg['last_audit_execution']='2026-10-08';reg['registry_version']=str(reg['registry_version'])+'-review4-20261008'
for axis in ['economia','financas','meio_ambiente','mobilidade']:assert gt['eixos'][axis]==before_gt['eixos'][axis],axis
assert [i for i in reg['indicators'] if i['category'] not in AXES]==[i for i in before_reg['indicators'] if i['category'] not in AXES]
assert len([i for i in reg['indicators'] if i['value'] is None])==28
if '--prepare' not in sys.argv:assert gt==approved_gt and reg==approved_reg,'Reconstrução diverge da proposta aprovada'
consistency=read(BASE/'radar_hub_consistency.json')
historical_divergences=copy.deepcopy(consistency['divergences'])
consistency['divergences']=[d for d in consistency['divergences'] if not str(d.get('id','')).startswith(('demo_','seg_','educ_','saude_'))]
consistency['revisao_quatro_eixos']={'date':'2026-10-08','human_review_pending':True,
    'historical_divergences':relative(OUT/'consistencia-legada-preservada.json'),
    'scope':'Registro atual versus evidência da MESMA competência; campos históricos de outras competências não são substitutos.',
    'current_checks':[{'id':i['indicator_id'],'registry':i['value'],'evidence':i.get('evidencia',{}).get('value'),'competence':i.get('competencia',i['base_year']),
        'pass':i['value']==i.get('evidencia',{}).get('value'),'status':i['audit_status']} for i in reg['indicators'] if i['category'] in AXES]}
assert all(e['pass'] for e in consistency['revisao_quatro_eixos']['current_checks'])
status=read(BASE/'consolidacao_status.json')
status.update(previous_report=status['report'],report=relative(OUT/'relatorio-consolidado.md'),
    independent_review={'axes':AXES,'date':'2026-10-08','decisions':relative(OUT/'decisoes-integracao.json'),'human_review_pending':True})
dump(OUT/'metadados-legados-preservados.json',legacy)
dump(OUT/'consistencia-legada-preservada.json',historical_divergences)
dump(OUT/'integracao-proposta-ground-truth.json',gt)
dump(OUT/'integracao-proposta-registry.json',reg)
dump(OUT/'integracao-proposta-consistency.json',consistency)
dump(OUT/'integracao-proposta-status.json',status)
old_registry={i['indicator_id']:i for i in before_reg['indicators']}
dump(OUT/'integracao-resumo.json',{'stage':'PREPARE' if '--prepare' in sys.argv else 'INTEGRATED','counts':{a:sum(map(len,series[a].values())) for a in AXES},'families':{a:{k:len(v) for k,v in series[a].items()} for a in AXES},'registry_nulls':28,'new_registry_values':{i['indicator_id']:i['value'] for i in reg['indicators'] if i['value']!=old_registry[i['indicator_id']]['value']}})
if '--prepare' in sys.argv:
    print('Proposta escrita; canônicos intactos');sys.exit(0)
spec=importlib.util.spec_from_file_location('builder',ROOT/'scripts/build_radar_hub_package.py');builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
builder.write_atomic(BASE/'sjc_open_data_ground_truth.json',json.dumps(gt,ensure_ascii=False,indent=2)+'\n')
builder.write_atomic(BASE/'sjc_metadata_registry.json',json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
builder.write_atomic(BASE/'radar_hub_consistency.json',json.dumps(consistency,ensure_ascii=False,indent=2)+'\n')
builder.write_atomic(BASE/'consolidacao_status.json',json.dumps(status,ensure_ascii=False,indent=2)+'\n')
print('Dados integrados; corrigir controller/rótulos e regenerar package no integrador.')
