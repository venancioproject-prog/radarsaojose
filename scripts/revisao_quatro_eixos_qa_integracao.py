from pathlib import Path
import json,hashlib,runpy
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008'
load=lambda p:json.loads(Path(p).read_text(encoding='utf8'))
g=load(BASE/'integracao-proposta-ground-truth.json');checks=[];cache={}
def ck(label,actual,expected):
 assert actual==expected,(label,actual,expected)
 checks.append({'check':label,'actual':actual,'expected':expected,'pass_':True})
def native(source):
 p=ROOT/source['raw_file']
 if str(p) not in cache:
  ck('hash '+p.name,hashlib.sha256(p.read_bytes()).hexdigest(),source['sha256']);cache[str(p)]=load(p)
 return cache[str(p)]
months=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
for family,rows in g['eixos']['seguranca']['series_auditadas'].items():
 for r in rows:
  n=native(g['eixos']['seguranca']['series_metadata'][r['source_metadata_id']]);loc=r['locator']
  if family=='ssp_taxas_publicadas':
   cell=next(x for x in n['data'] if x['ano']==loc['ano'] and x['idUnidade']==loc['idUnidade'])[loc['field']];expected=None if cell in [None,'-',''] else float(cell.replace('.','').replace(',','.'))
   ck(r['evidence_id'],r['value'],expected);continue
  cell=next(x for group in n['data'] for x in group['listaDados'] if x['idDelito']==loc['idDelito']);ck(r['evidence_id']+'label',r['variable'],cell['delito']['delito']);ck(r['evidence_id']+'published',r['published_months'],cell['publicado'])
  if family=='ssp_mensais_por_delito':
   index=months.index(loc['field']);expected=cell[loc['field']] if index<cell['publicado'] else None
   if cell['publicado']==0:expected=None
   ck(r['evidence_id'],r['value'],expected)
  else:
   if 'native_total' in r:ck(r['evidence_id']+'native total',r['native_total'],cell['total'])
   if r['status'].startswith('SUSPENSO'):ck(r['evidence_id']+'suspended',r['value'],None)
   else:ck(r['evidence_id'],r['value'],cell['total'] if cell['publicado']>0 else None)
for family,rows in g['eixos']['demografia']['series_auditadas'].items():
 for r in rows:
  n=native(g['eixos']['demografia']['series_metadata'][r['source_metadata_id']])[1:];loc=r['locator']
  if family=='indicadores_derivados_revisados':
   if 'estimada' in r['variable']:expected=int(next(x for x in n if x['D3C']==r['period'])['V'])
   else:expected=round(int(next(x for x in n if x['D4C']=='1')['V'])/int(next(x for x in n if x['D4C']=='6795')['V'])*100,2)
  elif 'year' in loc:expected=int(next(x for x in n if x['D3C']==str(loc['year']))['V'])
  else:expected=int(next(x for x in n if all(x[k]==v for k,v in loc.items()))['V'])
  ck(r['evidence_id'],r['value'],expected)
# Producer matrix transcription: native monthly arrays and labels must match every cell.
for r in load(BASE/'seguranca/evidencias-reproduzidas.json'):
 loc=r['locator'];n=load(r['raw_file']);cell=next(x for group in n['data'] for x in group['listaDados'] if x['idDelito']==loc['idDelito'])
 ck(r['evidence_id']+'native_label',r['native_label'],cell['delito']['delito']);ck(r['evidence_id']+'native_total',r['native_total'],cell['total']);ck(r['evidence_id']+'published',r['published'],cell['publicado']);ck(r['evidence_id']+'months',r['monthly_values'],[cell[m] if i<cell['publicado'] else None for i,m in enumerate(months)])
# Independently parse ALL integrated XLSX locators, including networks and auxiliary totals.
text=(ROOT/'scripts/revisao_quatro_eixos_qa_evidencias.py').read_text(encoding='utf8')
# Functions created by exec use the global namespace; execute with one shared dictionary.
helpers={'__file__':str(ROOT/'scripts/revisao_quatro_eixos_qa_evidencias.py')};exec(compile(text[:text.index("ideb=load")],str(ROOT/'scripts/revisao_quatro_eixos_qa_evidencias.py'),'exec'),helpers)
groups={}
for family,rows in g['eixos']['educacao']['series_auditadas'].items():
 for r in rows:
  source=g['eixos']['educacao']['series_metadata'][r['source_metadata_id']];loc=r['locator'];e={'raw_reference':source['raw_file'],'sha256':source['sha256'],'member':source['member'],'member_sha256':source['member_sha256'],'sheet':loc['sheet']}
  groups.setdefault((e['raw_reference'],e['sheet']),[]).append((family,r,e))
for es in groups.values():
 data=helpers['cells'](es[0][2],{r['locator']['row'] for _,r,_ in es})
 for family,r,e in es:
  loc=r['locator'];row=loc['row']
  if 'columns_summed' in loc:
   values=[data.get((row,c)) for c in loc['columns_summed']];assert all(isinstance(v,(int,float)) for v in values);expected=sum(values);ck(r['evidence_id']+'urban/rural',[r['urban'],r['rural']],values)
   ck(r['evidence_id']+'percentage',r['percentage'],expected/r['denominator']*100)
  else:
   v=data.get((row,loc['column']));expected=None if v in [None,'--','-','...'] else v
   if isinstance(expected,str):expected=float(expected.replace('.','').replace(',','.'))
  ck(r['evidence_id'],r['value'],expected)
  expectedUnit='%' if family in ['distorcao_idade_serie','rendimento'] else {'censo_matriculas':'matrículas','censo_matriculas_por_rede':'matrículas','censo_docentes':'docentes','censo_estabelecimentos':'estabelecimentos','censo_turmas':'turmas'}.get(family)
  if expectedUnit:ck(r['evidence_id']+'unit',r['unit'],expectedUnit)
result={'status':'PASS','checks_count':len(checks),'checks':checks,'scope':'Todas células e localizadores integrados SSP, SIDRA e INEP reproduzidos diretamente dos brutos, inclusive redes urbanas/rurais, totais docentes/estabelecimentos/turmas e unidades. Sem promoção CNES KPI nem vínculo territorial.'}
(BASE/'qa/validacao-integracao-proposta.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8');print('PASS',len(checks))
