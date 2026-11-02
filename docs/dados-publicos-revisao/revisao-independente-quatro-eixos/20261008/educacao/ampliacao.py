"""Propostas de ampliação comprovada; não modifica canônicos."""
from pathlib import Path
import json,zipfile,io,hashlib,datetime
from python_calamine import CalamineWorkbook
OUT=Path(__file__).resolve().parent;ROOT=next(p for p in OUT.parents if (p/'app.js').exists())
PRE=ROOT/'docs/dados-publicos-revisao/consolidacao-geral/20261008T060731Z'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(n,d):(OUT/n).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def sha(b):return hashlib.sha256(b).hexdigest()
def number(x):return x if isinstance(x,(int,float)) else None
evidences=[];series=[];sources=[];checks=[]
for family,filename,url,headerrow in [
 ('distorcao_idade_serie','TDI2025.zip','https://download.inep.gov.br/informacoes_estatisticas/indicadores_educacionais/2025/TDI_2025_MUNICIPIOS.zip',8),
 ('rendimento','rendimento2025.zip','https://download.inep.gov.br/informacoes_estatisticas/indicadores_educacionais/2025/tx_rend_municipios_2025.zip',8)]:
 p=OUT/'raw'/filename;b=p.read_bytes();z=zipfile.ZipFile(io.BytesIO(b));member=next(n for n in z.namelist() if n.endswith('.xlsx'));mb=z.read(member);w=CalamineWorkbook.from_filelike(io.BytesIO(mb));sheet=w.sheet_names[0];rows=w.get_sheet_by_index(0).to_python();headers=rows[headerrow]
 source={'family':family,'source_url':url,'retrieval_url':url.replace('https:','http:'),'raw_reference':p.relative_to(ROOT).as_posix(),'sha256':sha(b),'member':member,'member_sha256':sha(mb),'sheet':sheet,'edition':2025,'accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'headers':rows[:10],'notes':rows[-35:]};sources.append(source)
 for j,r in enumerate(rows):
  if len(r)<7 or r[3]!=3549904:continue
  assert r[2]=='SP' and r[4].strip()=='São José dos Campos' and r[0]==2025
  values={}
  for col in range(7,len(headers)):
   native=headers[col];raw=r[col];v=number(raw);values[native]=v
   e={k:v for k,v in source.items() if k not in ['headers','notes']};e.update({'evidence_id':f'rev20261008:educ:{family}:2025:{r[5]}:{r[6]}:{native}','year':2025,'territory':'Município da escola IBGE3549904','location':r[5],'network':r[6],'native_variable':native,'row':j+1,'column':col+1,'raw_value':raw,'value':v,'unit':'%','methodology':'Célula nativa publicada INEP. Dependência administrativa e localização não somadas; Total/Pública sobrepõem componentes. Sinais -- permanecem null. Taxa não equivale a contagem de alunos ou matrícula.','status':'REPRODUZIDO_AGUARDA_VALIDACAO_INDEPENDENTE' if v is not None else 'INDISPONIVEL_NA_FONTE'});evidences.append(e)
   if v is not None:assert 0<=v<=100
  rec={'family':family,'year':2025,'location':r[5],'network':r[6],'values':values,'row':j+1,'sheet':sheet};series.append(rec)
  if family=='rendimento':
   for stage in ['FUN','FUN_AI','FUN_AF','MED']:
    nums=[values.get(str(x)+'_CAT_'+stage) for x in [1,2,3]]
    if all(v is not None for v in nums):checks.append({'test':f'Rendimento {r[5]} {r[6]} {stage}','sum':sum(nums),'pass':abs(sum(nums)-100)<=0.2})
assert all(c['pass'] for c in checks)
save('indicadores2025-reproduzidos.json',{'homologated':False,'series':series,'evidences':evidences,'sources':sources,'checks':checks})
censos=[]
for year in [2023,2024,2025]:
 p=PRE/'censo2023-recorte-municipal.json' if year==2023 else OUT/f'censo{year}-recorte.json'
 if not p.exists():continue
 d=load(p);ts=d['tables'];t=next(t for t in ts if t['sheet']=='Educação Básica 1.1');r=t['rows'][0];v=r['values']
 # Conferência da hierarquia nativa em cada edição antes de usar posições.
 assert 'Educação Infantil' in str(t['headers']) and 'Ensino Fundamental' in str(t['headers'])
 fields={'total_matriculas':4,'educacao_infantil':5,'creche':6,'pre_escola':7,'ensino_fundamental':8,'anos_iniciais':9,'anos_finais':10,'ensino_medio':11,'educacao_profissional_total':15,'educacao_profissional_tecnica':16,'eja':23,'educacao_especial_total':26,'educacao_especial_classes_comuns':27,'educacao_especial_classes_exclusivas':28}
 if year==2025:
  # EdiçãoV2 reorganizou IFTP/profissional e categorias privadas; não usaroffsets2023.
  fields.update({'educacao_profissional_total':20,'educacao_profissional_tecnica':21,'eja':33,'educacao_especial_total':36,'educacao_especial_classes_comuns':37,'educacao_especial_classes_exclusivas':38})
 obs=[]
 for name,c in fields.items():
  e={k:t[k] for k in ['raw_reference','sha256','member','member_sha256','source_url']};e.update({'evidence_id':f'rev20261008:censo:{year}:{name}','year':year,'field':name,'value':number(v[c]),'raw_value':v[c],'sheet':t['sheet'],'row':r['row'],'column':c+1,'unit':'matrículas','network':'Todas','territory':'Município da escola IBGE3549904','methodology':'Célula nativa; matrícula não aluno único; especial e profissional com sobreposição. Preservar notas da edição.','status':'REPRODUZIDO_AGUARDA_VALIDACAO_INDEPENDENTE'});obs.append(e);evidences.append(e)
 n=next(t for t in ts if t['sheet']=='1.2');nv=n['rows'][0]['values'];nets=[]
 network_columns=[('Federal',16,26),('Estadual',17,27),('Municipal',18,28),('Privada',19,29)] if year==2025 else [('Federal',6,11),('Estadual',7,12),('Municipal',8,13),('Privada',9,14)]
 for name,uc,rc in network_columns:
  assert name in str(n['headers'])
  value=nv[uc]+nv[rc];nets.append({'network':name,'value':value,'urban':nv[uc],'rural':nv[rc],'columns':[uc+1,rc+1],'sheet':n['sheet'],'row':n['rows'][0]['row'],'source_url':n['source_url'],'sha256':n['sha256'],'raw_reference':n['raw_reference'],'unit':'matrículas','denominator':v[4],'pct':value/v[4]*100})
 spec=[fields[k] for k in ['educacao_especial_classes_comuns','educacao_especial_classes_exclusivas','educacao_especial_total']]
 assert sum(n['value'] for n in nets)==v[4] and v[6]+v[7]==v[5] and v[9]+v[10]==v[8] and v[spec[0]]+v[spec[1]]==v[spec[2]]
 aux=[]
 for title,family,unit in [('Educação Básica 2.1','docentes','docentes'),('Educação Básica 3.1','estabelecimentos','estabelecimentos'),('Educação Básica 4.1','turmas','turmas')]:
  a=next((t for t in ts if t['sheet']==title),None)
  if a:aux.append({'family':family,'value':a['rows'][0]['values'][4],'sheet':title,'row':a['rows'][0]['row'],'column':5,'unit':unit,'year':year,'raw_reference':a['raw_reference'],'sha256':a['sha256'],'source_url':a['source_url'],'definition':a['headers'][3][0],'notes':a['notes']})
 censos.append({'year':year,'matriculas':obs,'redes':nets,'auxiliares':aux,'tables':len(ts)})
save('ampliacao-censo2023-2025.json',{'homologated':False,'series':censos,'notes':'Não substituir recorte2023 por2025; adicionar série anual com edição e locators. Docentes podem atuar em múltiplas etapas; escolas totais não são somente públicas. Valores publicados zero mantidos; nenhum sinal ausente virou zero.'})
reg=load(ROOT/'data/radar_hub/sjc_metadata_registry.json')['indicators']
props=[{'target':'registry','indicator_id':'educ_taxa_escolarizacao','field':'source_system','before':'Censo Demográfico / PNAD Contínua','after':'IBGE / Censo Demográfico 2022','reason':'A resposta60045 é Censo2022 residentes6–14; PNAD não produz este resultado municipal.','evidence':next(i['evidencia'] for i in reg if i['indicator_id']=='educ_taxa_escolarizacao')},
 {'target':'registry','indicator_id':'educ_taxa_escolarizacao','field':'source_agency','before':'IBGE / Ministério da Educação','after':'Instituto Brasileiro de Geografia e Estatística (IBGE)','reason':'Fonte original IBGE, não MEC.','evidence':next(i['evidencia'] for i in reg if i['indicator_id']=='educ_taxa_escolarizacao')},
 {'target':'registry','indicator_id':'educ_ideb_anos_finais','field':'methodology','before':'Indicador oficial calculado para turmas de 6º ao 9º ano da rede pública municipal e estadual.','after':'IDEB observado publicado na linha Pública do município das escolas3549904, etapa anos finais, edição INEP2025; não média aritmética de notas das redes ou escolas.','reason':'Evitar redefinir a linha nativa Pública pela união administrativa inferida.'}]
html_patches=[{'target':'app.html','before':'Divisão do alunado entre redes Municipal, Estadual, Privada e Federal','after':'Matrículas2023 nas redes Municipal, Estadual, Privada e Federal; município da escola.','reason':'Matrículas não pessoas únicas; declararcompetência.'},{'target':'app.html','scope':'cartão hubChartEducacaoRede','before':"openIndicatorMetadata('educ_matriculas_fundamental')",'after':"openIndicatorMetadata('educ_matriculas_total_censo')",'reason':'Gráfico de todas as etapas não EF apenas.'},{'target':'app.html','before':'Rendimento e Eficiência Escolar (INEP)','after':'Escolarização e Indicadores Educacionais','reason':'Única barra conferida atualmente éIBGE Censo2022; ausentes continuamnull.'}]
patches=[{'function':'renderEducacaoMatriculasChart','before':'((v / 142850) * 100)','after':'((v / mat.total_matriculas) * 100)','guard':'total finito>0; se inválido não exibir percentual; não usar ||0','reason':'Denominador canônico2023=163965. Percentual por categoria não deve ser somado; sobreposições explicadas.'},
 {'function':'renderEducacaoRedeChart','before':'((v / 142850) * 100)','after':'((v / gt.eixos.educacao.matriculas_censo_escolar_2023.total_matriculas) * 100)','guard':'Só mostrar percentual se todas4redes não nulas e somaigualtotal163965; caso contrário não inventar denominador','reason':'Percentuais atuais fecham114,779%; corrigidos100%.'},
 {'function':'renderEducacaoRedeChart','before':'estudantes','after':'matrículas','reason':'Censo contabiliza matrículas, não pessoas únicas.'},
 {'function':'renderEducacaoMatriculasChart','before':'Educação Especial Inclusiva','after':'Educação Especial (comuns e exclusivas)','reason':'5425=5251comuns+174exclusivas, fonte2023tabela1.1col27.'},
 {'function':'renderEducacaoMatriculasChart','before':'Ensino Médio Regular','after':'Ensino Médio (inclui integrado)','reason':'28966inclui1183curso técnico integrado, além27783propedêutico.'},
 {'function':'renderEducacaoMatriculasChart','before':'matrículas ativas','after':'matrículas — Censo Escolar 2023','reason':'Não comprova statusativo em2026; corte2023.'},
 {'function':'renderEducacaoFluxoChart','before':'% de conformidade nos indicadores oficiais do INEP','after':'% — escolarização de residentes6–14, IBGE/Censo2022','reason':'A única barra comprovada éIBGE; ausentes continuamnull.'}]
save('propostas.json',{'homologated':False,'registry_changes':props,'controller_patches':patches,'html_patches':html_patches,'ground_truth_additions':[{'key':'censo_escolar_serie_documentada','value':censos,'file':'ampliacao-censo2023-2025.json'},{'key':'indicadores_educacionais_serie_documentada','value':series,'evidence_store':'indicadores2025-reproduzidos.json'}],'do_not_change':['app.js','recortes2023 comprovados','meta2023 suspensa','IDEB observado vigente'],'evidences':evidences})
save('testes-ampliacao.json',{'status':'PASS','censo_years':[x['year'] for x in censos],'rate_checks':checks,'new_rate_rows':len(series),'rate_evidence_cells':len([e for e in evidences if e.get('family') in ['rendimento','distorcao_idade_serie']]),'censo_invariants':'urbano+rural por rede=total; creche+pré=infantil; AI+AF=EF; comuns+exclusivas=especial'})
print(json.dumps({'years':[x['year'] for x in censos],'rate_rows':len(series),'rate_cells':len([e for e in evidences if e.get('family') in ['rendimento','distorcao_idade_serie']]),'summary':[{ 'year':x['year'],'total':x['matriculas'][0]['value'],'auxiliares':[(a['family'],a['value']) for a in x['auxiliares']]} for x in censos]},ensure_ascii=False))
