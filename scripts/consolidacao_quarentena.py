"""Suspende campos auxiliares sem prova; preserva integralmente snapshot anterior."""
from pathlib import Path
import json,copy
from build_radar_hub_package import write_atomic
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
def read(p):return json.loads(p.read_text(encoding='utf8'))
def save(p,x):write_atomic(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
gt=read(BASE/'sjc_open_data_ground_truth.json');changes=[]
def suspend(v,k=''):
 if isinstance(v,dict):return {**{key:suspend(x,key) for key,x in v.items()},'audit_status':'SUSPENSO_SEM_COMPROVACAO','consolidacao_note':'Campo auxiliar sem vínculo bruto reproduzível; original completo no snapshot inicial.'}
 if isinstance(v,list):return [suspend(x,k) for x in v]
 if isinstance(v,(int,float)) and not isinstance(v,bool):return v if k in ['ano','ano_referencia','year','codigo_ibge','idMunicipio'] else None
 return v
demo=gt['eixos']['demografia'];keep={'populacao_censo_2022','domicilios_censo_2022_total','domicilios_particulares_ocupados','media_moradores_domicilio','area_territorial_km2','densidade_demografica_hab_km2','distribuicao_sexo','indicadores_transicao_demografica','consolidacao_regioes_status','consolidacao_note','fonte_nome','fonte_url','data_consulta'}
for k in list(demo):
 if k not in keep:
  old=copy.deepcopy(demo[k]);demo[k]=suspend(demo[k]);changes.append({'axis':'demografia','path':k,'before':old,'after':demo[k],'decision':'SUSPENSO_SEM_COMPROVACAO'})
demo['area_territorial_km2'].update(ano_referencia=2022,urbana_km2=None,rural_km2=None)
demo['media_moradores_domicilio']['comparacao_2010']=None
transition=demo['indicadores_transicao_demografica'];confirmed={'idade_mediana':36,'indice_envelhecimento_ibge':62.48,'razao_sexo':92.72}
for k,v in list(transition.items()):
 if isinstance(v,(int,float)):transition[k]=confirmed.get(k)
seg=gt['eixos']['seguranca'];keep={'taxa_homicidios_dolosos_serie','consolidacao_chart_status'}
for k in list(seg):
 if k not in keep:
  old=copy.deepcopy(seg[k]);seg[k]=suspend(seg[k]);changes.append({'axis':'seguranca','path':k,'before':old,'after':seg[k],'decision':'SUSPENSO_SEM_COMPROVACAO'})
# Manter ocorrências anuais e taxas diretamente reproduzidas no endpoint correto.
counts=read(OUT/'fontes-externas/ssp-ocorrencias.json')['data'];rates=read(OUT/'fontes-externas/ssp-taxas.json')['data']
seg['ocorrencias_anuais_por_categoria']={str(r['ano']):{'homicidio_doloso':r['homicidio'],'roubo_outros':r['roubo'],'furto_outros':r['furto'],'frv_total':r['frv'],'roubo_veiculo':None,'furto_veiculo':None,'latrocinio':None,'audit_status':'PARCIALMENTE_REPRODUZIDO_ENDPOINT','source':'ssp-ocorrencias.json'} for r in counts}
seg['taxas_delito_ssp']={'raw_records':rates,'audit_status':'RESPOSTA_PRIMARIA_PRESERVADA','methodology':'Taxas nativas publicadas pela SSP. Denominadores variam conforme campo; não deduzir contagens a partir de taxas arredondadas.'}
# IDEB: os KPIs passam a usar a última edição oficial efetivamente reproduzida.
reg=read(BASE/'sjc_metadata_registry.json');education=read(OUT/'educacao-inep-reproduzida.json');ev={e['evidence_id']:e for e in education['evidences']}
for i in reg['indicators']:
 if i['indicator_id'] in ['educ_ideb_anos_iniciais','educ_ideb_anos_finais']:
  stage=i['indicator_id'].split('_')[-1];r=education['series'][stage]['Pública']['2025']['ideb'];old=copy.deepcopy(i);i.update(value=r['value'],base_year='2025',competencia='2025',evidence_id=r['evidence_id'],evidencia=ev[r['evidence_id']],source_system='INEP / IDEB, edição 2025');changes.append({'indicator_id':i['indicator_id'],'before':old,'after':i,'decision':'ATUALIZADO_EDICAO_REPRODUZIDA_2025'})
save(BASE/'sjc_open_data_ground_truth.json',gt);save(BASE/'sjc_metadata_registry.json',reg)
cons=read(BASE/'radar_hub_consistency.json');cons['consolidacao_20261008']={'homologated':False,'journal':(OUT/'reconciliacao-aplicada.json').relative_to(ROOT).as_posix(),'supplement':(OUT/'quarentena-campos-auxiliares.json').relative_to(ROOT).as_posix(),'note':'Divergências históricas preservadas; status atuais definidos pelos vínculos e pela revisão de consolidação.'};save(BASE/'radar_hub_consistency.json',cons)
save(OUT/'quarentena-campos-auxiliares.json',{'homologated':False,'changes':changes})
html=(ROOT/'app.html').read_text(encoding='utf8').replace('Rede pública, 2023. Metas do primeiro ciclo somente até 2021.','Rede pública, IDEB 2025. Metas do primeiro ciclo somente até 2021.').replace('Rede pública, 2023. IDEB distinto de nota SAEB.','Rede pública, IDEB 2025. IDEB distinto de nota SAEB.');write_atomic(ROOT/'app.html',html)
print('Campos auxiliares suspensos; KPIs IDEB ligados à edição oficial 2025.')
