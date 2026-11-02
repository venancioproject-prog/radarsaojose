from pathlib import Path
import json,hashlib
O=Path(__file__).parent; ROOT=Path.cwd()
def read(n):return json.loads((O/n).read_text(encoding='utf-8'))
def write(n,d):(O/n).write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
manifest=read('manifest.json'); sources={x['name']:x for x in manifest}; checks=[]
def check(name,test):
 checks.append({'check':name,'pass':bool(test)})
 if not test:raise AssertionError(name)
for m in manifest:check('SHA:'+m['name'],hashlib.sha256(Path(m['path']).read_bytes()).hexdigest()==m['sha256'])
municipios=read('municipios.json')['data']; check('mun560',any(x.get('codMunicipio')==560 and 'JOS' in x['nome'].upper() and 'CAMPOS' in x['nome'].upper() for x in municipios))
annual={int(x['ano']):x for x in read('ocorrencias.json')['data']}; taxes={int(x['ano']):x for x in read('taxas.json')['data']}
months=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']; evidence=[]; diffs=[]; coverage=[]; monthly={}; iddict={}; mappings={'homicidio':38,'roubo':30,'furto':21}
for y in range(2001,2027):
 rows=[r for b in read(f'mensal-{y}.json')['data'] for r in b['listaDados']]; monthly[y]={r['idDelito']:r for r in rows}; coverage.append({'year':y,'categories':len(rows),'published':sorted(set(r['publicado'] for r in rows))})
 for r in rows:
  p=r['publicado'];
  if p==0 and r['total']!=0:
   diffs.append({'year':y,'idDelito':r['idDelito'],'native_total':r['total'],'published':p,'decision':'REJEITAR_SEM_COMPETENCIA_PUBLICADA'})
  else:check(f'{y}:{r["idDelito"]}:sum_published',sum(r[m] for m in months[:p])==r['total'])
  check(f'{y}:{r["idDelito"]}:valid_period',0<=p<=12)
  iddict[r['idDelito']]=r['delito']['delito']
  vals=[r[m] if i<p else None for i,m in enumerate(months)]
  evidence.append({'evidence_id':f'indep:ssp:{y}:delito:{r["idDelito"]}','value':r['total'] if p>0 else None,'native_total':r['total'],'monthly_values':vals,'competence':str(y) if p==12 else f'{y}-01 a {y}-{p:02}','partial':p<12,'unit':'vítimas' if 'VÍTIMAS' in r['delito']['delito'] else 'ocorrências publicadas (rótulo nativo)','native_label':r['delito']['delito'],'raw_file':sources[f'mensal-{y}']['path'],'sha256':sources[f'mensal-{y}']['sha256'],'url':sources[f'mensal-{y}']['url'],'territory_filter':{'tipoGrupo':'MUNICÍPIO','idGrupo':560,'grupoDelito':6},'locator':{'data_year':y,'idDelito':r['idDelito'],'field':'total'},'published':p,'method':'Soma somente meses publicados; valores posteriores a publicado tornam-se null; nunca vítimas = ocorrências.'})
 if y in annual:
  for var,id in mappings.items():
   if annual[y][var]!=monthly[y][id]['total']:diffs.append({'year':y,'variable':var,'annual':annual[y][var],'monthly_sum':monthly[y][id]['total'],'decision':'CONFLITO_FONTE_PRIMARIA; não escolher por recência'})
  frv=monthly[y][37]['total']+monthly[y][22]['total']
  if frv!=annual[y]['frv']:diffs.append({'year':y,'variable':'frv','annual':annual[y]['frv'],'monthly_sum':frv,'decision':'CONFLITO_FONTE_PRIMARIA'})
  check(f'{y}:placeholder_veiculo',annual[y]['rouboVeiculo']==annual[y]['furtoVeiculo']==0)
check('2025:29_ocorrencias_33_vitimas',monthly[2025][38]['total']==29 and monthly[2025][41]['total']==33)
check('2024:143_724',monthly[2024][37]['total']==143 and monthly[2024][22]['total']==724)
check('2024:roubo30_inclui_carga',monthly[2024][30]['total']==monthly[2024][133]['total']+monthly[2024][46]['total']+monthly[2024][49]['total'])
check('2026:cut_publicado8',all(e['published']==8 and e['monthly_values'][8:]==[None]*4 for e in evidence if e['locator']['data_year']==2026))
prod=read('produtividade-2024.json')['data'][0]['listaDados']; pr={r['idDelito']:r for r in prod}
for r in prod:check(f'prod2024:{r["idDelito"]}:sum',sum(r[m] for m in months)==r['total'])
check('prod2170_nao_soma1420_1111',pr[88]['total']==2170 and pr[86]['total']+pr[87]['total']==2531)
rate_evidence=[]
units={'homicidios':'ocorrências de homicídio doloso /100 mil habitantes','furtos':'ocorrências de furto /100 mil habitantes','roubos':'ocorrências de roubo /100 mil habitantes','frvHabitantes':'furto e roubo de veículos /100 mil habitantes','furtoVeiculo':'furto de veículos /100 mil veículos','rouboVeiculo':'roubo de veículos /100 mil veículos','frvVeiculos':'furto e roubo de veículos /100 mil veículos'}
for y,row in taxes.items():
 for var,unit in units.items():
  raw=row[var]; value=None if raw=='-' else float(raw.replace('.','').replace(',','.'))
  rate_evidence.append({'evidence_id':f'indep:ssp:taxa:{y}:{var}','year':y,'value':value,'native':raw,'unit':unit,'denominator_source':'Fundação SEADE para habitantes, conforme PDA2025p20; valor exato da população/frota não consta neste endpoint','denominator_value':None,'raw_file':sources['taxas']['path'],'sha256':sources['taxas']['sha256'],'url':sources['taxas']['url'],'locator':{'idUnidade':560,'ano':str(y),'field':var},'method':'Taxa nativa publicada; não recalcular comIBGEatual nem inverter taxa arredondada para obter denominador.'})
check('rate2024_3.28',next(e['value'] for e in rate_evidence if e['year']==2024 and e['locator']['field']=='homicidios')==3.28)
check('rate2025_4.12',next(e['value'] for e in rate_evidence if e['year']==2025 and e['locator']['field']=='homicidios')==4.12)
write('taxas-evidencias.json',rate_evidence)
write('evidencias-reproduzidas.json',evidence);write('dicionario-ids.json',iddict);write('conflitos-anuais-mensais.json',diffs);write('cobertura.json',coverage)
reg=json.loads((ROOT/'data/radar_hub/sjc_metadata_registry.json').read_text(encoding='utf-8')); inv=[r for r in reg['indicators'] if r.get('category')=='seguranca'];write('inventario-registry.json',inv)
gt=json.loads((ROOT/'data/radar_hub/sjc_open_data_ground_truth.json').read_text(encoding='utf-8'))['eixos']['seguranca'];write('inventario-ground-truth.json',gt)
changes=[]
for r in inv:
 n=r['indicator_id']; d={'indicator_id':n,'before':r,'remove_from_active_authority':['raw_file','trecho_bruto','audit_date'],'preserve_in_history':True}
 if n=='seg_roubos_veiculos_2024':d.update(proposed_value=143,proposed_status='EVIDENCIA_REPRODUZIDA_AGUARDA_VALIDACAO_INDEPENDENTE',evidence_id='indep:ssp:2024:delito:37')
 elif n=='seg_furtos_veiculos_2024':d.update(proposed_value=724,proposed_status='EVIDENCIA_REPRODUZIDA_AGUARDA_VALIDACAO_INDEPENDENTE',evidence_id='indep:ssp:2024:delito:22')
 elif n=='seg_produtividade_prisoes':d.update(proposed_value=2170,proposed_status='EVIDENCIA_REPRODUZIDA_AGUARDA_VALIDACAO_INDEPENDENTE',locator={'idDelito':88,'grupoDelito':9},source=sources['produtividade-2024.json'])
 elif n=='seg_sao_jose_unida':d.update(proposed_value=None,proposed_status='MANTER_SUSPENSO',reason='2948 é acumulado desde implantação, notícia03jan2025; não total anual2024.')
 elif n in ('seg_ranking_500k','seg_esclarecimento_deic'):d.update(proposed_value=None,proposed_status='MANTER_SUSPENSO',reason='Sem universo/denominador original reproduzido; notícia/ata não comprovam cohortDEIC2024.')
 else:d.update(proposed_value=r['value'],proposed_status=r['audit_status'],reason='Valor primário reconfirmado; sanar campos legados contraditórios.')
 changes.append(d)
write('antes-depois-proposto.json',changes)
write('testes.json',{'status':'PASS','checks':len(checks),'records_verified':len(evidence),'checks_detail':checks,'conflicts_detected':diffs,'no_shared_writes':True})
print(json.dumps({'checks':len(checks),'records':len(evidence),'diffs':diffs},ensure_ascii=False))
