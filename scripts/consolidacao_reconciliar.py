"""Reconciliação reversível. Executar apenas com snapshot e fontes preservadas."""
from pathlib import Path
import json,copy,hashlib,zipfile,re,datetime,subprocess
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub'
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,x):
 tmp=p.with_name(p.name+'.consolidacao.tmp')
 tmp.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 try:tmp.replace(p)
 except PermissionError:
  # OneDrive pode recusar rename/open via Python; Copy-Item usa o provedor nativo.
  source=str(tmp).replace("'","''");target=str(p).replace("'","''")
  subprocess.run(['powershell','-NoProfile','-Command',f"Copy-Item -LiteralPath '{source}' -Destination '{target}' -Force -ErrorAction Stop"],check=True)
assert (OUT/'snapshot-canonico.zip').exists()
assert not (OUT/'reconciliacao-aplicada.json').exists(),'Operação já aplicada; revisar journal antes de repetir.'
gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');before=copy.deepcopy(reg);rm={i['indicator_id']:i for i in reg['indicators']};decisions=[];checked={}
def bind(i,value,period,unit,evidence,status='CONFIRMADO_FONTE_OFICIAL',reason='Resposta primária reproduzida; revisão humana pendente.'):
 i.update(value=value,base_year=period,competencia=period,unit=unit,audit_status=status,status_badge=status,evidence_id=evidence.get('evidence_id'),evidencia=evidence,valid_until=None,context_warning=reason,verificacao='nao_verificado' if value is None else 'primaria',last_checked='2026-10-08')
 if evidence.get('source_url') or evidence.get('url'):i['official_url']=evidence.get('source_url') or evidence.get('url')
def suspend(i,reason):bind(i,None,i.get('competencia',i.get('base_year')),i.get('unit'),{'status':'SUSPENSO','reason':reason},'SUSPENSO',reason)
def raw_ev(path,locator,value,unit,period,url,eid):
 return {'evidence_id':eid,'raw_file':path.relative_to(ROOT).as_posix(),'raw_reference':path.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'locator':locator,'value':value,'unit':unit,'period':str(period),'source_url':url,'accessed_at':'2026-10-08','territory':'São José dos Campos/SP; IBGE 3549904','status':'CONFIRMADO_FONTE_OFICIAL'}
# Recuperar vínculos P1–P4 sem executar seus aplicadores, que restaurariam snapshots antigos.
for axis,stem in [('economia','economia'),('financas','financas'),('meio_ambiente','meio_ambiente'),('mobilidade','mobilidade')]:
 bindings=read(BASE/(stem+'_audit_bindings.json'))['indicators'];store_path=next(BASE.glob(stem+'_evidence_*.json'));es={e['evidence_id']:e for e in read(store_path)['evidences']}
 for iid,b in bindings.items():
  i=rm[iid];e=es.get(b.get('evidence_id'));reason='Decisão '+stem+' preservada; evidência original e metodologia têm precedência sobre promoção posterior de status.'
  if e:
   p=ROOT/(e.get('raw_file') or e.get('raw_reference'))
   if p not in checked:checked[p]=hashlib.sha256(p.read_bytes()).hexdigest()
   assert checked[p]==e['sha256'],iid
   e=copy.deepcopy(e);value=b['value'];unit=e.get('unit',i.get('unit'));bind(i,value,b['period'],unit,e,b['status'],reason)
  else:suspend(i,reason+' Valor sem evidência permanece suspenso.');i['base_year']=i['competencia']=b['period']
  if 'indicator_values' in gt['eixos'][axis]:gt['eixos'][axis]['indicator_values'][iid]=i['value']
# P4: totais/médias após agosto foram deslocados para colunas mensais vazias.
for row in gt['eixos']['mobilidade']['series_auditadas']['transporte_bilhetagem']:
 if row['period']>'2026-08' and row['period']<'2027' and row.get('value') is not None:
  decisions.append({'path':'mobilidade.series_auditadas.transporte_bilhetagem','evidence_id':row['evidence_id'],'before':copy.deepcopy(row),'decision':'SUSPENSO_ERRO_COLUNA','reason':'PDF 2026 declara fechamento em agosto. Setembro–dezembro vazios; número do total/média não é dado mensal.'})
  row.update(value=None,normalized_value=None,display_value=None,status='SUSPENSO_ERRO_COLUNA',reconciliation_id='cons:p4-bilhetagem-2026',reconciliation_note='Totais/médias deslocados na extração legada; conferir colunas de posição fixa. Ausência preservada como null.')
# Educação: células originais, todas as redes separadas, série 2005–2025.
edu=gt['eixos']['educacao'];official=read(OUT/'educacao-inep-reproduzida.json');ss=official['series'];ev={e['evidence_id']:e for e in official['evidences']}
def points(net):
 result=[]
 for year in range(2005,2026,2):
  r={'ano':year,'escopo_rede':net,'metodologia':'Edição INEP 2025; município das escolas; metas 2007–2021; não média aritmética de escolas.'}
  for st,label in [('iniciais','iniciais'),('finais','finais')]:
   row=ss[st][net][str(year)];r['anos_'+label]=row['ideb']['value'];r['meta_'+label]=row.get('meta',{}).get('value');r['evidence_'+label]=row['ideb']['evidence_id']
  r['anos_iniciais_fundamental']=r['anos_iniciais'];result.append(r)
 return result
edu['ideb_inep_serie']=points('Pública');edu['ideb_inep_serie_completa']=points('Municipal')
edu['ideb_series_por_rede']={n:points(n) for n in ['Pública','Municipal','Estadual']}
edu['reconciliacao_ideb_redes']={'status':'REPRODUZIDO_CELULAS_INEP','edition':2025,'network_main':'Pública','note':'Pública, Municipal e Estadual são linhas nativas diferentes. 2023: pública 6,8/5,6; municipal 6,8/5,8. 2025: pública 6,9/5,7; municipal 6,9/6,0. Metas só até 2021. Registro anterior arquivado no snapshot.'}
for stage in ['iniciais','finais']:
 entry=ss[stage]['Pública']['2023']['ideb'];e=ev[entry['evidence_id']];bind(rm['educ_ideb_anos_'+stage],entry['value'],'2023','nota (0 a 10)',e);rm['educ_ideb_anos_'+stage]['name']='IDEB - Anos '+stage+' do Ensino Fundamental (Rede Pública)'
 suspend(rm['educ_ideb_meta_'+stage],'Metas municipais do primeiro ciclo do IDEB publicadas somente entre 2007 e 2021; meta 2023 sem comprovação.')
census=read(OUT/'censo2023-recorte-municipal.json');tables={t['sheet']:t for t in census['tables']};t=tables['Educação Básica 1.1'];row=t['rows'][0];vals=row['values'];mat=edu['matriculas_censo_escolar_2023']
cols={'total_matriculas':4,'educacao_infantil':5,'creche':6,'pre_escola':7,'ensino_fundamental':8,'anos_iniciais':9,'anos_finais':10,'ensino_medio':11,'educacao_profissional_tecnica':16,'educacao_jovens_adultos_eja':23,'educacao_especial':26}
for k,c in cols.items():mat[k]=vals[c]
mat.update(ensino_superior_graduacao=None,methodology='Matrículas, não alunos únicos. Educação especial se sobrepõe às etapas; educação profissional tem sobreposições previstas nas notas. Não somar todas as colunas como pessoas.',period=2023)
for iid,c in [('educ_matriculas_total_censo',4),('educ_matriculas_infantil',5),('educ_matriculas_fundamental',8),('educ_matriculas_medio',11)]:
 e=raw_ev(ROOT/t['raw_reference'],{'member':t['member'],'sheet':t['sheet'],'row':row['row'],'column':c+1,'raw_cell':vals[c]},vals[c],'matrículas',2023,t['source_url'],'cons:censo2023:'+iid);bind(rm[iid],vals[c],'2023','matrículas',e);rm[iid]['methodology']=mat['methodology']
network=tables['1.2']['rows'][0]['values'];edu['matriculas_por_rede_censo_2023']=[{'rede':n,'matriculas':network[c]+network[c+5],'pct':(network[c]+network[c+5])/network[4]*100,'methodology':'Total urbano + rural da mesma dependência administrativa; sinopse tabela 1.2; município da escola.'} for n,c in [('Federal',6),('Estadual',7),('Municipal',8),('Privada',9)]]
assert sum(r['matriculas'] for r in edu['matriculas_por_rede_censo_2023'])==mat['total_matriculas']
edu['censo_escolar_2023_2024']={'2023':copy.deepcopy(mat),'2024':None,'status':'2024 não conferido; registro anterior arquivado.'}
edu['censo2023_recorte_reproduzivel']='docs/dados-publicos-revisao/consolidacao-geral/'+OUT.name+'/censo2023-recorte-municipal.json'
ibge=read(OUT/'fontes-externas/ibge-10058.json')
def walk(items):
 for i in items:yield i;yield from walk(i.get('children',[]))
ibmap={i['id']:i for i in walk(ibge)};school=ibmap[60045]['res'][0];value=float(school['res']['2022']);assert value==99.09
e=raw_ev(OUT/'fontes-externas/ibge-10058.json',{'indicator_id':60045,'localidade':'354990','period':'2022'},value,'%',2022,'https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores?localidade=354990','cons:escolarizacao2022');bind(rm['educ_taxa_escolarizacao'],value,'2022','%',e);rm['educ_taxa_escolarizacao']['methodology']='Percentual de pessoas residentes de 6 a 14 anos que frequentavam escola, Censo Demográfico 2022; não taxa de matrícula, não rede municipal.'
edu['indicadores_socioeducacionais']['taxa_escolarizacao_6_a_14_anos']=value
for k in ['idhm_educacao','taxa_analfabetismo_15_anos_mais']:edu['indicadores_socioeducacionais'][k]=None
# Saúde: reconstruir decisões documentais da revisão anterior em memória, sem gravar nenhum artefato antigo.
source=(ROOT/'scripts/saude_documental_20261002.py').read_text(encoding='utf8')
ns={'__name__':'consolidacao_documental'};exec(compile(source,str(ROOT/'scripts/saude_documental_20261002.py'),'exec'),ns)
health=ns['s'];reviewed={i['indicator_id']:i for i in ns['reg']['indicators'] if i.get('category')=='saude'}
# Os sinais '-' dos capítulos permanecem null nas evidências antigas; os totais usados são impressos no documento.
health['mortalidade_infantil'].update(obitos_2024=None,nascidos_vivos_2024=None,obitos_2025=None,nascidos_vivos_2025=None,taxa_ibge_cidades_2025=None)
for i in reg['indicators']:
 if i['category']!='saude':continue
 if i['indicator_id'] not in reviewed:suspend(i,'Indicador sem correspondência na revisão documental reproduzida.');continue
 old=reviewed[i['indicator_id']];value=old['value'];page=old.get('evidencia',{}).get('pagina');url=old['official_url'];files={'Quadri_3_2025':OUT/'fontes-externas/saude-q2025.pdf','RelatAnualGest_2025':OUT/'fontes-externas/saude-rag2025.pdf','RelatAnualGest_2024':ROOT/'tmp/saude-audit/rag2024.pdf'}
 p=next((p for token,p in files.items() if token in url),OUT/'fontes-externas/saude-retrospectiva2025.html')
 if value is None or isinstance(value,str):suspend(i,old['context_warning']);continue
 e=raw_ev(p,{'page':page,'document_reference':url,'excerpt':old['evidencia'].get('trecho_bruto')},value,i['unit'],old['base_year'],url,'cons:saude:'+i['indicator_id']);bind(i,value,old['base_year'],i['unit'],e,reason=old['methodology']);i['methodology']=old['methodology'];i['name']=old['name']
gt['eixos']['saude']=health
# Segurança: taxa e ocorrências são variáveis distintas. Não inferir vítimas nem população de taxa arredondada.
rates=read(OUT/'fontes-externas/ssp-taxas.json');counts=read(OUT/'fontes-externas/ssp-ocorrencias.json');assert rates['success'] and counts['success'];rate_by={int(r['ano']):r for r in rates['data']};count_by={int(r['ano']):r for r in counts['data']};seg=gt['eixos']['seguranca']
seg['taxa_homicidios_dolosos_serie']=[{'ano':y,'vitimas':None,'ocorrencias':count_by[y]['homicidio'],'taxa_por_100k':float(rate_by[y]['homicidios'].replace(',','.')),'taxa_100k':float(rate_by[y]['homicidios'].replace(',','.')),'status':'CONFIRMADO_FONTE_OFICIAL','universe':'Ocorrências de homicídio doloso e taxa publicada SSP; vítimas não publicadas neste endpoint.','evidence_id':'cons:ssp:homicidio:'+str(y)} for y in sorted(rate_by.keys()&count_by.keys())]
for iid,key,table,path in [('seg_homicidios_dolosos_2024','homicidio',count_by,OUT/'fontes-externas/ssp-ocorrencias.json'),('seg_taxa_homicidios','homicidios',rate_by,OUT/'fontes-externas/ssp-taxas.json'),('seg_roubos_gerais','roubo',count_by,OUT/'fontes-externas/ssp-ocorrencias.json')]:
 value=table[2024][key];value=float(value.replace(',','.')) if isinstance(value,str) else value;e=raw_ev(path,{'idUnidade':560,'ano':2024,'variable':key},value,rm[iid]['unit'],2024,'https://www.ssp.sp.gov.br/v1/'+('TaxaDelito/RecuperaDadosMunicipio' if key=='homicidios' else 'OcorrenciasAnuais/recuperaDadosMunicipio')+'?idMunicipio=560','cons:ssp:'+iid);bind(rm[iid],value,'2024',rm[iid]['unit'],e)
rm['seg_homicidios_dolosos_2024']['name']='Ocorrências de homicídio doloso — SSP, 2024'
for iid in ['seg_roubos_veiculos_2024','seg_furtos_veiculos_2024','seg_produtividade_prisoes','seg_sao_jose_unida','seg_ranking_500k','seg_esclarecimento_deic']:suspend(rm[iid],'Sem resposta original e definição suficiente para este recorte. Endpoint anual retorna 0 nos campos por tipo de veículo, mas FRV=867 em 2024; zeros não aceitos como ausência de crimes. CSI/DEIC/ranking exigem fonte e metodologia próprias.')
seg['consolidacao_chart_status']={'homicidios':'REPRODUZIDO_TAXA_OCORRENCIAS','mensal':'PENDENTE_CONFERENCIA','patrimonio':'PENDENTE_CONFERENCIA','ddm':'PENDENTE_CONFERENCIA'}
# Demografia: recompor vínculo SIDRA nativo em vez de aceitar apenas resumos internos.
for iid,file,var,sex in [('demo_populacao_censo','sidra4714.json','93',None),('demo_area_territorial','sidra4714.json','6318',None),('demo_densidade_demografica','sidra4714.json','614',None),('demo_domicilios_total','sidra4711.json','617',None),('demo_domicilios_ocupados','sidra4712.json','381',None),('demo_media_moradores','sidra4712.json','5930',None),('demo_indice_envelhecimento_2022','sidra9515.json','10612',None),('demo_razao_sexo','sidra9515.json','8845',None),('demo_populacao_mulheres','sidra9514-total-idade.json','93','5'),('demo_populacao_homens','sidra9514-total-idade.json','93','4')]:
 p=OUT/'fontes-externas'/file;rows=read(p);index,r=next((j,r) for j,r in enumerate(rows) if r.get('D1C')=='3549904' and r.get('D2C')==var and (sex is None or r.get('D4C')==sex));value=float(r['V']);e=raw_ev(p,{'row':index+1,'native_record':r},value,rm[iid]['unit'],2022,'https://sidra.ibge.gov.br/tabela/'+re.search(r'\d+',file)[0],'cons:sidra:'+iid);bind(rm[iid],value,'2022',rm[iid]['unit'],e)
for iid in ['demo_populacao_estimada_2024','demo_populacao_estimada_2026','demo_taxa_urbanizacao']:suspend(rm[iid],'Resumo interno não substitui tabela oficial original. Projeção tendencial 2026 não é estimativa oficial do IBGE; urbanização tem divergência entre 98,2 e 98,72; manter suspenso até recorte compatível.')
demo=gt['eixos']['demografia'];demo['consolidacao_regioes_status']='SUSPENSO_SEM_VINCULO_CENSITARIO_REPRODUZIVEL'
demo['consolidacao_note']='35 unidades municipais não equivalem a setores censitários. Geometrias preservadas. Populações hardcoded totalizam 661.463; vínculo e cobertura precisam de comprovação. Ranking e densidades suspensos.'
# Não remover geometrias ou arrays territoriais; suspender só atributos sem vínculo reproduzível.
numeric_keys={'populacao','populacao_formatada','percentual_total','densidade_hab_km2','densidade_formatada','posicao_geral','ranking_top10','pct','densidade','percentual','populacao_2022','densidade_hab_por_km2'}
def quarantine(v):
 if isinstance(v,dict):return {k:None if k in numeric_keys else quarantine(x) for k,x in v.items()}
 if isinstance(v,list):return [quarantine(x) for x in v]
 return v
for key in ['populacao_por_regiao_censo_2022','ranking_setores_socioeconomicos_censo_2022']:demo[key]=quarantine(demo.get(key,[]))
for name in ['sjc_setores_socioeconomicos_geo.json','sjc_regioes_geo.json']:
 p=BASE/name;geo=read(p);geo['metadata']['audit_status']='SUSPENSO_VINCULO_POPULACIONAL';geo['metadata']['consolidacao_note']=demo['consolidacao_note'];geo['features']=[{**f,'properties':quarantine(f['properties'])} for f in geo['features']];save(p,geo)
# Registro histórico de todos os conflitos; não reescrever evidence stores anteriores.
original={i['indicator_id']:i for i in before['indicators']}
for i in reg['indicators']:
 old=original[i['indicator_id']]
 if old!=i:decisions.append({'indicator_id':i['indicator_id'],'axis':i['category'],'before':old,'after':copy.deepcopy(i),'decision':'SUSPENSO' if i['value'] is None else 'RECONCILIADO','reason':i['context_warning']})
save(OUT/'reconciliacao-aplicada.json',{'date':'2026-10-08','homologated':False,'decisions':decisions,'canonical':'Ground truth e registry reconciliados; package e inline derivados do mesmo builder; arquivos anteriores imutáveis no snapshot.'})
save(BASE/'sjc_open_data_ground_truth.json',gt);save(BASE/'sjc_metadata_registry.json',reg)
save(BASE/'consolidacao_status.json',{'date':'2026-10-08','homologated':False,'report':OUT.relative_to(ROOT).as_posix()+'/relatorio-final.md','journal':(OUT/'reconciliacao-aplicada.json').relative_to(ROOT).as_posix(),'pending':['Mapeamento censitário das 35 unidades','CNES de leitos/estabelecimentos','Mensais SSP/CSI/DEIC','Estimativa 2024 original','Teste real navegador/mobile/rede lenta'],'education_evidence':(OUT/'educacao-inep-reproduzida.json').relative_to(ROOT).as_posix()})
print('Reconciliação aplicada:',len(decisions),'decisões; evidências anteriores preservadas.')
