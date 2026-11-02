"""Aplica só Economia após a extração documental; gera matriz/consistência P1."""
import json, copy
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p1-economia'
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
store=read(BASE/'economia_evidence_2026-10-04.json');emap={e['evidence_id']:e for e in store['evidences']};snap=read(OUT/'snapshot-inicial.json')
gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json')
econ=copy.deepcopy(snap['economia']);pib=store['series']['pib'];years={r['ano']:r for r in pib};monthly=store['series']['novo_caged']
official=econ['pib_municipal_oficial']
for year in [2021,2022,2023]:
    official[f'pib_corrente_reais_milhoes_{year}']=years[year]['pib_milhoes'];official[f'pib_per_capita_reais_{year}']=years[year]['pib_per_capita']
official.update(pib_total_2023_bilhoes=years[2023]['pib_milhoes']/1000,posicao_ranking_estadual=None,posicao_ranking_nacional=None,fonte_nome='IBGE — PIB dos Municípios, publicação 2022–2023',fonte_url=emap['ibge-pib-2023-pib_mil_reais']['url'],nota_composicao_setorial='Disponível 2002–2021; 2022/2023 não publicada. Cinco componentes do PIB separados.',data_consulta=emap['ibge-pib-2023-pib_mil_reais']['accessed_at'])
econ['pib_serie_historica']=pib;econ['novo_caged_serie_mensal']=monthly
econ['caged_mensal_2023_2024']={str(year):[dict(r,mes=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][r['mes']-1]) for r in monthly if r['ano']==year] for year in range(2020,2027)}
econ['cempre_serie']=store['series']['cempre']
emp=econ['emprego_formal_novo_caged'];emp.update(estoque_carteiras_assinadas_2023=emap['mte-202608-2023-12-estoque']['display_value'],estoque_carteiras_assinadas_2024=emap['mte-202608-2024-12-estoque']['display_value'],salario_medio_formal_sm=None,salario_medio_formal_reais=None,saldo_anual_historico=store['series']['saldo_anual'],distribuicao_setorial_emprego_2023=[],fonte_url=emap['mte-202608-2024-12-estoque']['url'],data_consulta=emap['mte-202608-2024-12-estoque']['accessed_at'])
econ['novo_caged_2023'].update(estoque_dez_2023=emap['mte-202608-2023-12-estoque']['display_value'],salario_medio_formal_sm=None,salario_medio_formal_reais=None)
companies=econ['empresas_ativas_receita_federal_2023']
for key in ['total_cnpjs_ativos','total_cnpjs_ativos_2024','meis_ativos','microempresas_me','empresas_pequeno_porte_epp','medias_e_grandes_empresas']:companies[key]=None
companies.update(distribuicao_por_atividade=[],audit_status='NAO_VERIFICADO',limitation=emap['econ_total_empresas_ativas']['limitation'])
econ['audit_round']='P1-2026-10-04';econ['audit_status']='AUDITADO_EXTERNAMENTE_AGUARDANDO_REVISAO';econ['evidence_store']='data/radar_hub/economia_evidence_2026-10-04.json'
econ['limitations']={'pib':'Preços correntes: variação nominal, não crescimento real. 2022/2023 sujeitos a revisão. Per capita usa estimativas até 2021 e Censo em 2022/2023. Sem abertura setorial nos dois últimos anos.', 'caged':'Série com ajustes da edição agosto/2026, 2026 parcial até agosto. Novo CAGED desde janeiro/2020; não concatenado à RAIS/CAGED antigo. Estoque oficial, sem acumulação estimada de saldos.', 'cempre':'Quebra metodológica em 2022; série 2022–2024 mantida separada de 2006–2021. Empresas e outras organizações não são CNPJs ativos.'}
econ['indicator_values']={}
audit=store['indicators']
new_specs=[('econ_pib_municipal_2023','PIB Municipal a Preços Correntes (2023)','ibge-pib-2023-milhoes','R$ milhões',years[2023]['pib_milhoes']),('econ_cempre_unidades_locais_2024','Unidades locais do CEMPRE (2024)','cempre-706-2024','unidades locais',emap['cempre-706-2024']['display_value']),('econ_cempre_organizacoes_2024','Empresas e outras organizações atuantes (CEMPRE 2024)','cempre-367-2024','organizações',emap['cempre-367-2024']['display_value'])]
new_specs.append(('econ_caged_estoque_2026_08','Estoque de vínculos formais — agosto/2026','mte-202608-2026-08-estoque','vínculos',emap['mte-202608-2026-08-estoque']['display_value']))
for id,name,eid,unit,value in new_specs:
    if not any(i['indicator_id']==id for i in reg['indicators']):reg['indicators'].append({'indicator_id':id,'name':name,'category':'economia','frequency':'Anual','geographic_level':'Municipal (Código: 3549904)'})
    audit.append({'id':id,'previous':None,'evidence_id':eid,'value':value,'period':emap[eid]['period'],'unit':unit,'status':emap[eid]['status'],'decision':'ADICIONADO'})
for a in audit:
    i=next(i for i in reg['indicators'] if i['indicator_id']==a['id']);e=emap[a['evidence_id']]
    i.update(value=a['value'],unit=a['unit'],base_year=a['period'],audit_status=a['status'],audit_date=e['accessed_at'],valid_until=None,verificacao='nao_verificado' if a['value'] is None else 'primaria',source_agency=e['source'],source_system=e['table'],official_url=e['url'],methodology=json.dumps(e['transformation'],ensure_ascii=False) if e['transformation'] else e['variable'],context_warning=e['limitation'],last_checked=e['accessed_at'],evidence_id=e['evidence_id'],status_badge='NÃO VERIFICADO' if a['value'] is None else a['status'])
    i['evidencia']={'evidence_id':e['evidence_id'],'url':e['url'],'data_consulta':e['accessed_at'],'valor':a['value'],'competencia':e['period'],'status':e['status'],'trecho_bruto':e['evidence_excerpt'],'raw_file':e['raw_file'],'sha256':e['sha256'],'transformation':e['transformation']}
    econ['indicator_values'][a['id']]=a['value']
    if a['id']=='econ_caged_saldo_2024':i['frequency']='Anual (acumulado janeiro–dezembro)'
    if a['id'] in ['econ_caged_estoque','econ_caged_estoque_2024']:i['name']='Estoque de vínculos formais — dezembro/'+a['period'][:4];i['base_year']=a['period'][:4] # compatibility scalar; actual competence explicit below
    i['competencia']=a['period']
    if a['id']=='econ_caged_estoque_2026_08':i['evidencia']['parcial']=True
    if a['id']=='econ_salario_medio':econ['salario_cempre_2022']={'salario_medio_sm':a['value'],'evidence_id':a['evidence_id']} 
    if a['id']=='econ_pib_setor_servicos_pct':i['name']='VAB de serviços, exceto administração pública / PIB (2021)'
gt['eixos']['economia']=econ
assert {k:v for k,v in gt['eixos'].items() if k!='economia'}==snap['other_axes']
assert [i for i in reg['indicators'] if i['category']!='economia']==snap['other_indicators']
save(BASE/'sjc_open_data_ground_truth.json',gt);save(BASE/'sjc_metadata_registry.json',reg)
compact={'scope':'economia','round':store['round'],'homologated':False,'store':econ['evidence_store'],'indicators':{a['id']:{'value':a['value'],'period':a['period'],'status':a['status'],'evidence_id':a['evidence_id'],'url':emap[a['evidence_id']]['url'],'sha256':emap[a['evidence_id']]['sha256']} for a in audit}}
save(BASE/'economia_audit_bindings.json',compact)
cons=read(OUT/'radar_hub_consistency.json.before')
cons['divergences']=[d for d in cons['divergences'] if not d['id'].startswith('econ_')]
cons['economia']={'validation_scope':'valores ligados à evidência externa preservada; sem homologação humana','current_divergences':[],'legacy_unresolved':store['unresolved_legacy_stocks']}
save(BASE/'radar_hub_consistency.json',cons)
oldmat=read(ROOT/'docs/dados-publicos-revisao/p0/matriz-cobertura.json')
newmat=[r for r in oldmat if r['eixo']!='economia']+[{'id':a['id'],'eixo':'economia','indicador':next(i['name'] for i in reg['indicators'] if i['indicator_id']==a['id']),'valor_registry':a['value'],'valor_ground_truth':econ['indicator_values'][a['id']],'status':a['status'],'periodo':a['period'],'unidade':a['unit'],'evidence_id':a['evidence_id'],'caminho_ground_truth':'economia.indicator_values.'+a['id'],'divergencia':'NÃO' if a['value'] is not None else 'NÃO VERIFICADO'} for a in audit]
save(OUT/'matriz-completa.json',newmat);save(OUT/'matriz-economia-final.json',audit)
print('Economia aplicada; outros eixos preservados; registry:',len(reg['indicators']))
