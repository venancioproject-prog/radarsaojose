"""Reconciliação exclusiva de Mobilidade. Sem homologação global ou redesenho."""
from mobilidade_evidence_core import *
import copy,collections,re

def build():
 st=Store();revisions=[]
 for kind in ['frota','transporte','adicional']:
  d=read(BASE/f'mobilidade_{kind}_extraido_2026-10-05.json') if kind!='frota' else read(BASE/'mobilidade_frota_extraida_2026-10-05.json')
  for family,rows in d['series'].items():
   chosen={}
   for row in rows:
    e=copy.deepcopy(row);e['raw_value']=e['locator'].get('raw_cell',e['value'])
    if e['status']=='CONFIRMADO':e['status']='CONFIRMADO_FONTE_OFICIAL'
    if family=='transporte_ipk':e['break_segment']='IPKmensal_'+('real_2013_2016' if e['period']<'2017' else 'total_2017_2026')
    if family=='transporte_bilhetagem':e['break_segment']='bilhetagem_'+('pares_2013_2015' if e['period']<'2016' else 'agregado_2016_2017' if e['period']<'2018' else 'comum_2018_2021' if e['period']<'2022' else 'idosos_isentos_2022_2026')
    key=(e['period'],e['category'],e.get('operator_group'))
    if key in chosen:
     old=chosen[key];revisions.append({'family':family,'key':key,'old_evidence':old['evidence_id'],'new_evidence':e['evidence_id'],'old_value':old['value'],'new_value':e['value'],'decision':'duplicado idêntico' if old['value']==e['value'] else 'divergência suspensa'})
     if old['value']!=e['value']:old['status']='SUSPENSO';old['value']=old['normalized_value']=old['display_value']=None;old['limitations'].append('Versões para a mesma competência divergem; decisão pendente.')
     continue
    chosen[key]=e
   st.series[family]=list(chosen.values());st.evidences.extend(chosen.values())
  st.notes.extend(d.get('notes',[]))
 # A composição legada tem fórmula explícita e componentes; não é categoria nativa SENATRAN.
 stock={(e['period'],e['category']):e for e in st.series['frota_senatran']}
 for period in sorted(set(e['period'] for e in st.series['frota_senatran'])):
  components=[stock.get((period,c)) for c in ['MOTOCICLETA','MOTONETA']]
  if any(e is None or e['value'] is None for e in components):continue
  e=copy.deepcopy(components[0]);e.update(evidence_id='mob:calc:motos:'+period,family='frota_motos_calculada',indicator_id='frota_motos_calculada',category='MOTOCICLETA + MOTONETA',variable='Motocicletas e motonetas registradas',value=sum(c['value'] for c in components),status='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS',transformation={'formula':'MOTOCICLETA + MOTONETA','components':[c['evidence_id'] for c in components]},methodology='Soma de duas categorias nativas da mesma fonte, território e competência; não inclui ciclomotores.')
  e['raw_value']=None;e['normalized_value']=e['display_value']=e['value'];st.evidences.append(e);st.series.setdefault(e['family'],[]).append(e)
 ev={e['evidence_id']:e for e in st.evidences}
 def source(period,cat):return stock.get((period,cat))
 def total(period):
  p=source(period,'TOTAL');assert p and p['value'] is not None;return p
 def motos(period):return next(e for e in st.series['frota_motos_calculada'] if e['period']==period)
 gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');before=copy.deepcopy(gt['eixos']['mobilidade']);mob=gt['eixos']['mobilidade'];bindings={};changes=[]
 approved={'mob_frota_total':total('2023-12'),'mob_frota_total_2024':total('2024-12'),'mob_frota_automoveis':source('2023-12','AUTOMOVEL'),'mob_frota_motocicletas':motos('2023-12')}
 for i in reg['indicators']:
  if i['category']!='mobilidade':continue
  old=copy.deepcopy(i);e=approved.get(i['indicator_id'])
  if e:
   i.update(value=e['value'],audit_status=e['status'],evidence_id=e['evidence_id'],competencia=e['period'],official_url=e['source_url'],source_agency=e['institution'],frequency=e['frequency'],methodology=e['methodology'],context_warning='; '.join(e['limitations']),status_badge='FONTE EXTERNA P4',last_checked=e['accessed_at'],audit_date='2026-10-05')
   i['evidencia']={**e,'valor':e['value'],'data_consulta':e['accessed_at'],'competencia':e['period'],'trecho_bruto':json.dumps(e['locator'],ensure_ascii=False),'ferramenta':'Arquivo primário preservado e extração reproduzível'}
   if i['indicator_id']=='mob_frota_automoveis':i['name']='Automóveis registrados — dezembro2023'
  else:
   reason='Denominador populacional externo compatível não validado; estimativa interna não utilizada.' if i['indicator_id']=='mob_taxa_motorizacao' else 'Infosiga: catálogo aberto, mas arquivo/dicionário não obtidos pelas rotas oficiais; os valores internos não comprovam o dado.'
   i.update(value=None,audit_status='SUSPENSO',status_badge='EVIDÊNCIA PENDENTE',evidence_id=None,context_warning=reason,methodology=reason,audit_date='2026-10-05',last_checked='2026-10-05',evidencia={'valor':None,'url':i['official_url'],'data_consulta':'2026-10-05','motivo':reason,'consultas':'data/radar_hub/mobilidade_raw_2026-10-05/consultas.json'})
  i.pop('valid_until',None);i['p4_homologated']=False
  bindings[i['indicator_id']]={'value':i['value'],'status':i['audit_status'],'evidence_id':i.get('evidence_id'),'period':i.get('competencia',i['base_year'])}
  changes.append({'id':i['indicator_id'],'before':old,'after':copy.deepcopy(i),'decision':'CORRIGIDO' if e else 'SUSPENSO'})
 # Campos legados sem conceito publicado não ganham agrupamentos inventados.
 def row(year):
  p=f'{year}-12';t=total(p);a=source(p,'AUTOMOVEL');m=motos(p)
  return {'ano':year,'total':t['value'],'total_veiculos':t['value'],'automoveis':a['value'],'motos':m['value'],'motocicletas':m['value'],'comerciais':None,'caminhoes':source(p,'CAMINHAO')['value'],'onibus':source(p,'ONIBUS')['value'],'outros':None,'motorizacao':None,'evidence_ids':{'total':t['evidence_id'],'automoveis':a['evidence_id'],'motos':m['evidence_id']},'competencia':p,'universe':'Frota registrada em dezembro; não frota circulante'}
 mob['frota_veiculos_senatran_2023']=row(2023)
 annual=[]
 for year in range(2003,2026):
  if source(f'{year}-12','TOTAL'):annual.append(row(year))
  else:annual.append({'ano':year,'total':None,'automoveis':None,'motos':None,'competencia':f'{year}-12','status':'NAO_DISPONIVEL','evidence_ids':{},'note':'Posição de dezembro não validada; não interpolada.'})
 mob['frota_veiculos_serie_historica']=annual;mob['frota_serie_historica']=copy.deepcopy(annual)
 def suspend_values(v):
  if isinstance(v,list):return [suspend_values(x) for x in v]
  if isinstance(v,dict):return {k:(None if isinstance(x,(int,float)) and k not in ['ano','mes'] else suspend_values(x)) for k,x in v.items()}
  return v
 for key in ['fatalidades_transito_infosiga_serie','fatalidades_transito_mensal_2023_2024','perfil_vitimas_transito_infosiga']:
  mob[key]=suspend_values(mob[key])
 mob['frota_veiculos_oficial']=suspend_values(mob['frota_veiculos_oficial'])
 mob['frota_veiculos_oficial'].update(total_2023=total('2023-12')['value'],total_2024=total('2024-12')['value'],total_2025=total('2025-12')['value'],nota_p4='Estrutura anterior arquivada; composição nativa e valores reconciliados em series_auditadas. Campos sem vinculação externa permanecem null.')
 for year in [2023,2024,2025]:mob['frota_veiculos_oficial'][f'ano_{year}']=total(f'{year}-12')['value']
 mob['frota_veiculos_oficial']['composicao_2024']['automoveis']=source('2024-12','AUTOMOVEL')['value']
 mob['frota_veiculos_oficial']['composicao_2024']['motocicletas_motonetas']=motos('2024-12')['value']
 mob['frota_veiculos_oficial']['data_consulta']='2026-10-05'
 mob['frota_veiculos_oficial']['evidence_ids']={f'total_{year}':total(f'{year}-12')['evidence_id'] for year in [2023,2024,2025]}
 mob['frota_veiculos_oficial']['evidence_ids'].update(automoveis_2024=source('2024-12','AUTOMOVEL')['evidence_id'],motocicletas_motonetas_2024=motos('2024-12')['evidence_id'])
 # Metadados compartilhados evitam repetir milhares de URLs e universos no pacote.
 # O evidence store mantém registros completos; exportação recompõe todos os campos.
 compact={};metadata={};dynamic={'evidence_id','period','competence','raw_value','normalized_value','value','display_value','locator','partial','transformation'}
 for family,rows in st.series.items():
  compact[family]=[]
  for e in rows:
   common={k:v for k,v in e.items() if k not in dynamic};mid=hashlib.sha256(json.dumps(common,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:20];metadata[mid]=common
   item={k:v for k,v in e.items() if k in dynamic}
   item['locator']={k:v for k,v in item['locator'].items() if k not in ['layout_line','header','municipal_row']}
   item['source_metadata_id']=mid;compact[family].append(item)
 mob.update(series_auditadas=compact,series_metadata=metadata,p4_homologated=False,p4_status='AUDITADO_PENDENTE_REVISAO_HUMANA',p4_suspensions={'infosiga':'Dados não baixados; séries e perfil suspensos.','motorizacao':'Sem denominador populacional externo compatível.'},data_consulta='2026-10-05',fonte_nome='SENATRAN / IBGE / Prefeitura — evidências P4')
 save(OUT/'duplicatas-e-revisoes.json',revisions);save(OUT/'antes-depois-registry.json',changes);save(OUT/'ground-truth-antes.json',before)
 st.save('mobilidade_evidence_2026-10-05.json');save(BASE/'sjc_open_data_ground_truth.json',gt);save(BASE/'sjc_metadata_registry.json',reg)
 save(BASE/'mobilidade_audit_bindings.json',{'round':'P4','homologated':False,'status':'PENDENTE_REVISAO_HUMANA','indicators':bindings,'series_count':len(st.evidences),'evidence_store':'data/radar_hub/mobilidade_evidence_2026-10-05.json','suspensions':mob['p4_suspensions']})
 print('P4 incorporado',len(st.evidences),'observações;',len(annual),'posições anuais de frota')
if __name__=='__main__':build()
