"""Aplica somente Finanças; preserva demais eixos e decisões de Economia."""
import copy, json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p2-financas'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
store=read(BASE/'financas_evidence_2026-10-05.json');emap={e['evidence_id']:e for e in store['evidences']};snap=read(OUT/'snapshot-inicial.json')
gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');fin=copy.deepcopy(snap['financas'])
audit=copy.deepcopy(store['indicators'])

def scalar(id,name,eid):
    e=emap[eid];audit.append({'id':id,'name':name,'before':None,'after':e['display_value'],'exercise':e['exercise'],'period':e['period'],'unit':e['unit'],'concept':e['variable'],'accounting_stage':e['accounting_stage'],'status':e['status'],'evidence_id':eid,'decision':'SUSPENSO_DIVERGENCIA_P2' if e['display_value'] is None else 'ADICIONADO_BASE_P2','reason':e.get('limitation','Fonte oficial reproduzível. Armazenado sem criar nova visualização.')})
last=next(r for r in store['budget_annual'] if r['ano']==2025)
for key in ['previsao_inicial','previsao_atualizada','receita_realizada','dotacao_inicial','dotacao_atualizada','despesa_empenhada','despesa_liquidada','despesa_paga','resultado_orcamentario','realizacao_receita_pct','empenhado_dotacao_pct','liquidado_dotacao_pct','pago_dotacao_pct']:
    if last['evidence_ids'].get(key):scalar('fin_'+key+'_2025',key.replace('_',' ')+' — 2025',last['evidence_ids'][key])
def select(family,year,classification,stage=None,period=None,label=None):
    found=[r for r in store['series'][family] if r['exercise']==year and r['classification']==classification and (stage is None or r['stage']==stage) and (period is None or r['period_number']==period) and (label is None or r['label']==label)]
    assert len(found)==1,(family,classification,stage,len(found));return emap[found[0]['evidence_id']]
for key in ['DividaConsolidada','DividaConsolidadaLiquida','PercentualDaDCLSobreARCL']:
    e=select('divida_rgf',2025,key,period=3);scalar('fin_'+key.lower()+'_2025',e['variable']+' — 2025 Q3',e['evidence_id'])
for key,stage in [('DespesaComPessoalTotal','Valor'),('ReceitaCorrenteLiquidaAjustada','Valor'),('DespesaComPessoalTotal','% sobre a RCL Ajustada')]:
    e=select('pessoal_rgf',2025,key,stage,3);scalar('fin_pessoal_'+('pct' if '%' in stage else key.lower())+'_2025',e['variable']+' — Executivo, 2025 Q3',e['evidence_id'])
for stage in ['Despesas Empenhadas','Despesas Liquidadas','Despesas Pagas']:
    e=select('despesa_dca_natureza',2025,'DO4.4.00.00.00.00',stage);scalar('fin_investimentos_'+stage.split(' ')[1].lower()+'_2025','Investimentos (GND 4) — '+stage+' 2025',e['evidence_id'])

fin['indicator_values']={a['id']:a['after'] for a in audit}
for a in audit:
    e=emap[a['evidence_id']];i=next((i for i in reg['indicators'] if i['indicator_id']==a['id']),None)
    if i is None:i={'indicator_id':a['id'],'category':'financas'};reg['indicators'].append(i)
    i.update(name=a['name'],value=a['after'],unit=a['unit'],base_year=str(a['exercise']),competencia=a['period'],frequency=e.get('frequency','Anual'),geographic_level='Municipal (Código: 3549904)',source_agency=e['institution'],source_system=e['system']+' / '+e['statement'],official_url=e['url'],audit_status=a['status'],status_badge=a['status'],audit_date=e['accessed_at'],last_checked=e['accessed_at'],valid_until=None,verificacao='nao_verificado' if a['after'] is None else 'primaria',evidence_id=e['evidence_id'],methodology=e['variable']+'; estágio: '+e['accounting_stage']+'; '+json.dumps(e['transformation'],ensure_ascii=False),context_warning='Valores correntes; abrangência '+e['scope']+'. P2 aguarda revisão humana. '+e.get('limitation','')+('Cálculo explícito, não valor diretamente publicado.' if e['transformation'] else ''))
    i['evidencia']={'evidence_id':e['evidence_id'],'url':e['url'],'data_consulta':e['accessed_at'],'valor':a['after'],'competencia':a['period'],'status':a['status'],'trecho_bruto':e['evidence_excerpt'],'raw_file':e['raw_file'],'sha256':e['sha256'],'transformation':e['transformation'],'accounting_stage':e['accounting_stage'],'statement':e['statement'],'scope':e['scope']}

byid={a['id']:a for a in audit}
for year in [2023,2024]:
    r=next(r for r in store['budget_annual'] if r['ano']==year);exec=fin[f'execucao_orcamentaria_{year}_reais_milhoes']
    exec.update(receita_total_arrecadada=r['receita_realizada']/1e6,despesa_total_liquidada=r['despesa_liquidada']/1e6,despesa_total_empenhada=r['despesa_empenhada']/1e6,despesa_total_paga=r['despesa_paga']/1e6,resultado_orcamentario_superavit=None,resultado_orcamentario=r['resultado_orcamentario']/1e6,evidence_ids=r['evidence_ids'],fonte_nome='Tesouro Nacional — SICONFI / RREO consolidado',fonte_url=emap[r['evidence_ids']['receita_realizada']]['url'],data_consulta=emap[r['evidence_ids']['receita_realizada']]['accessed_at'])
    for field,code in [('aplicacao_saude_asps_pct','AplicacaoTotalDasDespesasComAcoesEServicosPublicosDeSaude'),('aplicacao_educacao_mde_pct','MinimoAnualDasReceitasDeImpostosNaManutencaoEDesenvolvimentoDoEnsinoDemonstrativoSimplificado')]:
        e=select('resumo_rreo',year,code,'% Aplicado Até o Bimestre',6);exec[field]=e['display_value'];exec['evidence_ids'][field]=e['evidence_id']
    e=select('pessoal_rgf',year,'DespesaComPessoalTotal','% sobre a RCL Ajustada',3);exec['despesa_total_pessoal_rcl_pct']=e['display_value'];exec['evidence_ids']['despesa_total_pessoal_rcl_pct']=e['evidence_id']
    for field,code,stage,fam in [('limite_saude_pct','AplicacaoTotalDasDespesasComAcoesEServicosPublicosDeSaude','% Mínimo a Aplicar no Exercício','resumo_rreo'),('limite_educacao_pct','MinimoAnualDasReceitasDeImpostosNaManutencaoEDesenvolvimentoDoEnsinoDemonstrativoSimplificado','% Mínimo a Aplicar no Exercício','resumo_rreo'),('limite_pessoal_pct','LimiteMaximoDespesaComPessoalTotal','% sobre a RCL Ajustada','pessoal_rgf')]:
        e=select(fam,year,code,stage,6 if fam=='resumo_rreo' else 3);exec[field]=e['display_value'];exec['evidence_ids'][field]=e['evidence_id']
    if year==2024:
        exec['receita_iss_dca_2023_milhoes']=byid['fin_receita_iss_milhoes']['after']
        # Não perpetuar valor legado sem vínculo: a abertura FUNDEB está na série DCA.
        exec['receita_fundeb_dca_2023_milhoes']=None
legacy=fin['orcamento_municipal_tce_siconfi_2023'];legacy.update(receita_arrecadada_reais_milhoes=byid['fin_orcamento_realizado']['after'],despesa_liquidada_reais_milhoes=byid['fin_despesa_liquidada_2023']['after'],superavit_orcamentario_reais_milhoes=None,resultado_orcamentario_reais_milhoes=byid['fin_superavit_orcamentario_2023']['after'],despesa_pessoal_pct_receita_corrente_liquida=byid['fin_despesa_pessoal_rcl_pct']['after'],indice_efetividade_gestao_iegm_tce=None,iegm_status='NAO_VERIFICADO',fonte_nome='SICONFI — demonstrativos 2023',fonte_url=byid['fin_orcamento_realizado'].get('url',emap[byid['fin_orcamento_realizado']['evidence_id']]['url']))
fin['orcamento_serie_historica']=[{'ano':r['ano'],'receita_milhoes':None if r['receita_realizada'] is None else r['receita_realizada']/1e6,'despesa_milhoes':None if r['despesa_liquidada'] is None else r['despesa_liquidada']/1e6,'superavit_milhoes':None if r.get('resultado_orcamentario') is None else r['resultado_orcamentario']/1e6,'resultado_conceito':'Receita realizada menos despesa empenhada','despesa_estagio':'Liquidada','precos':'correntes','evidence_ids':r['evidence_ids']} for r in store['budget_annual'] if not r['parcial']]
fin['despesas_por_funcao_governo_2023_reais_milhoes']=[];fin['composicao_receitas_2023']=[]
fin['visualization_limitations']={'functions':'Agrupamentos legados sem prova. Funções oficiais e seus estágios estão preservados na base P2; decisão visual na P2.1.','composition':'Composição legada sobreposta e sem denominador comprovado. Naturezas e deduções oficiais preservadas; decisão visual na P2.1.','iegm':'Classificação B+ não comprovada nesta rodada; suspensa.'}
fin['series_orcamentarias_anuais']=store['budget_annual']
# Detalhes completos estão no evidence store; no pacote, selecionar granularidade fiscal útil.
fin['series_auditadas']={k:v for k,v in store['series'].items() if k not in ['receita_dca_natureza','despesa_dca_natureza']}
fin['series_auditadas']['receita_dca_natureza']=[r for r in store['series']['receita_dca_natureza'] if r['classification'] in ['TotalReceitas','ReceitasExcetoIntraOrcamentarias'] or any(t in r['label'] for t in ['Receitas Correntes','Receitas de Capital','Impostos, Taxas','Receita Tributária','Transferências Correntes','Imposto sobre a Propriedade','Imposto sobre Serviços','Imposto Sobre Serviços','Imposto sobre Transmiss','Transmissão','Retido na Fonte','Taxas','Cota-Parte do Fundo de Participação dos Municípios','Cota-Parte do ICMS','Cota-Parte do IPVA','Manutenção e Desenvolvimento da Educação Básica','Sistema Único de Saúde'])]
fin['series_auditadas']['despesa_dca_natureza']=[r for r in store['series']['despesa_dca_natureza'] if r['classification']=='TotalDespesas' or any(t in r['label'] for t in ['Investimentos','Amortização da Dívida','Juros e Encargos da Dívida'])]
used={r['evidence_id'] for rows in fin['series_auditadas'].values() for r in rows}
fin['series_sources']={eid:{k:emap[eid][k] for k in ['url','accessed_at','raw_file','sha256']} for eid in used}
fin.update(audit_round=store['round'],audit_status='AUDITADO_EXTERNAMENTE_AGUARDANDO_REVISAO',evidence_store='data/radar_hub/financas_evidence_2026-10-05.json',limitations=store['methodology'],fonte_nome='Tesouro Nacional — SICONFI / FINBRA; TCESP e Prefeitura para reconciliação',fonte_url='https://apidatalake.tesouro.gov.br/docs/siconfi',data_consulta='2026-10-05')
gt['eixos']['financas']=fin
assert {k:v for k,v in gt['eixos'].items() if k!='financas'}==snap['other_axes']
assert [i for i in reg['indicators'] if i['category']!='financas']==snap['other_indicators']
save(BASE/'sjc_open_data_ground_truth.json',gt);save(BASE/'sjc_metadata_registry.json',reg)
binding={'scope':'financas','round':store['round'],'homologated':False,'store':fin['evidence_store'],'indicators':{a['id']:{'value':a['after'],'period':a['period'],'status':a['status'],'evidence_id':a['evidence_id'],'url':emap[a['evidence_id']]['url'],'sha256':emap[a['evidence_id']]['sha256'],'accounting_stage':a['accounting_stage']} for a in audit}}
save(BASE/'financas_audit_bindings.json',binding);save(OUT/'matriz-indicadores-final.json',audit)
cons=read(OUT/'radar_hub_consistency.json.before')
cons['divergences']=[d for d in cons['divergences'] if not d['id'].startswith('fin_')]
cons['financas']={'validation_scope':'P2: vínculos a evidência externa preservada; sem homologação humana','current_unresolved':store['unresolved_conflicts'],'legacy_decisions':store['indicators']}
save(BASE/'radar_hub_consistency.json',cons)
print('Finanças aplicada:',len(audit),'indicadores;',len(audit)-len(snap['indicators']),'novos; outros eixos iguais ao snapshot P2.')
