"""Aplicação P3 restrita a Meio Ambiente; preserva valores dos outros eixos."""
from collect_meio_ambiente_p3 import ROOT,BASE,OUT,read
import json,copy,re
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
snap=read(OUT/'snapshot-inicial.json');store=read(BASE/'meio_ambiente_evidence_2026-10-05.json');s=store['series'];decisions=[]
def select(family,period):
    found=[e for e in s[family] if e['period']==str(period)];assert len(found)==1,(family,period,len(found));return found[0]
chosen={'amb_focos_queimadas_2024':select('focos_anuais',2024),'amb_focos_queimadas_2023':select('focos_anuais',2023),'amb_saneamento_agua_tratada':select('sinisa_IAG0001',2023),'amb_saneamento_tratamento_esgoto':select('snis_IN016',2022),'amb_saneamento_perdas_distribuicao':select('sinisa_IAG2013',2023)}
reg=copy.deepcopy(snap['registry']); gt=read(BASE/'sjc_open_data_ground_truth.json')
for i in reg['indicators']:
    if i['category']!='meio_ambiente':continue
    before=copy.deepcopy(i);e=chosen.get(i['indicator_id']);status=e['status'] if e else 'ORIGEM_NAO_COMPROVADA';value=e['value'] if e else None
    reason='Substituído por dado externo reproduzível do produto e competência declarados.' if e else 'Indicador legado sem evidência externa suficiente; preservar ausência. Coleta domiciliar não substituída por indicador volumétrico.'
    if e:
        ev={**e,'valor':e['value'],'competencia':e['period'],'data_consulta':e['accessed_at'],'trecho_bruto':json.dumps(e['locator'],ensure_ascii=False)}
        i.update(name=e['variable'],value=value,unit=e['unit'],base_year=e['period'],competencia=e['period'],frequency=e['frequency'],source_agency='INPE' if e['family'].startswith('focos') else 'Ministério das Cidades',source_system=e.get('system'),official_url=e['url'],evidence_id=e['evidence_id'],geographic_level=e['spatial_scope'],methodology=e['variable']+'; código nativo '+e.get('native_code','satélite de referência')+'; '+json.dumps(e['transformation'],ensure_ascii=False)+'; numerador: '+e.get('numerator','contagem')+'; denominador: '+e.get('denominator','não se aplica'),context_warning='P3 aguarda revisão humana. '+' '.join(e['limitations']),evidencia=ev,spatial_scope=e['spatial_scope'])
    else:i.update(value=None,context_warning=reason,methodology=reason,evidencia={'status':status,'legacy_value':before['value'],'reason':reason,'round':'P3 2026-10-05'},evidence_id=None)
    i.update(audit_status=status,status_badge=status,verificacao='primaria' if e else 'nao_verificado',last_checked='2026-10-05',audit_date='2026-10-05',valid_until=None)
    decisions.append({'id':i['indicator_id'],'name':before['name'],'before':before['value'],'after':value,'before_period':before['base_year'],'period':e['period'] if e else before['base_year'],'status':status,'reason':reason,'evidence_id':e['evidence_id'] if e else None,'url':e['url'] if e else None,'old_definition':before.get('methodology'),'new_definition':i['methodology']})
# Novos escalares preservam seus códigos e denominadores próprios.
for family in ['sinisa_IAG0001','sinisa_IES0001','sinisa_IES2004','sinisa_IAG2013','sinisa_IRS0001','sinisa_IRS0005','sinisa_IRS3010','vegetacao_nativa','arborizacao_censo','esgoto_censo','snis_IN055']:
    e=max(s[family],key=lambda e:e['period']);iid='amb_p3_'+family
    reg['indicators'].append({'indicator_id':iid,'category':'meio_ambiente','name':e['variable'],'value':e['value'],'unit':e['unit'],'base_year':e['period'],'competencia':e['period'],'frequency':e['frequency'],'source_agency':e.get('system','IBGE' if 'censo' in family else 'IPA / DataGEO'),'source_system':e.get('system',family),'official_url':e['url'],'audit_status':e['status'],'status_badge':e['status'],'geographic_level':e['spatial_scope'],'spatial_scope':e['spatial_scope'],'audit_date':'2026-10-05','last_checked':'2026-10-05','valid_until':None,'verificacao':'primaria','methodology':e['variable'],'context_warning':'P3 aguarda revisão humana. '+' '.join(e['limitations']),'evidence_id':e['evidence_id'],'evidencia':e})
env=copy.deepcopy(snap['groundTruth']['eixos']['meio_ambiente']);supplemental=[]
def suspend(v,path=''):
    if isinstance(v,dict):return {k:suspend(x,path+'.'+k) for k,x in v.items()}
    if isinstance(v,list):return [suspend(x,path+f'[{i}]') for i,x in enumerate(v)]
    if isinstance(v,(int,float)) and not isinstance(v,bool):
        supplemental.append({'path':path,'before':v,'after':None,'status':'SUSPENSO_LEGADO','reason':'Valor direto legado não aceito como prova; consultar séries P3 com evidência.'});return None
    return v
env=suspend(env)
# Textos legados causais/normativos não permanecem na base ativa.
def cleanse(v):
    if isinstance(v,dict):return {k:cleanse(x) for k,x in v.items()}
    if isinstance(v,list):return [cleanse(x) for x in v]
    if isinstance(v,str):return 'Conteúdo legado suspenso; consultar evidência P3.'
    return v
env=cleanse(env)
env['focos_queimadas_inpe_serie']=[{'ano':int(e['period']),'focos':e['value'],'evidence_id':e['evidence_id'],'product':'satellite_reference','spatial_scope':e['spatial_scope']} for e in s['focos_anuais']]
env['qualidade_ar_cetesb_mensal_2023_2024']=[]
env['series_auditadas']={k:sorted(v,key=lambda e:e['period']) for k,v in s.items()}
env['saneamento_snis_2022']={'agua_pct_populacao_total':select('snis_IN055',2022)['value'],'coleta_esgoto_pct_agua_consumida':select('snis_IN015',2022)['value'],'tratamento_esgoto_pct_coletado':select('snis_IN016',2022)['value'],'perdas_distribuicao_pct':select('snis_IN049',2022)['value'],'period':2022,'evidence_ids':{c:select('snis_'+c,2022)['evidence_id'] for c in ['IN055','IN015','IN016','IN049']}}
env.update(audit_round='P3 2026-10-05',audit_status='AUDITADO_EXTERNAMENTE_AGUARDANDO_REVISAO',homologated=False,evidence_store='data/radar_hub/meio_ambiente_evidence_2026-10-05.json',limitations=store['methodology'],fonte_nome='Fontes primárias por observação — P3',fonte_url='https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/sinisa')
gt['eixos']['meio_ambiente']=env
assert {k:v for k,v in gt['eixos'].items() if k!='meio_ambiente'}=={k:v for k,v in snap['groundTruth']['eixos'].items() if k!='meio_ambiente'}
assert [i for i in reg['indicators'] if i['category']!='meio_ambiente']==[i for i in snap['registry']['indicators'] if i['category']!='meio_ambiente']
save(BASE/'sjc_open_data_ground_truth.json',gt);save(BASE/'sjc_metadata_registry.json',reg)
save(OUT/'matriz-legados.json',decisions);save(OUT/'campos-diretos-legados.json',supplemental)
binding={'scope':'meio_ambiente','round':'P3 2026-10-05','homologated':False,'indicators':{i['indicator_id']:{'value':i['value'],'status':i['audit_status'],'period':i['base_year'],'evidence_id':i.get('evidence_id'),'url':i.get('official_url')} for i in reg['indicators'] if i['category']=='meio_ambiente'}}
save(BASE/'meio_ambiente_audit_bindings.json',binding)
cons=read(BASE/'radar_hub_consistency.json');cons['divergences']=[d for d in cons['divergences'] if not d['id'].startswith('amb_')];cons['meio_ambiente']={'validation_scope':'P3 aguardando revisão humana','legacy_decisions':decisions,'unresolved':['Ar anual/mensal legado','União geométrica de áreas protegidas','Coleta domiciliar legada','Histórico municipal meteorológico/hidrológico','Metodologia área urbanizada 2022 na API','Resíduos: massa per capita publicada exige reconciliação com informações brutas']};save(BASE/'radar_hub_consistency.json',cons)
code=(OUT/'radar_hub_controller.js.before').read_text(encoding='utf8')
def replace_function(name,body):
    global code
    start=code.index('  function '+name+'(');end=code.index('\n  function ',start+10)
    # Fim inclui comentários entre funções, sem atingir a função seguinte.
    code=code[:start]+body+'\n'+code[end:]
replace_function('renderMeioAmbienteArChart',"""  function renderMeioAmbienteArChart(gt) {
    destroyChart('hubChartMeioAmbienteAr');
    showChartFallback('hubChartMeioAmbienteAr', null, 'https://qualar.cetesb.sp.gov.br/qualar/', 'CETESB', 'Séries anuais/mensais legadas sem comprovação. Snapshot por estação no exportável P3; acesso ao histórico pendente.');
    hideSkeleton('hubChartMeioAmbienteAr');
  }
""")
replace_function('renderMeioAmbienteTerritorioChart',"""  function renderMeioAmbienteTerritorioChart(gt) {
    destroyChart('hubChartMeioAmbienteTerritorio');
    showChartFallback('hubChartMeioAmbienteTerritorio', null, 'https://datageo.ambiente.sp.gov.br/', 'DataGEO / cadastros oficiais', 'Total protegido não comprovado: falta união das geometrias e tratamento de sobreposições. Áreas individuais no exportável P3.');
    hideSkeleton('hubChartMeioAmbienteTerritorio');
  }
""")
start=code.index('  function renderMeioAmbienteSaneamentoChart');end=code.index('\n  function ',start+10);part=code[start:end]
part=part.replace("'Atendimento Água Tratada'","'Água / população total (IN055)'").replace("'Coleta de Esgoto Sanitário'","'Coleta / água consumida (IN015)'").replace("'Tratamento do Esgoto Coletado'","'Tratado / coletado (IN016)'")
part=part.replace('const values = [99.8, 98.5, 98.2, 22.4];',"const d = gt.eixos.meio_ambiente.saneamento_snis_2022;\n    const values = [d.agua_pct_populacao_total, d.coleta_esgoto_pct_agua_consumida, d.tratamento_esgoto_pct_coletado, d.perdas_distribuicao_pct];")
part=part.replace('    const metas = [99.0, 90.0, 90.0, 25.0];\n','').replace("label: 'Índice Municipal SJC (%)'","label: 'SNIS 2022 — denominadores próprios (%)'")
part=re.sub(r'\},\s*\{\s*label: \'Meta Marco Legal.*?fill: false\s*\}', '}',part,flags=re.S)
code=code[:start]+part+code[end:]
code=code.replace("...(RADAR_HUB_CACHE.activeAxis === 'financas' ? {financas_series:window.getFinancasP2Export()} : {}),","...(RADAR_HUB_CACHE.activeAxis === 'financas' ? {financas_series:window.getFinancasP2Export()} : {}),\n      ...(RADAR_HUB_CACHE.activeAxis === 'meio_ambiente' ? {meio_ambiente_series:window.getMeioAmbienteP3Export()} : {}),")
code=code.replace('...(exportData.financas_series || [])];','...(exportData.financas_series || []),...(exportData.meio_ambiente_series || [])];')
hook="""  window.getMeioAmbienteP3Export = function() {
    const p = RADAR_HUB_CACHE.package;
    if (!p) return [];
    return Object.entries(p.groundTruth.eixos.meio_ambiente.series_auditadas || {}).flatMap(([family, rows]) => rows.map(e => ({id:e.evidence_id, nome:e.variable, eixo:'meio_ambiente', valor:e.value ?? null, unidade:e.unit, competencia:e.period, status_declarado:e.status, status_pacote:p.audit_status, fonte:e.system || family, url:e.url, data_consulta:e.accessed_at, versao:p.dataset_version, evidencia:{...e, family}, consistencia_local:null})));
  };

  function updateMeioAmbienteP3Cards() {
    const p = RADAR_HUB_CACHE.package;
    if (!p) return;
    for (const [elementId, indicatorId] of [['amb-p3-water-value','amb_saneamento_agua_tratada'],['amb-p3-sewage-value','amb_p3_sinisa_IES0001']]) {
      const el = document.getElementById(elementId);
      const i = p.metadataRegistry.indicators.find(i => i.indicator_id === indicatorId);
      if (el) el.textContent = i?.value == null ? 'Dado não disponível' : Number(i.value).toLocaleString('pt-BR', {maximumFractionDigits:2}) + '%';
    }
  }

"""
code=code.replace('  window.getRadarHubExport = function() {',hook+'  window.getRadarHubExport = function() {')
code=code.replace('      renderMeioAmbienteArChart(gt);','      updateMeioAmbienteP3Cards();\n      renderMeioAmbienteArChart(gt);')
(ROOT/'radar_hub_controller.js').write_text(code,encoding='utf8')
html=(ROOT/'app.html').read_text(encoding='utf8');start=html.index('  <!-- EIXO: MEIO AMBIENTE');end=html.index('  <!-- EIXO: ECONOMIA',start);part=(OUT/'app.html.before').read_text(encoding='utf8');part=part[part.index('  <!-- EIXO: MEIO AMBIENTE'):part.index('  <!-- EIXO: ECONOMIA',part.index('  <!-- EIXO: MEIO AMBIENTE'))]
replacements={'>312<':'>Dado não disponível<',"dias de ar 'Bom'":'dias bons — 2023 sem comprovação','85,5% do ano com ar de qualidade ótima/boa (Estação Satélite).':'Dias bons anuais suspensos; snapshot por estação disponível na base P3.','99,8%':'98,64%','Atendimento pleno SNIS/Sabesp. Meta Marco Legal: 99%.':'SINISA, referência 2023: população total com rede de água.','Coleta & Trat. Esgoto':'Coleta de Esgoto','98,5%':'97,22%','>coletado<':'>da população total<','98,2% do esgoto coletado recebe tratamento completo.':'SINISA, referência 2023: população total com rede coletora; não tratamento.','63,0%':'Dado não disponível','692,5 km² em APAs e parques. 18,4 m² de área verde/hab.':'Total protegido suspenso: limites e sobreposições não comprovados.','Índice diário e sazonalidade de concentração de MP10 e O3':'Série legada suspensa; estação não equivale à média municipal.','>Vista Verde<':'>Estação legada não comprovada<','Focos de Calor & Queimadas (INPE / BDQueimadas)':'Focos de Calor (INPE / BDQueimadas)','(2012 a 2024)':'(2003 a 2024) — detecções, não incêndios confirmados','2012 a 2024 (Série Completa)':'2003 a 2024 (Arquivos anuais)','Universalização do Saneamento (SNIS / Sabesp)':'Indicadores de Saneamento (SNIS / Sabesp — 2022)','Índices de atendimento e conformidade com o Marco Legal (Lei 14.026)':'Água, coleta volumétrica, tratamento e perdas: denominadores distintos; sem metas não auditadas.','Distribuição da área territorial municipal (1.099,4 km²)':'Total protegido sem comprovação; áreas individuais no exportável P3.'}
for old,new in replacements.items():part=part.replace(old,new)
part=part.replace('>Água Tratada<','>Rede de Água<').replace('>98,64%<',' id="amb-p3-water-value">Dado não disponível<').replace('>97,22%<',' id="amb-p3-sewage-value">Dado não disponível<').replace('SINISA, referência 2023: população total com rede coletora; não tratamento.','SINISA, referência 2024: população total com rede coletora; não tratamento.')
part=part.replace("window.openIndicatorMetadata('amb_saneamento_agua_tratada')","window.openIndicatorMetadata('amb_p3_snis_IN055')")
# A ficha de água existente mantém a competência 2023; a de coleta usa o novo indicador populacional explícito.
part=part.replace('Coleta de Esgoto</span>','Coleta de Esgoto</span>')
html=html[:start]+part+html[end:];(ROOT/'app.html').write_text(html,encoding='utf8')
print('P3 aplicada: 10 legados auditados, 11 novos escalares; outros eixos preservados.')
